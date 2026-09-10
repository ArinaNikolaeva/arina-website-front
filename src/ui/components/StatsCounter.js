// ==========================================
// СЧЁТЧИК ОБРАЩЕНИЙ
// ==========================================

import { statsData, formatNumber } from '../../data/stats.js';

export function renderStatsCounter() {
    return `
        <div class="stats-counter animate-on-scroll">
            <div class="stats-counter-item">
                <div class="stats-counter-value" data-count="${statsData.totalClients}">0</div>
                <div class="stats-counter-label">Всего обратились</div>
            </div>
            <div class="stats-counter-divider"></div>
            <div class="stats-counter-item">
                <div class="stats-counter-value" data-count="${statsData.online}">0</div>
                <div class="stats-counter-label">Онлайн</div>
            </div>
            <div class="stats-counter-divider"></div>
            <div class="stats-counter-item">
                <div class="stats-counter-value" data-count="${statsData.offline}">0</div>
                <div class="stats-counter-label">Лично</div>
            </div>
        </div>
    `;
}

// === АНИМАЦИЯ СЧЁТЧИКА ===
export function initStatsCounter() {
    const counters = document.querySelectorAll('.stats-counter-value');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count) || 0;
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// === ПЛАВНЫЙ ПОДСЧЁТ ===
function animateCounter(el, target) {
    const duration = 1500; // 1.5 секунды
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Плавная анимация (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * eased);
        
        el.textContent = formatNumber(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = formatNumber(target);
        }
    }

    requestAnimationFrame(update);
}