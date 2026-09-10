// ==========================================
// ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ
// ==========================================

// === LAYOUT ===
import { renderHeader, initHeader } from '../ui/layouts/Header.js';
import { renderFooter, initFooter } from '../ui/layouts/Footer.js';

// === PAGES ===
import { renderHero, initHero } from '../ui/pages/Hero.js';
import { renderAbout, initAbout } from '../ui/pages/About.js';
import { renderArticles, initArticles } from '../ui/pages/Articles.js';
import { renderReviews, initReviews } from '../ui/pages/Reviews.js';
import { renderFAQ, initFAQPage } from '../ui/pages/FAQ.js';

// === COMPONENTS ===
import { initCarousel } from '../ui/components/Carousel.js';
import { initModals } from '../ui/components/Modal.js';
import { initFAQ } from '../ui/components/FAQ.js';

// === ADMIN ===
import { initAuthModal, updateHeaderButtons } from '../admin/components/AuthModal.js';
import { initInlineEditor } from '../admin/components/InlineEditor.js';
import { initAdminPanel } from '../admin/components/AdminPanel.js';

// === DATA ===
import { api } from '../data/api.js';

// ==========================================
// ГЛАВНАЯ ФУНКЦИЯ
// ==========================================

export async function initApp() {
    try {
        // 1. Загружаем данные (API → fallback на siteConfig)
        const data = await loadData();

        // 2. Рендерим каркас
        renderLayout();

        // 3. Рендерим секции
        renderSections();

        // 4. Заполняем секции данными
        initHero(data.person, data.images);
        await initArticles();
        await initReviews();
        await initFAQPage();
        initAbout();

        // 5. Инициализируем модули
        initModules(data);

        // 6. Инициализируем утилиты
        initUtils();

        // 7. Привязываем контакты
        bindContacts(data.contacts);

        console.log('🚀 Сайт Арины Николаевой загружен!');
    } catch (err) {
        console.error('❌ Ошибка загрузки сайта:', err);
    }
}

// ==========================================
// ЗАГРУЗКА ДАННЫХ
// ==========================================

async function loadData() {
    const [person, contacts, images, stats] = await Promise.all([
        api.person.get(),
        api.contacts.get(),
        api.images.getAll(),
        api.stats.get(),
    ]);
    return { person, contacts, images, stats };
}

// ==========================================
// РЕНДЕР КАРКАСА
// ==========================================

function renderLayout() {
    document.body.insertAdjacentHTML('afterbegin', renderHeader());
    document.body.insertAdjacentHTML('beforeend', renderFooter());

    const main = document.createElement('main');
    document.body.insertBefore(main, document.querySelector('footer'));
}

// ==========================================
// РЕНДЕР СЕКЦИЙ
// ==========================================

function renderSections() {
    const main = document.querySelector('main');

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
}

// ==========================================
// ИНИЦИАЛИЗАЦИЯ МОДУЛЕЙ
// ==========================================

function initModules(data) {
    initCarousel('carouselTrack', 'carouselPrev', 'carouselNext', 'carouselDots');
    initCarousel('reviewsTrack', 'reviewsPrev', 'reviewsNext', 'reviewsDots');

    initModals();
    initFAQ();

    initAuthModal();
    updateHeaderButtons();
    initInlineEditor();
    initAdminPanel();

    initHeader(data.person);   // ✅ теперь data доступна
    initFooter();
}
// ==========================================
// УТИЛИТЫ
// ==========================================

function initUtils() {
    initScrollTopButton();
    initSmoothScroll();
    initScrollAnimations();
}

function initScrollTopButton() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        scrollBtn.classList.toggle('visible', window.scrollY > 400);
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
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
}

function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.style.animationDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay * 1000);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
}

// ==========================================
// КОНТАКТЫ
// ==========================================

function bindContacts(contacts) {
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
}