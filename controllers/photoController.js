'use strict';
const photoModel = require('../models/photoModel');

const {getAllPhotos, getPhoto, addPhoto }= photoModel;

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
      res.json(response);
    } else {
      next('No photo found', 404);
    }
  } catch (e) {
    console.log('photo_get error', e.message);
    next(httpError('internal server error', 500));
  }   
  
  
};

const photo_post = async (req, res, next) => {
  console.log(req.body, req.file);
  try {
    const { description, userID} = req.body;
    const result = await addPhoto(description, req.file.filename, userID, next);
    if (result.affectedRows > 0) {
      res.json({message: 'photo added', PhotoID: result.insertId,});
    } else {
      next(httpError('No photo inserted', 400));
    }
  } catch (e) {
    console.log('photo_post error', e.message);
    next(httpError('internal server error', 500));
  }
};

module.exports = {
  photo_list_get,
  photo_get,
  photo_post,
};