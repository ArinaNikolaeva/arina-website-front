// ==========================================
// СТРАНИЦА / КОМПОНЕНТ ОТЗЫВОВ
// ==========================================

import { reviewsData } from '../../data/reviews.js';
import { categoryMap } from '../../data/categories.js';
import { renderReviewForm, initReviewForm } from '../components/ReviewForm.js';
import { renderStatsCounter, initStatsCounter } from '../components/StatsCounter.js';

export function renderReviews() {
    return `
    ${renderStatsCounter()}
        <div class="carousel-wrapper reviews-carousel">
            <button class="carousel-btn carousel-btn-prev" id="reviewsPrev">‹</button>
            <div class="carousel-container">
                <div class="carousel-track" id="reviewsTrack">
                    ${reviewsData.map((review) => {
                        const category = categoryMap[review.category] || { color: '#888', label: review.category };
                        return `
                            <div class="review-card" data-review-id="${review.id}" data-review='${JSON.stringify(review).replace(/'/g, "&#39;")}'>
                                <div class="review-category-tag" style="background: ${category.color};">${category.label}</div>
                                <div class="review-card-body">
                                    <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                                    <p>"${review.text}"</p>
                                    <cite>— ${review.name}</cite>
                                    <div class="review-date">${review.date}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            <button class="carousel-btn carousel-btn-next" id="reviewsNext">›</button>
        </div>
        <div class="carousel-dots" id="reviewsDots"></div>
        
        ${renderReviewForm()}
    `;
}

export function initReviews() {
    initReviewForm();
    initStatsCounter();
    
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.review-card');
        if (card) {
            try {
                const reviewData = JSON.parse(card.dataset.review);
                openFullReview(reviewData);
            } catch (err) {
                console.warn('Ошибка при открытии отзыва:', err);
            }
        }
    });
    
    window.refreshReviews = () => {
        window.location.reload();
    };
}

function openFullReview(review) {
    if (document.querySelector('.full-review-modal')) return;

    const category = categoryMap[review.category] || { color: '#888', label: review.category };
    
    const starsHtml = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    let criteriaHtml = '';
    if (review.criteria) {
        const criteriaLabels = {
            professionalism: 'Профессионализм',
            empathy: 'Эмпатия и внимание',
            clarity: 'Чёткость объяснений',
            effectiveness: 'Эффективность работы',
            recommendation: 'Готовность рекомендовать'
        };
        
        criteriaHtml = `
            <div class="full-review-criteria">
                <h4>Оценка по критериям</h4>
                ${Object.entries(review.criteria).map(([key, value]) => `
                    <div class="full-review-criterion">
                        <span class="criterion-label">${criteriaLabels[key] || key}</span>
                        <span class="criterion-stars">${'★'.repeat(value)}${'☆'.repeat(5 - value)}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    const modal = document.createElement('div');
    modal.className = 'full-review-modal';
    modal.innerHTML = `
        <div class="full-review-overlay">
            <div class="full-review-container">
                <button class="full-review-close" id="fullReviewClose">✕</button>
                
                <div class="full-review-header">
                    <div class="full-review-category-tag" style="background: ${category.color};">${category.label}</div>
                    <div class="full-review-name">${review.name}</div>
                    <div class="full-review-date">${review.date}</div>
                </div>
                
                <div class="full-review-body">
                    <div class="full-review-stars">${starsHtml}</div>
                    <p class="full-review-text">${review.text}</p>
                    ${criteriaHtml}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#fullReviewClose');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('full-review-overlay')) {
            modal.remove();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.querySelector('.full-review-modal')) {
            modal.remove();
        }
    });
}