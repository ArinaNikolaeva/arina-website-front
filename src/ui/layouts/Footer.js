// ==========================================
// FOOTER
// ==========================================

import { api } from '../../data/api.js';

export function renderFooter() {
    const year = new Date().getFullYear();

    return `
        <footer class="footer">
            <div class="container footer-inner">
                <div id="footerCopyright">© ${year} · Все права защищены</div>
                <div>
                    <a href="#" id="footerTelegram">Telegram</a>
                    <a href="#" id="footerVK">ВКонтакте</a>
                    <a href="#" id="footerEmail">Email</a>
                </div>
            </div>
        </footer>
    `;
}

// === ЗАГРУЗКА ИМЕНИ И КОНТАКТОВ ИЗ БД ===
export async function initFooter(person, contacts) {
    // === Копирайт ===
    const copyright = document.getElementById('footerCopyright');
    if (copyright && person) {
        const year = new Date().getFullYear();
        copyright.textContent = `© ${year} ${person.name} · ${person.short_profession}`;
    }

    // === Контакты ===
    if (contacts) {
        document.getElementById('footerTelegram')?.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`Telegram: ${contacts.telegram}`);
        });

        document.getElementById('footerVK')?.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`ВКонтакте: ${contacts.vk}`);
        });

        document.getElementById('footerEmail')?.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`Email: ${contacts.email}`);
        });
    }
}