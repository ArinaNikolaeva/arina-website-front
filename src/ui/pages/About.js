// ==========================================
// ABOUT
// ==========================================

import { siteConfig } from '../../data/siteConfig.js';

export function renderAbout() {
    const person = siteConfig.person;
    const images = siteConfig.images;
        // ✅ Берём из localStorage или из конфига
    const savedEducation = localStorage.getItem('siteEducation');
    const savedCertificates = localStorage.getItem('siteCertificates');
    
    const education = savedEducation ? JSON.parse(savedEducation) : (person.education || []);
    const certificates = savedCertificates ? JSON.parse(savedCertificates) : (person.certificates || []);
    return `
        <!-- ✅ СТРОКА 1: Фото + Текст -->
        <div class="about-top">
            <div class="about-image animate-on-scroll">
                <img src="${images.aboutPhoto}" alt="${person.name}" />
            </div>
            <div class="about-content animate-on-scroll" style="animation-delay: 0.1s;">
                <h3 data-editable="about.name">${person.name}</h3>
                <div class="about-experience" data-editable="about.experience">${person.shortProfession}</div>
                <p data-editable="about.intro"><strong>Привет! Я ${person.name}.</strong> ${person.bio}</p>
                <p data-editable="about.description">${person.description}</p>

                <div class="about-meta">
                    ${siteConfig.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
        </div>

        <!-- ✅ СТРОКА 2: Образование на всю ширину -->
        ${education.length ? `
    <div class="about-education animate-on-scroll" style="animation-delay: 0.2s;">
        <h4 class="about-education-title">
            <span class="about-education-icon">✦</span>
            Образование
        </h4>
        
        <div class="about-education-list" id="educationListAbout">
            ${education.map((item, index) => `
                <div class="education-item ${index >= 3 ? 'hidden' : ''}" data-index="${index}">
                    <div class="education-item-icon">${item.icon || '◈'}</div>
                    <div class="education-item-content">
                        <div class="education-item-header">
                            <span class="education-item-type">${item.type}</span>
                            <span class="education-item-year">${item.year}</span>
                        </div>
                        <div class="education-item-title">${item.title}</div>
                        <div class="education-item-spec">${item.specialization}</div>
                        ${item.description ? `<div class="education-item-desc">${item.description}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>

        ${education.length > 3 ? `
            <button class="education-show-all" id="showAllEducation">
                Показать все (${education.length})
                <span class="education-show-icon">↓</span>
            </button>
        ` : ''}
    </div>
` : ''}
    `;
}

// === ИНИЦИАЛИЗАЦИЯ ОБРАЗОВАНИЯ ===
export function initAbout() {
    const showAllBtn = document.getElementById('showAllEducation');
    if (!showAllBtn) return;

    showAllBtn.addEventListener('click', () => {
        const list = document.getElementById('educationListAbout');
        if (!list) return;

        const hiddenItems = list.querySelectorAll('.education-item.hidden');
        const allItems = list.querySelectorAll('.education-item');

        if (hiddenItems.length > 0) {
            // Показать все
            hiddenItems.forEach(item => item.classList.remove('hidden'));
            showAllBtn.classList.add('open');
            showAllBtn.innerHTML = `Свернуть <span class="education-show-icon">↑</span>`;
        } else {
            // Скрыть (оставить первые 3)
            allItems.forEach((item, i) => {
                if (i >= 3) item.classList.add('hidden');
            });
            showAllBtn.classList.remove('open');
            showAllBtn.innerHTML = `Показать все (${allItems.length}) <span class="education-show-icon">↓</span>`;
        }
    });

    console.log('✅ About инициализирован');
}