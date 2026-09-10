// ==========================================
// ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ
// ==========================================

import { renderHeader } from '../ui/layouts/Header.js';
import { renderFooter } from '../ui/layouts/Footer.js';
import { initHeader } from '../ui/layouts/Header.js';
import { initFooter } from '../ui/layouts/Footer.js';
import { renderHero } from '../ui/pages/Hero.js';
import { renderAbout, initAbout } from '../ui/pages/About.js';
import { renderArticles } from '../ui/pages/Articles.js';
import { renderReviews } from '../ui/pages/Reviews.js';
import { renderFAQ } from '../ui/pages/FAQ.js';
import { initCarousel } from '../ui/components/Carousel.js';
import { initModals } from '../ui/components/Modal.js';
import { initFAQ } from '../ui/components/FAQ.js';

import { initAuthModal, updateHeaderButtons } from '../admin/components/AuthModal.js';
import { initInlineEditor } from '../admin/components/InlineEditor.js';
import { initAdminPanel } from '../admin/components/AdminPanel.js';

import { initHome } from '../ui/pages/Home.js';
import { siteConfig } from '../data/siteConfig.js';



export function initApp() {
    // Рендерим хедер и футер
    document.body.insertAdjacentHTML('afterbegin', renderHeader());
    document.body.insertAdjacentHTML('beforeend', renderFooter());

    // Создаём main
    const main = document.createElement('main');
    document.body.insertBefore(main, document.querySelector('footer'));

    // Рендерим все секции
    main.innerHTML = `
        ${renderHero()}

        <section class="section section-about" id="about">
            <div class="container">
                <h2 class="section-title animate-on-scroll">Об авторе</h2>
                ${renderAbout()}
            </div>
        </section>

        <section class="section section-articles" id="articles">
            <div class="section-bg" style="background-image: url('images/articles-bg.jpg');"></div>
            <div class="section-overlay"></div>
            <div class="container">
                <h2 class="section-title animate-on-scroll">Статьи</h2>
                ${renderArticles()}
            </div>
        </section>

        <section class="section section-reviews" id="reviews">
            <div class="container">
                <h2 class="section-title animate-on-scroll">Отзывы</h2>
                ${renderReviews()}
            </div>
        </section>

        <section class="section section-faq" id="faq">
            <div class="section-bg" style="background-image: url('images/faq-bg.jpg');"></div>
            <div class="section-overlay"></div>
            <div class="container">
                <h2 class="section-title animate-on-scroll">Часто задаваемые вопросы</h2>
                ${renderFAQ()}
            </div>
        </section>

        <section class="section section-contacts" id="contacts">
            <div class="container">
                <h2 class="section-title animate-on-scroll">Свяжитесь со мной</h2>
                <p class="contacts-desc animate-on-scroll" style="animation-delay: 0.05s;">
                    Напишите мне в удобном мессенджере — я отвечу в течение 24 часов.
                </p>
                <div class="messengers animate-on-scroll" style="animation-delay: 0.1s;">
                    <a href="#" class="messenger" id="contactTelegram">Telegram</a>
                    <a href="#" class="messenger" id="contactVK">ВКонтакте</a>
                    <a href="#" class="messenger" id="contactEmail">Email</a>
                </div>
            </div>
        </section>
    `;

    // ИНИЦИАЛИЗАЦИЯ
    // ИНИЦИАЛИЗАЦИЯ КАРУСЕЛЕЙ
    initCarousel('carouselTrack', 'carouselPrev', 'carouselNext', 'carouselDots');
    initCarousel('reviewsTrack', 'reviewsPrev', 'reviewsNext', 'reviewsDots');
    initModals();
    initFAQ();
    initAuthModal();
    updateHeaderButtons();
    initInlineEditor();
    initAdminPanel();
    initHome();
    initAbout();
    initHeader();
    initFooter();

    // Замените блок "КОНТАКТЫ" на этот:
    // === КОНТАКТЫ (с учётом сохранённых) ===
    const savedContacts = localStorage.getItem('siteContacts');
    const contacts = savedContacts ? JSON.parse(savedContacts) : siteConfig.contacts;

    document.getElementById('contactTelegram')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`Telegram: ${contacts.telegram}`);
    });
    document.getElementById('contactVK')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`ВКонтакте: ${contacts.vk}`);
    });
    document.getElementById('contactEmail')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`Email: ${contacts.email}`);
    });

    // КНОПКА "НАВЕРХ"
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            scrollBtn.classList.toggle('visible', window.scrollY > 400);
        });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ПЛАВНАЯ ПРОКРУТКА
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // АНИМАЦИИ ПРИ СКРОЛЛЕ
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.style.animationDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 1000);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    console.log('🚀 Сайт Арины Николаевой загружен!');
}