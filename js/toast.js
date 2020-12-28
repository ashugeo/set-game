export default {
    shown: [],

    show(id, html, icon) {
        if (this.shown.includes(id)) return;

        if (icon) {
            html = `<div class="toast hidden">
                <div class="row">
                    <i class="${icon}"></i>
                    <div>${html}</div>
                </div>
            </div>`;
        } else {
            html = `<div class="toast hidden">${html}</div>`;
        }
        
        const $toast = $(html);
        $('.toasts').append($toast);
        setTimeout(() => $toast.removeClass('hidden'), 10);

        // Prevent same toast from being spammed
        if (id) this.shown.push(id);

        setTimeout(() => {
            $toast.fadeOut(500, () => $toast.remove());
            if (id) this.shown.splice(this.shown.indexOf(id), 1);
        }, 5000);
    }
}