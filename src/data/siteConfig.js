// ==========================================
// ЕДИНЫЙ КОНФИГ САЙТА
// ==========================================

export const siteConfig = {
    // === ОСНОВНАЯ ИНФОРМАЦИЯ ===
    site: {
        title: 'Арина Николаева · Веб-разработчик',
        description: 'Квалифицированный веб-разработчик. Помогаю людям реализовать их идеи и помочь бизнесу.',
        year: 2026,
        url: 'https://arinanikolaeva.ru'
    },

    // === ПЕРСОНАЛЬНЫЕ ДАННЫЕ ===
    person: {
        name: 'Арина Николаева',
        firstName: 'Арина',
        lastName: 'Николаева',
        profession: 'Веб-разработчик · Молодой специалист',
        shortProfession: 'Веб-разработка · Молодой специалист',
        title: 'Веб-разработчик',
        age: 22,
        bio: 'Мне 22 года, я закончила ИРНИТУ (политех). Моя специализация — информационные системы и технологии.',
        description: 'Универсальный специалист по разработке сайтов, помогу с нуля создать инструмент для продвижения бизнеса',
        heroDescription: 'Квалифицированный программист. Помогаю людям реализовать их идеи и помочь бизнесу.',

        // ✅ ОБРАЗОВАНИЕ
        education: [
            {
                type: 'Университет',
                title: 'ИРНИТУ (политех)',
                specialization: 'Информационные системы и технологии',
                year: '2022 — 2026',
                icon: '◈',
                description: 'Бакалавриат'
            },
            {
                type: 'Курсы',
                title: 'Яндекс.Практикум',
                specialization: 'Веб-разработка',
                year: '2025',
                icon: '✦',
                description: 'Fullstack-разработчик'
            },
            {
                type: 'Курсы',
                title: 'Skillbox',
                specialization: 'UI/UX дизайн',
                year: '2024',
                icon: '✎',
                description: 'Дизайн интерфейсов'
            }
        ],

        // ✅ СЕРТИФИКАТЫ (кратко)
        certificates: [
            'Веб-разработчик · Яндекс.Практикум',
            'UI/UX дизайнер · Skillbox',
            'Основы JavaScript · Stepik'
        ]
    },

    // === КОНТАКТЫ ===
    contacts: {
        telegram: '@arina_psychologist',
        vk: 'vk.com/arina_psychologist',
        email: 'arina@psychologist.ru'
    },

    // === МЕТА-ТЕГИ ===
    meta: {
        keywords: 'веб-разработчик, сайты, программист, ИРНИТУ',
        ogImage: '/images/og-image.jpg'
    },

    // === ИЗОБРАЖЕНИЯ ===
    images: {
        heroBg: 'images/hero-bg.jpg',
        heroPhoto: 'images/hero-photo.jpg',
        aboutPhoto: 'images/about-photo.jpg',
        favicon: 'images/favicon.ico'
    },

    // === СПИСОК ТЕГОВ / КАТЕГОРИЙ ===
    tags: [
        '✦ ИРНИТУ (политех)',
        '✶ Веб-разработка',
        '✉︎ Сайт-визитка · Полноценный сайт · Сопровождение сайта'
    ]
};