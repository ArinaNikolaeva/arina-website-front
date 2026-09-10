// ==========================================
// ОБЩИЕ ХЕЛПЕРЫ ДЛЯ МОДЕРАЦИИ
// ==========================================

// === УВЕДОМЛЕНИЯ ===
export function showNotification(message, type = 'info') {
    document.querySelectorAll('.admin-toast').forEach(el => el.remove());

    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        padding: 14px 32px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10001;
        animation: slideUp 0.4s ease;
        font-family: 'Segoe UI', sans-serif;
        font-size: 0.95rem;
        background: ${type === 'error' ? 'rgba(255, 68, 68, 0.9)' : type === 'success' ? 'rgba(45, 107, 79, 0.9)' : 'rgba(255, 107, 53, 0.9)'};
        color: white;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// === СОЗДАНИЕ МОДАЛКИ ===
export function createModal({ overlayClass, modalClass, html }) {
    const overlay = document.createElement('div');
    overlay.className = overlayClass;

    const modal = document.createElement('div');
    modal.className = modalClass;
    modal.innerHTML = html;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    requestAnimationFrame(() => {
        overlay.classList.add('active');
        modal.classList.add('active');
    });

    function close() {
        overlay.classList.remove('active');
        modal.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
            modal.remove();
        }, 300);
    }

    overlay.addEventListener('click', close);

    return { overlay, modal, close };
}

// === ХЕЛПЕР ДЛЯ КАРТОЧЕК-ПЛИТОК (в статистике) ===
export function getCriterionLabel(key) {
    const labels = {
        professionalism: 'Профессионализм',
        empathy: 'Эмпатия',
        clarity: 'Чёткость',
        effectiveness: 'Эффективность',
        recommendation: 'Рекомендация'
    };
    return labels[key] || key;
}