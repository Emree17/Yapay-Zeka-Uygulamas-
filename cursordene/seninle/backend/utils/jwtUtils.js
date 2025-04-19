const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');

/**
 * JWT token oluşturur
 * @param {Object} payload - Token içine gömülecek veri
 * @param {string} secret - JWT secret key
 * @param {string|number} expiresIn - Token'in geçerlilik süresi
 * @returns {string} JWT token
 */
const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Kullanıcı için kimlik doğrulama token'ı oluşturur
 * @param {Object} user - Kullanıcı nesnesi
 * @returns {String} JWT token
 */
const generateAuthToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

/**
 * Kullanıcı için refresh token oluşturur
 * @param {Object} user - Kullanıcı nesnesi
 * @returns {String} JWT token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

/**
 * Şifre sıfırlama token'ı oluşturur
 * @param {String} userId - Kullanıcı ID'si
 * @returns {String} Şifre sıfırlama token'ı
 */
const generatePasswordResetToken = (userId) => {
  // 1 saatlik şifre sıfırlama token'ı oluştur
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_RESET_SECRET, 
    { expiresIn: '1h' }
  );
};

/**
 * Email doğrulama token'ı oluşturur
 * @param {String} userId - Kullanıcı ID'si
 * @returns {String} Email doğrulama token'ı
 */
const generateEmailVerificationToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_EMAIL_VERIFICATION_SECRET, 
    { expiresIn: '24h' }
  );
};

/**
 * JWT token doğrular
 * @param {string} token - Doğrulanacak token
 * @param {string} secret - JWT secret key
 * @returns {Promise<Object>} Decoded token payload
 */
const verifyToken = async (token, secret) => {
  try {
    return await promisify(jwt.verify)(token, secret);
  } catch (error) {
    throw new Error('Geçersiz token veya süresi dolmuş');
  }
};

/**
 * Auth token doğrular
 * @param {string} token - Doğrulanacak token
 * @returns {Promise<Object>} Decoded token payload
 */
const verifyAuthToken = (token) => {
  return verifyToken(token, process.env.JWT_SECRET);
};

/**
 * Refresh token doğrular
 * @param {String} token - Refresh token
 * @returns {Promise<Object>} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return verifyToken(token, process.env.JWT_REFRESH_SECRET);
};

/**
 * Şifre sıfırlama token'ını doğrular
 * @param {String} token - Şifre sıfırlama token'ı
 * @returns {Promise<Object>} Decoded token payload
 */
const verifyPasswordResetToken = (token) => {
  return verifyToken(token, process.env.JWT_RESET_SECRET);
};

/**
 * Email doğrulama token'ını doğrular
 * @param {String} token - Email doğrulama token'ı
 * @returns {Promise<Object>} Decoded token payload
 */
const verifyEmailVerificationToken = (token) => {
  return verifyToken(token, process.env.JWT_EMAIL_VERIFICATION_SECRET);
};

module.exports = {
  generateAuthToken,
  generateRefreshToken,
  generatePasswordResetToken,
  generateEmailVerificationToken,
  verifyAuthToken,
  verifyRefreshToken,
  verifyPasswordResetToken,
  verifyEmailVerificationToken
}; 