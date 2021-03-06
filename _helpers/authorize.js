const expressJwt = require('express-jwt');
const { secret } = require('../config.json');

module.exports = authorize;

function authorize(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authenticat jwt token and attach user to request obj (req.user)
    expressJwt({ secret }),

    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
	// user's role is not authorized
	return res.status(401).json({ message: 'Unauthorized' });
      }

      // authentication and authorization successful
      next();
    }
  ];
}
