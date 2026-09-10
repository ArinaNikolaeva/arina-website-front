// ==========================================
// РЕДАКТОР КОНТАКТОВ
// ==========================================

import { siteConfig } from '../../../data/siteConfig.js';
import { createModal, showNotification } from './helpers.js';

export function openContactsEditor(sidebar) {
    const contacts = getContacts();

    const { modal: editor, close } = createModal({
        overlayClass: 'contacts-editor-overlay',
        modalClass: 'contacts-editor',
        html: `
            <div class="contacts-editor-header">
                <h3>✎ Редактирование контактов</h3>
                <button class="contacts-editor-close" id="contactsEditorClose">✕</button>
            </div>
            <div class="contacts-editor-form">
                <div class="form-group">
                    <label for="contactTelegram">Telegram</label>
                    <input type="text" id="contactTelegram" value="${contacts.telegram || ''}" placeholder="@username">
                </div>
                <div class="form-group">
                    <label for="contactVk">ВКонтакте</label>
                    <input type="text" id="contactVk" value="${contacts.vk || ''}" placeholder="vk.com/username">
                </div>
                <div class="form-group">
                    <label for="contactEmail">Email</label>
                    <input type="email" id="contactEmail" value="${contacts.email || ''}" placeholder="email@example.com">
                </div>
                <div class="contacts-editor-actions">
                    <button type="button" class="admin-btn admin-btn-primary" id="saveContactsBtn">✎ Сохранить</button>
                    <button type="button" class="admin-btn admin-btn-secondary" id="contactsEditorCancel">✕ Отмена</button>
                </div>
            </div>
        `
    });

    editor.querySelector('#contactsEditorClose').addEventListener('click', close);
    editor.querySelector('#contactsEditorCancel').addEventListener('click', close);

    // ✅ Обработчик на КНОПКУ, а не на форму
    editor.querySelector('#saveContactsBtn').addEventListener('click', () => {
        const newContacts = {
            telegram: editor.querySelector('#contactTelegram').value.trim(),
            vk: editor.querySelector('#contactVk').value.trim(),
            email: editor.querySelector('#contactEmail').value.trim()
        };

        saveContacts(newContacts);

        // Обновляем превью в сайдбаре
        if (sidebar) {
            const previewTelegram = sidebar.querySelector('#previewTelegram');
            const previewVk = sidebar.querySelector('#previewVk');
            const previewEmail = sidebar.querySelector('#previewEmail');

            if (previewTelegram) previewTelegram.textContent = newContacts.telegram || '—';
            if (previewVk) previewVk.textContent = newContacts.vk || '—';
            if (previewEmail) previewEmail.textContent = newContacts.email || '—';
        }

        showNotification('✓ Контакты сохранены', 'success');
        close();
    });
}

// === ХЕЛПЕРЫ ===
function getContacts() {
    const saved = localStorage.getItem('siteContacts');
    if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
    }
    return { ...siteConfig.contacts };
}

function saveContacts(contacts) {
    localStorage.setItem('siteContacts', JSON.stringify(contacts));
}