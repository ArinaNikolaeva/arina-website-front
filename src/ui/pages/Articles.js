// ==========================================
// СТАТЬИ
// ==========================================

import { api } from '../../data/api.js';
import { categoryMap } from '../../data/categories.js';

// === ЦВЕТ КАТЕГОРИИ ===
function getCategoryColor(category) {
    return categoryMap[category]?.color || '#888';
}

// === РЕНДЕР ===
export function renderArticles() {
    return `
        <div class="carousel-wrapper">
            <button class="carousel-btn carousel-btn-prev" id="carouselPrev">‹</button>
            <div class="carousel-container">
                <div class="carousel-track" id="carouselTrack">
                    <!-- Загрузится через initArticles -->
                </div>
            </div>
            <button class="carousel-btn carousel-btn-next" id="carouselNext">›</button>
        </div>
        <div class="carousel-dots" id="carouselDots"></div>
    `;
}

// === ЗАГРУЗКА СТАТЕЙ ЧЕРЕЗ API ===
export async function initArticles() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    try {
        const articles = await api.articles.getAll();

        track.innerHTML = articles.map((article, index) => `
            <div class="article-card" data-article-id="${article.id}" data-index="${index}">
                <div class="article-image" style="background-image: url('${article.image}');"></div>
                <div class="article-content">
                    <span class="article-category" style="background: ${getCategoryColor(article.category)};">
                        ${article.category}
                    </span>
                    <h3>${article.title}</h3>
                    <p>${article.preview}</p>
                    <div class="article-meta">
                        <span>${article.date}</span>
                        <span>·</span>
                        <span>${article.reading_time}</span>
                    </div>
                </div>
            </div>
        `).join('');

        console.log(`✅ Загружено статей: ${articles.length}`);
    } catch (err) {
        console.error('❌ Ошибка загрузки статей:', err);
        track.innerHTML = '<p class="error-message">Не удалось загрузить статьи</p>';
    }
}