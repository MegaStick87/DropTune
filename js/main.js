// Programado por MegaStick.


// _____ ______   _______   ________  ________  ________  _________  ___  ________  ___  __       
// |\   _ \  _   \|\  ___ \ |\   ____\|\   __  \|\   ____\|\___   ___\\  \|\   ____\|\  \|\  \     
// \ \  \\\__\ \  \ \   __/|\ \  \___|\ \  \|\  \ \  \___|\|___ \  \_\ \  \ \  \___|\ \  \/  /|_   
// \ \  \\|__| \  \ \  \_|/_\ \  \  __\ \   __  \ \_____  \   \ \  \ \ \  \ \  \    \ \   ___  \  
//  \ \  \    \ \  \ \  \_|\ \ \  \|\  \ \  \ \  \|____|\  \   \ \  \ \ \  \ \  \____\ \  \\ \  \ 
//   \ \__\    \ \__\ \_______\ \_______\ \__\ \__\____\_\  \   \ \__\ \ \__\ \_______\ \__\\ \__\
//    \|__|     \|__|\|_______|\|_______|\|__|\|__|\_________\   \|__|  \|__|\|_______|\|__| \|__|
//                                                \|_________|                                    

//                                             ARCHIVO JS.

// No tengo nada que decir acá jijijja


// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.background = 'rgba(13, 17, 23, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(13, 17, 23, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.feature-card, .credit-card, .tool-card, .download-card, .section-header, .about-header, .tools-section, .sites-note').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .feature-card:nth-child(1) { transition-delay: 0s !important; }
    .feature-card:nth-child(2) { transition-delay: 0.1s !important; }
    .feature-card:nth-child(3) { transition-delay: 0.2s !important; }
    .feature-card:nth-child(4) { transition-delay: 0.3s !important; }
    
    .credit-card:nth-child(1) { transition-delay: 0s !important; }
    .credit-card:nth-child(2) { transition-delay: 0.15s !important; }
    
    .tool-card:nth-child(1) { transition-delay: 0s !important; }
    .tool-card:nth-child(2) { transition-delay: 0.15s !important; }
`;
document.head.appendChild(style);

// ===== BUTTON HOVER EFFECTS =====
document.querySelectorAll('.btn-primary, .btn-download').forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.style.setProperty('--x', x + 'px');
        this.style.setProperty('--y', y + 'px');
    });
});

// ===== FEATURE CARDS HOVER EFFECT =====
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== SCREENSHOT PARALLAX =====
const screenshot = document.querySelector('.screenshot-wrapper');
if (screenshot) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.1;
        screenshot.style.transform = `translateY(${rate}px)`;
    });
}

// ===== STATS COUNTER ANIMATION =====
function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + suffix;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// ===== LAZY LOAD IMAGES =====
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
    
    if (img.complete) {
        img.classList.add('loaded');
    }
});

// ===== MOBILE MENU (for future use) =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// ===== CONSOLE BRANDING =====
console.log(
    '%c🎵 DropTune v1.2',
    'font-size: 24px; font-weight: bold; color: #29ABE0; text-shadow: 2px 2px 0 #0288D1;'
);
console.log(
    '%cDescarga música y videos sin complicaciones',
    'font-size: 14px; color: #8B949E;'
);
console.log(
    '%cDesarrollado con 💙 por MegaStick & AndyGuss',
    'font-size: 12px; color: #FF6B6B;'
);

// ===== PERFORMANCE: REDUCE MOTION =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition', 'none');
}

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== TYPING EFFECT FOR HERO (optional enhancement) =====
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ===== SMOOTH REVEAL ON SCROLL =====
const revealElements = document.querySelectorAll('.section-title, .section-subtitle');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.2 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + window.innerHeight / 3;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            current = section.getAttribute('id');
        }
    });
    
    // If we're near the bottom of the page, highlight the last section (download)
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 100) {
        current = 'download';
    }
    
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Add active nav link style
const navActiveStyle = document.createElement('style');
navActiveStyle.textContent = `
    .nav-link.active {
        color: var(--primary) !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(navActiveStyle);

// ===== DISCORD COPY TO CLIPBOARD =====
document.querySelectorAll('.discord-copy').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const username = this.getAttribute('data-username');
        
        navigator.clipboard.writeText(username).then(() => {
            // Show notification
            showCopyNotification(`Usuario "${username}" copiado al portapapeles`);
        }).catch(err => {
            console.error('Error al copiar:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = username;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopyNotification(`Usuario "${username}" copiado al portapapeles`);
        });
    });
});

function showCopyNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.copy-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = `
        <img src="img/discord_icon.png" alt="Discord" class="notification-icon">
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .copy-notification {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: linear-gradient(135deg, rgba(88, 101, 242, 0.95), rgba(114, 137, 218, 0.95));
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 8px 32px rgba(88, 101, 242, 0.4);
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 500;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .copy-notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    
    .copy-notification .notification-icon {
        width: 24px;
        height: 24px;
        filter: brightness(0) invert(1);
    }
    
    button.social-link.discord-copy {
        border: none;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-tertiary);
        border-radius: var(--radius-sm);
        transition: var(--transition);
        padding: 0;
    }
    
    button.social-link.discord-copy:hover {
        background: var(--primary);
        transform: translateY(-2px);
    }
    
    button.social-link.discord-copy:active {
        transform: translateY(0) scale(0.95);
    }
`;
document.head.appendChild(notificationStyle);

// ===== FLOATING PARTICLES =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

createParticles();
