// ==========================================
// INLINE РЕДАКТОР — HERO И ABOUT (API)
// ==========================================

import { api } from '../../data/api.js';
import { showNotification } from './moderation/helpers.js';

// ==========================================
// ИНИЦИАЛИЗАЦИЯ
// ==========================================

export function initInlineEditor() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (isAdmin) {
        addEditOverlays();
    } else {
        removeEditOverlays();
    }
}

// ==========================================
// ДОБАВИТЬ ОВЕРЛЕИ
// ==========================================

function addEditOverlays() {
    const aboutContent = document.querySelector('.about-content');
    const heroText = document.querySelector('.hero-text');

    if (aboutContent && !aboutContent.querySelector('.edit-overlay')) {
        aboutContent.style.position = 'relative';
        const overlay = createOverlay('about', aboutContent);
        aboutContent.appendChild(overlay);
        console.log('✅ Оверлей для about добавлен');
    }

    if (heroText && !heroText.querySelector('.edit-overlay')) {
        heroText.style.position = 'relative';
        const overlay = createOverlay('hero', heroText);
        heroText.appendChild(overlay);
        console.log('✅ Оверлей для hero добавлен');
    }
}

// ==========================================
// СОЗДАТЬ ОВЕРЛЕЙ
// ==========================================

function createOverlay(section, parentElement) {
    const overlay = document.createElement('div');
    overlay.className = 'edit-overlay';
    overlay.dataset.section = section;
    overlay.dataset.editing = 'false';

    overlay.style.cssText = `
        position: absolute;
        inset: -30px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        border-radius: 30px;
        transition: all 0.4s ease;
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        pointer-events: none;
        cursor: pointer;
        box-shadow: inset 0 0 60px 40px rgba(18, 18, 18, 0);
    `;

    const btn = document.createElement('button');
    btn.className = 'edit-overlay-btn';
    btn.textContent = '✎ Редактировать';
    btn.style.cssText = `
        padding: 10px 24px;
        border-radius: 24px;
        background: rgba(255, 107, 53, 0.95);
        color: #FFFFFF;
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
        font-family: 'Segoe UI', sans-serif;
        backdrop-filter: blur(8px);
        transition: all 0.3s ease;
        position: relative;
        z-index: 51;
        opacity: 0;
        pointer-events: none;
        transform: scale(0.9);
    `;

    btn.addEventListener('mouseenter', () => {
        if (overlay.dataset.editing !== 'true') {
            btn.style.transform = 'scale(1.05)';
            btn.style.background = '#FF5722';
            btn.style.boxShadow = '0 0 40px rgba(255, 107, 53, 0.6)';
        }
    });

    btn.addEventListener('mouseleave', () => {
        if (overlay.dataset.editing !== 'true') {
            btn.style.transform = 'scale(1)';
            btn.style.background = 'rgba(255, 107, 53, 0.95)';
            btn.style.boxShadow = 'none';
        }
    });

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (overlay.dataset.editing === 'false') {
            toggleSectionEdit(section, overlay);
        }
    });

    overlay.appendChild(btn);

    const parent = parentElement || overlay.parentElement;

    if (parent) {
        let hoverTimeout;

        parent.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            if (overlay.dataset.editing !== 'true') {
                overlay.style.background = 'rgba(18, 18, 18, 0.25)';
                overlay.style.backdropFilter = 'blur(3px)';
                overlay.style.webkitBackdropFilter = 'blur(3px)';
                overlay.style.boxShadow = 'inset 0 0 80px 50px rgba(18, 18, 18, 0.3)';
                overlay.style.pointerEvents = 'auto';

                if (btn.style.display !== 'none') {
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                    btn.style.transform = 'scale(1)';
                }
            }
        });

        parent.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                if (overlay.dataset.editing !== 'true') {
                    overlay.style.background = 'transparent';
                    overlay.style.backdropFilter = 'none';
                    overlay.style.webkitBackdropFilter = 'none';
                    overlay.style.boxShadow = 'inset 0 0 60px 40px rgba(18, 18, 18, 0)';
                    overlay.style.pointerEvents = 'none';

                    if (btn.style.display !== 'none') {
                        btn.style.opacity = '0';
                        btn.style.pointerEvents = 'none';
                        btn.style.transform = 'scale(0.9)';
                    }
                }
            }, 100);
        });

        btn.addEventListener('mouseenter', () => {
            if (overlay.dataset.editing !== 'true') {
                clearTimeout(hoverTimeout);
            }
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay && overlay.dataset.editing === 'false') {
                toggleSectionEdit(section, overlay);
            }
        });
    }

    return overlay;
}

