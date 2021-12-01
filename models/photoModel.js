'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllPhotos = async (next) => {
  try {
    const [rows] = await promisePool.execute('SELECT PhotoID, PostedDate, Description, Filename, Location, Photo.UserID, UserTable.UserName FROM Photo INNER JOIN UserTable ON UserTable.UserID = Photo.UserID');
    return rows;
  } catch (e) {
    console.error('getAllPhotos error', e.message);
    next(httpError('Database error', 500));
  }
}

const getPhoto = async (id, next) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM Photo WHERE PhotoID = ?', [id]);
    return rows;
  } catch (e) {
    console.error('getPhoto error', e.message);
    next(httpError('Database error', 500));
  }    
}

const addPhoto = async (description, filename, userID, next) => {
  console.log(description, filename, userID);
  try {
    
//TODO location
    const [rows] = await promisePool.execute(`INSERT INTO Photo (PostedDate, Description, Filename, Location, UserID) VALUES (NOW(), ?, ?, '[]', ?)`, [description, filename, userID]);
    return rows;
  } catch (e) {
    console.error('addPhoto error', e.message);
    next(httpError('Database error', 500));
  }
}

const modifyPhoto = async (description, userID, id, next) => {
  try {
    const [rows] = await promisePool.execute('UPDATE Photo SET Description = ?, UserID = ? WHERE PhotoID = ?', [description, userID, id]);
    return rows;
  } catch (e) {
    console.error('modifyPhoto error', e.message);
    next(httpError('Database error', 500));
  }
}

const deletePhoto = async (id, next) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM Photo WHERE PhotoID = ?', [id]);
    return rows;
  } catch (e) {
    console.error('deletePhoto error', e.message);
    next(httpError('Database error', 500));
  }
}

module.exports = {
  
  getPhoto,
  getAllPhotos,
  addPhoto,
  modifyPhoto,
  deletePhoto,
};