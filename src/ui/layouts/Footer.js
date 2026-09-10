// ==========================================
// FOOTER
// ==========================================

import { siteConfig } from '../../data/siteConfig.js';

export function renderFooter() {
    const person = siteConfig.person;
    const site = siteConfig.site;

    return `
        <footer class="footer">
            <div class="container footer-inner">
                <div>© ${site.year} ${person.name} · ${person.shortProfession}</div>
                <div>
                    <a href="#" id="footerTelegram">Telegram</a>
                    <a href="#" id="footerVK">ВКонтакте</a>
                    <a href="#" id="footerEmail">Email</a>
                </div>
            </div>
        </footer>
    `;
}

export function initFooter() {
    const contacts = siteConfig.contacts;
    
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