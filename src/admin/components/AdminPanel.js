// ==========================================
// ПАНЕЛЬ УПРАВЛЕНИЯ АДМИНИСТРАТОРА (САЙДБАР)
// ==========================================

import { api } from '../../data/api.js';
import { showNotification } from './moderation/helpers.js';
import { openReviewsModeration } from './moderation/ReviewsModeration.js';
import { openArticlesModeration } from './moderation/ArticlesModeration.js';
import { openFaqModeration } from './moderation/FaqModeration.js';
import { openEducationEditor } from './moderation/EducationEditor.js';
import { openContactsEditor } from './moderation/ContactsEditor.js';

// ==========================================
// ИНИЦИАЛИЗАЦИЯ
// ==========================================

export function initAdminPanel() {
    const panelBtn = document.getElementById('adminPanelBtn');
    if (!panelBtn) {
        console.warn('AdminPanel: кнопка "Панель" не найдена');
        return;
    }

    panelBtn.addEventListener('click', () => {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (!isAdmin) {
            showNotification('⛔ Доступ запрещён. Войдите как администратор.', 'error');
            return;
        }
        openAdminSidebar();
    });

    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        panelBtn.style.display = 'inline-block';
        updatePanelNotificationDot();
    }

    console.log('🛠️ AdminPanel инициализирован');
}

// ==========================================
// ПУЛЬСИРУЮЩАЯ ТОЧКА НА КНОПКЕ "ПАНЕЛЬ"
// ==========================================

export async function updatePanelNotificationDot() {
    const panelBtn = document.getElementById('adminPanelBtn');
    if (!panelBtn) return;

    let pending = 0;
    try {
        const reviews = await api.reviews.getPending();
        pending = reviews.length;
    } catch (err) {
        console.warn('⚠️ Не удалось получить отзывы на модерации:', err.message);
    }

    // Удаляем старую точку
    panelBtn.querySelector('.panel-notification-dot')?.remove();

    if (pending > 0) {
        panelBtn.classList.add('has-notification');
        const dot = document.createElement('span');
        dot.className = 'panel-notification-dot';
        panelBtn.appendChild(dot);
    } else {
        panelBtn.classList.remove('has-notification');
    }
}

// ==========================================
// ПОЛУЧЕНИЕ ДАННЫХ
// ==========================================

async function getContacts() {
    try {
        return await api.contacts.get();
    } catch (err) {
        console.warn('⚠️ Не удалось загрузить контакты:', err.message);
        return { telegram: '', vk: '', email: '' };
    }
}

async function getEducation() {
    try {
        return await api.education.getAll();
    } catch (err) {
        console.warn('⚠️ Не удалось загрузить образование:', err.message);
        return [];
    }
}

function getStats() {
    const articles = document.querySelectorAll('.carousel-slide, .article-card').length || 0;
    const reviews = document.querySelectorAll('.review-card').length || 0;
    const faq = document.querySelectorAll('.faq-item').length || 0;
    const editable = document.querySelectorAll('[data-editable]').length || 0;
    return { articles, reviews, faq, editable };
}

// ==========================================
// БОКОВАЯ ПАНЕЛЬ
// ==========================================

