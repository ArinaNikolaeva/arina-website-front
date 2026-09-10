// ==========================================
// МОДАЛКИ ДЛЯ СТАТЕЙ И ОТЗЫВОВ (API)
// ==========================================

import { api } from '../../data/api.js';

export function initModals() {
    // ==========================================
    // МОДАЛКА ДЛЯ СТАТЕЙ
    // ==========================================
    const modal = document.getElementById('articleModal');
    const closeBtn = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalCategory = document.getElementById('modalCategory');
    const modalTitle = document.getElementById('modalTitle');
    const modalMeta = document.getElementById('modalMeta');
    const modalText = document.getElementById('modalText');

    // Кэш статей (чтобы не делать запрос на каждый клик)
    let articlesCache = null;

    async function getArticles() {
        if (!articlesCache) {
            try {
                articlesCache = await api.articles.getAll();
            } catch (err) {
                console.error('❌ Ошибка загрузки статей:', err);
                return [];
            }
        }
        return articlesCache;
    }

    async function openArticle(id) {
        const articles = await getArticles();
        const article = articles.find(a => a.id === id);
        if (!article) return;

        modalImage.src = article.image;
        modalImage.alt = article.title;
        modalCategory.textContent = article.category;
        modalTitle.textContent = article.title;
        modalMeta.textContent = `${article.date} · ${article.reading_time}`;
        modalText.innerHTML = article.content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // === ОТКРЫТИЕ ПО КЛИКУ НА КАРТОЧКУ ===
    document.addEventListener('click', async (e) => {
        const card = e.target.closest('.article-card');
        if (card) {
            const id = parseInt(card.dataset.articleId);
            if (!isNaN(id)) {
                await openArticle(id);
            }
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });

    // ==========================================
    // МОДАЛКА ДЛЯ ОТЗЫВОВ
    // ==========================================
    const rModal = document.getElementById('reviewModal');
    const rClose = document.getElementById('reviewModalClose');
    const rName = document.getElementById('reviewModalName');
    const rStars = document.getElementById('reviewModalStars');
    const rText = document.getElementById('reviewModalText');
    const rDate = document.getElementById('reviewModalDate');
    const rDetails = document.getElementById('reviewModalDetails');

    const detailLabels = {
        professionalism: 'Профессионализм',
        empathy: 'Эмпатия и внимание',
        clarity: 'Чёткость объяснений',
        effectiveness: 'Эффективность работы',
        recommendation: 'Готовность рекомендовать'
    };

    // Кэш отзывов
    let reviewsCache = null;

    async function getReviews() {
        if (!reviewsCache) {
            try {
                reviewsCache = await api.reviews.getPublished();
            } catch (err) {
                console.error('❌ Ошибка загрузки отзывов:', err);
                return [];
            }
        }
        return reviewsCache;
    }

    async function openReview(id) {
        const reviews = await getReviews();
        const review = reviews.find(r => r.id === id);
        if (!review) return;

        if (rName) rName.textContent = review.name;
        if (rStars) rStars.textContent = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        if (rText) rText.textContent = review.text;
        if (rDate) rDate.textContent = review.date;

        // Детальная оценка по критериям
        if (rDetails && review.criteria) {
            rDetails.innerHTML = Object.entries(review.criteria).map(([key, value]) => `
                <div class="modal-detail-item">
                    <span class="modal-detail-label">${detailLabels[key] || key}</span>
                    <span class="modal-detail-stars">${'★'.repeat(value)}${'☆'.repeat(5 - value)}</span>
                </div>
            `).join('');
        } else if (rDetails) {
            rDetails.innerHTML = '';
        }

        rModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeReviewModal() {
        rModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', async (e) => {
        const reviewCard = e.target.closest('.review-card');
        if (reviewCard) {
            const id = parseInt(reviewCard.dataset.reviewId);
            if (!isNaN(id)) {
                await openReview(id);
            }
        }
    });

    if (rClose) rClose.addEventListener('click', closeReviewModal);
    if (rModal) {
        rModal.addEventListener('click', (e) => {
            if (e.target === rModal) closeReviewModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && rModal?.classList.contains('active')) {
            closeReviewModal();
        }
    });

    console.log('✅ Модалки инициализированы');
}