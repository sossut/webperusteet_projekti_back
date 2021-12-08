'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const bcrypt = require('bcryptjs');
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const { getUserLogin } = require('../models/userModel');

// local strategy for username password login
passport.use(
  new Strategy(async (username, password, done) => {
      
    const params = [username];
    try {
      const [user] = await getUserLogin(params);
      
      console.log('Local strategy', user); // result is binary row
      if (!user) {
        return done(null, false, { message: 'user' });
      }
      if (!bcrypt.compareSync(password, user.Password)) {
        return done(null, false, { message: 'pw' });
      }
      return done(null, { ...user }, { message: 'Logged In Successfully' }); 
    } catch (err) {
      return done(err);
    }
  })
);


// consider .env for secret, e.g. secretOrKey: process.env.JWT_SECRET
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
                
      done(null, jwtPayload);
       
      
    }
  )
);

module.exports = passport;