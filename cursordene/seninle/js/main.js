// Belge hazır olduğunda çalıştır
document.addEventListener('DOMContentLoaded', function() {
    // Header'ın scroll olayını dinle
    handleHeaderScroll();

    // Mobil menü kontrolü
    setupMobileMenu();

    // Kaydırmalı bağlantıları düzgün yönlendir
    setupSmoothScrolling();

    // Karanlık mod kontrolü
    setupDarkModeToggle();

    // Kimlik doğrulama işlemlerini ayarla
    setupAuthForms();

    // Kullanıcı durumunu kontrol et ve UI'ı güncelle
    checkAuthStatus();
});

// Header'ın scroll olduğunda davranışını kontrol et
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
            header.style.padding = '15px 0';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.padding = '20px 0';
        }
    });
}

// Mobil menüyü ayarla
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (!menuToggle) return;
    
    menuToggle.addEventListener('click', function() {
        // Mobil menü açılıp kapanma mantığı burada geliştirilecek
        // Örnek olarak basit bir toggle
        if (nav.style.display === 'flex') {
            nav.style.display = 'none';
            authButtons.style.display = 'none';
        } else {
            nav.style.display = 'flex';
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.width = '100%';
            nav.style.backgroundColor = 'white';
            nav.style.padding = '20px';
            nav.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            
            authButtons.style.display = 'flex';
            authButtons.style.flexDirection = 'column';
            authButtons.style.position = 'absolute';
            authButtons.style.top = 'calc(100% + ' + nav.offsetHeight + 'px)';
            authButtons.style.left = '0';
            authButtons.style.width = '100%';
            authButtons.style.backgroundColor = 'white';
            authButtons.style.padding = '0 20px 20px';
            authButtons.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Pürüzsüz kaydırma için bağlantıları ayarla
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Eğer # ise kaydırma yapma
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Karanlık mod geçişi
function setupDarkModeToggle() {
    const darkModeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme') || 'light';
    
    if (darkModeToggle) {
        // Sayfa yüklendiğinde tema ayarını uygula
        if (storedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Tema değiştirme tıklaması
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            this.innerHTML = isDarkMode 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        });
    }
}

// Kimlik doğrulama formlarını ayarla (Login ve Register)
function setupAuthForms() {
    // Login/Register modallarını aç
    const loginButtons = document.querySelectorAll('.btn-login, .btn-login-link');
    const registerButtons = document.querySelectorAll('.btn-register, .btn-register-link');
    const modalCloseButtons = document.querySelectorAll('.close-modal');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    
    // Login modal
    const loginModal = document.getElementById('login-modal');
    // Register modal
    const registerModal = document.getElementById('register-modal');
    // Forgot password modal
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    
    // Login formuna submit event listener ekle
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register formuna submit event listener ekle
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Şifre sıfırlama formuna submit event listener ekle
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
    
    // Login butonlarına tıklama olayı ekle
    loginButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginModal) {
                loginModal.style.display = 'flex';
                if (registerModal) registerModal.style.display = 'none';
                if (forgotPasswordModal) forgotPasswordModal.style.display = 'none';
            }
        });
    });
    
    // Register butonlarına tıklama olayı ekle
    registerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (registerModal) {
                registerModal.style.display = 'flex';
                if (loginModal) loginModal.style.display = 'none';
                if (forgotPasswordModal) forgotPasswordModal.style.display = 'none';
            }
        });
    });
    
    // Şifre unuttum butonuna tıklama olayı ekle
    const forgotPasswordLinks = document.querySelectorAll('.forgot-password-link');
    forgotPasswordLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (forgotPasswordModal) {
                forgotPasswordModal.style.display = 'flex';
                if (loginModal) loginModal.style.display = 'none';
                if (registerModal) registerModal.style.display = 'none';
            }
        });
    });
    
    // Modal kapatma butonlarına tıklama olayı ekle
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Modal dışına tıklayarak kapatma
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.closest('.modal').style.display = 'none';
            }
        });
    });
    
    // Register'dan login formuna geçiş
    const goToLoginLinks = document.querySelectorAll('.go-to-login');
    goToLoginLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (registerModal) registerModal.style.display = 'none';
            if (loginModal) loginModal.style.display = 'flex';
        });
    });
    
    // Login'den register formuna geçiş
    const goToRegisterLinks = document.querySelectorAll('.go-to-register');
    goToRegisterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) registerModal.style.display = 'flex';
        });
    });
}

