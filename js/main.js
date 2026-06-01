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

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const navbar = $('.navbar');
const navLogo = $('.nav-logo');
const navLinks = $$('.nav-link');
const sections = $$('section[id]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const logoClickSound = new Audio('sound/fnaf.mp3');

logoClickSound.preload = 'auto';
logoClickSound.volume = 0.55;

function updateNavbar() {
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 100
        ? '0 10px 30px rgba(16, 24, 32, 0.08)'
        : 'none';
}

function updateActiveNav() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    let current = '';

    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < bottom) {
            current = section.id;
        }
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        current = 'download';
    }

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

function createConfetti() {
    const colors = ['#1677b7', '#29abe0', '#7fc4e8', '#d9e2ea', '#ffffff'];

    for (let i = 0; i < 22; i++) {
        const confetti = document.createElement('span');
        const size = Math.random() * 7 + 4;

        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '999px' : '2px';
        confetti.style.animationDuration = `${Math.random() * 1.2 + 1.6}s`;

        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3200);
    }
}

function showNotification(message) {
    $('.copy-notification')?.remove();

    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = `
        <img src="img/discord_icon.png" alt="" class="notification-icon">
        <span>${message}</span>
    `;

    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
    }
}

function animateCounter(element, start, end, suffix) {
    if (reduceMotion) {
        element.textContent = `${end}${suffix}`;
        return;
    }

    const duration = 1500;
    const startedAt = performance.now();

    function update(now) {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.floor(start + (end - start) * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

function setupScrollIndicator() {
    const hero = $('.hero');
    const features = $('#features');
    if (!hero || !features) return null;

    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.innerHTML = `
        <div class="scroll-mouse">
            <div class="scroll-wheel"></div>
        </div>
        <span>Scroll</span>
    `;

    indicator.addEventListener('click', () => {
        features.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    hero.appendChild(indicator);
    return indicator;
}

function setupRevealAnimations() {
    const elements = $$('.feature-card, .credit-card, .tool-card, .download-card, .section-header, .about-header, .tools-section');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        elements.forEach(element => element.classList.add('animate-in'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(element);
    });
}

function setupStatsAnimation() {
    const stats = $$('.stat');
    if (!stats.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const value = $('.stat-value', entry.target);
            if (value?.textContent === '100%') animateCounter(value, 0, 100, '%');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

$$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (event) => {
        const target = $(anchor.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
});

$$('img').forEach(img => {
    img.addEventListener('load', () => img.classList.add('loaded'));
    if (img.complete) img.classList.add('loaded');
});

$$('.discord-copy').forEach(button => {
    button.addEventListener('click', async (event) => {
        event.preventDefault();
        const username = button.dataset.username;
        if (!username) return;
        await copyText(username);
        showNotification(`Usuario "${username}" copiado`);
    });
});

$$('.btn-download').forEach(button => {
    button.addEventListener('click', createConfetti);
});

let logoClicks = 0;

if (navLogo) {
    navLogo.style.cursor = 'pointer';
    navLogo.addEventListener('click', (event) => {
        event.preventDefault();
        logoClicks++;

        logoClickSound.currentTime = 0;
        logoClickSound.play().catch(() => {});

        navLogo.animate(
            [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
            { duration: 400, easing: 'ease' }
        );

        if (logoClicks >= 5) {
            logoClicks = 0;
            createConfetti();
        }
    });
}

const scrollIndicator = setupScrollIndicator();

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    updateNavbar();
    updateActiveNav();
});

window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveNav();
    scrollIndicator?.classList.toggle('is-hidden', window.scrollY > 100);
}, { passive: true });

setupRevealAnimations();
setupStatsAnimation();
