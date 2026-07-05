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

// Add screenshot-specific styles to theme variables
themeVars.light.screenshotFilter = 'none';
themeVars.light.screenshotShadow = '0 10px 30px rgba(2,6,23,0.12)';
themeVars.dark.screenshotFilter = 'brightness(1.08) contrast(1.12) saturate(1.06)';
themeVars.dark.screenshotShadow = '0 30px 90px rgba(0,0,0,0.7)';

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

const supportsViewTransition = typeof document.startViewTransition === 'function';

async function toggleDialog(event, dialogId) {
    const viewTransitionClass = 'vt-element-animation';
    const viewTransitionClassClosing = 'vt-element-animation-closing';
    const openDialog = document.querySelector('dialog[open]');
    const dialog = dialogId ? document.getElementById(dialogId) : openDialog;
    if (!dialog) return;

    if (!dialogId) {
        if (!dialog.open) return;

        const originElement = document.querySelector('[origin-element]');
        if (supportsViewTransition && originElement) {
            dialog.style.viewTransitionName = 'vt-shared';
            dialog.style.viewTransitionClass = viewTransitionClassClosing;
            originElement.style.viewTransitionName = 'vt-shared';
            originElement.style.viewTransitionClass = viewTransitionClassClosing;

            const viewTransition = document.startViewTransition(() => {
                originElement.style.viewTransitionName = '';
                originElement.style.viewTransitionClass = '';
                dialog.style.viewTransitionName = '';
                dialog.style.viewTransitionClass = '';
                dialog.close();
            });
            await viewTransition.finished;
        } else {
            dialog.close();
        }

        return false;
    }

    if (dialog.open) return;

    const originElement = event.currentTarget;

    if (supportsViewTransition) {
        dialog.style.viewTransitionName = 'vt-shared';
        dialog.style.viewTransitionClass = viewTransitionClass;
        originElement.style.viewTransitionName = 'vt-shared';
        originElement.style.viewTransitionClass = viewTransitionClass;
        originElement.setAttribute('origin-element', '');

        const viewTransition = document.startViewTransition(() => {
            originElement.style.viewTransitionName = '';
            originElement.style.viewTransitionClass = '';
            dialog.showModal();
        });
        await viewTransition.finished;
    } else {
        dialog.showModal();
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

function setupScreenshotEasterEgg() {
    const screenshot = $('.screenshot');
    const wrapper = $('.screenshot-wrapper');
    if (!screenshot || !wrapper) return;

    const params = new URLSearchParams(window.location.search);
    const forced = params.has('droptunead') || params.get('egg') === 'droptunead';
    const disabled = params.get('egg') === 'off';
    const chance = 0.08;

    if (disabled || (!forced && Math.random() > chance)) return;

    const originalSrc = screenshot.getAttribute('src');
    screenshot.dataset.originalSrc = originalSrc || '';
    screenshot.src = 'img/droptunead.jpg';
    screenshot.alt = 'Anuncio secreto de DropTune';
    wrapper.classList.add('is-easter-egg');

    if (!gsap || reduceMotion) return;

    gsap.fromTo(screenshot,
        { autoAlpha: 0, scale: 1.035, filter: 'brightness(1.35) saturate(1.25) blur(6px)' },
        { autoAlpha: 1, scale: 1, filter: 'brightness(1) saturate(1) blur(0px)', duration: d(0.85), ease: 'power3.out', delay: d(0.28) }
    );

    gsap.fromTo(wrapper,
        { boxShadow: '0 0 0 rgba(42,139,214,0)' },
        { boxShadow: '0 28px 95px rgba(42,139,214,0.28)', duration: d(1.2), ease: 'power2.out', yoyo: true, repeat: 1, delay: d(0.2) }
    );
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
        .fromTo('.screenshot-wrapper',
            {
                y: 26,
                scale: 0.965,
                autoAlpha: 0,
                clipPath: 'inset(8% 10% 8% 10% round 18px)',
                filter: 'blur(10px) saturate(1.15)'
            },
            {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0% round 18px)',
                filter: 'blur(0px) saturate(1)',
                duration: d(1.05),
                ease: 'power4.out',
                clearProps: 'transform,clipPath,filter,opacity,visibility'
            }, '-=0.68');

    // The hero screenshot gets an entrance reveal, then remains static.
    heroTimeline.eventCallback('onComplete', () => {
        const screenshot = $('.screenshot-wrapper');
        if (!screenshot) return;
        screenshot.style.opacity = '1';
        screenshot.style.visibility = 'visible';
        screenshot.style.transition = 'none';
        screenshot.style.willChange = 'auto';
    });

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


    // Additionally, if the device is touch-capable, clear any ScrollTrigger instances that target the screenshot.
    try {
        const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
        if (isTouch && window.ScrollTrigger) {
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger && st.trigger.matches && st.trigger.matches('.screenshot-wrapper, .screenshot')) {
                    st.kill();
                }
            });
        }
    } catch (e) { /* ignore */ }

    // Lightbox animado con blur de fondo para la captura (DropTune_1.png)
    function setupScreenshotLightbox() {
        const originalImg = document.querySelector('.screenshot');
        if (!originalImg) return;

        originalImg.style.cursor = 'zoom-in';

        let overlayEl = null;
        let _initRect = null;

        function openLightbox() {
            if (!gsap) return window.open(originalImg.src, '_blank');
            if (overlayEl) return;

            const rect = originalImg.getBoundingClientRect();
            _initRect = rect;

            overlayEl = document.createElement('div');
            overlayEl.className = 'screenshot-overlay';
            Object.assign(overlayEl.style, {
                position: 'fixed',
                inset: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(8,10,12,0)',
                zIndex: 99999,
                cursor: 'zoom-out',
                backdropFilter: 'blur(0px)'
            });

            const clone = originalImg.cloneNode(true);
            clone.className = 'screenshot-clone';
            // ensure the clone is visible and positioned relative to the viewport
            Object.assign(clone.style, {
                position: 'fixed',
                top: `${rect.top}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                transformOrigin: 'center center',
                borderRadius: getComputedStyle(originalImg).borderRadius || '8px',
                boxShadow: '0 10px 30px rgba(2,6,23,0.45)',
                willChange: 'transform, filter',
                zIndex: 99999,
                opacity: 1
            });

            // Force visible in case global img styles hide non-loaded clones
            clone.classList.add('loaded');

            overlayEl.appendChild(clone);

            // Controles accesibles: cerrar y descargar
            const controls = document.createElement('div');
            controls.className = 'lightbox-controls';

            const closeBtn = document.createElement('button');
            closeBtn.className = 'lightbox-close';
            closeBtn.type = 'button';
            closeBtn.setAttribute('aria-label', 'Cerrar imagen');
            closeBtn.innerHTML = '✕';

            controls.appendChild(closeBtn);
            overlayEl.appendChild(controls);
            document.body.appendChild(overlayEl);
            document.body.style.overflow = 'hidden';

            const targetScaleX = (window.innerWidth * 0.92) / rect.width;
            const targetScaleY = (window.innerHeight * 0.92) / rect.height;
            const targetScale = Math.min(targetScaleX, targetScaleY);

            const targetX = (window.innerWidth - rect.width) / 2 - rect.left;
            const targetY = (window.innerHeight - rect.height) / 2 - rect.top;

            // Animación principal: fondo con blur + zoom suave y elevación
            gsap.timeline({ defaults: { ease: 'power4.out' } })
                .to(overlayEl, { backdropFilter: 'blur(8px)', background: 'rgba(8,10,12,0.6)', duration: d(0.42) }, 0)
                .to(clone, {
                    x: targetX,
                    y: targetY,
                    scale: targetScale,
                    duration: d(0.92),
                    ease: 'power4.out',
                    rotationX: 0.6,
                    rotationY: -0.8,
                    boxShadow: '0 28px 80px rgba(2,6,23,0.6)'
                }, 0);

            function closeLightbox() {
                // Compute destination rect of the original image at close time (handles scroll/resize)
                const srcRect = originalImg.getBoundingClientRect() || _initRect;

                // If init rect not available, fallback to srcRect
                const initRect = _initRect || srcRect;

                // Helper to check if thumbnail is visible in viewport
                const isVisible = (r) => !(r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth);

                if (!isVisible(srcRect)) {
                    // If thumbnail is offscreen, do a graceful fade+scale instead of forcing movement
                    gsap.timeline({ defaults: { ease: 'power3.inOut' } })
                        .to(overlayEl, { backdropFilter: 'blur(0px)', background: 'rgba(8,10,12,0)', duration: d(0.36) }, 0)
                        .to(clone, { autoAlpha: 0, scale: 0.9, duration: d(0.42), onComplete: () => {
                            overlayEl?.remove();
                            overlayEl = null;
                        } }, 0);

                    window.removeEventListener('keydown', onKey);
                    try { lastFocused?.focus?.(); } catch (e) { originalImg.focus?.(); }
                    setTimeout(() => { document.body.style.overflow = ''; }, d(300));
                    return;
                }

                // Compute final transform values relative to clone's original top/left
                const finalScale = srcRect.width / initRect.width;
                const finalX = srcRect.left - initRect.left;
                const finalY = srcRect.top - initRect.top;

                // Animate backdrop + clone back to thumbnail position
                gsap.timeline({ defaults: { ease: 'power3.inOut' } })
                    .to(overlayEl, { backdropFilter: 'blur(0px)', background: 'rgba(8,10,12,0)', duration: d(0.36) }, 0)
                    .to(clone, { x: finalX, y: finalY, scale: finalScale, duration: d(0.6), rotationX: 0, rotationY: 0, boxShadow: '0 10px 30px rgba(2,6,23,0.45)' , onComplete: () => {
                        overlayEl?.remove();
                        overlayEl = null;
                    }}, 0);

                window.removeEventListener('keydown', onKey);
                // restore focus to previously focused element (if any)
                try { lastFocused?.focus?.(); } catch (e) { originalImg.focus?.(); }
                // restore body scrolling after animation has started
                setTimeout(() => { document.body.style.overflow = ''; }, d(300));
            }

            function onKey(e) { if (e.key === 'Escape') closeLightbox(); }

            overlayEl.addEventListener('click', (ev) => { if (ev.target === overlayEl || ev.target === clone) closeLightbox(); });


            // Controls events
            closeBtn.addEventListener('click', closeLightbox);

            // Accessibility: trap focus inside controls while open
            const focusable = [closeBtn];
            let lastFocused = document.activeElement;
            closeBtn.tabIndex = 0;
            closeBtn.focus();

            function trapTab(e) {
                if (e.key !== 'Tab') return;
                // If only one focusable element, keep focus there
                if (focusable.length === 1) {
                    e.preventDefault();
                    focusable[0].focus();
                    return;
                }
                const idx = focusable.indexOf(document.activeElement);
                if (e.shiftKey) {
                    if (idx === 0) { e.preventDefault(); focusable[focusable.length - 1].focus(); }
                } else {
                    if (idx === focusable.length - 1) { e.preventDefault(); focusable[0].focus(); }
                }
            }

            function onKeyWrap(e) {
                onKey(e);
                trapTab(e);
            }

            window.addEventListener('keydown', onKeyWrap);
        }

        // Make image focusable for keyboard users
        originalImg.tabIndex = 0;
        originalImg.addEventListener('click', openLightbox);
        originalImg.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(); });
    }

    // Inicializar lightbox después de configurar GSAP
    try { setupScreenshotLightbox(); } catch (e) { console.warn('screenshot lightbox init failed', e); }

    const parallaxItems = [
        { element: $('.hero-content'), speed: 0.08 },
        { element: $('.hero-image'), speed: -0.11 }
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
function setupDownloadSectionAnimation() {
    if (!gsap || reduceMotion || !window.ScrollTrigger) return;

    const card = $('.download-card');
    if (!card) return;

    const title = $('.download-title', card);
    const description = $('.download-description', card);
    const infoItems = $$('.info-item', card);
    const button = $('.btn-download', card);
    const buttonIcon = $('.btn-icon', button);
    const buttonText = $('.btn-text', button);
    const targets = [title, description, ...infoItems, button].filter(Boolean);

    gsap.set(card, {
        autoAlpha: 0,
        y: 46,
        scale: 0.965,
        filter: 'blur(16px)',
        clipPath: 'inset(9% 7% 9% 7% round 22px)',
        '--download-card-glow': '0'
    });

    gsap.set(targets, {
        autoAlpha: 0,
        y: 22,
        filter: 'blur(10px)'
    });

    gsap.set(infoItems, {
        scale: 0.94,
        rotateX: 7,
        transformPerspective: 900,
        transformOrigin: '50% 80%'
    });

    if (button) {
        gsap.set(button, {
            scale: 0.94
        });
    }

    ScrollTrigger.create({
        trigger: card,
        start: 'top 78%',
        once: true,
        onEnter: () => {
            const timeline = gsap.timeline({
                defaults: { overwrite: 'auto' },
                onComplete: () => {
                    card.classList.add('animate-in');
                    gsap.set([card, ...targets], { clearProps: 'transform,filter,opacity,visibility,clipPath' });
                    gsap.set(infoItems, { clearProps: 'rotateX,transformPerspective,transformOrigin' });
                }
            });

            timeline
                .to(card, {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    clipPath: 'inset(0% 0% 0% 0% round 22px)',
                    duration: d(0.96),
                    ease: 'power4.out'
                }, 0)
                .to(card, {
                    '--download-card-glow': '1',
                    duration: d(0.72),
                    ease: 'power2.out',
                    yoyo: true,
                    repeat: 1
                }, 0.08)
                .to([title, description], {
                    autoAlpha: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: d(0.72),
                    ease: 'power3.out',
                    stagger: d(0.075)
                }, 0.18)
                .to(infoItems, {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    filter: 'blur(0px)',
                    duration: d(0.72),
                    ease: 'back.out(1.25)',
                    stagger: d(0.08)
                }, 0.34)
                .to(button, {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: d(0.7),
                    ease: 'back.out(1.55)'
                }, 0.62)
                .to(buttonIcon, {
                    y: -3,
                    duration: d(0.24),
                    ease: 'power2.out',
                    yoyo: true,
                    repeat: 1
                }, 0.88)
                .to(buttonText, {
                    x: 2,
                    duration: d(0.26),
                    ease: 'power2.out',
                    yoyo: true,
                    repeat: 1
                }, 0.9);
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
        '.screenshot-wrapper',
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
            const isLargeVisual = element.classList.contains('screenshot-wrapper') || element.classList.contains('download-card');
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
setupScreenshotEasterEgg();
setupDemoVideos();
setupGsapAnimations();
setupKofiButtonAnimation();
setupDownloadSectionAnimation();
setupFastScrollDisarray();
