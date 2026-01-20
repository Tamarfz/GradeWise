const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'dev-only-change-me-immediately';

/**
 * Generate a JWT token for a user
 * @param {Object} userData - User data to encode in token
 * @returns {string} JWT token
 */
const generateToken = (userData) => {
  return jwt.sign(
    { data: userData },
    secretKey,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded user data or null if invalid
 */
const verifyToken = (token) => {
  try {
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, secretKey);
    return decoded.data || null;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};

/**
 * Express middleware to authenticate requests using JWT token
 * Expects token in Authorization header: "Bearer <token>"
 * Attaches user data to req.user on success
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  // Support both "Bearer <token>" and just "<token>" formats
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader.split(' ')[0];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const user = verifyToken(token);
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }

  req.user = user;
  next();
};

/**
 * Express middleware to authorize admin users only
 * Must be used after authenticateToken middleware
 */
const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
  }

  if (req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required.' });
  }

  next();
};

/**
 * Express middleware to authorize judge users only
 * Must be used after authenticateToken middleware
 */
const authorizeJudge = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
  }

  if (req.user.type !== 'judge') {
    return res.status(403).json({ error: 'Forbidden: Judge access required.' });
  }

  next();
};

/**
 * Express middleware to authorize specific user types
 * @param {string|string[]} allowedTypes - Single type or array of allowed types
 */
const authorizeTypes = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
    }

    const userType = req.user.type;
    const isAllowed = allowedTypes.includes(userType);

    if (!isAllowed) {
      return res.status(403).json({ 
        error: `Forbidden: Access restricted to ${allowedTypes.join(' or ')}.` 
      });
    }

    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  authorizeAdmin,
  authorizeJudge,
  authorizeTypes,
  secretKey, // Export for use in services if needed
};