// ==========================================
// УДАЛИТЬ ОВЕРЛЕИ
// ==========================================

function removeEditOverlays() {
    document.querySelectorAll('.edit-overlay').forEach(overlay => overlay.remove());
    document.querySelectorAll('[data-editable]').forEach(el => {
        el.contentEditable = 'false';
        el.classList.remove('editing-active');
        el.style.outline = 'none';
        el.style.outlineOffset = '0';
        el.style.backgroundColor = 'transparent';
        el.style.borderRadius = '0';
        el.style.padding = '0';
        el.style.color = '';
    });
    document.querySelectorAll('.edit-actions').forEach(el => el.remove());
}

// ==========================================
// ПЕРЕКЛЮЧЕНИЕ РЕЖИМА РЕДАКТИРОВАНИЯ
// ==========================================

async function toggleSectionEdit(section, overlay) {
    const isEditing = overlay.dataset.editing === 'true';

    if (isEditing) {
        // === СОХРАНЯЕМ В БД ===
        await saveSection(section);
        overlay.dataset.editing = 'false';
        overlay.style.background = 'transparent';
        overlay.style.backdropFilter = 'none';
        overlay.style.webkitBackdropFilter = 'none';
        overlay.style.pointerEvents = 'none';

        const btn = overlay.querySelector('.edit-overlay-btn');
        if (btn) {
            btn.style.display = 'block';
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
        }

        const actions = document.querySelector('.edit-actions');
        if (actions) actions.remove();

        document.querySelectorAll(`[data-editable^="${section}"]`).forEach(el => {
            el.contentEditable = 'false';
            el.classList.remove('editing-active');
            el.style.outline = 'none';
            el.style.outlineOffset = '0';
            el.style.backgroundColor = 'transparent';
            el.style.borderRadius = '0';
            el.style.padding = '0';
            el.style.color = '';
        });

        showNotification('✓ Изменения сохранены', 'success');
    } else {
        // === ВКЛЮЧАЕМ РЕДАКТИРОВАНИЕ ===
        closeOtherSections(overlay);

        overlay.dataset.editing = 'true';
        overlay.style.background = 'transparent';
        overlay.style.backdropFilter = 'none';
        overlay.style.webkitBackdropFilter = 'none';
        overlay.style.pointerEvents = 'none';

        const btn = overlay.querySelector('.edit-overlay-btn');
        if (btn) btn.style.display = 'none';

        const parentSection = overlay.closest('.section');
        if (parentSection) parentSection.classList.add('section-editing');

        showEditActions(section, overlay);

        document.querySelectorAll(`[data-editable^="${section}"]`).forEach(el => {
            el.contentEditable = 'true';
            el.classList.add('editing-active');
        });
    }
}

// ==========================================
// ЗАКРЫТЬ ДРУГИЕ СЕКЦИИ
// ==========================================

