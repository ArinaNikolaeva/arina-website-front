// ==========================================
// FAQ
// ==========================================

import { faqData } from '../../data/faq.js';

function getFaqForSite() {
    const saved = localStorage.getItem('siteFaq');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {}
    }
    return faqData;
}

export function renderFAQ() {
    const items = getFaqForSite();
    
    return `
        <div class="faq-list">
            ${items.map((item, index) => `
                <div class="faq-item ${index === 0 ? 'open' : ''} animate-on-scroll" style="animation-delay: ${(index * 0.05).toFixed(2)}s;">
                    <div class="faq-question">${item.question}</div>
                    <div class="faq-answer">${item.answer}</div>
                </div>
            `).join('')}
        </div>
    `;
}