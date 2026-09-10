// ==========================================
// ПАНЕЛЬ УПРАВЛЕНИЯ АДМИНИСТРАТОРА (САЙДБАР)
// ==========================================

import { siteConfig } from '../../data/siteConfig.js';

import { showNotification } from './moderation/helpers.js';
import { openReviewsModeration } from './moderation/ReviewsModeration.js';
import { openArticlesModeration } from './moderation/ArticlesModeration.js';
import { openFaqModeration } from './moderation/FaqModeration.js';
import { openEducationEditor } from './moderation/EducationEditor.js';
import { openContactsEditor } from './moderation/ContactsEditor.js';

import { reviewsData } from '../../data/reviews.js';

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
        // ✅ Проверяем, есть ли новые отзывы
        updatePanelNotificationDot();
    }

    console.log('🛠️ AdminPanel инициализирован');
}

// === ПУЛЬСИРУЮЩАЯ ТОЧКА НА КНОПКЕ "ПАНЕЛЬ" ===
function updatePanelNotificationDot() {
    const panelBtn = document.getElementById('adminPanelBtn');
    if (!panelBtn) return;

    // Считаем отзывы, которые ещё не промодерированы
    const pending = getPendingReviewsCount();

    // Удаляем старую точку, если есть
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

// === СЧИТАЕМ ОТЗЫВЫ НА МОДЕРАЦИИ ===
function getPendingReviewsCount() {
    const saved = localStorage.getItem('psychologist_reviews');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            return parsed.filter(r => r.isModerated === false).length;
        } catch (e) {}
    }
    return 0;
}

// === ХЕЛПЕРЫ ===
function getContacts() {
    const saved = localStorage.getItem('siteContacts');
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    return { ...siteConfig.contacts };
}

function getEducation() {
    const saved = localStorage.getItem('siteEducation');
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    return siteConfig.person.education || [];
}

function getStats() {
    const articles = document.querySelectorAll('.carousel-slide, .article-card').length || 0;
    const reviews = document.querySelectorAll('.review-card').length || 0;
    const faq = document.querySelectorAll('.faq-item').length || 0;
    const editable = document.querySelectorAll('[data-editable]').length || 0;
    return { articles, reviews, faq, editable };
}

// === БОКОВАЯ ПАНЕЛЬ ===
function openAdminSidebar() {
    if (document.querySelector('.admin-sidebar')) return;

    const stats = getStats();
    const contacts = getContacts();
    const education = getEducation();

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
                    ${getPendingReviewsCount() > 0 ? '<span class="panel-notification-dot stat-dot"></span>' : ''}
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
                <p>Изменения сохраняются в <code>localStorage</code>.</p>
            </div>

            <div class="admin-section-title">Действия</div>
            <div class="admin-actions">
                <button class="admin-btn admin-btn-danger" id="adminClearData">⊘ Очистить данные</button>
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
    sidebar.querySelector('#editContactsBtn')?.addEventListener('click', () => openContactsEditor(sidebar));
    sidebar.querySelector('#educationStatTile')?.addEventListener('click', () => openEducationEditor(sidebar));
    sidebar.querySelector('#reviewsStatTile')?.addEventListener('click', () => openReviewsModeration());
    sidebar.querySelector('#articlesStatTile')?.addEventListener('click', () => openArticlesModeration());
    sidebar.querySelector('#faqStatTile')?.addEventListener('click', () => openFaqModeration());

    sidebar.querySelector('#adminClearData')?.addEventListener('click', () => {
        if (confirm('⚠ Вы уверены, что хотите очистить все сохранённые данные?')) {
            localStorage.removeItem('editorData');
            localStorage.removeItem('siteContacts');
            localStorage.removeItem('siteEducation');
            localStorage.removeItem('siteCertificates');
            localStorage.removeItem('siteArticles');
            localStorage.removeItem('siteFaq');
            showNotification('⊘ Все данные очищены', 'success');
            closeSidebar();
        }
    });
}
// Экспорт для обновления точки из других мест
export { updatePanelNotificationDot };