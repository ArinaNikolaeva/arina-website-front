// ==========================================
// HEADER
// ==========================================

export function renderHeader() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    return `
        <header class="header" id="header">
            <div class="container header-inner">
                <div class="logo" id="logoLink">
                    <span class="logo-icon">✦</span>
                    <span class="logo-name" id="logoName"></span>
                    <span class="logo-lastname" id="logoLastName"></span>
                </div>
                <nav class="nav">
                    <a href="#about">Об авторе</a>
                    <a href="#articles">Статьи</a>
                    <a href="#reviews">Отзывы</a>
                    <a href="#faq">FAQ</a>
                    <a href="#contacts">Контакты</a>
                    <button class="nav-auth-btn" id="authOpenBtn">
                        ${isAdmin ? 'Выход' : 'Вход'}
                    </button>
                    <button class="nav-admin-btn" id="adminPanelBtn" style="display: ${isAdmin ? 'inline-block' : 'none'}">
                        Панель
                    </button>
                </nav>
            </div>
        </header>
    `;
}

// === ЗАГРУЗКА ИМЕНИ ИЗ API ===
export async function initHeader(person) {
    const name = document.getElementById('logoName');
    const lastName = document.getElementById('logoLastName');

    if (name && person) name.textContent = person.first_name || '';
    if (lastName && person) lastName.textContent = person.last_name || '';

    // Логотип — скролл наверх
    document.getElementById('logoLink')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Кнопка "Панель"
    document.getElementById('adminPanelBtn')?.addEventListener('click', () => {
        console.log('🛠️ Панель администратора в разработке');
    });
}