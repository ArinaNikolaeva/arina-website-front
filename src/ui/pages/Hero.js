// ==========================================
// HERO
// ==========================================

// Данные получаем через initHero()
// В renderHero рендерим каркас, в initHero — заполняем

export function renderHero() {
    return `
        <section class="section section-hero" id="home">
            <div class="section-bg" id="heroBg"></div>
            <div class="section-overlay"></div>
            <div class="container hero-inner">
                <div class="hero-text">
                    <h1 class="animate-on-scroll" data-editable="hero.name" id="heroName"></h1>
                    <p class="subtitle animate-on-scroll" style="animation-delay: 0.1s;" data-editable="hero.subtitle" id="heroSubtitle"></p>
                    <p class="description animate-on-scroll" style="animation-delay: 0.2s;" data-editable="hero.description" id="heroDescription"></p>
                    <div class="hero-actions animate-on-scroll" style="animation-delay: 0.3s;">
                        <a href="#contacts" class="btn btn-primary">Связаться</a>
                        <a href="#about" class="btn btn-outline">Узнать больше</a>
                    </div>
                </div>
                <div class="hero-image animate-on-scroll" style="animation-delay: 0.15s;">
                    <img src="" alt="" id="heroPhoto" />
                </div>
            </div>
        </section>
    `;
}

// === ЗАГРУЗКА ДАННЫХ ===
export function initHero(person, images) {
    console.log('🔍 initHero получил person:', person);   // ← добавь
    console.log('🔍 initHero получил images:', images);   // ← добавь

    const heroBg = document.getElementById('heroBg');
    const heroName = document.getElementById('heroName');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const heroDescription = document.getElementById('heroDescription');
    const heroPhoto = document.getElementById('heroPhoto');

    if (heroBg) heroBg.style.backgroundImage = `url('${images.hero_bg}')`;
    if (heroName) heroName.textContent = person.name;
    console.log('🔍 Установлено имя:', heroName.textContent);   // ← добавь

    if (heroSubtitle) heroSubtitle.textContent = person.short_profession;
    if (heroDescription) heroDescription.textContent = person.hero_description;
    if (heroPhoto) {
        heroPhoto.src = images.hero_photo;
        heroPhoto.alt = person.name;
    }
}
