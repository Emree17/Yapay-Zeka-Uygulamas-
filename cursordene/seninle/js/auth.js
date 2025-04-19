/**
 * Auth Service - Kullanıcı kimlik doğrulama işlemleri
 * Login, register, şifre sıfırlama ve çıkış işlemleri
 */
class AuthService {
  constructor() {
    this.baseUrl = 'http://localhost:5000/api';
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    // Demo mod - backend çalışmadığında sahte veri kullanmak için
    this.useMockData = true; // Backend çalışmadığı için şimdilik true
  }

  /**
   * API için header oluştur
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': this.token ? `Bearer ${this.token}` : ''
    };
  }

  /**
   * Kullanıcı kaydı oluştur
   * @param {Object} userData - Kullanıcı bilgileri (firstName, lastName, email, password)
   * @returns {Promise} Kayıt sonucu
   */
  async register(userData) {
    try {
      // Demo mod aktifse sahte veri döndür
      if (this.useMockData) {
        console.log('Demo mod: Kullanıcı kaydı simüle ediliyor', userData);
        
        // Sahte kullanıcı oluştur
        const mockUser = {
          _id: 'mock-user-' + Date.now(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: 'user',
          isEmailVerified: false,
          createdAt: new Date().toISOString()
        };
        
        // Sahte token oluştur
        const mockToken = 'mock-token-' + Date.now();
        const mockRefreshToken = 'mock-refresh-token-' + Date.now();
        
        // Token ve kullanıcı bilgilerini sakla
        this.setAuthData(mockToken, mockRefreshToken, mockUser);
        
        // 500ms gecikme ile gerçekçi bir API çağrısı simüle et
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          status: 'success',
          token: mockToken,
          refreshToken: mockRefreshToken,
          data: {
            user: mockUser
          }
        };
      }

      // Gerçek API çağrısı
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kayıt işlemi başarısız oldu');
      }

      // Token ve kullanıcı bilgilerini sakla
      this.setAuthData(data.token, data.refreshToken, data.data.user);

      return data;
    } catch (error) {
      console.error('Kayıt hatası:', error);
      throw error;
    }
  }

  /**
   * Kullanıcı girişi yap
   * @param {string} email - Kullanıcı email
   * @param {string} password - Kullanıcı şifresi
   * @returns {Promise} Giriş sonucu
   */
  async login(email, password) {
    try {
      // Demo mod aktifse sahte veri döndür
      if (this.useMockData) {
        console.log('Demo mod: Kullanıcı girişi simüle ediliyor', { email });
        
        // Sahte kullanıcı oluştur
        const mockUser = {
          _id: 'mock-user-' + Date.now(),
          firstName: 'Demo',
          lastName: 'Kullanıcı',
          email: email,
          role: 'user',
          isEmailVerified: true,
          createdAt: new Date().toISOString()
        };
        
        // Sahte token oluştur
        const mockToken = 'mock-token-' + Date.now();
        const mockRefreshToken = 'mock-refresh-token-' + Date.now();
        
        // Token ve kullanıcı bilgilerini sakla
        this.setAuthData(mockToken, mockRefreshToken, mockUser);
        
        // 500ms gecikme ile gerçekçi bir API çağrısı simüle et
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          status: 'success',
          token: mockToken,
          refreshToken: mockRefreshToken,
          data: {
            user: mockUser
          }
        };
      }

      // Gerçek API çağrısı
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Giriş işlemi başarısız oldu');
      }

      // Token ve kullanıcı bilgilerini sakla
      this.setAuthData(data.token, data.refreshToken, data.data.user);

      return data;
    } catch (error) {
      console.error('Giriş hatası:', error);
      throw error;
    }
  }

  /**
   * Şifre sıfırlama bağlantısı gönder
   * @param {string} email - Kullanıcı email
   * @returns {Promise} İşlem sonucu
   */
  async forgotPassword(email) {
    try {
      // Demo mod aktifse sahte veri döndür
      if (this.useMockData) {
        console.log('Demo mod: Şifre sıfırlama isteği simüle ediliyor', { email });
        
        // 500ms gecikme ile gerçekçi bir API çağrısı simüle et
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          status: 'success',
          message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
        };
      }

      // Gerçek API çağrısı
      const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Şifre sıfırlama işlemi başarısız oldu');
      }

      return data;
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      throw error;
    }
  }

  /**
   * Şifre sıfırlama işlemini tamamla
   * @param {string} token - Şifre sıfırlama token'ı
   * @param {string} password - Yeni şifre
   * @returns {Promise} İşlem sonucu
   */
  async resetPassword(token, password) {
    try {
      // Demo mod aktifse sahte veri döndür
      if (this.useMockData) {
        console.log('Demo mod: Şifre sıfırlama işlemi simüle ediliyor', { token: token.substring(0, 10) + '...' });
        
        // Sahte kullanıcı oluştur
        const mockUser = {
          _id: 'mock-user-' + Date.now(),
          firstName: 'Demo',
          lastName: 'Kullanıcı',
          email: 'demo@example.com',
          role: 'user',
          isEmailVerified: true,
          createdAt: new Date().toISOString()
        };
        
        // Sahte token oluştur
        const mockToken = 'mock-token-' + Date.now();
        const mockRefreshToken = 'mock-refresh-token-' + Date.now();
        
        // 500ms gecikme ile gerçekçi bir API çağrısı simüle et
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          status: 'success',
          message: 'Şifreniz başarıyla sıfırlandı',
          token: mockToken,
          refreshToken: mockRefreshToken,
          data: {
            user: mockUser
          }
        };
      }

      // Gerçek API çağrısı
      const response = await fetch(`${this.baseUrl}/auth/reset-password/${token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Şifre sıfırlama işlemi başarısız oldu');
      }

      // Otomatik giriş ise token bilgilerini güncelle
      if (data.token && data.refreshToken) {
        this.setAuthData(data.token, data.refreshToken, data.data?.user);
      }

      return data;
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      throw error;
    }
  }

  /**
   * Email doğrula
   * @param {string} token - Email doğrulama token'ı
   * @returns {Promise} İşlem sonucu
   */
  async verifyEmail(token) {
    try {
      // Demo mod aktifse sahte veri döndür
      if (this.useMockData) {
        console.log('Demo mod: Email doğrulama işlemi simüle ediliyor', { token: token.substring(0, 10) + '...' });
        
        // 500ms gecikme ile gerçekçi bir API çağrısı simüle et
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          status: 'success',
          message: 'Email başarıyla doğrulandı'
        };
      }

      // Gerçek API çağrısı
      const response = await fetch(`${this.baseUrl}/auth/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email doğrulama işlemi başarısız oldu');
      }

      return data;
    } catch (error) {
      console.error('Email doğrulama hatası:', error);
      throw error;
    }
  }

  /**
   * Kullanıcı çıkışı yap
   */
  logout() {
    // Yerel depolamadan kimlik bilgilerini temizle
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    
    // Anasayfaya yönlendir
    window.location.href = '/index.html';
  }

  /**
   * Refresh token ile yeni token al
   * @returns {Promise} Yeni token bilgileri
   */
  async refreshAccessToken() {
    try {
      // Demo mod aktifse sahte veri döndür
      if (this.useMockData) {
        console.log('Demo mod: Token yenileme işlemi simüle ediliyor');
        
        if (!this.refreshToken) {
          throw new Error('Refresh token bulunamadı');
        }
        
        // Sahte token oluştur
        const mockToken = 'mock-token-' + Date.now();
        const mockRefreshToken = 'mock-refresh-token-' + Date.now();
        
        // Token bilgilerini güncelle
        this.token = mockToken;
        this.refreshToken = mockRefreshToken;
        localStorage.setItem('token', mockToken);
        localStorage.setItem('refreshToken', mockRefreshToken);
        
        // 500ms gecikme ile gerçekçi bir API çağrısı simüle et
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          status: 'success',
          token: mockToken,
          refreshToken: mockRefreshToken
        };
      }

      if (!this.refreshToken) {
        throw new Error('Refresh token bulunamadı');
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      const data = await response.json();

      if (!response.ok) {
        // Refresh token geçersiz, kullanıcıyı çıkış yaptır
        this.logout();
        throw new Error(data.message || 'Token yenileme başarısız oldu');
      }

      // Yeni token bilgilerini sakla
      this.setAuthData(data.token, data.refreshToken, this.user);

      return data;
    } catch (error) {
      console.error('Token yenileme hatası:', error);
      throw error;
    }
  }

  /**
   * Kullanıcının giriş yapmış olup olmadığını kontrol et
   * @returns {boolean} Giriş durumu
   */
  isLoggedIn() {
    return !!this.token && !!this.user;
  }

  /**
   * Token ve kullanıcı bilgilerini sakla
   * @param {string} token - JWT token
   * @param {string} refreshToken - Refresh token
   * @param {Object} user - Kullanıcı bilgileri
   */
  setAuthData(token, refreshToken, user) {
    // Yerel depolamaya kaydet
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Sınıf içinde güncelle
    this.token = token;
    this.refreshToken = refreshToken;
    this.user = user;
  }

  /**
   * Kullanıcı bilgilerini getir
   * @returns {Object} Kullanıcı bilgileri
   */
  getUser() {
    return this.user;
  }
}

// Global AuthService örneği oluştur
if (typeof window !== 'undefined' && !window.authService) {
  try {
    console.log('authService global örneği oluşturuluyor...');
    window.authService = new AuthService();
    console.log('authService global örneği başarıyla oluşturuldu');
  } catch (error) {
    console.error('authService oluşturulurken hata:', error);
  }
} 