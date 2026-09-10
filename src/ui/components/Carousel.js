// ==========================================
// КАРУСЕЛЬ (универсальная)
// ==========================================

export function initCarousel(trackId, prevBtnId, nextBtnId, dotsId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsId);

    if (!track || !prevBtn || !nextBtn) {
        console.warn(`Carousel: элементы не найдены для #${trackId}`);
        return;
    }

    // Поддерживаем .carousel-slide (статьи), .review-card (отзывы) и .article-card (статьи в новом формате)
    const slides = track.querySelectorAll('.carousel-slide, .review-card, .article-card');
    const total = slides.length;
    
    // Определяем количество слайдов на экран
    const perView = getSlidesPerView(trackId);
    const gap = 24;
    let current = 0;
    let autoPlayInterval = null;

    if (total <= perView) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        if (dotsContainer) dotsContainer.style.display = 'none';
        return;
    }

    // === ОПРЕДЕЛЕНИЕ КОЛИЧЕСТВА СЛАЙДОВ ===
    function getSlidesPerView(trackId) {
        if (trackId === 'reviewsTrack') {
            if (window.innerWidth <= 768) return 1;
            return 2;
        }
        // Для статей (carouselTrack)
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    // === ОБНОВЛЕНИЕ КАРУСЕЛИ ===
    function update(animate = true) {
        if (!animate) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }

        // Рассчитываем ширину слайда
        const containerWidth = track.parentElement?.offsetWidth || 800;
        const slideWidth = Math.floor((containerWidth - gap * (perView - 1)) / perView);
        
        // Устанавливаем ширину каждому слайду
        slides.forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}px`;
            slide.style.minWidth = '0';
        });

        // Сдвигаем трек
        const offset = current * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        // === СТРЕЛКИ ИСЧЕЗАЮТ НА КРАЯХ ===
        const maxIndex = total - perView;
        
        // Предыдущая стрелка
        prevBtn.disabled = current === 0;
        prevBtn.style.opacity = current === 0 ? '0' : '1';
        prevBtn.style.pointerEvents = current === 0 ? 'none' : 'auto';

        // Следующая стрелка
        nextBtn.disabled = current >= maxIndex;
        nextBtn.style.opacity = current >= maxIndex ? '0' : '1';
        nextBtn.style.pointerEvents = current >= maxIndex ? 'none' : 'auto';

        // === ТОЧКИ ===
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });
        }
    }

    // === СОЗДАНИЕ ТОЧЕК ===
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const maxIndex = total - perView;
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                current = i;
                update(true);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    // === НАВИГАЦИЯ ===
    function goPrev() {
        if (current > 0) {
            current--;
            update(true);
            resetAutoPlay();
        }
    }

    function goNext() {
        const maxIndex = total - perView;
        if (current < maxIndex) {
            current++;
            update(true);
            resetAutoPlay();
        }
    }

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    // === АВТОПРОКРУТКА ===
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        const maxIndex = total - perView;
        if (maxIndex <= 0) return;
        
        autoPlayInterval = setInterval(() => {
            if (current >= maxIndex) {
                current = 0;
            } else {
                current++;
            }
            update(true);
        }, 5000);
    }

    function resetAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
    }

    // === ПЕРЕСЧЁТ ПРИ РЕСАЙЗЕ ===
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newPerView = getSlidesPerView(trackId);
            if (newPerView !== perView) {
                // Обновляем perView и пересоздаём точки
                // К сожалению, не можем изменить perView в замыкании, но пересоздаём карусель
                // Простой способ: перезапустить инициализацию
                destroy();
                initCarousel(trackId, prevBtnId, nextBtnId, dotsId);
            } else {
                update(false);
            }
        }, 250);
    }

    // === ОСТАНОВКА АВТОПРОКРУТКИ ПРИ ХОВЕРЕ ===
    const wrapper = track.closest('.carousel-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        });
        wrapper.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }

    // === УНИЧТОЖЕНИЕ ===
    function destroy() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        window.removeEventListener('resize', handleResize);
        prevBtn.removeEventListener('click', goPrev);
        nextBtn.removeEventListener('click', goNext);
    }

    // === СТАРТ ===
    createDots();
    // Ждём рендеринга
    setTimeout(() => {
        update(false);
        startAutoPlay();
    }, 100);

    window.addEventListener('resize', handleResize);

    console.log(`🔄 Карусель "${trackId}" инициализирована: ${total} слайдов, ${perView} на экран`);

    // === ВОЗВРАЩАЕМ API ===
    return {
        goPrev,
        goNext,
        update: () => update(true),
        destroy,
        refresh: () => {
            const newPerView = getSlidesPerView(trackId);
            if (newPerView !== perView) {
                destroy();
                initCarousel(trackId, prevBtnId, nextBtnId, dotsId);
            } else {
                update(false);
            }
        }
    };
}