function closeOtherSections(currentOverlay) {
    document.querySelectorAll('.edit-overlay').forEach(overlay => {
        if (overlay !== currentOverlay && overlay.dataset.editing === 'true') {
            const section = overlay.dataset.section;
            overlay.dataset.editing = 'false';
            overlay.style.background = 'transparent';
            overlay.style.backdropFilter = 'none';
            overlay.style.webkitBackdropFilter = 'none';
            overlay.style.pointerEvents = 'none';

            const btn = overlay.querySelector('.edit-overlay-btn');
            if (btn) {
                btn.style.display = 'block';
                btn.style.opacity = '0';
                btn.style.pointerEvents = 'none';
            }

            document.querySelectorAll(`[data-editable^="${section}"]`).forEach(el => {
                el.contentEditable = 'false';
                el.classList.remove('editing-active');
                el.style.outline = 'none';
                el.style.outlineOffset = '0';
                el.style.backgroundColor = 'transparent';
                el.style.borderRadius = '0';
                el.style.padding = '0';
                el.style.color = '';
            });
        }
    });

    const actions = document.querySelector('.edit-actions');
    if (actions) actions.remove();
}

// ==========================================
// ПЛАВАЮЩИЕ КНОПКИ
// ==========================================

function showEditActions(section, overlay) {
    const oldActions = document.querySelector('.edit-actions');
    if (oldActions) oldActions.remove();

    const actions = document.createElement('div');
    actions.className = 'edit-actions';
    actions.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 12px;
        align-items: center;
        z-index: 9999;
        background: rgba(18, 18, 18, 0.92);
        backdrop-filter: blur(16px);
        padding: 14px 28px;
        border-radius: 60px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.3s ease;
    `;

    const sectionNames = {
        hero: 'Главный блок',
        about: 'Обо мне'
    };

    const indicator = document.createElement('span');
    indicator.textContent = `✎ Редактирование: ${sectionNames[section] || section}`;
    indicator.style.cssText = `
        color: #FF6B35;
        font-size: 0.85rem;
        font-weight: 600;
        margin-right: 8px;
        font-family: 'Segoe UI', sans-serif;
    `;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Сохранить';
    saveBtn.style.cssText = `
        padding: 10px 28px;
        border-radius: 40px;
        background: #FF6B35;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 600;
        font-family: 'Segoe UI', sans-serif;
        transition: transform 0.2s ease, background 0.2s ease;
    `;
    saveBtn.addEventListener('mouseenter', () => {
        saveBtn.style.transform = 'scale(1.03)';
        saveBtn.style.background = 'rgba(255, 107, 53, 0.5)';
    });
    saveBtn.addEventListener('mouseleave', () => {
        saveBtn.style.transform = 'scale(1)';
        saveBtn.style.background = 'rgba(255, 107, 53, 0.9)';
    });
    saveBtn.addEventListener('click', () => {
        toggleSectionEdit(section, overlay);
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '✕ Отмена';
    cancelBtn.style.cssText = `
        padding: 10px 28px;
        border-radius: 40px;
        background: transparent;
        color: #B0B0B0;
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 500;
        font-family: 'Segoe UI', sans-serif;
        transition: transform 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    `;
    cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.transform = 'scale(1.03)';
        cancelBtn.style.color = '#FFFFFF';
        cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
    cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.transform = 'scale(1)';
        cancelBtn.style.color = '#B0B0B0';
        cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
    cancelBtn.addEventListener('click', async () => {
        overlay.dataset.editing = 'false';
        overlay.style.background = 'transparent';
        overlay.style.backdropFilter = 'none';
        overlay.style.webkitBackdropFilter = 'none';
        overlay.style.pointerEvents = 'none';

        const btn = overlay.querySelector('.edit-overlay-btn');
        if (btn) {
            btn.style.display = 'block';
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
        }

        actions.remove();

        // Перезагружаем данные из БД (откат изменений)
        await reloadSectionData(section);

        document.querySelectorAll(`[data-editable^="${section}"]`).forEach(el => {
            el.contentEditable = 'false';
            el.classList.remove('editing-active');
            el.style.outline = 'none';
            el.style.outlineOffset = '0';
            el.style.backgroundColor = 'transparent';
            el.style.borderRadius = '0';
            el.style.padding = '0';
            el.style.color = '';
        });
    });

    actions.appendChild(indicator);
    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);
    document.body.appendChild(actions);
}

// ==========================================
// СОХРАНЕНИЕ В БД
// ==========================================

async function saveSection(section) {
    try {
        // Загружаем текущие данные из БД
        const person = await api.person.get();

        // Собираем изменения из DOM
        const updates = {};

        document.querySelectorAll(`[data-editable^="${section}"]`).forEach(el => {
            const path = el.dataset.editable; // "hero.name", "about.intro"
            const value = (el.textContent || el.innerText || '').trim();
            const field = path.split('.')[1]; // "name" или "intro"

            // Преобразуем название поля из data-editable в поле БД
            const fieldMap = {
                // Hero
                'hero.name': 'name',
                'hero.subtitle': 'short_profession',
                'hero.description': 'hero_description',
                // About
                'about.name': 'name',
                'about.experience': 'short_profession',
                'about.intro': 'bio',
                'about.description': 'description'
            };

            const dbField = fieldMap[path];
            if (dbField) {
                // Если это intro — убираем "Привет! Я ..." из начала
                if (path === 'about.intro') {
                    // Убираем часть "Привет! Я X." — оставляем только био
                    const cleanValue = value.replace(/^Привет! Я .+?\.\s*/, '');
                    updates[dbField] = cleanValue;
                } else {
                    updates[dbField] = value;
                }
            }
        });

        // Объединяем с существующими данными
        const newData = {
            name: updates.name || person.name,
            first_name: person.first_name,
            last_name: person.last_name,
            profession: person.profession,
            short_profession: updates.short_profession || person.short_profession,
            bio: updates.bio || person.bio,
            description: updates.description || person.description,
            hero_description: updates.hero_description || person.hero_description
        };

        // Отправляем в БД
        await api.person.update(newData);

        console.log(`✅ Секция "${section}" сохранена в БД`);
    } catch (err) {
        console.error('❌ Ошибка сохранения:', err);
        showNotification('❌ Не удалось сохранить', 'error');
    }
}

// ==========================================
// ПЕРЕЗАГРУЗКА ДАННЫХ СЕКЦИИ (откат)
// ==========================================

async function reloadSectionData(section) {
    try {
        const person = await api.person.get();

        if (section === 'hero') {
            const heroName = document.querySelector('[data-editable="hero.name"]');
            const heroSubtitle = document.querySelector('[data-editable="hero.subtitle"]');
            const heroDesc = document.querySelector('[data-editable="hero.description"]');

            if (heroName) heroName.textContent = person.name;
            if (heroSubtitle) heroSubtitle.textContent = person.short_profession;
            if (heroDesc) heroDesc.textContent = person.hero_description;
        }

        if (section === 'about') {
            const aboutName = document.querySelector('[data-editable="about.name"]');
            const aboutExp = document.querySelector('[data-editable="about.experience"]');
            const aboutIntro = document.querySelector('[data-editable="about.intro"]');
            const aboutDesc = document.querySelector('[data-editable="about.description"]');

            if (aboutName) aboutName.textContent = person.name;
            if (aboutExp) aboutExp.textContent = person.short_profession;
            if (aboutIntro) aboutIntro.innerHTML = `<strong>Привет! Я ${person.name}.</strong> ${person.bio}`;
            if (aboutDesc) aboutDesc.textContent = person.description;
        }
    } catch (err) {
        console.error('❌ Ошибка перезагрузки:', err);
    }
}

// ==========================================
// ВСПОМОГАТЕЛЬНОЕ
// ==========================================

export function updateEditorState() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        addEditOverlays();
    } else {
        removeEditOverlays();
    }
}

export function logoutAdmin() {
    localStorage.removeItem('isAdmin');
    removeEditOverlays();
    showNotification('👋 Вы вышли из режима администратора', 'info');

    const authBtn = document.getElementById('authOpenBtn');
    if (authBtn) {
        authBtn.textContent = '🔑 Вход';
        authBtn.style.background = '#D48B6A';
        authBtn.style.color = '#121212';
        authBtn.style.border = 'none';
    }

    const adminPanelBtn = document.getElementById('adminPanelBtn');
    if (adminPanelBtn) {
        adminPanelBtn.style.display = 'none';
    }
}

// Стили анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);