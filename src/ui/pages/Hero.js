// ==========================================
// HERO
// ==========================================

import { siteConfig } from '../../data/siteConfig.js';

export function renderHero() {
    const person = siteConfig.person;
    const images = siteConfig.images;

    return `
        <section class="section section-hero" id="home">
            <div class="section-bg" style="background-image: url('${images.heroBg}');"></div>
            <div class="section-overlay"></div>
            <div class="container hero-inner">
                <div class="hero-text">
                    <h1 class="animate-on-scroll" data-editable="hero.name">${person.name}</h1>
                    <p class="subtitle animate-on-scroll" style="animation-delay: 0.1s;" data-editable="hero.subtitle">
                        ${person.shortProfession}
                    </p>
                    <p class="description animate-on-scroll" style="animation-delay: 0.2s;" data-editable="hero.description">
                        ${person.heroDescription}
                    </p>
                    <div class="hero-actions animate-on-scroll" style="animation-delay: 0.3s;">
                        <a href="#contacts" class="btn btn-primary">Связаться</a>
                        <a href="#about" class="btn btn-outline">Узнать больше</a>
                    </div>
                </div>
                <div class="hero-image animate-on-scroll" style="animation-delay: 0.15s;">
                    <img src="${images.heroPhoto}" alt="${person.name}" />
                </div>
            </div>
        </section>
    `;
}