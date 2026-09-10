// ==========================================
// МОДЕРАЦИЯ ОТЗЫВОВ (API)
// ==========================================

import { updatePanelNotificationDot } from '../AdminPanel.js';
import { api } from '../../../data/api.js';
import { createModal, showNotification, getCriterionLabel } from './helpers.js';

export async function openReviewsModeration() {
    // 1. Загружаем отзывы из БД
    let pending = [];
    let published = [];

    try {
        [pending, published] = await Promise.all([
            api.reviews.getPending(),
            api.reviews.getPublished(),
        ]);
    } catch (err) {
        console.warn('⚠️ Не удалось загрузить отзывы:', err.message);
    }

    // 2. Открываем модалку
    const { modal, close } = createModal({
        overlayClass: 'reviews-moderation-overlay',
        modalClass: 'reviews-moderation',
        html: `
            <div class="reviews-moderation-header">
                <h3>Модерация отзывов</h3>
                <button class="reviews-moderation-close" id="reviewsModerationClose">✕</button>
            </div>

            <div class="reviews-moderation-tabs">
                <button class="reviews-tab active" data-tab="pending">
                    Новые
                    ${pending.length ? `<span class="reviews-tab-badge">${pending.length}</span>` : ''}
                </button>
                <button class="reviews-tab" data-tab="published">
                    Опубликованные
                    <span class="reviews-tab-badge">${published.length}</span>
                </button>
            </div>

            <div class="reviews-moderation-body">
                <div class="reviews-tab-content active" data-content="pending">
                    ${renderReviewList(pending, 'pending')}
                </div>
                <div class="reviews-tab-content" data-content="published">
                    ${renderReviewList(published, 'published')}
                </div>
            </div>
        `
    });

    modal.querySelector('#reviewsModerationClose').addEventListener('click', close);

    // === ВКЛАДКИ ===
    modal.querySelectorAll('.reviews-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            modal.querySelectorAll('.reviews-tab').forEach(t => t.classList.remove('active'));
            modal.querySelectorAll('.reviews-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            modal.querySelector(`.reviews-tab-content[data-content="${tabName}"]`)?.classList.add('active');
        });
    });

    // === ОДОБРИТЬ ===
    modal.querySelectorAll('.review-approve').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            try {
                await api.reviews.approve(id);
                showNotification('✓ Отзыв опубликован', 'success');
                close();
                updatePanelNotificationDot();
                setTimeout(openReviewsModeration, 350);
            } catch (err) {
                console.error('❌ Ошибка одобрения:', err);
                showNotification('❌ Не удалось одобрить', 'error');
            }
        });
    });

    // === УДАЛИТЬ ===
    modal.querySelectorAll('.review-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('Удалить этот отзыв?')) return;
            const id = parseInt(btn.dataset.id);
            try {
                await api.reviews.delete(id);
                showNotification('⊘ Отзыв удалён', 'success');
                close();
                updatePanelNotificationDot();
                setTimeout(openReviewsModeration, 350);
            } catch (err) {
                console.error('❌ Ошибка удаления:', err);
                showNotification('❌ Не удалось удалить', 'error');
            }
        });
    });
}

// ==========================================
// РЕНДЕР СПИСКА
// ==========================================

function renderReviewList(reviews, type) {
    if (!reviews.length) {
        return `
            <div class="reviews-empty">
                <span class="reviews-empty-icon">❝</span>
                <p>${type === 'pending' ? 'Нет новых отзывов на модерации' : 'Нет опубликованных отзывов'}</p>
            </div>
        `;
    }

    return `
        <div class="reviews-moderation-list">
            ${reviews.map(review => `
                <div class="review-moderation-card">
                    <div class="review-moderation-header">
                        <div class="review-moderation-info">
                            <span class="review-moderation-name">${review.name}</span>
                            <span class="review-moderation-date">${review.date}</span>
                        </div>
                        <div class="review-moderation-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                    </div>
                    <p class="review-moderation-text">${review.text}</p>
                    ${review.criteria ? `
                        <div class="review-moderation-criteria">
                            ${Object.entries(review.criteria).map(([key, value]) => `
                                <span class="review-criterion-badge">
                                    ${getCriterionLabel(key)}: ${'★'.repeat(value)}${'☆'.repeat(5 - value)}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="review-moderation-actions">
                        ${type === 'pending' ? `
                            <button class="admin-btn admin-btn-primary review-approve" data-id="${review.id}">
                                ✓ Опубликовать
                            </button>
                        ` : ''}
                        <button class="admin-btn admin-btn-danger review-delete" data-id="${review.id}">
                            ✕ Удалить
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}