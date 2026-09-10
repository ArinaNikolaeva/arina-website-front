// ==========================================
// МОДЕРАЦИЯ FAQ + РЕДАКТОР (API)
// ==========================================

import { api } from '../../../data/api.js';
import { createModal, showNotification } from './helpers.js';

export async function openFaqModeration() {
    // 1. Загружаем FAQ из БД
    let allFaq = [];
    try {
        allFaq = await api.faq.getAll();
    } catch (err) {
        console.warn('⚠️ Не удалось загрузить FAQ:', err.message);
    }

    // 2. Открываем модалку
    const { modal, close } = createModal({
        overlayClass: 'faq-moderation-overlay',
        modalClass: 'faq-moderation',
        html: `
            <div class="faq-moderation-header">
                <h3>? Управление FAQ</h3>
                <button class="faq-moderation-close" id="faqModerationClose">✕</button>
            </div>
            <div class="faq-moderation-toolbar">
                <button class="admin-btn admin-btn-primary" id="createFaqBtn">+ Добавить вопрос</button>
            </div>
            <div class="faq-moderation-body">
                ${renderFaqList(allFaq)}
            </div>
        `
    });

    modal.querySelector('#faqModerationClose').addEventListener('click', close);

    // 3. Создать новый
    modal.querySelector('#createFaqBtn').addEventListener('click', () => {
        close();
        setTimeout(() => openFaqEditor(null), 350);
    });

    // 4. Открыть на редактирование
    modal.querySelectorAll('.faq-moderation-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.faq-moderation-actions')) return;
            const id = parseInt(card.dataset.id);
            const item = allFaq.find(f => f.id === id);
            if (item) {
                close();
                setTimeout(() => openFaqEditor(item), 350);
            }
        });
    });

    // 5. Удалить
    modal.querySelectorAll('.faq-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!confirm('Удалить этот вопрос?')) return;

            const id = parseInt(btn.dataset.id);
            try {
                await api.faq.delete(id);
                showNotification('⊘ Вопрос удалён из БД', 'success');
                close();
                setTimeout(openFaqModeration, 350);
            } catch (err) {
                console.error('❌ Ошибка удаления:', err);
                showNotification('❌ Не удалось удалить', 'error');
            }
        });
    });
}

// ==========================================
// РЕНДЕР СПИСКА
// ==========================================

function renderFaqList(faq) {
    if (!faq.length) {
        return `
            <div class="faq-empty">
                <span class="faq-empty-icon">?</span>
                <p>Пока нет вопросов. Добавьте первый!</p>
            </div>
        `;
    }

    return `
        <div class="faq-moderation-list">
            ${faq.map(item => `
                <div class="faq-moderation-card" data-id="${item.id}">
                    <div class="faq-moderation-number">${item.id}</div>
                    <div class="faq-moderation-content">
                        <h4 class="faq-moderation-question">${item.question}</h4>
                        <p class="faq-moderation-answer">${item.answer}</p>
                    </div>
                    <div class="faq-moderation-actions">
                        <button class="faq-delete" data-id="${item.id}" title="Удалить">✕</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ==========================================
// РЕДАКТОР FAQ
// ==========================================

function openFaqEditor(item = null) {
    const isNew = !item;
    const currentItem = item || { id: null, question: '', answer: '' };

    const { modal: editor, close } = createModal({
        overlayClass: 'faq-editor-overlay',
        modalClass: 'faq-editor',
        html: `
            <div class="faq-editor-header">
                <h3>${isNew ? '+ Новый вопрос' : '✎ Редактирование вопроса'}</h3>
                <button class="faq-editor-close" id="faqEditorClose">✕</button>
            </div>
            <div class="faq-editor-body">
                <div class="faq-editor-group">
                    <label>Вопрос</label>
                    <input type="text" id="faqQuestion" value="${currentItem.question}">
                </div>
                <div class="faq-editor-group">
                    <label>Ответ</label>
                    <textarea id="faqAnswer" rows="8">${currentItem.answer}</textarea>
                </div>
            </div>
            <div class="faq-editor-actions">
                <button class="admin-btn admin-btn-primary" id="saveFaqBtn">${isNew ? 'Создать' : 'Сохранить'}</button>
                <button class="admin-btn admin-btn-secondary" id="cancelFaqBtn">✕ Отмена</button>
            </div>
        `
    });

    editor.querySelector('#faqEditorClose').addEventListener('click', close);
    editor.querySelector('#cancelFaqBtn').addEventListener('click', close);

    // === СОХРАНЕНИЕ В БД ===
    editor.querySelector('#saveFaqBtn').addEventListener('click', async () => {
        const data = {
            question: editor.querySelector('#faqQuestion').value.trim() || 'Без вопроса',
            answer: editor.querySelector('#faqAnswer').value.trim() || 'Без ответа',
            sort_order: 0
        };

        try {
            if (isNew) {
                await api.faq.create(data);
                showNotification('✓ Вопрос создан в БД', 'success');
            } else {
                await api.faq.update(currentItem.id, data);
                showNotification('✓ Вопрос сохранён в БД', 'success');
            }

            close();
            setTimeout(openFaqModeration, 350);
        } catch (err) {
            console.error('❌ Ошибка сохранения:', err);
            showNotification('❌ Не удалось сохранить', 'error');
        }
    });
}