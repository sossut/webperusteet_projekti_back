'use strict';
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: './uploads/'});
const {photo_list_get, photo_get, photo_post,} = require('../controllers/photoController');


const router = express.Router();

router.get('/', photo_list_get);

router.get('/:id', photo_get);

router.post('/', upload.single('photo'), photo_post);

router.put('/', (req, res) => {
  res.send('From this endpoint you can edit photos.')
});

router.delete('/', (req, res) => {
  res.send('From this endpoint you can delete photos.')
});

module.exports = router;

