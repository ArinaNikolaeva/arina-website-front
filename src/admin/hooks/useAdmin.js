// ==========================================
// ХУК ДЛЯ АДМИНИСТРАТОРА
// ==========================================

export function useAdmin() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    const login = (email, password) => {
        if (email === 'admin@psychologist.ru' && password === 'admin123') {
            localStorage.setItem('isAdmin', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('isAdmin');
    };

    return { isAdmin, login, logout };
}