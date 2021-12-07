'use strict';

const pool = require('../database/db');
const { httpError } = require('../utils/errors');
const promisePool = pool.promise();

const getAllUsers = async (next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT UserID, UserName, email, role FROM UserTable;'
    );
    console.log('getAllUsers', rows);
    return rows;
  } catch (e) {
    console.error('getAllUsers error', e.message);
    next(httpError('Database error', 500));
  }
};

const getUser = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT UserID, UserName, Email, Role FROM UserTable WHERE UserID = ?;',
      [id]
    );
    
    return rows;
  } catch (e) {
    console.error('getUser error', e.message);
    next(httpError('Database error', 500));
  }
};

const addUser = async (name, email, password, next) => {
  try {
    const [rows] = await promisePool.execute(
      'INSERT INTO UserTable (UserName, email, password) VALUES (?, ?, ?);',
      [name, email, password]
    );
    return rows;
  } catch (e) {
    console.error('addUser error', e.message);
    next(httpError('Database error', 500));
  }
};

const getUserLogin = async (params) => {
  try {
    
    console.log('getUserLogin', params);
    
    const [rows] = await promisePool.execute('SELECT * FROM UserTable WHERE Email = ?;', params);
    
    return rows;
  } catch (e) {
    console.log('getUserLogin error', e.message);
    next(httpError('Database error', 500));
  }
}



module.exports = {
  getAllUsers,
  getUser,
  addUser,
  getUserLogin,
  
};