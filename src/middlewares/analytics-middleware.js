function authMiddleware(req, res, next) {
  const role = req.headers['x-role'];
  if (!role) return res.status(401).json({ message: 'No role header found' });
  req.user = { role };
  next();
}

function roleMiddleware(role) {
  return (req, res, next) => {
    if (req.user.role !== role)
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    next();
  };
}

module.exports = { authMiddleware, roleMiddleware };
