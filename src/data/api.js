// ==========================================
// API КЛИЕНТ ДЛЯ БЭКЕНДА
// ==========================================

const API_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error(`❌ API [${endpoint}]:`, err.message);
        throw err;
    }
}

export const api = {
    person: {
        get: () => request('/person'),
        update: (data) => request('/person', { method: 'PUT', body: JSON.stringify(data) }),
    },
    contacts: {
        get: () => request('/contacts'),
        update: (data) => request('/contacts', { method: 'PUT', body: JSON.stringify(data) }),
    },
    education: {
        getAll: () => request('/education'),
        create: (data) => request('/education', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`/education/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`/education/${id}`, { method: 'DELETE' }),
    },
    certificates: {
        getAll: () => request('/certificates'),
        create: (data) => request('/certificates', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id) => request(`/certificates/${id}`, { method: 'DELETE' }),
    },
    images: {
        getAll: () => request('/images'),
        update: (key, data) => request(`/images/${key}`, { method: 'PUT', body: JSON.stringify(data) }),
    },
    articles: {
        getAll: () => request('/articles'),
        create: (data) => request('/articles', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`/articles/${id}`, { method: 'DELETE' }),
    },
    reviews: {
        getPublished: () => request('/reviews/published'),
        getPending: () => request('/reviews/pending'),
        create: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
        approve: (id) => request(`/reviews/${id}/approve`, { method: 'PUT' }),
        delete: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),
    },
    faq: {
        getAll: () => request('/faq'),
        create: (data) => request('/faq', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`/faq/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`/faq/${id}`, { method: 'DELETE' }),
    },
    stats: {
        get: () => request('/stats'),
        update: (data) => request('/stats', { method: 'PUT', body: JSON.stringify(data) }),
    },
};