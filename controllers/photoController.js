'use strict';

const { validationResult } = require('express-validator');
const {getAllPhotos, getPhoto, addPhoto, modifyPhoto, deletePhoto, likePhoto, getLikedPhotos, randomPhoto, searchPhoto } = require('../models/photoModel');

const { makeThumbnail } = require('../utils/resize');

const { httpError } = require('../utils/errors');

const { getCoordinates } = require('../utils/imageMeta');

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
    const location = await getCoordinates(req.file.path);
    req.body.location = location;
  } catch (e) {
    req.body.location = [0, 0];
  }
  
  

  try {
    const thumb = await makeThumbnail(
      req.file.path,
      './thumbnails/' + req.file.filename
    );
    

    const { description, location} = req.body;
    const result = await addPhoto(description, req.file.filename,  JSON.stringify(location), req.user.UserID, next);

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
    console.log('photo_delete error', e.message);
    next(httpError('internal server error', 500));
  }
}

const photo_like = async (req, res, next) => {
  try {
    const response = await likePhoto(req.params.id, req.user.UserID, next);
    if (response.affectedRows > 0 ) {
      res.json({message: 'photo liked', PhotoID: response.insertId});
    } else {
      next(httpError('No photo liked', 400));
    }
  } catch (e) {
    console.log('photo_like error', e.message);
    next(httpError('internal server error', 500));
  }
}

const photo_get_liked_photos = async (req, res, next) => {
  try {
    
    const response = await getLikedPhotos(req.params.id, next);
    console.log(response);
    if (response.length > 0) {
      res.json(response);
    } else {
      next(httpError('No liked photos found', 404));
    }
  } catch (e) {
    console.log('photo_get_liked_photos error', e.message);
    next(httpError('internal server error', 500));
  }
}

const photo_random = async (req, res, next) => {
  try {
    const response = await randomPhoto(next);
    if (response.length > 0) {
      res.json(response.pop());
    } else {
      next(httpError('No random photo found', 404));
    }
  } catch (e) {
    console.log('photo_random error', e.message);
    next(httpError('internal server error', 500));
  }
}

const photo_search = async (req, res, next) => {
  try {
    console.log(req.params.query);
    const response = await searchPhoto(req.params.query);
    if (response.length > 0) {
      res.json(response);
    } else {
      next(httpError('No photos found', 404));
    }
  } catch (e) {
    console.log('photo_search error', e.message);
    next(httpError('internal server error', 500));
  }
}

module.exports = {
  photo_list_get,
  photo_get,
  photo_post,
  photo_put,
  photo_delete,
  photo_like,
  photo_get_liked_photos,
  photo_random,
  photo_search,
};