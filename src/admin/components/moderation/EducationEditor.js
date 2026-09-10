// ==========================================
// РЕДАКТОР ОБРАЗОВАНИЯ (API)
// ==========================================

import { api } from '../../../data/api.js';
import { createModal, showNotification } from './helpers.js';

export async function openEducationEditor(sidebar) {
    // 1. Загружаем данные из БД
    let education = [];
    let certificates = [];

    try {
        [education, certificates] = await Promise.all([
            api.education.getAll(),
            api.certificates.getAll(),
        ]);
    } catch (err) {
        console.warn('⚠️ Не удалось загрузить данные:', err.message);
    }

    // 2. Открываем модалку
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
                    <textarea id="certificatesInput" rows="3">${certificates.map(c => c.title).join(', ')}</textarea>
                </div>
            </div>
            <div class="education-editor-actions">
                <button class="admin-btn admin-btn-primary" id="saveEducationBtn">Сохранить</button>
                <button class="admin-btn admin-btn-secondary" id="cancelEducationBtn">✕ Отмена</button>
            </div>
        `
    });

    // 3. Локальная копия для редактирования
    let currentEducation = education.map(item => ({ ...item }));
    let currentCertificates = certificates.map(c => ({ ...c }));

    editor.querySelector('#educationEditorClose').addEventListener('click', close);
    editor.querySelector('#cancelEducationBtn').addEventListener('click', close);

    // 4. Обработчики полей
    function attachHandlers(container, list) {
        container.querySelectorAll('.education-item-editor').forEach((el, index) => {
            el.querySelectorAll('input[data-field]').forEach(input => {
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

    // 5. Добавить запись
    editor.querySelector('#addEducationBtn').addEventListener('click', () => {
        currentEducation.push({
            id: null,        // ещё не в БД
            type: 'Курсы',
            title: '',
            specialization: '',
            year: '2026',
            icon: '◈',
            description: '',
            sort_order: currentEducation.length + 1
        });
        const list = editor.querySelector('#educationList');
        list.innerHTML = currentEducation.map((item, i) => renderEducationItem(item, i)).join('');
        attachHandlers(editor, currentEducation);
    });

    // 6. Сохранение в БД
    editor.querySelector('#saveEducationBtn').addEventListener('click', async () => {
        try {
            await saveEducationChanges(education, currentEducation);

            // Сохраняем сертификаты
            const certsText = editor.querySelector('#certificatesInput').value
                .split(',').map(c => c.trim()).filter(Boolean);
            await saveCertificatesChanges(certificates, certsText);

            // Обновляем счётчик в сайдбаре
            const educationTile = sidebar.querySelector('#educationStatTile .stat-value');
            if (educationTile) educationTile.textContent = currentEducation.length;

            showNotification('✓ Образование сохранено в БД', 'success');
            close();
        } catch (err) {
            console.error('❌ Ошибка сохранения:', err);
            showNotification('❌ Не удалось сохранить', 'error');
        }
    });
}

// ==========================================
// РЕНДЕР КАРТОЧКИ
// ==========================================

function renderEducationItem(item, index) {
    return `
        <div class="education-item-editor" data-id="${item.id || ''}">
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
        </div>
    `;
}

// ==========================================
// СОХРАНЕНИЕ ИЗМЕНЕНИЙ В БД
// ==========================================

async function saveEducationChanges(original, current) {
    const originalIds = original.map(e => e.id).filter(Boolean);
    const currentIds = current.map(e => e.id).filter(Boolean);

    // 1. Удалить те, что были удалены
    const toDelete = originalIds.filter(id => !currentIds.includes(id));
    for (const id of toDelete) {
        await api.education.delete(id);
    }

    // 2. Создать новые / обновить существующие
    for (let i = 0; i < current.length; i++) {
        const item = current[i];
        const data = {
            type: item.type,
            title: item.title,
            specialization: item.specialization,
            year: item.year,
            icon: item.icon,
            description: item.description,
            sort_order: i + 1
        };

        if (!item.id) {
            // Новый — создаём
            const created = await api.education.create(data);
            item.id = created.id; // сохраняем id для последующих операций
        } else {
            // Существующий — обновляем
            await api.education.update(item.id, data);
        }
    }
}

// ==========================================
// СЕРТИФИКАТЫ
// ==========================================

async function saveCertificatesChanges(original, currentTitles) {
    const originalTitles = original.map(c => c.title);
    const currentTitles_ = currentTitles;

    // 1. Удалить те, что убрали
    for (const cert of original) {
        if (!currentTitles_.includes(cert.title)) {
            await api.certificates.delete(cert.id);
        }
    }

    // 2. Добавить новые
    for (let i = 0; i < currentTitles_.length; i++) {
        const title = currentTitles_[i];
        if (!originalTitles.includes(title)) {
            await api.certificates.create({ title, sort_order: i + 1 });
        }
    }
}