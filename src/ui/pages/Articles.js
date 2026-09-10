// ==========================================
// СТАТЬИ
// ==========================================

import { articlesData } from '../../data/articles.js';

// === ЦВЕТА ДЛЯ КАТЕГОРИЙ СТАТЕЙ ===
function getCategoryColor(category) {
    const colors = {
        'Отношения': '#D48B6A',
        'Кризисы': '#C47A7A',
        'Самооценка': '#6A9C89',
        'Психология': '#B8A08A',
        'Эмоции': '#B8A08A',
        'Коммуникация': '#7A9BA8',
        'Веб-разработка': '#A88B6A',
        'Бизнес': '#6A8B9C'
    };
    return colors[category] || '#888';
}

export function renderArticles() {
    return `
        <div class="carousel-wrapper">
            <button class="carousel-btn carousel-btn-prev" id="carouselPrev">‹</button>
            <div class="carousel-container">
                <div class="carousel-track" id="carouselTrack">
                    ${articlesData.map((article, index) => `
                        <div class="article-card" data-article-id="${article.id}" data-index="${index}">
                            <div class="article-image" style="background-image: url('${article.image}');"></div>
                            <div class="article-content">
                                <span class="article-category" style="background: ${getCategoryColor(article.category)};">${article.category}</span>
                                <h3>${article.title}</h3>
                                <p>${article.preview}</p>
                                <div class="article-meta">
                                    <span>${article.date}</span>
                                    <span>·</span>
                                    <span>${article.readingTime}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <button class="carousel-btn carousel-btn-next" id="carouselNext">›</button>
        </div>
        <div class="carousel-dots" id="carouselDots"></div>
    `;
}

// === ИНИЦИАЛИЗАЦИЯ ===
export function initArticles() {
    // Вся логика открытия теперь в Modal.js
    // Здесь ничего не нужно, кроме инициализации карусели
    console.log('✅ Статьи инициализированы');
}