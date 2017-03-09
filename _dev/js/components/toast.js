'use strict';

let toastStack = new Map();
let t1 = 't1';
let t2 = 't2';

export class Toast {

    static create (msg, options) {
        this._toastContainer = document.querySelector('.toast-container');
        if (!this._toastContainer) {
            this._toastContainer = document.createElement('div');
            this._toastContainer.classList.add('toast-container');
            document.body.appendChild(this._toastContainer);
        }
        this._options = options || {};
        let tag = this._options.tag || (Date.now().toString());
        Array.from(this._toastContainer.querySelectorAll('.toast'))
            .forEach(t => {
                t.parentNode.removeChild(t);
            });

        // Make a toast...
        const tpl = document.querySelector('#tpl-toast');
        let clone = tpl.content.cloneNode(true);
        this._toast        = clone.querySelector('.toast');
        this._toastContent = this._toast.querySelector('.toast__content');
        this._toastAction  = this._toast.querySelector('.toast__action');

        if (this._options.interactive)
            this._toast.classList.add('interactive');

        this._toastContent.textContent = msg;
        this._toast.dataset.tag        = tag;

        if (this._options.action) {
            this._toastAction.dataset.action = this._options.action;
            this._toastAction.textContent    = this._options.action;
        }

        if (toastStack.has(t1)) {
            toastStack.set(t2, tag);
        } else {
            toastStack.set(t1, tag);
        }
        this._toastContainer.appendChild(this._toast);

        // Double rAF to allow slide-up effect to take hold.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this._toastContainer.classList.add('is-visible');

                // If toast should stay visible until user interaction,
                // prevent toast timeout.
                if (this._options.interactive)
                    return;

                // Wait a few seconds, then fade it...
                let timeout = this._options.timeout || 3500;
                setTimeout(() => {
                    this.dismiss();
                }, timeout);
            });
        });

        this._toastAction.onclick = () => {
            this.dismiss();
        };
    }

    static dismiss () {
        if (toastStack.size > 0) {
            if (toastStack.has(t2)) {
                if ( toastStack.set(t1,toastStack.get(t2)) ) {
                    toastStack.delete(t2);
                }
            }

            Array.from(this._toastContainer.querySelectorAll(`.toast[data-tag="${toastStack.get(t1)}"]`))
                .forEach(toast => {
                    toast.classList.add('toast--dismissed');
                    this._toastContainer.classList.remove('is-visible');

                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                // After which, remove it altogether.
                                toast.addEventListener('transitionend', evt => {
                                    evt.target.parentNode.removeChild(evt.target);
                                    toastStack.delete(t1);
                                });
                            });
                        });
                    }, 1000);
                });
        }

        toastStack.clear();
    }
}
