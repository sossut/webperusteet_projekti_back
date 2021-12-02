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

const modifyPhoto = async (description, userID, id, role, next) => {
  let sql = 'UPDATE Photo SET Description = ? WHERE PhotoID = ? AND UserID = ?';
  let params = [description, id, userID];

  if (role === 0) {
    sql = 'UPDATE Photo SET Description = ?, UserID = ? WHERE PhotoID = ?';
    params = [description, userID, id];
  }
  console.log('sql', sql);
  try {
    const [rows] = await promisePool.execute(sql, params);
    return rows;
  } catch (e) {
    console.error('modifyPhoto error', e.message);
    next(httpError('Database error', 500));
  }
}

const deletePhoto = async (id, userID, role, next) => {
  let sql = 'DELETE FROM Photo WHERE PhotoID = ? AND UserID = ?';
  let params = [id, userID];
  if (role === 0) {
    sql = 'DELETE FROM Photo WHERE PhotoID = ?';
    params = [id];
  }
  try {
    const [rows] = await promisePool.execute(sql, params);
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