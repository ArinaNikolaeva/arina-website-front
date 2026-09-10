// ==========================================
// СТАТИСТИКА ОБРАЩЕНИЙ
// ==========================================

export const statsData = {
    // Общее количество обратившихся
    totalClients: 30,
    
    // Отдельно: онлайн и лично
    online: 14,
    offline: 16,
    
    // Годы опыта
    yearsExperience: 2,
    
    // Проектов
    projectsDone: 48
};

// === ФОРМАТИРОВАНИЕ ЧИСЛА ===
export function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}