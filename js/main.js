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
// No tengo nada que decir aca jijijja

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        navbar.style.background = 'rgba(22, 27, 34, 0.9)';
        navbar.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
    } else {
        navbar.style.background = 'rgba(22, 27, 34, 0.75)';
        navbar.style.boxShadow = 'none';
    }
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

document.querySelectorAll('.feature-card, .credit-card, .tool-card, .download-card, .section-header, .about-header, .tools-section').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
    observer.observe(el);
});

// Animation styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== LAZY LOAD IMAGES =====
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
    if (img.complete) {
        img.classList.add('loaded');
    }
});

// ===== PAGE LOAD =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== CONSOLE BRANDING =====
console.log(
    '%c DropTune v1.2',
    'font-size: 24px; font-weight: bold; color: #29ABE0;'
);
console.log(
    '%cDescarga musica y videos sin complicaciones',
    'font-size: 12px; color: #8B949E;'
);
console.log(
    '%cDesarrollado por MegaStick & AndyGuss',
    'font-size: 11px; color: #FF6B6B;'
);

// ===== REDUCE MOTION =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-smooth', 'none');
    document.documentElement.style.setProperty('--transition-bounce', 'none');
}

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + window.innerHeight / 3;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.clientHeight;
        if (scrollPos >= top && scrollPos < bottom) {
            current = section.getAttribute('id');
        }
    });
    
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 100) {
        current = 'download';
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

const navActiveStyle = document.createElement('style');
navActiveStyle.textContent = `
    .nav-link.active {
        color: var(--primary-light) !important;
        background: rgba(41, 171, 224, 0.1);
    }
`;
document.head.appendChild(navActiveStyle);

// ===== DISCORD COPY =====
document.querySelectorAll('.discord-copy').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const username = this.getAttribute('data-username');
        
        navigator.clipboard.writeText(username).then(() => {
            showNotification(`Usuario "${username}" copiado`);
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = username;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification(`Usuario "${username}" copiado`);
        });
    });
});

function showNotification(message) {
    const existing = document.querySelector('.copy-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = `
        <img src="img/discord_icon.png" alt="" class="notification-icon">
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .copy-notification {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: linear-gradient(135deg, #5865F2, #7289DA);
        color: white;
        padding: 14px 24px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 40px rgba(88, 101, 242, 0.4);
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .copy-notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    
    .copy-notification .notification-icon {
        width: 22px;
        height: 22px;
        filter: brightness(0) invert(1);
    }
    
    button.social-link.discord-copy {
        border: none;
        cursor: pointer;
    }
`;
document.head.appendChild(notificationStyle);

// ===== CONFETTI ON DOWNLOAD =====
function createConfetti() {
    const colors = ['#29ABE0', '#A78BFA', '#FF6B6B', '#FFE66D', '#4FC3F7'];
    
    for (let i = 0; i < 25; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events: none;
            z-index: 9999;
            animation: confettiFall ${Math.random() * 2 + 1.5}s ease-out forwards;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3500);
    }
}

const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
`;
document.head.appendChild(confettiStyle);

document.querySelectorAll('.btn-download').forEach(btn => {
    btn.addEventListener('click', createConfetti);
});

// ===== INTERACTIVE LOGO =====
const navLogo = document.querySelector('.nav-logo');
let clicks = 0;

if (navLogo) {
    navLogo.style.cursor = 'pointer';
    navLogo.addEventListener('click', function(e) {
        e.preventDefault();
        clicks++;
        
        this.style.animation = 'spin 0.4s ease';
        setTimeout(() => this.style.animation = '', 400);
        
        if (clicks >= 5) {
            clicks = 0;
            createConfetti();
        }
    });
}

const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(spinStyle);

// ===== PARALLAX SHAPES =====
const shapes = document.querySelectorAll('.shape');

document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    shapes.forEach((shape, i) => {
        const speed = (i + 1) * 5;
        shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.btn-primary, .btn-download, .nav-link-primary').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        this.style.transition = 'transform 0.1s ease';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
        this.style.transition = 'transform 0.3s ease';
    });
});

// ===== BOUNCY SCROLL INDICATOR =====
const scrollIndicator = document.createElement('div');
scrollIndicator.className = 'scroll-indicator';
scrollIndicator.innerHTML = `
    <div class="scroll-mouse">
        <div class="scroll-wheel"></div>
    </div>
    <span>Scroll</span>
`;
document.querySelector('.hero').appendChild(scrollIndicator);

const scrollIndicatorStyle = document.createElement('style');
scrollIndicatorStyle.textContent = `
    .scroll-indicator {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        color: var(--text-muted);
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1px;
        animation: fadeInUp 1s ease 1.5s backwards;
        cursor: pointer;
        transition:
            color 0.3s ease,
            opacity 0.45s ease,
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.45s ease;
        will-change: opacity, transform, filter;
    }
    
    .scroll-indicator:hover {
        color: var(--primary-light);
    }

    .scroll-indicator.is-hidden {
        opacity: 0;
        transform: translateX(-50%) translateY(14px) scale(0.96);
        filter: blur(4px);
        pointer-events: none;
    }
    
    .scroll-mouse {
        width: 24px;
        height: 38px;
        border: 2px solid currentColor;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        padding-top: 8px;
    }
    
    .scroll-wheel {
        width: 4px;
        height: 8px;
        background: currentColor;
        border-radius: 2px;
        animation: scrollBounce 1.5s ease-in-out infinite;
    }
    
    @keyframes scrollBounce {
        0%, 100% { transform: translateY(0); opacity: 1; }
        50% { transform: translateY(6px); opacity: 0.5; }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    @media (max-width: 768px) {
        .scroll-indicator { display: none; }
    }
`;
document.head.appendChild(scrollIndicatorStyle);

scrollIndicator.addEventListener('click', () => {
    document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
});

// Hide scroll indicator on scroll
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        scrollIndicator.classList.add('is-hidden');
    } else {
        scrollIndicator.classList.remove('is-hidden');
    }
});

// ===== HOVER SOUND VISUAL FEEDBACK =====
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===== STATS COUNTER ANIMATION =====
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const value = entry.target.querySelector('.stat-value');
            if (value && value.textContent === '100%') {
                animateCounter(value, 0, 100, '%');
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

function animateCounter(element, start, end, suffix) {
    const duration = 1500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * eased);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== RIPPLE EFFECT ON BUTTONS =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        width: 10px;
        height: 10px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: rippleAnim 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleAnim {
        to {
            transform: translate(-50%, -50%) scale(30);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ===== FLOATING ANIMATION FOR SCREENSHOT =====
const screenshot = document.querySelector('.screenshot-wrapper');
if (screenshot) {
    let floatY = 0;
    let floatDirection = 1;
    
    function floatAnimation() {
        floatY += 0.02 * floatDirection;
        if (floatY > 1 || floatY < -1) floatDirection *= -1;
        
        screenshot.style.transform = `translateY(${floatY * 8}px)`;
        requestAnimationFrame(floatAnimation);
    }
    
    floatAnimation();
}
