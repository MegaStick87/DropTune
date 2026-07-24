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

// No tengo nada que decir acá, aunque si que hay bastante código por acá.

import { PrettyModal } from './PrettyModal.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Initialize PrettyModal
const prettyModal = new PrettyModal();
window.prettyModal = prettyModal;

const navbar = $('.navbar');
const navLogo = $('.nav-logo');
const navLinks = $$('.nav-link');
const sections = $$('section[id]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsap = window.gsap;

window.closeModalAndScroll = (dialogId, targetId) => {
    prettyModal.close(dialogId);
    window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({
            behavior: reduceMotion ? 'auto' : 'smooth',
            block: 'start'
        });
    }, reduceMotion ? 0 : 720);
};

// Registrar plugins de GSAP si están disponibles
if (gsap) {
    try {
        if (window.Flip && typeof gsap.registerPlugin === 'function') gsap.registerPlugin(window.Flip);
        if (window.CustomEase && typeof gsap.registerPlugin === 'function') gsap.registerPlugin(window.CustomEase);
        if (window.ScrollTrigger && typeof gsap.registerPlugin === 'function') gsap.registerPlugin(window.ScrollTrigger);
    } catch (e) {
        console.warn('GSAP plugin registration failed:', e);
    }
}
const logoClickSound = new Audio('sound/fnaf.mp3');

logoClickSound.preload = 'auto';
logoClickSound.volume = 0.55;

// Theme variables for light and dark modes
const themeVars = {
    light: {
        'blue': '#1677b7',
        'blue-dark': '#0d5f98',
        'ink': '#101820',
        'ink-soft': '#4f5f6d',
        'paper': '#f5f7fa',
        'paper-soft': '#eef3f7',
        'line': '#d9e2ea',
        'white': '#ffffff',
        'bg': '#ffffff',
        'text': '#101820',
        // nav primary button
        'navPrimaryBg': '#101820',
        'navPrimaryColor': '#ffffff'
    },
    dark: {
        'blue': '#2a8bd6',
        'blue-dark': '#1f6fa8',
        'ink': '#e6eef6',
        'ink-soft': '#b9c6d1',
        'paper': '#0f1416',
        'paper-soft': '#0b0f12',
        // separator line - lighter than background so it remains visible in dark mode
        'line': '#223033',
        'white': '#0b0f12',
        'bg': '#0b0f12',
        'text': '#e6eef6',
        // nav primary button adjusted for dark theme
        'navPrimaryBg': '#e6eef6',
        'navPrimaryColor': '#0b0f12'
    }
};

// Animation speed multiplier (less than 1 = faster)
const ANIM_SPEED = 0.75;

function d(v) { return (v * ANIM_SPEED); }

// Card and divider theming
themeVars.light.cardBg = 'var(--paper)';
themeVars.light.cardBorder = 'var(--line)';
themeVars.light.cardShadow = '0 18px 48px rgba(16,24,32,0.04)';

// Improve contrast for dark mode cards: slightly lighter surface, clearer border, stronger shadow
themeVars.dark.cardBg = '#0f1719';
themeVars.dark.cardBorder = '#21272a';
themeVars.dark.cardShadow = '0 24px 60px rgba(2,6,23,0.66)';

// Panel (download) theming
themeVars.light.panelBg = 'var(--white)';
themeVars.light.panelBorder = 'var(--line)';
themeVars.light.panelShadow = '0 28px 90px rgba(16, 24, 32, 0.08)';

themeVars.dark.panelBg = '#0c1113';
themeVars.dark.panelBorder = '#1b2225';
themeVars.dark.panelShadow = '0 34px 110px rgba(0,0,0,0.7)';


function applyTheme(theme, animated = true) {
    const vars = themeVars[theme] || themeVars.light;
    const root = document.documentElement;

    // Also set data-theme attribute for CSS fallbacks
    root.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');

    if (gsap && animated) {
        const animProps = {};
        Object.keys(vars).forEach(k => { animProps[`--${k}`] = vars[k]; });
        animProps.duration = d(0.6);
        animProps.ease = 'power2.inOut';
        gsap.to(root, animProps);
    } else {
        Object.keys(vars).forEach(k => root.style.setProperty(`--${k}`, vars[k]));
    }

    // Update theme toggle accessible label and title
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
        const nextLabel = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
        btn.setAttribute('aria-label', nextLabel);
        btn.title = nextLabel;
    }

    localStorage.setItem('site-theme', theme);
}

