'use strict';


const photos = [
  {
    id: '1',
    description: 'Forest',
    owner: '1',
    filename: 'http://placekeanu.com/400/300',
  },
  {
    id: '2',
    description: 'Mountains',
    owner: '2',
    filename: 'http://placekeanu.com/400/302',
  },
];

const getPhoto = (id) => {
    return photos.find((photo) => photo.id === id);
}
module.exports = {
  photos,
  getPhoto,
};