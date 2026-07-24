export class PrettyModal {
    constructor() {
        this.injectStyles()
        this.bindReleaseNavigation()
    }

    open(dialogId, trigger = null){
        const dialog = document.getElementById(dialogId)
        if(!dialog || dialog.open) return

        const eventOrigin = window.event && window.event.currentTarget
        const origin = trigger || eventOrigin || document.activeElement
        const canFlip = window.Flip && window.CustomEase && origin instanceof Element
        const randomId = Math.random().toString(16).slice(2)

        if (origin instanceof Element) {
            dialog.dataset.flipId = randomId
            origin.dataset.flipId = randomId
        }

        const originState = canFlip ? Flip.getState(origin) : null
        dialog.showModal()
        this.prepareReleaseHistory(dialog)
        this.animateContent(dialog)

        if (!canFlip) {
            dialog.classList.add('pretty-modal-opening')
            window.setTimeout(() => dialog.classList.remove('pretty-modal-opening'), 520)
            return
        }

        Flip.from(originState, {
            targets: dialog,
            scale: true,
            ease: CustomEase.create("custom", "M0,0 C0.305,0.206 0.116,0.567 0.3,0.8 0.394,0.921 0.491,1 1,1"),
            toggleClass: 'pretty-modal-opening',
            duration: 0.7,
        })
    }

    animateContent(dialog){
        const gsap = window.gsap
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (!gsap || reduceMotion) return

        const content = dialog.querySelectorAll(
            '.modal-heading, .modal-text, .release-banner, .release-index, .release-entry, .news-item, .modal-actions'
        )
        if (!content.length) return

        gsap.killTweensOf(content)
        gsap.fromTo(content,
            { y: 16, autoAlpha: 0, filter: 'blur(8px)' },
            {
                y: 0,
                autoAlpha: 1,
                filter: 'blur(0px)',
                duration: 0.58,
                stagger: 0.055,
                delay: 0.12,
                ease: 'power3.out',
                clearProps: 'transform,opacity,visibility,filter'
            }
        )
    }

    bindReleaseNavigation(){
        document.addEventListener('click', (event) => {
            const button = event.target.closest('[data-release-target]')
            if (!button) return

            const dialog = button.closest('dialog')
            const feed = dialog?.querySelector('.release-feed')
            const target = dialog?.querySelector('#' + button.dataset.releaseTarget)
            if (!dialog || !feed || !target) return

            this.setActiveRelease(dialog, target.id)
            const scroller = this.getReleaseScroller(dialog)
            const targetTop = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
            const gsap = window.gsap
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

            if (!gsap || reduceMotion) {
                scroller.scrollTo({ top: targetTop, behavior: reduceMotion ? 'auto' : 'smooth' })
                return
            }

            gsap.to(scroller, {
                scrollTop: targetTop,
                duration: 0.72,
                ease: 'power3.inOut',
                overwrite: true
            })
            gsap.fromTo(target.querySelectorAll('h3, .release-summary, .release-points li'),
                { x: 12, autoAlpha: 0.55, filter: 'blur(5px)' },
                {
                    x: 0,
                    autoAlpha: 1,
                    filter: 'blur(0px)',
                    duration: 0.52,
                    stagger: 0.035,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity,visibility,filter'
                }
            )
        })
    }

    prepareReleaseHistory(dialog){
        const feed = dialog.querySelector('.release-feed')
        if (!feed) return

        const scroller = this.getReleaseScroller(dialog)
        scroller.scrollTop = 0
        const firstEntry = feed.querySelector('.release-entry')
        if (firstEntry) this.setActiveRelease(dialog, firstEntry.id)
        if (scroller.dataset.releaseScrollBound) return

        scroller.dataset.releaseScrollBound = 'true'
        let frame = 0
        scroller.addEventListener('scroll', () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                const entries = [...feed.querySelectorAll('.release-entry')]
                const scrollerTop = scroller.getBoundingClientRect().top
                const threshold = scrollerTop + Math.min(120, scroller.clientHeight * 0.28)
                let active = entries[0]

                if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) {
                    active = entries[entries.length - 1]
                } else {
                    entries.forEach((entry) => {
                        if (entry.getBoundingClientRect().top <= threshold) active = entry
                    })
                }

                if (active) this.setActiveRelease(dialog, active.id)
            })
        }, { passive: true })
    }

    getReleaseScroller(dialog){
        const feed = dialog.querySelector('.release-feed')
        const modalCard = dialog.querySelector('.modal-card')
        return feed.scrollHeight > feed.clientHeight + 2 ? feed : modalCard
    }
    setActiveRelease(dialog, releaseId){
        dialog.querySelectorAll('[data-release-target]').forEach((button) => {
            const isActive = button.dataset.releaseTarget === releaseId
            button.classList.toggle('is-active', isActive)
            if (isActive) {
                button.setAttribute('aria-current', 'true')
                const list = button.closest('.release-index-list')
                if (list && list.scrollWidth > list.clientWidth) {
                    const left = button.offsetLeft - (list.clientWidth - button.offsetWidth) / 2
                    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    list.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' })
                }
            } else {
                button.removeAttribute('aria-current')
            }
        })
    }
    close(dialogId){
        const dialog = document.getElementById(dialogId)
        if(!dialog || !dialog.open) return

        const originId = dialog.dataset.flipId
        const origin = originId ? document.querySelector(`[data-flip-id="${originId}"]:not([open])`) : null
        const canFlip = window.Flip && window.CustomEase && origin instanceof Element

        if (!canFlip) {
            dialog.classList.add('pretty-modal-closing')
            window.setTimeout(() => {
                dialog.classList.remove('pretty-modal-closing')
                dialog.removeAttribute('style')
                dialog.close()
            }, 700)
            return
        }

        const originState = Flip.getState(origin)
        Flip.to(originState, {
            targets: dialog,
            scale: true,
            ease: CustomEase.create("custom", "M0,0 C0.305,0.206 0.116,0.567 0.3,0.8 0.394,0.921 0.491,1 1,1"),
            onComplete: () => {
                dialog.removeAttribute('style')
                dialog.close()
            },
            toggleClass: 'pretty-modal-closing',
            duration: 0.7,
        })
    }

    injectStyles() {
        if (document.getElementById('pretty-modal-styles')) return;

        const styles = `
            .pretty-modal-opening {
                animation: pretty-modal-opening 500ms cubic-bezier(.56,.27,0,1);
            }

            @keyframes pretty-modal-opening{
                from { opacity: 0; filter: blur(8px) } to { opacity: 1; filter: blur(0px) }
            }

            .pretty-modal-closing {
                animation:
                    pretty-modal-closing-border-radius 500ms cubic-bezier(.56,.27,0,1),
                    pretty-modal-closing-blur 500ms cubic-bezier(.37,.35,0,1),
                    pretty-modal-closing-fade 700ms cubic-bezier(.56,.27,0,1)
                ;
            }

            @keyframes pretty-modal-closing-border-radius {
                to { border-radius:400px; }
            }

            @keyframes pretty-modal-closing-blur {
                0% { filter: blur(0); } 100% { filter: blur(32px); }
            }

            @keyframes pretty-modal-closing-fade {
                from { opacity: 1; } to { opacity: 0; }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'pretty-modal-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}