// Kullanıcı giriş durumunu kontrol et ve UI'ı güncelle
function checkAuthStatus() {
    // Auth servis var mı kontrol et
    if (typeof authService === 'undefined') {
        console.warn('Auth service bulunamadı');
        return;
    }
    
    const isLoggedIn = authService.isLoggedIn();
    
    // Header UI'ı güncelle
    updateHeaderUI(isLoggedIn);
    
    // Sayfaya özgü içeriği güncelle
    if (isLoggedIn) {
        loadUserSpecificContent();
    }
}

// Header UI'ı kullanıcı giriş durumuna göre güncelle
function updateHeaderUI(isLoggedIn) {
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    
    if (!authButtons) return;
    
    if (isLoggedIn) {
        // Kullanıcı giriş yapmış
        if (authButtons) authButtons.style.display = 'none';
        
        // Kullanıcı menüsü var mı?
        if (!userMenu) {
            // Kullanıcı menüsü oluştur
            createUserMenu();
        } else {
            userMenu.style.display = 'flex';
            
            // Kullanıcı bilgilerini güncelle
            const user = authService.getUser();
            const userAvatar = userMenu.querySelector('.user-avatar span');
            if (userAvatar && user) {
                userAvatar.textContent = `Merhaba, ${user.firstName || 'Kullanıcı'}`;
            }
        }
    } else {
        // Kullanıcı giriş yapmamış
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Kullanıcı menüsünü oluştur
function createUserMenu() {
    const header = document.querySelector('.header .container');
    const user = authService.getUser();
    
    if (!header || !user) return;
    
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.innerHTML = `
        <div class="user-avatar">
            <img src="${user.profilePicture || 'images/user-avatar.jpg'}" alt="Kullanıcı Profili">
            <span>Merhaba, ${user.firstName || 'Kullanıcı'}</span>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="dropdown-menu">
            <ul>
                <li><a href="journal.html"><i class="fas fa-book"></i> Günlüğüm</a></li>
                <li><a href="progress.html"><i class="fas fa-chart-line"></i> İlerleme</a></li>
                <li><a href="profile.html"><i class="fas fa-user"></i> Profil</a></li>
                <li><a href="#" id="logout-button"><i class="fas fa-sign-out-alt"></i> Çıkış</a></li>
            </ul>
        </div>
    `;
    
    header.appendChild(userMenu);
    
    // Çıkış butonuna event listener ekle
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

// Kullanıcıya özel içeriği yükle
function loadUserSpecificContent() {
    // Sayfaya göre farklı içerikler yüklenebilir
    const currentPage = window.location.pathname;
    
    // Journal sayfasındaysa günlükleri yükle
    if (currentPage.includes('journal.html')) {
        // Günlük sayfası fonksiyonları
        if (typeof loadJournalHistory === 'function') {
            loadJournalHistory();
        }
    }
    
    // İlerleme sayfasındaysa grafikleri yükle
    if (currentPage.includes('progress.html')) {
        // İlerleme sayfası fonksiyonları
        if (typeof loadEmotionTrends === 'function') {
            loadEmotionTrends();
        }
    }
}

// Login formunu işle
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.querySelector('#login-form .form-error');
    const submitButton = document.querySelector('#login-form button[type="submit"]');
    
    if (!email || !password) {
        if (errorDiv) errorDiv.textContent = 'Lütfen tüm alanları doldurun.';
        return;
    }
    
    // Loading durumunu göster
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giriş Yapılıyor...';
    }
    
    try {
        // Auth servis var mı kontrol et
        if (typeof authService === 'undefined') {
            throw new Error('Auth service bulunamadı');
        }
        
        // Giriş yap
        await authService.login(email, password);
        
        // Başarılı giriş
        // Modal kapat
        const loginModal = document.getElementById('login-modal');
        if (loginModal) loginModal.style.display = 'none';
        
        // UI güncelle
        updateHeaderUI(true);
        
        // Kullanıcı sayfasına yönlendir
        window.location.href = 'journal.html';
    } catch (error) {
        // Hata mesajını göster
        if (errorDiv) errorDiv.textContent = error.message || 'Giriş yapılırken bir hata oluştu.';
    } finally {
        // Loading durumunu kaldır
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Giriş Yap';
        }
    }
}

