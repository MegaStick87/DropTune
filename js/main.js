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

    // Prefer ScrollTrigger for smoother scroll-based reveals when available
    if (gsap && window.ScrollTrigger && !reduceMotion) {
        gsap.set(elements, { autoAlpha: 0, y: 44, filter: 'blur(10px)' });

        elements.forEach(target => {
            const group = target.classList.contains('section-header') || target.classList.contains('about-header')
                ? [target, ...$$('.section-tag, .section-title, .section-description', target)]
                : target;

            gsap.fromTo(group, { autoAlpha: 0, y: 44, filter: 'blur(10px)' }, {
                autoAlpha: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: d(0.85),
                ease: 'power3.out',
                stagger: d(0.08),
                overwrite: 'auto',
                scrollTrigger: {
                    trigger: target,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                onComplete: () => target.classList.add('animate-in')
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
        const dur = d(0.6);
        const delay = index * d(0.05);
        element.style.transition = `opacity ${dur}s ease ${delay}s, transform ${dur}s ease ${delay}s`;
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
        .from('.hero-buttons .btn', { y: 18, autoAlpha: 0, stagger: d(0.08) }, '-=0.35')
        .from('.hero-stats .stat, .hero-stats .stat-divider', { y: 16, autoAlpha: 0, stagger: d(0.07) }, '-=0.35')
        .from('.screenshot-wrapper', { x: 42, y: 28, rotate: 1.8, autoAlpha: 0, duration: d(1.05) }, '-=0.8');

    // Keep screenshot visually stable: remove subtle floating loop
    // (Retain 3D mouse-driven rotation and entry animation.)

    gsap.to('.hero-badge', {
        y: -4,
        duration: d(2.2),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: d(1.2)
    });

    const hoverTargets = $$('.btn, .feature-card, .credit-card, .tool-card, .social-link, .kofi-button');
    const supportsHoverInteraction = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Sólo aplicar efectos hover en dispositivos que soportan hover (evita desplazamientos en móviles)
    if (supportsHoverInteraction) {
        hoverTargets.forEach(target => {
            const isButton = target.classList.contains('btn') || target.classList.contains('kofi-button');

            // Botones tienen un desplazamiento mínimo para evitar que suban demasiado
            const enterProps = isButton
                ? { y: -1, scale: 1.01, duration: d(0.18), overwrite: 'auto' }
                : { y: -3, scale: 1.02, duration: d(0.24), overwrite: 'auto' };

            const leaveProps = { y: 0, scale: 1, duration: d(0.28), overwrite: 'auto' };

            target.addEventListener('mouseenter', () => {
                gsap.to(target, enterProps);
            });

            target.addEventListener('mouseleave', () => {
                gsap.to(target, leaveProps);
            });
        });
    }

    const screenshot = $('.screenshot-wrapper');
    if (screenshot) {
            window.addEventListener('mousemove', (event) => {
            const x = (event.clientX / window.innerWidth - 0.5) * 10;
            const y = (event.clientY / window.innerHeight - 0.5) * 10;
            gsap.to(screenshot, {
                rotateY: x,
                rotateX: -y,
                transformPerspective: 900,
                transformOrigin: 'center',
                    duration: d(0.65),
                overwrite: 'auto'
            });
        }, { passive: true });
    }

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

        // CTA and enhancements
        function setupGsapEnhancements() {
            try {
                // CTA reveal
                const cta = document.querySelector('.btn-primary');
                if (cta) {
                    gsap.from(cta, {
                        y: 20,
                        autoAlpha: 0,
                        duration: d(0.9),
                        ease: 'power3.out',
                        scrollTrigger: { trigger: '.download', start: 'top 80%' }
                    });

                    // Hover glow
                    const hoverIn = (el) => gsap.to(el, { boxShadow: '0 12px 40px rgba(41,171,224,0.28)', scale: 1.02, duration: d(0.22), ease: 'power1.out' });
                    const hoverOut = (el) => gsap.to(el, { boxShadow: '0 6px 18px rgba(0,0,0,0.12)', scale: 1, duration: d(0.35), ease: 'power2.out' });

                    cta.addEventListener('mouseenter', () => hoverIn(cta));
                    cta.addEventListener('mouseleave', () => hoverOut(cta));

                    // idle pulse (subtle)
                    const pulse = gsap.to(cta, { boxShadow: '0 18px 60px rgba(41,171,224,0.12)', scale: 1.01, duration: d(2.6), ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true });
                    ScrollTrigger.create({
                        trigger: cta,
                        start: 'top bottom',
                        onEnter: () => pulse.play(),
                        onLeaveBack: () => pulse.pause(0)
                    });
                }

                // Background subtle animated gradient
                let bg = document.querySelector('.bg-animated');
                if (!bg) {
                    bg = document.createElement('div');
                    bg.className = 'bg-animated';
                    document.body.insertBefore(bg, document.body.firstChild);

                    gsap.to(bg, { '--gx': '100%', duration: 20, ease: 'sine.inOut', repeat: -1, yoyo: true });
                    gsap.to(bg, { opacity: 0.08, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
                }
            } catch (e) { console.warn('GSAP enhancements failed', e); }
        }

        setupGsapEnhancements();
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
setupGsapAnimations();
