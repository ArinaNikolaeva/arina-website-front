// ==========================================
// ABOUT
// ==========================================

import { api } from '../../data/api.js';
import { siteConfig } from '../../data/siteConfig.js';

// === РЕНДЕР КАРКАСА ===
export function renderAbout() {
    return `
        <div class="about-top">
            <div class="about-image animate-on-scroll">
                <img src="" alt="" id="aboutPhoto" />
            </div>
            <div class="about-content animate-on-scroll" style="animation-delay: 0.1s;">
                <h3 data-editable="about.name" id="aboutName"></h3>
                <div class="about-experience" data-editable="about.experience" id="aboutExperience"></div>
                <p data-editable="about.intro" id="aboutIntro"></p>
                <p data-editable="about.description" id="aboutDescription"></p>

                <div class="about-meta">
                    ${siteConfig.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
        </div>

        <div class="about-education animate-on-scroll" style="animation-delay: 0.2s;" id="aboutEducationWrapper">
            <h4 class="about-education-title">
                <span class="about-education-icon">✦</span>
                Образование
            </h4>
            <div class="about-education-list" id="educationListAbout"></div>
        </div>
    `;
}

// === ЗАГРУЗКА ДАННЫХ ===
export async function initAbout() {
    try {
        const [person, images, education, certificates] = await Promise.all([
            api.person.get(),
            api.images.getAll(),
            api.education.getAll(),
            api.certificates.getAll(),
        ]);

        // === Фото ===
        const aboutPhoto = document.getElementById('aboutPhoto');
        if (aboutPhoto) {
            aboutPhoto.src = images.about_photo || '';
            aboutPhoto.alt = person.name || '';
        }

        // === Текст ===
        const aboutName = document.getElementById('aboutName');
        const aboutExp = document.getElementById('aboutExperience');
        const aboutIntro = document.getElementById('aboutIntro');
        const aboutDesc = document.getElementById('aboutDescription');

        if (aboutName) aboutName.textContent = person.name || '';
        if (aboutExp) aboutExp.textContent = person.short_profession || '';
        if (aboutIntro) aboutIntro.innerHTML = `<strong>Привет! Я ${person.name}.</strong> ${person.bio}`;
        if (aboutDesc) aboutDesc.textContent = person.description || '';

        // === Образование ===
        const list = document.getElementById('educationListAbout');
        if (list && education.length) {
            list.innerHTML = education.map((item, index) => `
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
            `).join('');

            // === Кнопка "Показать все" ===
            if (education.length > 3) {
                const btn = document.createElement('button');
                btn.className = 'education-show-all';
                btn.id = 'showAllEducation';
                btn.innerHTML = `Показать все (${education.length}) <span class="education-show-icon">↓</span>`;
                list.parentElement.appendChild(btn);

                btn.addEventListener('click', () => {
                    const hiddenItems = list.querySelectorAll('.education-item.hidden');
                    const allItems = list.querySelectorAll('.education-item');

                    if (hiddenItems.length > 0) {
                        hiddenItems.forEach(item => item.classList.remove('hidden'));
                        btn.classList.add('open');
                        btn.innerHTML = `Свернуть <span class="education-show-icon">↑</span>`;
                    } else {
                        allItems.forEach((item, i) => {
                            if (i >= 3) item.classList.add('hidden');
                        });
                        btn.classList.remove('open');
                        btn.innerHTML = `Показать все (${allItems.length}) <span class="education-show-icon">↓</span>`;
                    }
                });
            }
        }

        // === Сертификаты (можно добавить позже) ===
        console.log('✅ About загружен');
    } catch (err) {
        console.error('❌ Ошибка загрузки About:', err);
    }
}