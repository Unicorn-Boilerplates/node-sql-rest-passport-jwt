const jwt = require('jwt-simple');
const moment = require('moment');

const model = require('./../models/user');
const secrets = require('./../../config/secret');

/**
 * Express middleware function. Ensures that the user is autheticated. This
 * method reads the authorization header where a JWT is expected to be found.
 * If no valid JWT is found a NOT_AUTHORIZED (401) response is returned.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - Middleware function to continue the call chain
 */
function ensureAuthenticated(req, res, next) {
  let err;
  console.log('received authentication request')
  console.log('Test for Authorization', req.headers)
  if (!req.headers.authorization) {
    err = new Error();
    err.status = 401;
    err.message = 'Please make sure your request has an Authorization header';
    return next(err);
  }
  console.log('Test for Beared')
  if (!/^Bearer .*$/.test(req.headers.authorization)) {
    err = new Error();
    err.status = 401;
    err.message = 'Authorization header does not match expected format';
    return next(err);
  }
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.decode(token, secrets.TOKEN_SECRET);
  if (payload.exp <= moment().unix()) {
    err = new Error();
    err.status = 401;
    err.message = 'Token has expired';
    return next(err);
  }
  console.log('GOT HERE')
  req.user = payload.sub;
  req.scopes = payload.scopes;
  next();
}

exports.ensureAuthenticated = ensureAuthenticated;

/**
 * Middleware function to check that the user is an Admin (deprecated)
 * todo(mziccard) Remove after replacing everywhere with checkScopes
 */
function ensureAdmin(req, res, next) {
  model.User.find({
    where: {
      id: req.user,
      isAdmin: true,
    },
  }).then((user) => {
    if (!user) {
      const err = new Error();
      err.status = 401;
      err.message = 'You need to be an admin to access this endpoint';
      return next(err);
    }
    next();
  }).catch(err => next(err));
}

exports.ensureAdmin = ensureAdmin;

/**
 * Factory of middleware functions that check whether a user has the scopes
 * required to access the required resource. Functions generated by this
 * method must be chained after ensureAuthenticated.
 *
 * @param {array} requiredScopes - An array of strings with the required scopes
 */
function checkScopes(requiredScopes) {
  return function(req, res, next) {
    let authorized = true;
    if (req.scopes) {
      for (let j = 0; j < requiredScopes.length && authorized; j++) {
        if (req.scopes.indexOf(requiredScopes[j]) === -1) {
          authorized = false;
        }
      }
    }
    if (authorized) {
      return next();
    }
    const err = new Error();
    err.status = 401;
    err.message = 'You don\'t have access to the requested resource';
    return next(err);
  };
}

exports.checkScopes = checkScopes;

/**
 * Creates a JSON Web Token given a complete user. JWT contains user id,
 * expiration and user's access scopes.
 *
 * @param {object} user - A user info, as extracted from the database
 */
function createToken(user) {
  console.log('creating Token for:', user)
  let scopes = ['user'];
  if (user.isAdmin) {
    scopes = ['user', 'admin'];
  }
  console.log('USER ID:', user.id)
  const payload = {
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix(),
    scopes,
  };
  console.log(payload, secrets.TOKEN_SECRET)
  return jwt.encode(payload, secrets.TOKEN_SECRET);
}

exports.createToken = createToken;

function createEarlyToken(user) {
  const payload = {
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix(),
    scopes: ['early-user'],
  };
  return jwt.encode(payload, secrets.TOKEN_SECRET);
}

exports.createEarlyToken = createEarlyToken;
