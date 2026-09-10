// ==========================================
// ОТЗЫВЫ
// ==========================================

import { api } from '../../data/api.js';
import { categoryMap } from '../../data/categories.js';
import { renderReviewForm, initReviewForm } from '../components/ReviewForm.js';
import { initStatsCounter } from '../components/StatsCounter.js';

// === РЕНДЕР ===
export function renderReviews() {
    return `
        <div class="stats-counter-wrapper" id="statsCounterWrapper"></div>

        <div class="carousel-wrapper reviews-carousel">
            <button class="carousel-btn carousel-btn-prev" id="reviewsPrev">‹</button>
            <div class="carousel-container">
                <div class="carousel-track" id="reviewsTrack">
                    <!-- Загрузится через initReviews -->
                </div>
            </div>
            <button class="carousel-btn carousel-btn-next" id="reviewsNext">›</button>
        </div>
        <div class="carousel-dots" id="reviewsDots"></div>

        ${renderReviewForm()}
    `;
}

// === ЗАГРУЗКА ===
export async function initReviews() {
    initReviewForm();

    // Загружаем счётчик отдельно (он асинхронный)
    await loadStatsCounter();

    // Загружаем отзывы
    await loadReviews();

    // Инициализируем анимацию счётчика
    initStatsCounter();

    // Регистрируем функцию обновления
    window.refreshReviews = () => {
        window.location.reload();
    };
}

// === СЧЁТЧИК ОБРАЩЕНИЙ ===
async function loadStatsCounter() {
    const wrapper = document.getElementById('statsCounterWrapper');
    if (!wrapper) return;

    // Динамически импортируем и вызываем асинхронный рендер
    const { renderStatsCounter } = await import('../components/StatsCounter.js');
    wrapper.innerHTML = await renderStatsCounter();
}

// === ЗАГРУЗКА ОТЗЫВОВ ===
async function loadReviews() {
    const track = document.getElementById('reviewsTrack');
    if (!track) return;

    try {
        const reviews = await api.reviews.getPublished();

        track.innerHTML = reviews.map((review) => {
            const category = categoryMap[review.category] || { color: '#888', label: review.category };
            return `
                <div class="review-card" data-review-id="${review.id}">
                    <div class="review-category-tag" style="background: ${category.color};">${category.label}</div>
                    <div class="review-card-body">
                        <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                        <p>"${review.text}"</p>
                        <cite>— ${review.name}</cite>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
            `;
        }).join('');

        console.log(`✅ Загружено отзывов: ${reviews.length}`);
    } catch (err) {
        console.error('❌ Ошибка загрузки отзывов:', err);
        track.innerHTML = '<p class="error-message">Не удалось загрузить отзывы</p>';
    }
}