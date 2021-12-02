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
const {photo_list_get, photo_get, photo_post, photo_put, photo_delete} = require('../controllers/photoController');


const router = express.Router();



router.get('/', photo_list_get);

router.get('/:id', photo_get);

router.post('/', upload.single('photo'), body('description').notEmpty().escape(),  photo_post);

router.put('/:id', body('description').notEmpty().escape(),  photo_put);

router.delete('/:id', photo_delete);

module.exports = router;

