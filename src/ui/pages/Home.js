import { renderReviews, initReviews } from './Reviews.js';

export function renderHome(data) {
    return `
        <!-- Секция Hero -->
        <section class="section section-hero" id="home">
            <div class="section-bg" style="background-image: url('${data.bgImage}');"></div>
            <div class="section-overlay"></div>
            <div class="container hero-inner">
                <div class="hero-text">
                    <h1 class="animate-on-scroll">${data.name}</h1>
                    <p class="subtitle animate-on-scroll" style="animation-delay: 0.1s;">
                        ${data.subtitle}
                    </p>
                    <p class="description animate-on-scroll" style="animation-delay: 0.2s;">
                        ${data.description}
                    </p>
                    <div class="hero-actions animate-on-scroll" style="animation-delay: 0.3s;">
                        <a href="#contacts" class="btn btn-primary">Связаться</a>
                        <a href="#about" class="btn btn-outline">Узнать больше</a>
                    </div>
                </div>
                <div class="hero-image animate-on-scroll" style="animation-delay: 0.15s;">
                    <img src="${data.photo}" alt="${data.name}" />
                </div>
            </div>
        </section>

        <!-- Секция Отзывов -->
        <section class="section reviews-section" id="reviews">
            <div class="container">
                <h2 class="section-title">Отзывы</h2>
                ${renderReviews()}
            </div>
        </section>
    `;
}

// === ИНИЦИАЛИЗАЦИЯ ПОСЛЕ РЕНДЕРИНГА ===
export function initHome() {
    initReviews();
    // ... остальные инициализации
}