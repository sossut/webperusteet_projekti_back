'use strict';
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: './uploads/'});
const {photo_list_get, photo_get, photo_post, photo_put, photo_delete} = require('../controllers/photoController');


const router = express.Router();

router.route('/');

router.get('/', photo_list_get);

router.get('/:id', photo_get);

router.post('/', upload.single('photo'), photo_post);

router.put('/', photo_put);

router.delete('/:id', photo_delete);

module.exports = router;

