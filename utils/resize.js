'use strict';
const sharp = require('sharp');

const makeThumbnail = async (file, thumbname) => { // file = full path to image (req.file.path), thumbname = filename (req.file.filename)
  return await sharp(file).resize(250,250).png().toFile(thumbname);
};

module.exports = {
  makeThumbnail,
};