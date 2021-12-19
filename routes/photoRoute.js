'use strict';


const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ dest: './uploads/', fileFilter});
const {photo_list_get, photo_get, photo_post, photo_put, photo_delete, photo_like, photo_get_liked_photos, photo_random, photo_search, photo_delete_like} = require('../controllers/photoController');


const router = express.Router();

router.get('/', photo_list_get);

router.get('/:id', photo_get);

router.get('/favs/:id', photo_get_liked_photos);

router.get('/get/random', photo_random);

router.get('/search/:query', photo_search);

router.post('/', upload.single('photo'), body('description').notEmpty().escape(),  photo_post);

router.post('/:id', photo_like);

router.put('/:id', body('description').notEmpty().escape(),  photo_put);

router.delete('/:id', photo_delete);

router.delete('/like/:id', photo_delete_like);

module.exports = router;

