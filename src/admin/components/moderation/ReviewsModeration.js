// ==========================================
// МОДЕРАЦИЯ ОТЗЫВОВ
// ==========================================
import { updatePanelNotificationDot } from '../AdminPanel.js';
import { siteConfig } from '../../../data/siteConfig.js';
import { createModal, showNotification, getCriterionLabel } from './helpers.js';
import { reviewsData } from '../../../data/reviews.js';

export function openReviewsModeration() {
    const allReviews = getAllReviews();
    const pending = allReviews.filter(r => r.isModerated === false);
    const published = allReviews.filter(r => r.isModerated !== false);

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

    // === КНОПКИ ===
    modal.querySelectorAll('.review-approve').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = parseFloat(btn.dataset.id);
        approveReview(id);
        showNotification('✓ Отзыв опубликован', 'success');
        close();
        updatePanelNotificationDot();
        updateReviewsTileDot();   // ← новая строка
        setTimeout(openReviewsModeration, 350);
    });
});

modal.querySelectorAll('.review-delete').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!confirm('Удалить этот отзыв?')) return;
        const id = parseFloat(btn.dataset.id);
        deleteReviewById(id);
        showNotification('⊘ Отзыв удалён', 'success');
        close();
        updatePanelNotificationDot();
        updateReviewsTileDot();   // ← новая строка
        setTimeout(openReviewsModeration, 350);
    });
});

// === ОБНОВЛЕНИЕ ТОЧКИ НА ПЛИТКЕ "ОТЗЫВОВ" ===
function updateReviewsTileDot() {
    const tile = document.querySelector('#reviewsStatTile');
    if (!tile) return;

    const pendingCount = getAllReviews().filter(r => r.isModerated === false).length;
    const existingDot = tile.querySelector('.stat-dot');

    if (pendingCount > 0 && !existingDot) {
        const dot = document.createElement('span');
        dot.className = 'panel-notification-dot stat-dot';
        tile.appendChild(dot);
    } else if (pendingCount === 0 && existingDot) {
        existingDot.remove();
    }
}
}

// === РЕНДЕР СПИСКА ===
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

// === ХЕЛПЕРЫ ===
function getAllReviews() {
    const saved = localStorage.getItem('psychologist_reviews');
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    // ✅ Берём из reviewsData
    return reviewsData || [];
}

function approveReview(id) {
    const reviews = getAllReviews();
    const review = reviews.find(r => r.id === id);
    if (review) {
        review.isModerated = true;
        localStorage.setItem('psychologist_reviews', JSON.stringify(reviews));
    }
}

function deleteReviewById(id) {
    const reviews = getAllReviews().filter(r => r.id !== id);
    localStorage.setItem('psychologist_reviews', JSON.stringify(reviews));
}