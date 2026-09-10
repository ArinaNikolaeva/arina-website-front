// ==========================================
// ДАННЫЕ ОТЗЫВОВ И УПРАВЛЕНИЕ ИМИ
// ==========================================

import { articleCategories } from './categories.js';

// ✅ ОСТАВЛЯЕМ ВАШИ ДАННЫЕ КАК ЕСТЬ
const reviewsData = [
    {
        id: 1,
        name: 'Екатерина',
        date: '15 марта 2026',
        rating: 5,
        category: articleCategories[4],
        text: 'Арина — потрясающий специалист! За несколько вчтречь мы смогли создать сайт моей мечты!! Благодарю!.',
        criteria: {
            professionalism: 5,
            empathy: 5,
            clarity: 5,
            effectiveness: 5,
            recommendation: 5
        }
    },
    {
        id: 2,
        name: 'Дмитрий',
        date: '2 февраля 2026',
        rating: 5,
        category: articleCategories[0],
        text: 'Хотел улучшить бизнес, но бюджет не такой большой как хотелось бы, а сайт нужен был качественный, Арина справилась с этой задачей и очень мне помогла',
        criteria: {
            professionalism: 5,
            empathy: 4,
            clarity: 5,
            effectiveness: 5,
            recommendation: 5
        }
    },
    {
        id: 3,
        name: 'Ольга',
        date: '20 января 2026',
        rating: 4,
        category: articleCategories[1],
        text: 'Хороший специалист. Внимательно слушает, задаёт правильные вопросы. Немного не хватило времени на проработку, но это уже индивидуально.',
        criteria: {
            professionalism: 4,
            empathy: 5,
            clarity: 4,
            effectiveness: 4,
            recommendation: 4
        }
    }
];

// ✅ ЭКСПОРТ ВАШИХ ДАННЫХ
export { reviewsData };

// === НОВЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С localStorage ===

const STORAGE_KEY = 'psychologist_reviews';

function loadReviews() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length) {
                return parsed;
            }
        } catch (e) {}
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsData));
    return JSON.parse(JSON.stringify(reviewsData));
}

function saveReviews(reviews) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function addReview({ name, text, rating, category = 'эмоции', criteria = null }) {
    const reviews = loadReviews();
    const newReview = {
        id: Date.now() + Math.random(),
        name: name.trim(),
        text: text.trim(),
        rating: Number(rating),
        category: category,
        date: new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }),
        isModerated: false,
        criteria: criteria || {
            professionalism: Number(rating),
            empathy: Number(rating),
            clarity: Number(rating),
            effectiveness: Number(rating),
            recommendation: Number(rating)
        }
    };
    reviews.push(newReview);
    saveReviews(reviews);
    return newReview;
}

export function getPublishedReviews() {
    const all = loadReviews();
    return all.filter(r => r.isModerated !== false);
}