function initTheme() {
    const saved = localStorage.getItem('site-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(initial, false);

    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            // Button press animation (use GSAP if available for a nicer effect)
            try {
                if (gsap) {
                    gsap.fromTo(toggle, { scale: 0.92 }, { scale: 1, duration: d(0.32), ease: 'back.out(1.6)' });
                } else {
                    toggle.animate([{ transform: 'scale(0.92)' }, { transform: 'scale(1)' }], { duration: d(320), easing: 'cubic-bezier(.2,.9,.2,1)' });
                }
            } catch (e) { /* ignore animation errors */ }

            applyTheme(next, true);
        });
    }
}

// Initialize theme after DOM loaded
window.addEventListener('DOMContentLoaded', initTheme);

function updateVisualViewportHeight() {
    const height = window.visualViewport?.height || window.innerHeight;
    document.documentElement.style.setProperty('--visual-viewport-height', `${height}px`);
}

updateVisualViewportHeight();
window.addEventListener('resize', updateVisualViewportHeight, { passive: true });
window.addEventListener('orientationchange', updateVisualViewportHeight, { passive: true });
window.visualViewport?.addEventListener('resize', updateVisualViewportHeight, { passive: true });
window.visualViewport?.addEventListener('scroll', updateVisualViewportHeight, { passive: true });
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
    const existing = $('.copy-notification');
    if (existing) {
        gsap?.killTweensOf(existing);
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = `
        <img src="img/discord_icon.png" alt="" class="notification-icon">
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    const icon = $('.notification-icon', notification);
    const text = $('span', notification);

    if (gsap && !reduceMotion) {
        notification.style.transition = 'background 0.45s ease, border-color 0.45s ease, color 0.45s ease';

        gsap.set(notification, {
            autoAlpha: 0,
            xPercent: -50,
            y: 26,
            scale: 0.92,
            filter: 'blur(12px) saturate(1.18)',
            transformOrigin: '50% 100%'
        });
        gsap.set([icon, text], { autoAlpha: 0, y: 6 });
        gsap.set(icon, { scale: 0.82, rotate: -8 });

        gsap.timeline({ defaults: { overwrite: 'auto' } })
            .to(notification, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px) saturate(1)',
                duration: d(0.54),
                ease: 'back.out(1.45)'
            }, 0)
            .to(icon, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                rotate: 0,
                duration: d(0.48),
                ease: 'back.out(2)'
            }, 0.08)
            .to(text, {
                autoAlpha: 1,
                y: 0,
                duration: d(0.36),
                ease: 'power3.out'
            }, 0.14);

        setTimeout(() => {
            gsap.timeline({ defaults: { overwrite: 'auto' }, onComplete: () => notification.remove() })
                .to([icon, text], { y: -4, autoAlpha: 0, duration: d(0.22), ease: 'power2.in' }, 0)
                .to(notification, {
                    y: 18,
                    scale: 0.96,
                    autoAlpha: 0,
                    filter: 'blur(10px) saturate(1.1)',
                    duration: d(0.34),
                    ease: 'power3.inOut'
                }, 0.02);
        }, 2500);

        return;
    }

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
    const elements = $$('.demo-card, .feature-card, .credit-card, .tool-card, .section-header, .about-header, .tools-section');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        elements.forEach(element => element.classList.add('animate-in'));
        return;
    }

    if (gsap && window.ScrollTrigger) {
        const getRevealTargets = (target) => {
            if (target.classList.contains('section-header') || target.classList.contains('about-header')) {
                const children = $$('.section-tag, .section-title, .section-description', target);
                return children.length ? children : [target];
            }

            if (target.classList.contains('tools-section')) {
                const children = $$('.tools-title, .tools-description, .tool-card, .sites-note', target);
                return children.length ? children : [target];
            }

            return [target];
        };

elements.forEach((target, index) => {
            const targets = getRevealTargets(target);
            const animatesChildren = !targets.includes(target);

            if (animatesChildren) {
                gsap.set(target, { autoAlpha: 1, clearProps: 'transform,filter,opacity,visibility' });
            }

            const isCard = target.matches('.demo-card, .feature-card, .credit-card, .tool-card');
            const fromX = isCard ? ((index % 2 === 0 ? -1 : 1) * 18) : 0;

            gsap.set(targets, {
                autoAlpha: 0,
                x: fromX,
                y: isCard ? 46 : 38,
                scale: isCard ? 0.94 : 0.98,
                rotateX: isCard ? 7 : 4,
                filter: 'blur(18px) saturate(1.18)',
                transformPerspective: 900,
                transformOrigin: '50% 70%'
            });

            const timeline = gsap.timeline({
                paused: true,
                defaults: { overwrite: 'auto' },
                onComplete: () => {
                    target.classList.add('animate-in');
                    gsap.set(target, { autoAlpha: 1, clearProps: 'transform,filter,opacity,visibility' });
                    gsap.set(targets, { clearProps: 'transform,filter,opacity,visibility,clipPath' });
                }
            });

            timeline
                .to(targets, {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    filter: 'blur(0px) saturate(1)',
                    duration: d(isCard ? 1.02 : 0.92),
                    ease: isCard ? 'back.out(1.18)' : 'power4.out',
                    stagger: targets.length > 1 ? d(0.075) : 0
                })
                .fromTo(targets,
                    { clipPath: 'inset(0 0 18% 0 round 12px)' },
                    {
                        clipPath: 'inset(0 0 0% 0 round 12px)',
                        duration: d(0.78),
                        ease: 'power3.out',
                        stagger: targets.length > 1 ? d(0.06) : 0,
                        clearProps: 'clipPath'
                    }, 0.04);

            ScrollTrigger.create({
                trigger: target,
                start: 'top 82%',
                once: true,
                onEnter: () => timeline.play(0)
            });
        });

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
        element.style.filter = 'blur(10px)';
        const dur = d(0.7);
        const delay = index * d(0.05);
        element.style.transition = `opacity ${dur}s ease ${delay}s, transform ${dur}s ease ${delay}s, filter ${dur}s ease ${delay}s`;
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

function setupGsapAnimations() {
    if (!gsap || reduceMotion) return;

    gsap.defaults({ ease: 'power3.out' });

    const heroTimeline = gsap.timeline({ defaults: { duration: d(0.85) } });
    heroTimeline
        .from('.navbar-glass', { y: -28, autoAlpha: 0, duration: d(0.7) })
        .from('.hero-badge', { y: 18, autoAlpha: 0 }, '-=0.35')
        .from('.title-line', { yPercent: 105, autoAlpha: 0, skewY: 4, stagger: d(0.12) }, '-=0.2')
        .from('.hero-description', { y: 24, autoAlpha: 0 }, '-=0.35')
        .from('.hero-buttons .btn', {
            y: 18,
            scale: 0.96,
            autoAlpha: 0,
            stagger: d(0.07),
            duration: d(0.72),
            ease: 'back.out(1.6)',
            clearProps: 'transform,opacity,visibility'
        }, '-=0.28')
        .from('.hero-stats .stat, .hero-stats .stat-divider', { y: 16, autoAlpha: 0, stagger: d(0.07) }, '-=0.38')
        .fromTo('.hero-logo-large',
            {
                y: 24,
                scale: 0.78,
                autoAlpha: 0,
                filter: 'blur(18px)'
            },
            {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                filter: 'blur(0px)',
                duration: d(1.05),
                ease: 'power4.out',
                clearProps: 'transform,opacity,visibility,filter'
            }, '-=0.68');


    gsap.to('.hero-badge', {
        y: -4,
        duration: d(2.2),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: d(1.2)
    });

    const hoverTargets = $$('.feature-card, .credit-card, .tool-card, .social-link');
    const supportsHoverInteraction = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Sólo aplicar efectos hover en dispositivos que soportan hover (evita desplazamientos en móviles)
    if (supportsHoverInteraction) {
        hoverTargets.forEach(target => {
            const isButton = target.classList.contains('btn') || target.classList.contains('kofi-button');

            // Botones: completamente estáticos (sin desplazamiento). Otros targets mantienen micro-movimiento.
            const enterProps = isButton
                ? { y: 0, scale: 1, duration: d(0.12), overwrite: 'auto' }
                : { y: -2, scale: 1.02, duration: d(0.24), overwrite: 'auto' };

            const leaveProps = { y: 0, scale: 1, duration: d(0.28), overwrite: 'auto' };

            target.addEventListener('mouseenter', () => {
                gsap.to(target, enterProps);
            });

            target.addEventListener('mouseleave', () => {
                gsap.to(target, leaveProps);
            });
        });
    }

    const parallaxItems = [
        { element: $('.hero-content'), speed: 0.08 }
    ].filter(item => item.element);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            parallaxItems.forEach(({ element, speed }) => {
                gsap.to(element, {
                    y: scrollY * speed,
                    duration: d(0.45),
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            });
            ticking = false;
        });
    }, { passive: true });
}


function setupKofiButtonAnimation() {
    const kofiButton = $('.kofi-button');
    if (!kofiButton || !gsap || reduceMotion) return;

    const icon = $('.kofi-icon', kofiButton);
    const label = $('span', kofiButton);
    const supportsHoverInteraction = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let isVisible = false;
    let isHovering = false;
    let hoverTimeline = null;

    gsap.set(kofiButton, { '--shine-x': '-135%', transformOrigin: 'center center' });
    gsap.set(icon, { transformOrigin: '50% 55%' });

    gsap.from(kofiButton, {
        y: 16,
        scale: 0.96,
        autoAlpha: 0,
        duration: d(0.8),
        ease: 'power3.out',
        scrollTrigger: {
            trigger: kofiButton,
            start: 'top 92%'
        }
    });

    const idle = gsap.timeline({ paused: true, repeat: -1, repeatDelay: d(2.2) })
        .to(icon, { y: -1.5, scale: 1.08, rotate: -3, duration: d(0.55), ease: 'sine.inOut' })
        .to(icon, { y: 0, scale: 1, rotate: 0, duration: d(0.65), ease: 'sine.inOut' })
        .to(kofiButton, { '--shine-x': '135%', duration: d(0.95), ease: 'power2.inOut' }, 0.08)
        .set(kofiButton, { '--shine-x': '-135%' });

    const playIdle = () => {
        if (isVisible && !isHovering) idle.play();
    };

    const stopIdle = () => {
        idle.pause(0);
        gsap.to(icon, { y: 0, rotate: 0, scale: 1, duration: d(0.28), ease: 'power2.out', overwrite: 'auto' });
        gsap.set(kofiButton, { '--shine-x': '-135%' });
    };

    ScrollTrigger.create({
        trigger: kofiButton,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => { isVisible = true; playIdle(); },
        onEnterBack: () => { isVisible = true; playIdle(); },
        onLeave: () => { isVisible = false; stopIdle(); },
        onLeaveBack: () => { isVisible = false; stopIdle(); }
    });

    if (!supportsHoverInteraction) return;

    kofiButton.addEventListener('mouseenter', () => {
        isHovering = true;
        stopIdle();
        hoverTimeline?.kill();

        hoverTimeline = gsap.timeline({ defaults: { overwrite: 'auto' } })
            .to(kofiButton, { y: -2, scale: 1.025, duration: d(0.38), ease: 'power3.out' }, 0)
            .to(icon, { y: -1, rotate: -4, scale: 1.1, duration: d(0.42), ease: 'back.out(1.8)' }, 0)
            .to(label, { x: 1.5, duration: d(0.36), ease: 'power3.out' }, 0.02)
            .to(kofiButton, { '--shine-x': '135%', duration: d(0.8), ease: 'power2.inOut' }, 0.04)
            .set(kofiButton, { '--shine-x': '-135%' });
    });

    kofiButton.addEventListener('mouseleave', () => {
        isHovering = false;
        hoverTimeline?.kill();

        gsap.timeline({ defaults: { overwrite: 'auto' }, onComplete: playIdle })
            .to(kofiButton, { y: 0, scale: 1, duration: d(0.46), ease: 'power3.out' }, 0)
            .to(icon, { y: 0, rotate: 0, scale: 1, duration: d(0.42), ease: 'power3.out' }, 0)
            .to(label, { x: 0, duration: d(0.34), ease: 'power3.out' }, 0);
    });
}
function setupNodeRequirementAnimation() {
    const card = $('.node-card');
    if (!card || !gsap || reduceMotion || !window.ScrollTrigger) return;

    const logo = $('.node-logo', card);
    const watermark = $('.node-watermark', card);
    const contentTargets = [
        $('.node-kicker', card),
        $('.node-title', card),
        $('.node-description', card),
        ...$$('.node-facts span', card),
        $('.node-actions', card)
    ].filter(Boolean);

    gsap.set(card, {
        autoAlpha: 0,
        y: 54
    });
    gsap.set(contentTargets, { autoAlpha: 0, y: 24, filter: 'blur(10px)' });
    gsap.set(logo, {
        autoAlpha: 0,
        y: -42,
        scale: 0.86,
        filter: 'brightness(0) invert(1) blur(16px)'
    });
    gsap.set(watermark, {
        autoAlpha: 0,
        y: 38,
        scale: 0.68,
        rotate: -24,
        filter: 'blur(24px) brightness(1.18)',
        transformOrigin: '50% 70%'
    });

    ScrollTrigger.create({
        trigger: card,
        start: 'top 80%',
        once: true,
        onEnter: () => {
            const timeline = gsap.timeline({
                defaults: { overwrite: 'auto' },
                onComplete: () => {
                    card.classList.add('animate-in');
                    gsap.set([card, ...contentTargets, logo, watermark], {
                        clearProps: 'transform,filter,opacity,visibility,clipPath'
                    });
                }
            });

            timeline
                .to(card, {
                    autoAlpha: 1,
                    y: 0,
                    duration: d(1),
                    ease: 'power4.out'
                }, 0)
                .to(logo, {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    filter: 'brightness(0) invert(1) blur(0px)',
                    duration: d(1.05),
                    ease: 'back.out(1.35)'
                }, 0.12)
                .to(watermark, {
                    autoAlpha: 0.15,
                    y: 0,
                    scale: 1,
                    rotate: -8,
                    filter: 'blur(0px) brightness(1)',
                    duration: d(1.25),
                    ease: 'power4.out'
                }, 0.18)
                .to(contentTargets, {
                    autoAlpha: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: d(0.72),
                    stagger: d(0.065),
                    ease: 'power3.out'
                }, 0.28);
        }
    });
}
function setupDownloadSectionAnimation() {
    const card = $('.download-card');
    if (!card) return;

    const logoStrips = $$('.download-logo-strip', card);
    const logoTracks = logoStrips.map((strip) => {
        const track = document.createElement('div');
        track.className = 'download-logo-track';

        for (let groupIndex = 0; groupIndex < 2; groupIndex += 1) {
            const group = document.createElement('div');
            group.className = 'download-logo-group';

            for (let logoIndex = 0; logoIndex < 7; logoIndex += 1) {
                const logo = document.createElement('img');
                logo.src = 'img/DropTune_Icon_HighRes.png';
                logo.alt = '';
                logo.className = 'download-logo-item';
                logo.draggable = false;
                group.appendChild(logo);
            }

            track.appendChild(group);
        }

        strip.replaceChildren(track);
        return track;
    });

    if (!gsap || reduceMotion || !window.ScrollTrigger) return;

    const kicker = $('.download-kicker', card);
    const title = $('.download-title', card);
    const titleGradient = $('.download-title-gradient', card);
    const titleSolid = $('.download-title-solid', card);
    const description = $('.download-description', card);
    const infoItems = $$('.info-item', card);
    const button = $('.btn-download', card);
    const buttonIcon = $('.btn-icon', button);
    const buttonText = $('.btn-text', button);
    const logoWall = $('.download-logo-wall', card);
    const visualLabel = $('.download-visual-label', card);
    const contentTargets = [kicker, title, description, ...infoItems, button].filter(Boolean);

    const marqueeDirection = Math.random() < 0.5 ? -1 : 1;
    const compactMarquee = window.matchMedia('(max-width: 768px)').matches;
    const diagonalAngle = (compactMarquee ? -6 : -9) * marqueeDirection;
    gsap.set(logoStrips, {
        rotate: diagonalAngle,
        transformOrigin: '50% 50%'
    });

    const marqueeTweens = logoTracks.map((track) => {
        const startPosition = marqueeDirection < 0 ? 0 : -50;
        const endPosition = marqueeDirection < 0 ? -50 : 0;
        const tween = gsap.fromTo(track,
            { xPercent: startPosition },
            {
                xPercent: endPosition,
                duration: 51.5,
                ease: 'none',
                repeat: -1,
                force3D: true,
                paused: true
            }
        );

        tween.progress(Math.random());
        return tween;
    });

    if ('IntersectionObserver' in window) {
        const marqueeObserver = new IntersectionObserver(([entry]) => {
            marqueeTweens.forEach((tween) => {
                if (entry.isIntersecting) tween.play();
                else tween.pause();
            });
        }, { threshold: 0.01 });

        marqueeObserver.observe(card);
    } else {
        marqueeTweens.forEach(tween => tween.play());
    }

    gsap.set(card, {
        autoAlpha: 0,
        y: 52
    });

    gsap.set(contentTargets, {
        autoAlpha: 0,
        y: 24,
        filter: 'blur(10px)'
    });

    gsap.set(titleGradient, {
        autoAlpha: 1,
        backgroundPosition: '0% 50%'
    });
    gsap.set(titleSolid, { autoAlpha: 0 });

    gsap.set(infoItems, {
        scale: 0.94,
        rotateX: 7,
        transformPerspective: 900,
        transformOrigin: '50% 80%'
    });

    gsap.set(button, { scale: 0.94 });
    gsap.set(logoWall, {
        autoAlpha: 0,
        filter: 'blur(14px)'
    });
    gsap.set(visualLabel, {
        autoAlpha: 0,
        y: 14,
        filter: 'blur(8px)'
    });

    ScrollTrigger.create({
        trigger: card,
        start: 'top 78%',
        once: true,
        onEnter: () => {
            const timeline = gsap.timeline({
                defaults: { overwrite: 'auto' },
                onComplete: () => {
                    card.classList.add('animate-in');
                    gsap.set([
                        card,
                        ...contentTargets,
                        titleGradient,
                        titleSolid,
                        logoWall,
                        visualLabel
                    ], {
                        clearProps: 'transform,filter,opacity,visibility,clipPath,backgroundPosition'
                    });
                    gsap.set(infoItems, {
                        clearProps: 'rotateX,transformPerspective,transformOrigin'
                    });
                }
            });

            timeline
                .to(card, {
                    autoAlpha: 1,
                    y: 0,
                    duration: d(1),
                    ease: 'power4.out'
                }, 0)
                .to(logoWall, {
                    autoAlpha: 0.48,
                    filter: 'blur(0px)',
                    duration: d(1.1),
                    ease: 'power3.out'
                }, 0.06)
                .to([kicker, title, description], {
                    autoAlpha: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: d(0.76),
                    ease: 'power3.out',
                    stagger: d(0.075)
                }, 0.18)
                .to(titleGradient, {
                    backgroundPosition: '100% 50%',
                    duration: d(1.1),
                    ease: 'power2.inOut'
                }, 0.24)
                .to(infoItems, {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    filter: 'blur(0px)',
                    duration: d(0.7),
                    ease: 'back.out(1.2)',
                    stagger: d(0.075)
                }, 0.42)
                .to(button, {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: d(0.68),
                    ease: 'back.out(1.45)'
                }, 0.66)
                .to(visualLabel, {
                    autoAlpha: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: d(0.58),
                    ease: 'power3.out'
                }, 0.7)
                .to(titleSolid, {
                    autoAlpha: 1,
                    duration: d(0.48),
                    ease: 'power2.out'
                }, 0.98)
                .to(titleGradient, {
                    autoAlpha: 0,
                    duration: d(0.48),
                    ease: 'power2.out'
                }, 0.98)
                .to(buttonIcon, {
                    y: -3,
                    duration: d(0.22),
                    ease: 'power2.out',
                    yoyo: true,
                    repeat: 1
                }, 1.02)
                .to(buttonText, {
                    x: 2,
                    duration: d(0.24),
                    ease: 'power2.out',
                    yoyo: true,
                    repeat: 1
                }, 1.04);
        }
    });
}
function setupFastScrollDisarray() {
    if (!gsap || reduceMotion) return;

    const selector = [
        '.hero-badge',
        '.title-line',
        '.hero-description',
        '.hero-buttons .btn',
        '.hero-stats .stat',
        '.section-header.animate-in',
        '.about-header.animate-in',
        '.demo-card.animate-in',
        '.feature-card.animate-in',
        '.credit-card.animate-in',
        '.tool-card.animate-in',
        '.download-card.animate-in'
    ].join(', ');

    let lastY = window.scrollY;
    let lastTime = performance.now();
    let lastBurst = 0;

    const isVisible = (element) => {
        if (!element || element.closest('.video-demo-overlay')) return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.bottom > 28 && rect.top < window.innerHeight - 28;
    };

    const playDisarray = (direction, intensity) => {
        const now = performance.now();
        if (now - lastBurst < 145) return;
        lastBurst = now;

        const visibleTargets = $$(selector).filter(isVisible).slice(0, 24);
        if (!visibleTargets.length) return;

        visibleTargets.forEach((element, index) => {
            const isHeroTitle = element.classList.contains('title-line');
            const isLargeVisual = element.classList.contains('download-card');
            const strength = isLargeVisual ? 0.72 : 1;
            const drift = gsap.utils.random(7, 18) * intensity * strength;
            const wobble = gsap.utils.random(-13, 13) * intensity * strength;
            const rotate = gsap.utils.random(-2.4, 2.4) * intensity * (isHeroTitle ? 0.45 : strength);
            const delay = Math.min(0.08, index * 0.006);

            gsap.killTweensOf(element);
            gsap.timeline({ defaults: { overwrite: 'auto' } })
                .to(element, {
                    x: wobble,
                    y: direction * drift,
                    rotate,
                    scale: 1 + gsap.utils.random(-0.012, 0.018) * intensity,
                    duration: d(0.13),
                    ease: 'power2.out'
                }, delay)
                .to(element, {
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 1,
                    duration: d(0.78),
                    ease: 'elastic.out(1, 0.62)',
                    clearProps: 'transform'
                }, '+=0.015');
        });
    };

    window.addEventListener('scroll', () => {
        if ($('.video-demo-overlay')) return;

        const now = performance.now();
        const currentY = window.scrollY;
        const deltaY = currentY - lastY;
        const deltaTime = Math.max(16, now - lastTime);
        const speed = Math.abs(deltaY / deltaTime);

        lastY = currentY;
        lastTime = now;

        if (speed < 1.05) return;

        const direction = Math.sign(deltaY) || 1;
        const intensity = gsap.utils.clamp(0.38, 1, (speed - 0.75) / 2.4);
        playDisarray(direction, intensity);
    }, { passive: true });
}
function setupDemoVideos() {
    const cards = $$('.demo-card');
    if (!cards.length) return;

    let overlay = null;
    let activeTrigger = null;

    function buildOverlay(card) {
        const videoId = card.dataset.videoId;
        const title = card.dataset.videoTitle || 'Demo de DropTune';
        const kind = card.dataset.videoKind || 'Demo';
        const embedOrigin = encodeURIComponent(window.location.origin);
        const thumbImage = $('.demo-thumb img', card);
        const posterSrc = thumbImage?.currentSrc || thumbImage?.src || '';
        const posterAlt = thumbImage?.alt || title;

        const element = document.createElement('div');
        element.className = 'video-demo-overlay';
        element.setAttribute('role', 'dialog');
        element.setAttribute('aria-modal', 'true');
        element.setAttribute('aria-label', title);
        element.innerHTML = `
            <div class="video-demo-shell">
                <div class="video-demo-head">
                    <div>
                        <span class="video-demo-label">${kind}</span>
                        <h2 class="video-demo-title">${title}</h2>
                    </div>
                    <button class="video-demo-close" type="button" aria-label="Cerrar video">&#10005;</button>
                </div>
                <div class="video-demo-frame">
                    <div class="video-demo-poster" aria-hidden="true">
                        <img src="${posterSrc}" alt="${posterAlt}">
                    </div>
                    <iframe title="${title}" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&origin=${embedOrigin}" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            </div>
        `;

        return element;
    }

    function closeDemo() {
        if (!overlay) return;

        const current = overlay;
        const trigger = activeTrigger;
        const shell = $('.video-demo-shell', current);
        const head = $('.video-demo-head', current);
        const frame = $('.video-demo-frame', current);
        const closeButton = $('.video-demo-close', current);
        const thumb = trigger ? $('.demo-thumb', trigger) : null;

        overlay = null;
        activeTrigger = null;
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeydown);

        const restoreFocus = () => trigger?.focus?.();

        if (gsap && !reduceMotion && shell && frame) {
            const thumbRect = thumb?.getBoundingClientRect();
            const frameRect = frame.getBoundingClientRect();
            const canReturnToThumb = thumbRect
                && thumbRect.width > 0
                && thumbRect.height > 0
                && thumbRect.bottom > 0
                && thumbRect.top < window.innerHeight
                && thumbRect.right > 0
                && thumbRect.left < window.innerWidth;

            const timeline = gsap.timeline({
                defaults: { overwrite: 'auto' },
                onComplete: () => {
                    current.remove();
                    restoreFocus();
                }
            });

            timeline
                .to([head, closeButton], { y: -10, autoAlpha: 0, duration: d(0.24), ease: 'power2.in' }, 0)
                .to(current, { backdropFilter: 'blur(0px)', background: 'rgba(4, 8, 12, 0)', duration: d(0.52), ease: 'power3.inOut' }, 0.05);

            if (canReturnToThumb) {
                timeline
                    .to(frame, {
                        x: thumbRect.left + thumbRect.width / 2 - (frameRect.left + frameRect.width / 2),
                        y: thumbRect.top + thumbRect.height / 2 - (frameRect.top + frameRect.height / 2),
                        scaleX: thumbRect.width / frameRect.width,
                        scaleY: thumbRect.height / frameRect.height,
                        borderRadius: getComputedStyle(thumb).borderRadius || '16px',
                        boxShadow: '0 12px 34px rgba(0, 0, 0, 0.22)',
                        duration: d(0.74),
                        ease: 'power4.inOut'
                    }, 0)
                    .to(shell, { y: -6, scale: 0.992, autoAlpha: 0.96, duration: d(0.36), ease: 'sine.inOut' }, 0)
                    .to(frame, { autoAlpha: 0, duration: d(0.16), ease: 'power2.out' }, d(0.62))
                    .to(current, { autoAlpha: 0, duration: d(0.18), ease: 'power2.out' }, d(0.64));
            } else {
                timeline
                    .to(shell, { y: 28, scale: 0.94, autoAlpha: 0, duration: d(0.42), ease: 'power3.inOut' }, 0)
                    .to(current, { autoAlpha: 0, duration: d(0.42), ease: 'power2.out' }, 0.05);
            }
        } else {
            current.remove();
            restoreFocus();
        }
    }
    function handleKeydown(event) {
        if (event.key === 'Escape') closeDemo();
    }

    function openDemo(card) {
        if (overlay) closeDemo();

        activeTrigger = card;
        overlay = buildOverlay(card);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        const closeButton = $('.video-demo-close', overlay);
        const shell = $('.video-demo-shell', overlay);
        const frame = $('.video-demo-frame', overlay);
        const poster = $('.video-demo-poster', overlay);
        const iframe = $('.video-demo-frame iframe', overlay);

        closeButton.addEventListener('click', closeDemo);
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) closeDemo();
        });
        window.addEventListener('keydown', handleKeydown);
        closeButton.focus();

        if (gsap && !reduceMotion) {
            const thumb = $('.demo-thumb', card);
            const thumbRect = thumb?.getBoundingClientRect();
            const frameRect = frame.getBoundingClientRect();

            gsap.set(overlay, { autoAlpha: 0, backdropFilter: 'blur(0px)', background: 'rgba(4, 8, 12, 0)' });
            gsap.set(shell, { y: 24, scale: 0.96, autoAlpha: 0 });

            if (thumbRect) {
                gsap.set(frame, {
                    transformOrigin: 'center center',
                    x: thumbRect.left + thumbRect.width / 2 - (frameRect.left + frameRect.width / 2),
                    y: thumbRect.top + thumbRect.height / 2 - (frameRect.top + frameRect.height / 2),
                    scaleX: thumbRect.width / frameRect.width,
                    scaleY: thumbRect.height / frameRect.height
                });
            }

            gsap.timeline({ defaults: { ease: 'power4.out' } })
                .to(overlay, { autoAlpha: 1, backdropFilter: 'blur(16px)', background: 'rgba(4, 8, 12, 0.72)', duration: d(0.42) }, 0)
                .to(shell, { y: 0, scale: 1, autoAlpha: 1, duration: d(0.54) }, 0.05)
                .to(frame, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: d(0.72) }, 0.02)
                .to($('.video-demo-poster img', overlay), { scale: 1.01, duration: d(0.78) }, 0.02)
                .to(poster, { filter: 'blur(10px) saturate(1.12) contrast(1.02)', autoAlpha: 0.34, duration: d(0.52), ease: 'sine.inOut' }, 0.46)
                .to(iframe, { autoAlpha: 1, duration: d(0.34), ease: 'power2.out' }, 0.58)
                .to(poster, { autoAlpha: 0, duration: d(0.34), ease: 'power2.out' }, 0.82)
                .from($('.video-demo-title', overlay), { yPercent: 80, autoAlpha: 0, duration: d(0.5) }, 0.16)
                .from($('.video-demo-label', overlay), { y: 12, autoAlpha: 0, duration: d(0.38) }, 0.12)
                .from(closeButton, { rotate: -90, scale: 0.7, autoAlpha: 0, duration: d(0.42) }, 0.2);
        }
    }

    cards.forEach(card => {
        card.addEventListener('click', () => openDemo(card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openDemo(card);
            }
        });
    });
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

            if (gsap && !reduceMotion) {
            gsap.fromTo(navLogo,
                { rotate: 0, scale: 1 },
                { rotate: 360, scale: 1.18, duration: d(0.52), ease: 'back.out(2)', clearProps: 'transform' }
            );
        } else {
            navLogo.animate(
                [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
                { duration: 400, easing: 'ease' }
            );
        }

        if (logoClicks >= 5) {
            logoClicks = 0;
            createConfetti();
        }
    });
}

const scrollIndicator = setupScrollIndicator();

const handlePageLoaded = () => {
    document.body.classList.add('loaded');
    updateNavbar();
    updateActiveNav();
};

if (document.readyState === 'complete') {
    handlePageLoaded();
} else {
    window.addEventListener('load', handlePageLoaded, { once: true });
}

window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveNav();
    scrollIndicator?.classList.toggle('is-hidden', window.scrollY > 100);
}, { passive: true });

setupRevealAnimations();
setupStatsAnimation();
setupDemoVideos();
setupGsapAnimations();
setupKofiButtonAnimation();
setupNodeRequirementAnimation();
setupDownloadSectionAnimation();
setupFastScrollDisarray();
