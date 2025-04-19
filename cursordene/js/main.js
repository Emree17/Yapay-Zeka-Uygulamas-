// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');
    
    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    // Modal Elements
    const loginBtn = document.querySelector('.btn-login');
    const signupBtn = document.querySelector('.btn-signup');
    const ctaBtn = document.querySelector('.btn-cta');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const signupLink = document.getElementById('signup-link');
    const loginLink = document.getElementById('login-link');
    
    // Testimonials
    const dots = document.querySelectorAll('.dot');
    
    // Hero Buttons
    const startNowBtn = document.querySelector('.hero-content .btn-primary');
    const learnMoreBtn = document.querySelector('.hero-content .btn-secondary');
    
    // Coach Selection
    const coachButtons = document.querySelectorAll('.btn-coach');
    
    // Initialize current theme from localStorage or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Theme Toggle Functionality
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        
        // Update icon
        if (body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Mobile Navigation Toggle
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate burger
        burger.querySelectorAll('div').forEach(line => {
            line.classList.toggle('active');
        });
    });
    
    // Modal Functionality
    function openModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // Open login modal
    loginBtn.addEventListener('click', () => openModal(loginModal));
    
    // Open signup modal
    signupBtn.addEventListener('click', () => openModal(signupModal));
    
    // CTA button to open signup modal
    ctaBtn.addEventListener('click', () => openModal(signupModal));
    
    // Hero buttons
    startNowBtn.addEventListener('click', () => openModal(signupModal));
    learnMoreBtn.addEventListener('click', () => {
        document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Close modals with X button
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Switch between login and signup modals
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(signupModal);
    });
    
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        openModal(loginModal);
    });
    
    // Testimonial slider functionality
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    // Hide all testimonials except the first one
    if (testimonials.length > 1) {
        for (let i = 1; i < testimonials.length; i++) {
            testimonials[i].style.display = 'none';
        }
    }
    
    // Testimonial dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    function showTestimonial(index) {
        // Hide current testimonial
        testimonials[currentTestimonial].style.display = 'none';
        dots[currentTestimonial].classList.remove('active');
        
        // Show new testimonial
        currentTestimonial = index;
        testimonials[currentTestimonial].style.display = 'block';
        dots[currentTestimonial].classList.add('active');
    }
    
    // Auto-rotate testimonials every 5 seconds
    setInterval(() => {
        if (testimonials.length > 1) {
            let nextTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(nextTestimonial);
        }
    }, 5000);
    
    // Form Submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // In a real application, you would send these credentials to your server
            console.log('Login attempt with:', email);
            
            // Mock login success
            alert('Giriş başarılı! Günlük sayfasına yönlendiriliyorsunuz...');
            
            // In a real application, you would redirect to the dashboard or journal page
            // window.location.href = 'dashboard.html';
            
            // For now, just close the modal
            closeModal(loginModal);
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            // Basic validation
            if (password !== confirmPassword) {
                alert('Şifreler eşleşmiyor!');
                return;
            }
            
            // In a real application, you would send this data to your server
            console.log('Signup attempt with:', name, email);
            
            // Mock signup success
            alert('Kayıt başarılı! Giriş yapabilirsiniz.');
            
            // Close signup modal and open login modal
            closeModal(signupModal);
            openModal(loginModal);
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // In a real application, you would send this to your server
            console.log('Newsletter signup:', email);
            
            // Mock success
            alert('Bültenimize başarıyla abone oldunuz!');
            
            // Clear the input
            newsletterForm.querySelector('input[type="email"]').value = '';
        });
    }
    
    // Coach Selection
    coachButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the coach name
            const coachName = this.parentElement.querySelector('h3').textContent;
            
            // Remove 'selected' class from all coach cards
            document.querySelectorAll('.coach-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add 'selected' class to the parent card
            this.parentElement.classList.add('selected');
            
            // Mock coach selection
            alert(`"${coachName}" koçunu seçtin! Artık günlük yazma deneyimini bu koç ile yaşayabilirsin.`);
            
            // In a real application, you would save this preference to the user's account
            console.log('Coach selected:', coachName);
        });
    });
    
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Scroll animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .step, .coach-card, .testimonial');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Run animations on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run animations on load
    animateOnScroll();
}); 