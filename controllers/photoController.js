'use strict';
const photoModel = require('../models/photoModel');

const {photos, getPhoto }= photoModel;

const photo_list_get = (req, res) => {
    
    res.json(photos);
};

const photo_get = (req, res) => {   
  const vastaus = getPhoto(req.params.id);
  res.json(vastaus);
};

const photo_post = (req, res) => {
  console.log(req.body, req.file);
  res.send('From this endpoint you can add cats.');
};

module.exports = {
  photo_list_get,
  photo_get,
  photo_post,
};