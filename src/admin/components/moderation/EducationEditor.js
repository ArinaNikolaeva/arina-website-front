// ==========================================
// РЕДАКТОР ОБРАЗОВАНИЯ
// ==========================================

import { siteConfig } from '../../../data/siteConfig.js';
import { createModal, showNotification } from './helpers.js';

export function openEducationEditor(sidebar) {
    const education = getEducation();
    const certificates = getCertificates();

    const { modal: editor, close } = createModal({
        overlayClass: 'education-editor-overlay',
        modalClass: 'education-editor',
        html: `
            <div class="education-editor-header">
                <h3>✎ Редактирование образования</h3>
                <button class="education-editor-close" id="educationEditorClose">✕</button>
            </div>
            <div class="education-editor-body">
                <div class="education-editor-list" id="educationList">
                    ${education.map((item, index) => renderEducationItem(item, index)).join('')}
                </div>
                <button class="admin-btn admin-btn-secondary" id="addEducationBtn" style="margin-top: 12px;">
                    + Добавить запись
                </button>
                <div class="education-editor-divider"></div>
                <div class="form-group">
                    <label>Сертификаты (через запятую)</label>
                    <textarea id="certificatesInput" rows="3">${certificates.join(', ')}</textarea>
                </div>
            </div>
            <div class="education-editor-actions">
                <button class="admin-btn admin-btn-primary" id="saveEducationBtn">Сохранить</button>
                <button class="admin-btn admin-btn-secondary" id="cancelEducationBtn">✕ Отмена</button>
            </div>
        `
    });

    let currentEducation = [...education];

    editor.querySelector('#educationEditorClose').addEventListener('click', close);
    editor.querySelector('#cancelEducationBtn').addEventListener('click', close);

    function attachHandlers(container, list) {
        container.querySelectorAll('.education-item-editor').forEach((el, index) => {
            el.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', () => {
                    list[index][input.dataset.field] = input.value;
                });
            });

            el.querySelector('.education-remove')?.addEventListener('click', () => {
                list.splice(index, 1);
                const listEl = container.querySelector('#educationList');
                listEl.innerHTML = list.map((item, i) => renderEducationItem(item, i)).join('');
                attachHandlers(container, list);
            });
        });
    }

    attachHandlers(editor, currentEducation);

    editor.querySelector('#addEducationBtn').addEventListener('click', () => {
        currentEducation.push({
            type: 'Курсы',
            title: 'Название',
            specialization: 'Специализация',
            year: '2026',
            icon: '◈',
            description: ''
        });
        const list = editor.querySelector('#educationList');
        list.innerHTML = currentEducation.map((item, i) => renderEducationItem(item, i)).join('');
        attachHandlers(editor, currentEducation);
    });

    editor.querySelector('#saveEducationBtn').addEventListener('click', () => {
        saveEducation(currentEducation);
        const certs = editor.querySelector('#certificatesInput').value
            .split(',').map(c => c.trim()).filter(Boolean);
        saveCertificates(certs);

        const educationTile = sidebar.querySelector('#educationStatTile .stat-value');
        if (educationTile) educationTile.textContent = currentEducation.length;

        showNotification('✓ Образование сохранено', 'success');
        close();
    });
}

function renderEducationItem(item, index) {
    return `
        <div class="education-item-editor">
            <div class="education-item-editor-header">
                <span>Запись ${index + 1}</span>
                <button type="button" class="education-remove" title="Удалить">✕</button>
            </div>
            <div class="education-item-editor-grid">
                <input type="text" data-field="icon" value="${item.icon || '◈'}" placeholder="◈" maxlength="2">
                <input type="text" data-field="type" value="${item.type || ''}" placeholder="Тип (Курсы)">
                <input type="text" data-field="year" value="${item.year || ''}" placeholder="Год">
            </div>
            <input type="text" data-field="title" value="${item.title || ''}" placeholder="Название учебного заведения" style="margin-top: 10px;">
            <input type="text" data-field="specialization" value="${item.specialization || ''}" placeholder="Специализация" style="margin-top: 10px;">
            <input type="text" data-field="description" value="${item.description || ''}" placeholder="Описание (необязательно)" style="margin-top: 10px;">
            <div class="education-file-upload">
                <div class="education-file-label"><span>Прикрепить документ</span></div>
                <div class="education-file-dropzone" data-index="${index}">
                    <span class="education-file-placeholder">Перетащите файл сюда или нажмите для выбора</span>
                    <span class="education-file-hint">PDF, JPG, PNG · до 5 МБ</span>
                </div>
                <div class="education-file-preview" id="filePreview-${index}"></div>
            </div>
        </div>
    `;
}

// === ХЕЛПЕРЫ ===
function getEducation() {
    const saved = localStorage.getItem('siteEducation');
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    return siteConfig.person.education || [];
}

function saveEducation(education) {
    localStorage.setItem('siteEducation', JSON.stringify(education));
}

function getCertificates() {
    const saved = localStorage.getItem('siteCertificates');
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    return siteConfig.person.certificates || [];
}

function saveCertificates(certificates) {
    localStorage.setItem('siteCertificates', JSON.stringify(certificates));
}