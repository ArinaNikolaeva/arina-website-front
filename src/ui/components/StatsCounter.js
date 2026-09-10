// ==========================================
// СЧЁТЧИК ОБРАЩЕНИЙ (API)
// ==========================================

import { api } from '../../data/api.js';

// === ЗАГРУЗКА И РЕНДЕР ===
export async function renderStatsCounter() {
    let stats = {
        total_clients: 0,
        online_clients: 0,
        offline_clients: 0
    };

    try {
        stats = await api.stats.get();
    } catch (err) {
        console.warn('⚠️ Не удалось загрузить статистику:', err.message);
    }

    return `
        <div class="stats-counter animate-on-scroll">
            <div class="stats-counter-item">
                <div class="stats-counter-value" data-count="${stats.total_clients || 0}">0</div>
                <div class="stats-counter-label">Всего обратились</div>
            </div>
            <div class="stats-counter-divider"></div>
            <div class="stats-counter-item">
                <div class="stats-counter-value" data-count="${stats.online_clients || 0}">0</div>
                <div class="stats-counter-label">Онлайн</div>
            </div>
            <div class="stats-counter-divider"></div>
            <div class="stats-counter-item">
                <div class="stats-counter-value" data-count="${stats.offline_clients || 0}">0</div>
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
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * eased);

        el.textContent = formatNumber(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = formatNumber(target) + '+';
        }
    }

    requestAnimationFrame(update);
}

// === ФОРМАТИРОВАНИЕ ЧИСЛА ===
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}