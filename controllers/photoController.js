'use strict';

const { validationResult } = require('express-validator');
const {getAllPhotos, getPhoto, addPhoto, modifyPhoto, deletePhoto } = require('../models/photoModel');

const { makeThumbnail } = require('../utils/resize');

const { httpError } = require('../utils/errors');

const photo_list_get = async (req, res, next) => {
    
    try {
      const photos = await  getAllPhotos(next);
      
      if (photos.length > 0) {
        res.json(photos);
      } else {
        next('No photos found', 404);
      }
    } catch (e) {
      console.log('photo_list_get error', e.message);
      next(httpError('internal server error', 500));
    }
    
};

const photo_get = async (req, res, next) => {
  console.log('photo_get', req.params.id);
  try {
    const response = await getPhoto(req.params.id, next);
    if (response.length > 0) {
      res.json(response.pop());
    } else {
      next('No photo found', 404);
    }
  } catch (e) {
    console.log('photo_get error', e.message);
    next(httpError('internal server error', 500));
  }   
  
  
};

const photo_post = async (req, res, next) => {
  console.log('post', req.body, req.file, req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('photo_post validation', errors.array());
    next(httpError('invalid data', 400));
    return;
  }
  if (!req.file) {
    const err = httpError('file not valid', 400);
    next(err);
    return;
  }
  try {
    const thumb = await makeThumbnail(
      
      req.file.path,
      './thumbnails/' + req.file.filename
    );
    
    const { description} = req.body;
    const result = await addPhoto(description, req.file.filename, req.user.UserID, next);

    if (thumb) {
      if (result.affectedRows > 0) {
        res.json({message: 'photo added', PhotoID: result.insertId,});
      } else {
        next(httpError('No photo inserted', 400));
      }
    }
    
  } catch (e) {
    console.log('photo_post error', e.message);
    next(httpError('internal server error', 500));
  }
};

const photo_put = async (req, res, next) => {
  console.log(req.body, req.params, req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('photo_put validation', errors.array());
    next(httpError('invalid data', 400));
    return;
  }
  try {
    const {description} = req.body;

    const userID = req.user.Role === 0 ? req.body.UserID : req.user.UserID;

    const result = await modifyPhoto(description, userID, req.params.id, req.user.Role, next);
    if (result.affectedRows > 0) {
      res.json({message: 'photo modified', PhotoID: result.insertId});
    } else {
      next(httpError('No photo modified', 400));
    }
  } catch (e) {
    console.log('photo_modify error', e.message);
    next(httpError('internal server error', 500));
  }
}

const photo_delete = async (req, res, next) => {
  try {
    const response = await deletePhoto(req.params.id, req.user.UserID, req.user.Role, next);
    if (response.affectedRows > 0) {
      res.json({message: 'photo deleted', PhotoID: response.insertId});
    } else {
      next(httpError('No photo deleted', 400));
    }
  } catch (e) {
    console.log('photo_delet error', e.message);
    next(httpError('internal server error', 500));
  }
}

module.exports = {
  photo_list_get,
  photo_get,
  photo_post,
  photo_put,
  photo_delete,
};