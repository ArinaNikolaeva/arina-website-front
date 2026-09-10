// ==========================================
// МОДАЛЬНОЕ ОКНО ДЛЯ ВХОДА АДМИНА
// ==========================================

export function initAuthModal() {
    const modal = document.getElementById('authModal');
    const openBtn = document.getElementById('authOpenBtn');
    const closeBtn = document.getElementById('authModalClose');
    const form = document.getElementById('authForm');
    const errorMsg = document.getElementById('authError');

    if (!modal || !openBtn || !closeBtn || !form) {
        console.warn('AuthModal: элементы не найдены');
        return;
    }

    // === ОБНОВЛЯЕМ СОСТОЯНИЕ КНОПКИ ===
    function updateButtonState() {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (isAdmin) {
            openBtn.textContent = '✕ Выход';  // ← символ "✕"
            openBtn.style.background = 'transparent';
            openBtn.style.color = '#B0B0B0';
            openBtn.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            openBtn.style.boxShadow = 'none';
        } else {
            openBtn.textContent = '✦ Вход';  // ← символ "✦"
            openBtn.style.background = 'var(--color-accent)';
            openBtn.style.color = '#121212';
            openBtn.style.border = 'none';
            openBtn.style.boxShadow = '0 4px 16px rgba(212, 139, 106, 0.25)';
        }
    }

    // === ОТКРЫТИЕ МОДАЛКИ (только для входа) ===
    openBtn.addEventListener('click', () => {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (isAdmin) {
            logoutAdmin();
        } else {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            errorMsg.textContent = '';
            form.reset();
        }
    });

    // === ЗАКРЫТИЕ МОДАЛКИ ===
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        errorMsg.textContent = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // === ОТПРАВКА ФОРМЫ (ВХОД) ===
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value.trim();

        const validEmail = 'admin@psychologist.ru';
        const validPassword = 'admin123';

        if (email === validEmail && password === validPassword) {
            localStorage.setItem('isAdmin', 'true');
            closeModal();
            
            showAuthSuccess('✓ Режим администратора включен. Страница будет перезагружена.');  // ← символ "✓"
            
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            errorMsg.textContent = '✗ Неверный логин или пароль';  // ← символ "✗"
            errorMsg.style.color = '#e74c3c';
        }
    });

    // === ФУНКЦИЯ ВЫХОДА ===
    window.logoutAdmin = function() {
        if (!confirm('Вы уверены, что хотите выйти из режима администратора?\nВсе временные изменения будут сброшены.')) {
            return;
        }
        
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('editorData');
        
        showAuthSuccess('✕ Вы вышли из режима администратора. Страница будет перезагружена.');  // ← символ "✕"
        
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    updateButtonState();
    console.log('🔐 AuthModal инициализирован');
}

// === ПОКАЗ УСПЕШНОГО СООБЩЕНИЯ ===
function showAuthSuccess(message) {
    document.querySelectorAll('.auth-success-toast').forEach(el => el.remove());
    
    const msg = document.createElement('div');
    msg.className = 'auth-success-toast';
    msg.textContent = message;
    msg.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${message.includes('включен') ? '#2d6b4f' : 'rgba(255, 107, 53, 0.9)'};
        color: white;
        padding: 14px 32px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        animation: slideUp 0.4s ease;
        font-family: 'Segoe UI', sans-serif;
    `;
    document.body.appendChild(msg);

    setTimeout(() => {
        if (msg.parentNode) {
            msg.style.opacity = '0';
            msg.style.transition = 'opacity 0.5s ease';
            setTimeout(() => msg.remove(), 500);
        }
    }, 3000);
}

// === ОБНОВЛЕНИЕ КНОПОК В ХЕДЕРЕ ===
export function updateHeaderButtons() {
    const openBtn = document.getElementById('authOpenBtn');
    const adminPanelBtn = document.getElementById('adminPanelBtn');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (isAdmin) {
        if (openBtn) {
            openBtn.textContent = '✕ Выход';
            openBtn.style.background = 'transparent';
            openBtn.style.color = '#B0B0B0';
            openBtn.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            openBtn.style.boxShadow = 'none';
        }
        if (adminPanelBtn) {
            adminPanelBtn.style.display = 'inline-block';
        }
    } else {
        if (openBtn) {
            openBtn.textContent = '✦ Вход';
            openBtn.style.background = 'var(--color-accent)';
            openBtn.style.color = '#121212';
            openBtn.style.border = 'none';
            openBtn.style.boxShadow = '0 4px 16px rgba(212, 139, 106, 0.25)';
        }
        if (adminPanelBtn) {
            adminPanelBtn.style.display = 'none';
        }
    }
}

// === СТИЛИ ДЛЯ ТОСТА ===
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);