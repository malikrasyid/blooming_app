const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // { id, role }
    next();
  });
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) return res.sendStatus(403);
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
