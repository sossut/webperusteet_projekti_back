'use strict';
// userController
const userModel = require('../models/userModel');
const { httpError } = require('../utils/errors');

// const users = userModel.users;
const { getAllUsers, getUser, addUser } = userModel;

const user_list_get = async (req, res, next) => {  
  try {
    const users = await getAllUsers(next);
    if (users.length > 0) {
      res.json(users);
    } else {
      next('No users found', 404);
    }
  } catch (e) {
    console.log('user_list_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const user_get = async (req, res, next) => {
  try {
    const vastaus = await getUser(req.params.id, next);
    if (vastaus.length > 0) {
      res.json(vastaus.pop());
    } else {
      
      next(httpError('No user found', 404));
    }
  } catch (e) {
    console.log('user_get error', e.message);
    next(httpError('internal server error', 500));
  }
};

const user_post = async (req, res, next) => {
  try {
    console.log('from form', req.body);
    const { name, email, passwd } = req.body;
    const tulos = await addUser(name, email, passwd, next);
    if (tulos.affectedRows > 0) {
      res.json({
        message: 'user added',
        user_id: tulos.insertId,
      });
    } else {
      next(httpError('No user inserted', 400));
    }
  } catch (e) {
    console.log('user_post error', e.message);
    next(httpError('internal server error', 500));
  }
};

module.exports = {
  user_list_get,
  user_get,
  user_post,
};