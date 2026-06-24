export class PrettyModal {
    constructor() {
        this.injectStyles()
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