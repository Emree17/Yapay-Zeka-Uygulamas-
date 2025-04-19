const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { 
  generateAuthToken, 
  generateRefreshToken,
  generatePasswordResetToken,
  generateEmailVerificationToken,
  verifyRefreshToken,
  verifyEmailVerificationToken,
  verifyAuthToken
} = require('../utils/jwtUtils');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

/**
 * Kullanıcı kaydı oluşturur
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Email kullanımda mı kontrol et
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Bu email adresi zaten kullanımda', 400));
  }

  // Sadece admin kullanıcılar admin rolü atayabilir
  if (role === 'admin' && (!req.user || req.user.role !== 'admin')) {
    return next(new AppError('Admin rolü atamak için yetkiniz yok', 403));
  }

  // Kullanıcı oluştur
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'user'
  });

  // Doğrulama e-postası gönder
  if (process.env.NODE_ENV === 'production') {
    const verificationToken = generateEmailVerificationToken(user._id);
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    const message = `
      Merhaba ${user.firstName},
      
      E-posta adresinizi doğrulamak için lütfen aşağıdaki bağlantıya tıklayın:
      ${verificationUrl}
      
      Bu bağlantı 24 saat boyunca geçerlidir.
      
      Teşekkürler,
      Seninle Ekibi
    `;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'E-posta Doğrulama',
        message
      });
    } catch (error) {
      console.error('Email gönderme hatası:', error);
      // Email gönderilemese bile kullanıcı oluşturulur
    }
  }

  // Token oluştur
  const token = generateAuthToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  
  // Hassas verileri kaldır
  user.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user
    }
  });
});

/**
 * Kullanıcı girişi yapar
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Email ve şifre kontrolü
  if (!email || !password) {
    return next(new AppError('Lütfen email ve şifre girin', 400));
  }

  // Kullanıcıyı bul
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Geçersiz email veya şifre', 401));
  }

  // Son aktif zamanı güncelle
  user.lastActive = Date.now();
  await user.save({ validateBeforeSave: false });

  // Token oluştur
  const token = generateAuthToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Hassas verileri kaldır
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user
    }
  });
});

/**
 * Kullanıcı çıkışı yapar (client tarafında token silinir)
 * @route GET /api/auth/logout
 * @access Private
 */
exports.logout = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Başarıyla çıkış yapıldı'
  });
};

/**
 * Token yenileme
 * @route POST /api/auth/refresh-token
 * @access Public
 */
exports.refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh token gerekli', 400));
  }

  try {
    // Token doğrula
    const decoded = await verifyRefreshToken(refreshToken);
    
    // Kullanıcıyı kontrol et
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new AppError('Bu token ile ilişkili kullanıcı bulunamadı', 401));
    }

    // Yeni token oluştur
    const token = generateAuthToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    return next(new AppError('Geçersiz veya süresi dolmuş refresh token', 401));
  }
});

/**
 * Şifre sıfırlama isteği gönderir
 * @route POST /api/auth/forgot-password
 * @access Public
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Email ile kullanıcıyı bul
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    return next(new AppError('Bu email adresi ile kayıtlı kullanıcı bulunamadı', 404));
  }

  // Reset token oluştur
  const resetToken = generatePasswordResetToken(user._id);
  
  // DB'ye token hash'ini kaydet
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 saat
  
  await user.save({ validateBeforeSave: false });

  // Reset URL
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const message = `
    Merhaba ${user.firstName},
    
    Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:
    ${resetURL}
    
    Bu bağlantı 1 saat boyunca geçerlidir.
    
    Eğer şifre sıfırlama isteğini siz göndermediyseniz, bu e-postayı görmezden gelin.
    
    Teşekkürler,
    Seninle Ekibi
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Şifre Sıfırlama İsteği',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi'
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save({ validateBeforeSave: false });
    
    return next(new AppError('E-posta gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin', 500));
  }
});

/**
 * Şifre sıfırlama işlemini gerçekleştirir
 * @route PATCH /api/auth/reset-password/:token
 * @access Public
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Token'ı hash'le
  const resetToken = req.params.token;
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Geçerli token ile kullanıcıyı bul
  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Geçersiz veya süresi dolmuş token', 400));
  }

  // Yeni şifreyi ayarla
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  await user.save();

  // Otomatik giriş (token oluştur)
  const token = generateAuthToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Şifreniz başarıyla sıfırlandı',
    token,
    refreshToken
  });
});

/**
 * Mevcut kullanıcının şifresini günceller
 * @route PATCH /api/auth/update-password
 * @access Private
 */
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  // Kullanıcıyı şifresiyle birlikte getir
  const user = await User.findById(req.user.id).select('+password');

  // Mevcut şifreyi kontrol et
  if (!(await user.comparePassword(currentPassword, user.password))) {
    return next(new AppError('Mevcut şifreniz yanlış', 401));
  }

  // Şifreyi güncelle
  user.password = newPassword;
  await user.save();

  // Yeni token oluştur
  const token = generateAuthToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Şifreniz başarıyla güncellendi',
    token,
    refreshToken
  });
});

/**
 * Email doğrulama
 * @route GET /api/auth/verify-email/:token
 * @access Public
 */
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return next(new AppError('Doğrulama token\'ı gerekli', 400));
  }

  try {
    // Token'ı doğrula
    const decoded = await verifyEmailVerificationToken(token);

    // Kullanıcıyı bul ve güncelle
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { isEmailVerified: true },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new AppError('Bu token ile ilişkili kullanıcı bulunamadı', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Email başarıyla doğrulandı'
    });
  } catch (error) {
    return next(new AppError('Geçersiz veya süresi dolmuş doğrulama token\'ı', 400));
  }
}); 