// Register formunu işle
async function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('register-first-name').value;
    const lastName = document.getElementById('register-last-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const termsCheckbox = document.getElementById('register-terms');
    const errorDiv = document.querySelector('#register-form .form-error');
    const submitButton = document.querySelector('#register-form button[type="submit"]');
    
    if (!firstName || !lastName || !email || !password) {
        if (errorDiv) errorDiv.textContent = 'Lütfen tüm alanları doldurun.';
        return;
    }
    
    if (termsCheckbox && !termsCheckbox.checked) {
        if (errorDiv) errorDiv.textContent = 'Kullanım koşullarını kabul etmelisiniz.';
        return;
    }
    
    // Loading durumunu göster
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kaydediliyor...';
    }
    
    try {
        // Auth servis var mı kontrol et
        if (typeof authService === 'undefined') {
            throw new Error('Auth service bulunamadı');
        }
        
        // Kayıt ol
        await authService.register({
            firstName,
            lastName,
            email,
            password
        });
        
        // Başarılı kayıt
        // Modal kapat
        const registerModal = document.getElementById('register-modal');
        if (registerModal) registerModal.style.display = 'none';
        
        // UI güncelle
        updateHeaderUI(true);
        
        // Kullanıcı sayfasına yönlendir
        window.location.href = 'journal.html';
    } catch (error) {
        // Hata mesajını göster
        if (errorDiv) errorDiv.textContent = error.message || 'Kayıt olurken bir hata oluştu.';
    } finally {
        // Loading durumunu kaldır
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Kayıt Ol';
        }
    }
}

// Şifre sıfırlama formunu işle
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgot-email').value;
    const errorDiv = document.querySelector('#forgot-password-form .form-error');
    const successDiv = document.querySelector('#forgot-password-form .form-success');
    const submitButton = document.querySelector('#forgot-password-form button[type="submit"]');
    
    if (!email) {
        if (errorDiv) errorDiv.textContent = 'Lütfen email adresinizi girin.';
        return;
    }
    
    // Loading durumunu göster
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
    }
    
    // Hata mesajını temizle
    if (errorDiv) errorDiv.textContent = '';
    
    try {
        // Auth servis var mı kontrol et
        if (typeof authService === 'undefined') {
            throw new Error('Auth service bulunamadı');
        }
        
        // Şifre sıfırlama isteği gönder
        await authService.forgotPassword(email);
        
        // Başarı mesajını göster
        if (successDiv) {
            successDiv.textContent = 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.';
            successDiv.style.display = 'block';
        }
        
        // Form alanlarını temizle
        document.getElementById('forgot-email').value = '';
    } catch (error) {
        // Hata mesajını göster
        if (errorDiv) errorDiv.textContent = error.message || 'Şifre sıfırlama işlemi başarısız oldu.';
    } finally {
        // Loading durumunu kaldır
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Şifre Sıfırlama Bağlantısı Gönder';
        }
    }
}

// Çıkış işlemini gerçekleştir
function handleLogout() {
    // Auth servis var mı kontrol et
    if (typeof authService === 'undefined') {
        console.warn('Auth service bulunamadı');
        return;
    }
    
    // Çıkış yap
    authService.logout();
    
    // UI güncelle
    updateHeaderUI(false);
    
    // Anasayfaya yönlendir
    window.location.href = 'index.html';
} 