async function openAdminSidebar() {
    if (document.querySelector('.admin-sidebar')) return;

    // Загружаем данные из БД
    const [contacts, education] = await Promise.all([
        getContacts(),
        getEducation(),
    ]);

    const stats = getStats();

    // Проверка отзывов на модерации
    let pendingCount = 0;
    try {
        const pending = await api.reviews.getPending();
        pendingCount = pending.length;
    } catch (err) {}

    const overlay = document.createElement('div');
    overlay.className = 'admin-sidebar-overlay';

    const sidebar = document.createElement('aside');
    sidebar.className = 'admin-sidebar';
    sidebar.innerHTML = `
        <div class="admin-sidebar-header">
            <h2>⚙ Панель администратора</h2>
            <button class="admin-sidebar-close" id="adminSidebarClose">✕</button>
        </div>

        <div class="admin-sidebar-body">
            <div class="admin-section-title">Статистика сайта</div>
            <div class="admin-stats">
                <div class="stat-item stat-item-clickable" id="articlesStatTile" title="Управление статьями">
                    <span class="stat-icon">◈</span>
                    <span class="stat-value">${stats.articles}</span>
                    <span class="stat-label">Статей</span>
                </div>
                <div class="stat-item stat-item-clickable" id="reviewsStatTile" title="Открыть модерацию">
                    <span class="stat-icon">❝</span>
                    <span class="stat-value">${stats.reviews}</span>
                    <span class="stat-label">Отзывов</span>
                    ${pendingCount > 0 ? '<span class="panel-notification-dot stat-dot"></span>' : ''}
                </div>
                <div class="stat-item stat-item-clickable" id="faqStatTile" title="Управление FAQ">
                    <span class="stat-icon">?</span>
                    <span class="stat-value">${stats.faq}</span>
                    <span class="stat-label">FAQ</span>
                </div>
                <div class="stat-item stat-item-clickable" id="educationStatTile" title="Редактировать образование">
                    <span class="stat-icon">✦</span>
                    <span class="stat-value">${education.length}</span>
                    <span class="stat-label">Образование</span>
                </div>
            </div>

            <div class="admin-section-title">Связь со мной</div>
            <div class="admin-contacts-tile" id="adminContactsTile">
                <div class="contact-preview">
                    <div class="contact-preview-item">
                        <span class="contact-preview-icon">✈</span>
                        <span class="contact-preview-value" id="previewTelegram">${contacts.telegram || '—'}</span>
                    </div>
                    <div class="contact-preview-item">
                        <span class="contact-preview-icon">◈</span>
                        <span class="contact-preview-value" id="previewVk">${contacts.vk || '—'}</span>
                    </div>
                    <div class="contact-preview-item">
                        <span class="contact-preview-icon">✉</span>
                        <span class="contact-preview-value" id="previewEmail">${contacts.email || '—'}</span>
                    </div>
                </div>
                <button class="admin-btn admin-btn-primary" id="editContactsBtn">✎ Изменить контакты</button>
            </div>

            <div class="admin-section-title">Режим редактирования</div>
            <div class="admin-info">
                <p>Нажмите <strong>✎ Редактировать</strong> на любом тексте с оранжевым контуром.</p>
                <p>Изменения сохраняются в <code>базу данных</code>.</p>
            </div>

            <div class="admin-section-title">Действия</div>
            <div class="admin-actions">
                <button class="admin-btn admin-btn-secondary" id="adminRefreshData">↻ Обновить статистику</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

    requestAnimationFrame(() => {
        overlay.classList.add('active');
        sidebar.classList.add('active');
    });

    // === ЗАКРЫТИЕ ===
    function closeSidebar() {
        overlay.classList.remove('active');
        sidebar.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
            sidebar.remove();
        }, 300);
    }

    overlay.addEventListener('click', closeSidebar);
    sidebar.querySelector('#adminSidebarClose').addEventListener('click', closeSidebar);

    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeSidebar();
            document.removeEventListener('keydown', escHandler);
        }
    });

    // === ОБРАБОТЧИКИ КЛИКА ===
    sidebar.querySelector('#editContactsBtn')?.addEventListener('click', () => {
        openContactsEditor(sidebar);
    });

    sidebar.querySelector('#educationStatTile')?.addEventListener('click', () => {
        openEducationEditor(sidebar);
    });

    sidebar.querySelector('#reviewsStatTile')?.addEventListener('click', () => {
        openReviewsModeration();
    });

    sidebar.querySelector('#articlesStatTile')?.addEventListener('click', () => {
        openArticlesModeration();
    });

    sidebar.querySelector('#faqStatTile')?.addEventListener('click', () => {
        openFaqModeration();
    });

    // === ОБНОВЛЕНИЕ СТАТИСТИКИ ===
    sidebar.querySelector('#adminRefreshData')?.addEventListener('click', () => {
        closeSidebar();
        setTimeout(openAdminSidebar, 350);
    });
}