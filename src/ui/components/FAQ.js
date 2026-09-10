export function initFAQ() {
    document.querySelectorAll('.faq-item').forEach((item) => {
        item.addEventListener('click', function() {
            // Закрываем все другие открытые FAQ (опционально)
            document.querySelectorAll('.faq-item.open').forEach((el) => {
                 if (el !== this) el.classList.remove('open');
             });
            this.classList.toggle('open');
        });
    });
    console.log('✅ FAQ инициализирован');
}