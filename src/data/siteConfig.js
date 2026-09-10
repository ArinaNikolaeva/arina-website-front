// ==========================================
// КОНФИГ САЙТА — UI-СПРАВОЧНИК + ЗАГЛУШКИ
// ==========================================
// ⚠️ Внимание! Все данные (person, contacts, education, etc.)
// теперь берутся из API (БД). Этот файл — только:
// 1. SEO-мета (не меняется через админку)
// 2. Список тегов (UI-логика)
// 3. Пустые заглушки для fallback, если API недоступен
// ==========================================

export const siteConfig = {
    // === SEO (не редактируется через админку) ===
    site: {
        title: 'Арина Николаева · Веб-разработчик',
        description: 'Квалифицированный веб-разработчик. Помогаю людям реализовать их идеи и помочь бизнесу.',
        year: 2026,
        url: 'https://arinanikolaeva.ru'
    },

    // === META-ТЕГИ ===
    meta: {
        keywords: 'веб-разработчик, сайты, программист, ИРНИТУ',
        ogImage: '/images/og-image.jpg'
    },

    // === СПИСОК ТЕГОВ (UI-логика) ===
    tags: [
        '✦ ИРНИТУ (политех)',
        '✶ Веб-разработка',
        '✉︎ Сайт-визитка · Полноценный сайт · Сопровождение сайта'
    ],

    // === ЗАГЛУШКИ ДЛЯ FALLBACK (пустые!) ===
    person: {
        name: '',
        firstName: '',
        lastName: '',
        profession: '',
        shortProfession: '',
        title: '',
        age: 0,
        bio: '',
        description: '',
        heroDescription: '',
        education: [],
        certificates: []
    },

    contacts: {
        telegram: '',
        vk: '',
        email: ''
    },

    images: {
        heroBg: '',
        heroPhoto: '',
        aboutPhoto: '',
        favicon: 'images/favicon.ico'
    }
};