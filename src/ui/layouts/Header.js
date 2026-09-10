// ==========================================
// HEADER
// ==========================================

import { siteConfig } from '../../data/siteConfig.js';

export function renderHeader() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const person = siteConfig.person;

    return `
        <header class="header" id="header">
            <div class="container header-inner">
                <div class="logo" id="logoLink">
                    <span class="logo-icon">✦</span>
                    <span class="logo-name">${person.firstName}</span>
                    <span class="logo-lastname">${person.lastName}</span>
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

export function initHeader() {
    document.getElementById('logoLink')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('adminPanelBtn')?.addEventListener('click', () => {
        alert('🛠️ Панель администратора в разработке');
    });
}