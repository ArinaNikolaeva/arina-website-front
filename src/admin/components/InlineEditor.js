// ==========================================
// РЕДАКТИРОВАНИЕ — ПРОСТАЯ РАБОЧАЯ ВЕРСИЯ
// ==========================================

import { siteConfig } from '../../data/siteConfig.js';

// ✅ БЕРЁМ ДАННЫЕ ИЗ siteConfig
const defaultData = {
    about: {
        name: siteConfig.person.name,
        experience: siteConfig.person.shortProfession,
        intro: siteConfig.person.bio,
        description: siteConfig.person.description
    },
    hero: {
        name: siteConfig.person.name,
        subtitle: siteConfig.person.shortProfession,
        description: siteConfig.person.heroDescription
    }
};

export function loadData() {
    const saved = localStorage.getItem('editorData');
    if (saved) {
        try { return JSON.parse(saved); } 
        catch (e) { return JSON.parse(JSON.stringify(defaultData)); }
    }
    localStorage.setItem('editorData', JSON.stringify(defaultData));
    return JSON.parse(JSON.stringify(defaultData));
}

export function saveData(data) {
    localStorage.setItem('editorData', JSON.stringify(data));
}

export function applyDataToDOM(data) {
    const heroName = document.querySelector('.hero-text h1');
    const heroSubtitle = document.querySelector('.hero-text .subtitle');
    const heroDesc = document.querySelector('.hero-text .description');
    if (heroName) heroName.textContent = data.hero.name;
    if (heroSubtitle) heroSubtitle.textContent = data.hero.subtitle;
    if (heroDesc) heroDesc.textContent = data.hero.description;

    const aboutName = document.querySelector('.about-content h3');
    const aboutExp = document.querySelector('.about-experience');
    const aboutIntro = document.querySelector('.about-content p:first-of-type');
    const aboutDesc = document.querySelector('.about-content p:last-of-type');
    if (aboutName) aboutName.textContent = data.about.name;
    if (aboutExp) aboutExp.textContent = data.about.experience;
    if (aboutIntro) aboutIntro.innerHTML = `<strong>Привет! Я ${data.about.name}.</strong> ${data.about.intro}`;
    if (aboutDesc) aboutDesc.textContent = data.about.description;
}

export function initInlineEditor() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    applyDataToDOM(loadData());
    
    if (isAdmin) {
        addEditOverlays();
    } else {
        removeEditOverlays();
    }
}

// === ДОБАВИТЬ ОВЕРЛЕИ ===
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

// === СОЗДАТЬ ОВЕРЛЕЙ ===
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
        /* ✅ Плавное растворение через box-shadow */
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

        // === НАВЕДЕНИЕ ===
        parent.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            if (overlay.dataset.editing !== 'true') {
                // Плавное затемнение с размытием
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

        // === УХОД ===
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

// === УДАЛИТЬ ОВЕРЛЕИ ===
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

// === ПЕРЕКЛЮЧЕНИЕ ===
function toggleSectionEdit(section, overlay) {
    const isEditing = overlay.dataset.editing === 'true';
    
    if (isEditing) {
        saveSection(section);
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
        
        showToast('Изменения сохранены!');
    } else {
        closeOtherSections(overlay);
        
        overlay.dataset.editing = 'true';
        overlay.style.background = 'transparent';
        overlay.style.backdropFilter = 'none';
        overlay.style.webkitBackdropFilter = 'none';
        overlay.style.pointerEvents = 'none';
        
        const btn = overlay.querySelector('.edit-overlay-btn');
        if (btn) {
            btn.style.display = 'none';
        }
        
        const parentSection = overlay.closest('.section');
        if (parentSection) {
            parentSection.classList.add('section-editing');
        }
        
        showEditActions(section, overlay);
        
        document.querySelectorAll(`[data-editable^="${section}"]`).forEach(el => {
            el.contentEditable = 'true';
            el.classList.add('editing-active');
        });
    }
}

// === ЗАКРЫТЬ ВСЕ ДРУГИЕ СЕКЦИИ ===
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

// === ПЛАВАЮЩИЕ КНОПКИ ===
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
    cancelBtn.addEventListener('click', () => {
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
        applyDataToDOM(loadData());
        
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

// === СОХРАНЕНИЕ ===
function saveSection(section) {
    const data = loadData();
    const editableElements = document.querySelectorAll(`[data-editable^="${section}"]`);
    
    editableElements.forEach(el => {
        const path = el.dataset.editable;
        const value = el.textContent || el.innerText || '';
        const keys = path.split('.');
        const lastKey = keys.pop();
        const obj = keys.reduce((acc, key) => acc[key] = acc[key] || {}, data);
        obj[lastKey] = value.trim();
    });
    
    saveData(data);
    applyDataToDOM(data);
}

export function updateEditorState() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        addEditOverlays();
    } else {
        removeEditOverlays();
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(45, 107, 79, 0.9);
        color: white;
        padding: 14px 32px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        animation: slideUp 0.4s ease;
        font-family: 'Segoe UI', sans-serif;
        font-size: 0.95rem;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

export function logoutAdmin() {
    localStorage.removeItem('isAdmin');
    removeEditOverlays();
    showToast('👋 Вы вышли из режима администратора');
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

// Стили
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);