'use strict';
// userController
const { validationResult } = require('express-validator');
const { getAllUsers, getUser, addUser } = require('../models/userModel');
const { httpError } = require('../utils/errors');

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('user_post validation', errors.array());
    next(httpError('invalid data', 400));
    return;
  }

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

const checkToken = (req, res, next) => {
  if (!req.user) {
    next(new Error('token not valid'));
  } else {
    res.json({ user: req.user });
  }
};

module.exports = {
  user_list_get,
  user_get,
  user_post,
  checkToken,
};