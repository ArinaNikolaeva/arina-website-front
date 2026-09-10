// ==========================================
// МОДЕРАЦИЯ СТАТЕЙ + РЕДАКТОР (API)
// ==========================================

import { api } from '../../../data/api.js';
import { createModal, showNotification } from './helpers.js';

export async function openArticlesModeration() {
    // 1. Загружаем статьи из БД
    let allArticles = [];
    try {
        allArticles = await api.articles.getAll();
    } catch (err) {
        console.warn('⚠️ Не удалось загрузить статьи:', err.message);
    }

    // 2. Открываем модалку
    const { modal, close } = createModal({
        overlayClass: 'articles-moderation-overlay',
        modalClass: 'articles-moderation',
        html: `
            <div class="articles-moderation-header">
                <h3>◈ Управление статьями</h3>
                <button class="articles-moderation-close" id="articlesModerationClose">✕</button>
            </div>
            <div class="articles-moderation-toolbar">
                <button class="admin-btn admin-btn-primary" id="createArticleBtn">
                    + Создать новую статью
                </button>
            </div>
            <div class="articles-moderation-body">
                ${renderArticlesList(allArticles)}
            </div>
        `
    });

    modal.querySelector('#articlesModerationClose').addEventListener('click', close);

    // 3. Создать новую
    modal.querySelector('#createArticleBtn').addEventListener('click', () => {
        close();
        setTimeout(() => openArticleEditor(null), 350);
    });

    // 4. Открыть на редактирование
    modal.querySelectorAll('.article-moderation-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.article-moderation-actions')) return;
            const id = parseInt(card.dataset.id);
            const article = allArticles.find(a => a.id === id);
            if (article) {
                close();
                setTimeout(() => openArticleEditor(article), 350);
            }
        });
    });

    // 5. Удалить
    modal.querySelectorAll('.article-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!confirm('Удалить эту статью?')) return;

            const id = parseInt(btn.dataset.id);
            try {
                await api.articles.delete(id);
                showNotification('⊘ Статья удалена из БД', 'success');
                close();
                setTimeout(openArticlesModeration, 350);
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

function renderArticlesList(articles) {
    if (!articles.length) {
        return `
            <div class="articles-empty">
                <span class="articles-empty-icon">◈</span>
                <p>Пока нет статей. Создайте первую!</p>
            </div>
        `;
    }

    return `
        <div class="articles-moderation-list">
            ${articles.map(article => `
                <div class="article-moderation-card" data-id="${article.id}">
                    <div class="article-moderation-image" style="background-image: url('${article.image}');"></div>
                    <div class="article-moderation-content">
                        <div class="article-moderation-category">${article.category}</div>
                        <h4 class="article-moderation-title">${article.title}</h4>
                        <p class="article-moderation-preview">${article.preview}</p>
                        <div class="article-moderation-meta">
                            <span>${article.date}</span>
                            <span>·</span>
                            <span>${article.reading_time}</span>
                            <span class="article-moderation-status ${article.is_published === 0 ? 'draft' : 'published'}">
                                ${article.is_published === 0 ? '◌ Черновик' : '● Опубликовано'}
                            </span>
                        </div>
                    </div>
                    <div class="article-moderation-actions">
                        <button class="article-delete" data-id="${article.id}" title="Удалить">✕</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ==========================================
// РЕДАКТОР СТАТЬИ
// ==========================================

function openArticleEditor(article = null) {
    const isNew = !article;
    const currentArticle = article || {
        id: null,
        title: '',
        category: 'Веб-разработка',
        date: new Date().toLocaleDateString('ru-RU'),
        reading_time: '5 мин чтения',
        image: 'images/article-1.jpg',
        preview: '',
        content: '',
        is_published: 1
    };

    const categories = ['Веб-разработка', 'Дизайн', 'Поддержка и SEO', 'Бизнес', 'Сайты-визитки', 'Лендинги'];

    const { modal: editor, close } = createModal({
        overlayClass: 'article-editor-overlay',
        modalClass: 'article-editor',
        html: `
            <div class="article-editor-header">
                <h3>${isNew ? '+ Новая статья' : '✎ Редактирование статьи'}</h3>
                <button class="article-editor-close" id="articleEditorClose">✕</button>
            </div>

            <div class="article-editor-body">
                <div class="article-editor-fields">
                    <div class="article-editor-group">
                        <label>Заголовок</label>
                        <input type="text" id="articleTitle" value="${currentArticle.title}" placeholder="Название статьи">
                    </div>
                    <div class="article-editor-row">
                        <div class="article-editor-group">
                            <label>Категория</label>
                            <select id="articleCategory">
                                ${categories.map(cat => `
                                    <option value="${cat}" ${currentArticle.category === cat ? 'selected' : ''}>${cat}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="article-editor-group">
                            <label>Время чтения</label>
                            <input type="text" id="articleReadingTime" value="${currentArticle.reading_time}" placeholder="5 мин чтения">
                        </div>
                    </div>
                    <div class="article-editor-group">
                        <label>Дата</label>
                        <input type="text" id="articleDate" value="${currentArticle.date}" placeholder="10.09.2026">
                    </div>
                    <div class="article-editor-group">
                        <label>Превью (краткое описание)</label>
                        <textarea id="articlePreview" rows="3">${currentArticle.preview}</textarea>
                    </div>
                    <div class="article-editor-group">
                        <label>Текст статьи (HTML)</label>
                        <textarea id="articleContent" rows="12">${currentArticle.content}</textarea>
                    </div>
                </div>

                <div class="article-editor-sidebar">
                    <div class="article-editor-group">
                        <label>Обложка статьи</label>
                        <div class="article-image-preview" id="articleImagePreview" style="background-image: url('${currentArticle.image}');"></div>
                        <input type="text" id="articleImage" value="${currentArticle.image}" placeholder="images/article-1.jpg" style="margin-top: 10px;">
                    </div>
                    <div class="article-editor-group">
                        <label>Статус</label>
                        <div class="article-status-toggle">
                            <button class="status-btn ${currentArticle.is_published !== 0 ? 'active' : ''}" data-status="published">● Опубликовано</button>
                            <button class="status-btn ${currentArticle.is_published === 0 ? 'active' : ''}" data-status="draft">◌ Черновик</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="article-editor-actions">
                <button class="admin-btn admin-btn-primary" id="saveArticleBtn">
                    ${isNew ? 'Создать' : 'Сохранить'}
                </button>
                <button class="admin-btn admin-btn-secondary" id="cancelArticleBtn">✕ Отмена</button>
            </div>
        `
    });

    let currentStatus = currentArticle.is_published !== 0;

    editor.querySelector('#articleEditorClose').addEventListener('click', close);
    editor.querySelector('#cancelArticleBtn').addEventListener('click', close);

    // Переключение статуса
    editor.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            editor.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentStatus = btn.dataset.status === 'published';
        });
    });

    // Превью картинки
    const imageInput = editor.querySelector('#articleImage');
    const imagePreview = editor.querySelector('#articleImagePreview');
    imageInput.addEventListener('input', () => {
        imagePreview.style.backgroundImage = `url('${imageInput.value}')`;
    });

    // === СОХРАНЕНИЕ В БД ===
    editor.querySelector('#saveArticleBtn').addEventListener('click', async () => {
        const data = {
            title: editor.querySelector('#articleTitle').value.trim() || 'Без названия',
            category: editor.querySelector('#articleCategory').value,
            date: editor.querySelector('#articleDate').value.trim(),
            reading_time: editor.querySelector('#articleReadingTime').value.trim(),
            image: editor.querySelector('#articleImage').value.trim(),
            preview: editor.querySelector('#articlePreview').value.trim(),
            content: editor.querySelector('#articleContent').value.trim(),
            is_published: currentStatus ? 1 : 0,
            sort_order: 0
        };

        try {
            if (isNew) {
                await api.articles.create(data);
                showNotification('✓ Статья создана в БД', 'success');
            } else {
                await api.articles.update(currentArticle.id, data);
                showNotification('✓ Статья сохранена в БД', 'success');
            }

            close();
            setTimeout(openArticlesModeration, 350);
        } catch (err) {
            console.error('❌ Ошибка сохранения:', err);
            showNotification('❌ Не удалось сохранить', 'error');
        }
    });
}