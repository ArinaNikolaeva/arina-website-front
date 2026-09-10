// ==========================================
// FAQ
// ==========================================

import { api } from '../../data/api.js';

// === РЕНДЕР ===
export function renderFAQ() {
    return `
        <div class="faq-list" id="faqList">
            <!-- Загрузится через initFAQPage -->
        </div>
    `;
}

// === ЗАГРУЗКА FAQ ЧЕРЕЗ API ===
export async function initFAQPage() {
    const list = document.getElementById('faqList');
    if (!list) return;

    try {
        const items = await api.faq.getAll();

        list.innerHTML = items.map((item, index) => `
            <div class="faq-item ${index === 0 ? 'open' : ''} animate-on-scroll" style="animation-delay: ${(index * 0.05).toFixed(2)}s;">
                <div class="faq-question">${item.question}</div>
                <div class="faq-answer">${item.answer}</div>
            </div>
        `).join('');

        console.log(`✅ Загружено вопросов FAQ: ${items.length}`);
    } catch (err) {
        console.error('❌ Ошибка загрузки FAQ:', err);
        list.innerHTML = '<p class="error-message">Не удалось загрузить FAQ</p>';
    }
}