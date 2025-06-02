// YasnaArchive - main.js
// Author: GeekNeuron (با همکاری هوش مصنوعی)
// Version: 1.0.1 (شامل تمام ویژگی‌های بحث شده)

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const body = document.body;
    const siteTitleLogo = document.getElementById('site-title-logo');
    const starfieldContainer = document.getElementById('starfield-background');

    // Header Controls
    const themeToggleButton = document.getElementById('theme-toggle');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinksContainer = document.getElementById('nav-links');
    const readingSettingsToggleButton = document.getElementById('reading-settings-toggle'); // <<<< تعریف این متغیر اینجاست
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResultsContainer = document.getElementById('search-results');
    const searchResultsList = document.getElementById('search-results-list');
    const noResultsMessage = document.getElementById('no-results-message');

    // Main Content Areas
    const heroSection = document.getElementById('hero-section');
    const contentGrid = document.getElementById('content-grid');
    const constellationNavContainer = document.getElementById('constellation-nav-container');
    const constellationMap = constellationNavContainer?.querySelector('.constellation-map');
    const detailContentArea = document.getElementById('detail-content-area');
    const viewToggleButtonsContainer = document.getElementById('view-toggle-buttons');
    const showConstellationViewBtn = document.getElementById('show-constellation-view-btn');
    const showTileViewBtn = document.getElementById('show-tile-view-btn');

    // Settings Panel Elements
    const settingsPanel = document.getElementById('reading-settings-panel');
    const closeSettingsButton = document.getElementById('close-settings-panel');
    const settingsOverlay = document.getElementById('settings-overlay');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizeValueDisplay = document.getElementById('font-size-value');
    const decreaseFontButton = document.getElementById('decrease-font');
    const increaseFontButton = document.getElementById('increase-font');
    const resetFontSizeButton = document.getElementById('reset-font-size');
    const themeOptionButtons = document.querySelectorAll('.theme-option-btn');
    const lineHeightSlider = document.getElementById('line-height-slider');
    const lineHeightValueDisplay = document.getElementById('line-height-value');
    const decreaseLineHeightButton = document.getElementById('decrease-line-height');
    const increaseLineHeightButton = document.getElementById('increase-line-height');
    const resetLineHeightButton = document.getElementById('reset-line-height');
    const alignOptionButtons = document.querySelectorAll('.align-option-btn');
    const fontFamilySelect = document.getElementById('font-family-select');
    const contentWidthSlider = document.getElementById('content-width-slider');
    const contentWidthValueDisplay = document.getElementById('content-width-value');
    const toggleFullscreenButton = document.getElementById('toggle-fullscreen-btn');
    const keepScreenOnToggle = document.getElementById('keep-screen-on-toggle');
    const wakeLockStatusDisplay = document.getElementById('wake-lock-status');
    const toggleImmersiveModeSettingsButton = document.getElementById('toggle-immersive-mode-settings');
    const resetAllSettingsButton = document.getElementById('reset-all-reading-settings-btn');

    // Other UI Elements
    const scrollToTopButton = document.getElementById('scrollToTopBtn');
    const soundToggleButton = document.getElementById('toggle-sound-btn');

    // --- State Variables ---
    let searchableData = [];
    let isSearchDataFetched = false;
    let currentDetailSectionId = null;
    let searchDebounceTimer;
    let wakeLock = null;
    let soundEnabled = localStorage.getItem('soundEnabled') === 'true';
    let scrollDebounceTimer;
    let currentViewMode = localStorage.getItem('yasnaArchiveViewMode') || 'tiles';

    const root = document.documentElement;

    // --- Default Settings ---
    const defaultReadingSettings = {
        fontSizeMultiplier: 1,
        readingTheme: 'light-theme',
        lineHeight: 1.7,
        textAlign: 'right',
        fontFamily: 'var(--font-family-sans)',
        contentWidth: 'medium',
        keepScreenOn: false,
        immersiveMode: false,
    };
    let currentMainTheme = localStorage.getItem('yasnaArchiveMainTheme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'theme-dark' : 'theme-light');

    // --- Sound Effects ---
    const sounds = { // USER: مسیرهای صحیح فایل‌های صوتی خود را اینجا قرار دهید
        // themeSwitch: new Audio('assets/audio/theme_switch.mp3'),
        // uiInteraction: new Audio('assets/audio/ui_interaction.mp3'),
        // openPanel: new Audio('assets/audio/panel_open.mp3'),
        // closePanel: new Audio('assets/audio/panel_close.mp3'),
    };
    Object.values(sounds).forEach(sound => { if (sound && typeof sound.load === 'function') { sound.load(); sound.volume = 0.2; } });

    function playSound(soundName) {
        if (soundEnabled && sounds[soundName]) {
            sounds[soundName].currentTime = 0;
            sounds[soundName].play().catch(e => console.warn(`Sound play error (${soundName}):`, e.message));
        }
    }

    if (soundToggleButton) {
        soundToggleButton.textContent = soundEnabled ? '🔊' : '🔇';
        soundToggleButton.setAttribute('aria-label', soundEnabled ? 'غیرفعال کردن صدا' : 'فعال کردن صدا');
        soundToggleButton.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggleButton.textContent = soundEnabled ? '🔊' : '🔇';
            soundToggleButton.setAttribute('aria-label', soundEnabled ? 'غیرفعال کردن صدا' : 'فعال کردن صدا');
            localStorage.setItem('soundEnabled', soundEnabled);
            if (soundEnabled) playSound('uiInteraction');
        });
    }

    // --- Theme Management ---
    function applyMainTheme(themeName) {
        body.classList.remove('theme-light', 'theme-dark');
        body.classList.add(themeName);
        currentMainTheme = themeName;
        if (themeToggleButton) {
            themeToggleButton.textContent = themeName === 'theme-dark' ? '☀️' : '🌙';
            themeToggleButton.setAttribute('aria-label', themeName === 'theme-dark' ? 'تغییر به تم روشن' : 'تغییر به تم تاریک');
        }
        localStorage.setItem('yasnaArchiveMainTheme', themeName);

        if (starfieldContainer) {
            const isSepiaActive = body.classList.contains('reading-theme-sepia');
            if (themeName === 'theme-dark' && !isSepiaActive) { // Starfield only if main dark and not sepia
                starfieldContainer.style.opacity = '1';
                if (starfieldContainer.children.length === 0) createStars(150);
            } else {
                starfieldContainer.style.opacity = '0';
            }
        }
        // playSound('themeSwitch'); // صدا هنگام تغییر تم اصلی
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const newMainTheme = body.classList.contains('theme-light') ? 'theme-dark' : 'theme-light';
            applyMainTheme(newMainTheme);
            const activeReadingThemeBtn = document.querySelector('.theme-option-btn.active');
            if (activeReadingThemeBtn) {
                 applyReadingTheme(activeReadingThemeBtn.dataset.readingTheme, true); // play sound on explicit theme change
            } else {
                 applyReadingTheme(defaultReadingSettings.readingTheme, true); // fallback if no reading theme was active
            }
        });
    }

    function createStars(count) {
        if (!starfieldContainer) return;
        starfieldContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.classList.add('star-particle');
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            const size = Math.random() * 2 + 0.5;
            star.style.width = `${size}px`; star.style.height = `${size}px`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s, ${Math.random() * 150 + 50}s`;
            star.style.animationDelay = `${Math.random() * 5}s, ${Math.random() * 50}s`;
            starfieldContainer.appendChild(star);
        }
    }

    // --- Hamburger Menu ---
    if (hamburgerMenu && navLinksContainer) {
        hamburgerMenu.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
            hamburgerMenu.setAttribute('aria-expanded', navLinksContainer.classList.contains('active'));
            playSound('uiInteraction');
        });
        navLinksContainer.addEventListener('click', (event) => {
            if (event.target.tagName === 'A' && navLinksContainer.classList.contains('active')) {
                hamburgerMenu.click(); // Simulate click to close
            }
        });
    }

    // --- Show/Hide Main Content Areas & Scroll Position ---
    function showHomePage() {
        deactivateImmersiveMode(); // Ensure immersive is off when going home
        if (currentViewMode === 'constellation' && constellationNavContainer) {
            if (heroSection) heroSection.style.display = 'none';
            if (contentGrid) contentGrid.style.display = 'none';
            constellationNavContainer.style.display = 'block';
        } else {
            if (heroSection) heroSection.style.display = 'block';
            if (contentGrid) contentGrid.style.display = 'grid';
            if (constellationNavContainer) constellationNavContainer.style.display = 'none';
        }
        if (viewToggleButtonsContainer) viewToggleButtonsContainer.style.display = 'flex';
        if (detailContentArea) detailContentArea.innerHTML = '';
        currentDetailSectionId = null;
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
        if (siteTitleLogo) siteTitleLogo.focus();
    }

    function showDetailSection(sectionId) {
        // Immersive mode is deactivated by loadSectionContent before calling this
        if (heroSection) heroSection.style.display = 'none';
        if (contentGrid) contentGrid.style.display = 'none';
        if (constellationNavContainer) constellationNavContainer.style.display = 'none';
        if (viewToggleButtonsContainer) viewToggleButtonsContainer.style.display = 'none';
        currentDetailSectionId = sectionId;
    }
    if (siteTitleLogo) siteTitleLogo.addEventListener('click', showHomePage);

    // View Mode Toggle
    if (showTileViewBtn && showConstellationViewBtn && viewToggleButtonsContainer) {
        const updateViewModeButtons = () => {
            showTileViewBtn.classList.toggle('active', currentViewMode === 'tiles');
            showConstellationViewBtn.classList.toggle('active', currentViewMode === 'constellation');
            showTileViewBtn.setAttribute('aria-selected', currentViewMode === 'tiles');
            showConstellationViewBtn.setAttribute('aria-selected', currentViewMode === 'constellation');
        };
        showTileViewBtn.addEventListener('click', () => { currentViewMode = 'tiles'; localStorage.setItem('yasnaArchiveViewMode', 'tiles'); updateViewModeButtons(); showHomePage(); playSound('uiInteraction'); });
        showConstellationViewBtn.addEventListener('click', () => { currentViewMode = 'constellation'; localStorage.setItem('yasnaArchiveViewMode', 'constellation'); updateViewModeButtons(); showHomePage(); playSound('uiInteraction'); });
        updateViewModeButtons();
    }

    window.addEventListener('scroll', () => {
        clearTimeout(scrollDebounceTimer);
        scrollDebounceTimer = setTimeout(() => {
            if (currentDetailSectionId && detailContentArea && detailContentArea.innerHTML !== '' && !body.classList.contains('immersive-active')) {
                localStorage.setItem(`scrollPos_${currentDetailSectionId}`, window.scrollY);
            }
        }, 250);
        if (scrollToTopButton) { scrollToTopButton.style.display = (window.scrollY > 150) ? "block" : "none"; }
        simpleHeroParallax();
    });

    function displayError(container, message) { if (container) container.innerHTML = `<p class="error-message" role="alert">${message}</p>`; }

    async function loadGeneralData() {
        try {
            const response = await fetch('data/general.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} loading general.json`);
            const data = await response.json();

            if (data.sections && navLinksContainer) {
                const existingLinks = navLinksContainer.querySelectorAll('li:not(:first-child)');
                existingLinks.forEach(link => link.remove());
                data.sections.forEach(section => {
                    const li = document.createElement('li'); const a = document.createElement('a');
                    a.href = `#${section.id}`; a.textContent = section.title; a.dataset.section = section.id;
                    li.appendChild(a); navLinksContainer.appendChild(li);
                });
            }
            if (data.sections && contentGrid) {
                contentGrid.innerHTML = '';
                data.sections.forEach((section, index) => {
                    const tile = document.createElement('div'); tile.classList.add('tile');
                    tile.dataset.sectionId = section.id; tile.setAttribute('role', 'button'); tile.setAttribute('tabindex', '0');
                    tile.style.animationDelay = `${index * 0.07}s`;
                    tile.innerHTML = `<h3>${section.title}</h3><p>${section.summary}</p><span class="read-more-btn" aria-hidden="true">بیشتر بخوانید</span>`;
                    const loadContentHandler = () => loadSectionContent(section.id);
                    tile.addEventListener('click', loadContentHandler);
                    tile.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadContentHandler(); } });
                    contentGrid.appendChild(tile);
                });
            }
            if (data.sections && constellationMap) {
                const positions = [ { t: '20%', l: '50%'}, { t: '35%', l: '20%'}, { t: '35%', l: '80%'}, { t: '60%', l: '30%'}, { t: '60%', l: '70%'}, { t: '85%', l: '50%'} ];
                constellationMap.innerHTML = '';
                data.sections.forEach((section, index) => {
                    const star = document.createElement('div'); star.classList.add('star');
                    star.dataset.sectionId = section.id; star.setAttribute('title', section.title);
                    star.setAttribute('role', 'button'); star.setAttribute('tabindex', '0');
                    star.style.animationDelay = `${0.5 + index * 0.15}s`;
                    const pos = positions[index % positions.length];
                    star.style.top = pos.t; star.style.left = pos.l; star.style.transform = 'translate(-50%, -50%)';
                    star.innerHTML = `<div class="star-core"></div><span class="star-label">${section.title}</span>`;
                    const loadContentHandler = () => loadSectionContent(section.id);
                    star.addEventListener('click', loadContentHandler);
                    star.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadContentHandler(); } });
                    constellationMap.appendChild(star);
                });
            }
        } catch (error) {
            console.error('Failed to load general data:', error);
            if (contentGrid) displayError(contentGrid, 'خطا در بارگذاری اطلاعات اصلی سایت.');
            if (constellationMap) displayError(constellationMap, 'خطا در بارگذاری نقشه ستاره‌ای.');
        }
    }

    if (navLinksContainer) {
        navLinksContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.dataset.section) {
                e.preventDefault();
                const sectionId = e.target.dataset.section;
                if (sectionId === 'home') showHomePage(); else loadSectionContent(sectionId);
                // Hamburger menu close logic is inside its own event listener
            }
        });
    }

    async function loadSectionContent(sectionId) {
        if (!sectionId || sectionId === 'home') { showHomePage(); return; }
        if (currentDetailSectionId === sectionId && detailContentArea.querySelector(`#${sectionId}-details`)) {
             const targetEl = detailContentArea.querySelector(`#${sectionId}-details`);
             if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
             return;
        }
        deactivateImmersiveMode(); // Deactivate immersive if active from another section
        showDetailSection(sectionId); // Updates currentDetailSectionId and hides other main views
        
        // Find section title from general data for loading message
        let sectionTitleForLoading = sectionId;
        if (searchableData.length > 0) { // Use searchableData if populated
            const sectionInfo = searchableData.find(s => s.id === sectionId && (s.type === 'tile' || s.type === 'page'));
            if (sectionInfo) sectionTitleForLoading = sectionInfo.title;
        } else { // Fallback to trying to get from nav links if general.json hasn't populated searchableData yet
            const navLinkForSection = navLinksContainer.querySelector(`a[data-section="${sectionId}"]`);
            if (navLinkForSection) sectionTitleForLoading = navLinkForSection.textContent;
        }

        detailContentArea.innerHTML = `<div class="loading-indicator" role="status" aria-live="polite"><div class="pulsating-orb"></div><p>در حال بارگذاری ${sectionTitleForLoading}...</p></div>`;

        try {
            const response = await fetch(`data/${sectionId}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${sectionId}.json`);
            const data = await response.json();

            const sectionElement = document.createElement('section');
            sectionElement.id = `${sectionId}-details`; sectionElement.classList.add('content-section');
            const dynamicContentDiv = document.createElement('div');
            dynamicContentDiv.id = `${sectionId}-content`; dynamicContentDiv.classList.add('dynamic-content');

            if (sectionId === 'history') renderHistory(data, dynamicContentDiv);
            else if (sectionId === 'prophet') renderProphet(data, dynamicContentDiv);
            else if (sectionId === 'scripture') renderScripture(data, dynamicContentDiv, sectionId); // Pass sectionId for immersive button
            else if (sectionId === 'script-lang') renderScriptLanguage(data, dynamicContentDiv);
            else if (sectionId === 'genealogy') renderGenealogy(data, dynamicContentDiv);
            else dynamicContentDiv.innerHTML = `<p>تابع رندر برای بخش "${sectionId}" پیاده‌سازی نشده است.</p>`;

            sectionElement.appendChild(dynamicContentDiv);
            detailContentArea.innerHTML = ''; detailContentArea.appendChild(sectionElement);

            const savedScrollPos = parseInt(localStorage.getItem(`scrollPos_${sectionId}`), 10);
            requestAnimationFrame(() => {
                if (!isNaN(savedScrollPos)) window.scrollTo({ top: savedScrollPos, behavior: 'auto' });
                else sectionElement.scrollIntoView({ behavior: 'auto', block: 'start' });
            });
            const firstHeading = sectionElement.querySelector('h2, h3');
            if (firstHeading) { firstHeading.setAttribute('tabindex', '-1'); if (isNaN(savedScrollPos)) firstHeading.focus({ preventScroll: true }); }
            if (typeof observeNewAnimatedElements === 'function') observeNewAnimatedElements(dynamicContentDiv);

            // Apply immersive mode if it was globally set in settings and this section supports it
            if (localStorage.getItem('readingImmersiveMode') === 'true' && sectionId === 'scripture') { // Example: only for scripture
                activateImmersiveModeGeneric();
            }


        } catch (error) { console.error(`Failed to load/render ${sectionId}.json:`, error); displayError(detailContentArea, `خطا در بارگذاری محتوای بخش "${sectionId}".`); }
    }

    // --- Render Functions (Copied from previous full code, ensure they are complete) ---
    function renderHistory(data, container) { /* ... (کد کامل از پاسخ قبلی) ... */
        let html = `<h2 class="anim-on-scroll" style="animation-delay: 0.1s;">${data.title || 'تاریخ'}</h2>`;
        if (data.introduction) html += `<p class="introduction anim-on-scroll" style="animation-delay: 0.2s;">${data.introduction}</p>`;
        if (data.periods && data.periods.length > 0) {
            html += `<div class="timeline-container anim-on-scroll" style="animation-delay: 0.3s;"><div class="timeline-path"></div><div class="timeline-events">
                        ${data.periods.map((event, index) => `
                            <div class="timeline-event" data-event-id="${event.id || 'event-' + index}" data-event-index="${index}" tabindex="0" aria-label="رویداد: ${event.title || event.era_title}">
                                <div class="event-marker">${event.icon_image ? `<img src="${event.icon_image}" alt="" class="event-icon">` : ''}</div>
                                <div class="event-summary"><span class="event-year">${event.year || ''}</span><h4 class="event-title">${event.title || event.era_title}</h4></div>
                            </div>`).join('')}
                    </div></div>`;
            html += `<div class="timeline-event-details-wrapper"></div>`;
        }
        if (data.conclusion) html += `<p class="conclusion anim-on-scroll" style="animation-delay: 0.4s;">${data.conclusion}</p>`;
        container.innerHTML = html;
        const allEventElements = container.querySelectorAll('.timeline-event');
        let timelineEventDetailWrapper = container.querySelector('.timeline-event-details-wrapper');
        if (allEventElements.length > 0 && timelineEventDetailWrapper) {
            const timelineEventsContainer = container.querySelector('.timeline-events');
            const timelinePath = container.querySelector('.timeline-path');
            const eventSpacing = 180; const totalTimelineWidth = (allEventElements.length * eventSpacing);
            if(timelineEventsContainer) timelineEventsContainer.style.width = `${totalTimelineWidth}px`;
            if(timelinePath) timelinePath.style.width = `${totalTimelineWidth - (eventSpacing / 2)}px`;
            allEventElements.forEach((el, index) => {
                el.style.left = `${index * eventSpacing + (eventSpacing / 4)}px`;
                const eventData = data.periods[index];
                const displayEventDetails = () => {
                    allEventElements.forEach(e => e.classList.remove('active')); el.classList.add('active');
                    timelineEventDetailWrapper.innerHTML = `<div class="timeline-event-details"><h3 class="anim-on-scroll">${eventData.title || eventData.era_title} (${eventData.year || ''})</h3>
                        <p class="short-desc anim-on-scroll" style="animation-delay:0.1s;">${eventData.short_description || ''}</p>
                        <div class="full-details anim-on-scroll" style="animation-delay:0.2s;">${eventData.full_details || '<p>جزئیات بیشتری ثبت نشده است.</p>'}</div></div>`;
                    if (typeof observeNewAnimatedElements === 'function') observeNewAnimatedElements(timelineEventDetailWrapper.firstChild);
                };
                el.addEventListener('click', displayEventDetails);
                el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); displayEventDetails(); } });
            });
        }
    }
    function renderProphet(data, container) { /* ... (کد کامل از پاسخ قبلی) ... */
        let html = `<h2 class="anim-on-scroll">${data.pageTitle || 'پیامبر'}</h2>`;
        if (data.image) html += `<img src="${data.image}" alt="${data.fullName || 'زرتشت'}" class="anim-on-scroll featured-image" style="max-width: 250px; float: left; margin: 0 1.5rem 1rem 0; animation-delay:0.1s;">`;
        if(data.fullName) html += `<p class="anim-on-scroll" style="animation-delay:0.2s;"><strong>نام کامل:</strong> ${data.fullName}</p>`;
        if(data.epithets) html += `<p class="anim-on-scroll" style="animation-delay:0.3s;"><strong>القاب:</strong> ${data.epithets.join('، ')}</p>`;
        if(data.era && data.era.text) html += `<p class="anim-on-scroll" style="animation-delay:0.4s;"><strong>دوران زندگی:</strong> ${data.era.text}</p>`;
        if(data.birthPlace) html += `<p class="anim-on-scroll" style="animation-delay:0.5s;"><strong>محل تولد احتمالی:</strong> ${data.birthPlace}</p>`;
        if(data.teachings && data.teachings.length > 0) {
            html += `<h3 class="anim-on-scroll" style="animation-delay:0.6s;">آموزه‌های بنیادین:</h3><ul class="teachings-list anim-on-scroll" style="animation-delay:0.7s;">`;
            data.teachings.forEach((t, i) => html += `<li class="anim-on-scroll" style="animation-delay:${0.7 + i*0.1}s"><strong>${t.title}:</strong> ${t.summary}</li>`);
            html += '</ul>';
        }
        if(data.lifeEvents && data.lifeEvents.length > 0) {
            html += `<h3 class="anim-on-scroll" style="animation-delay:0.8s;">رویدادهای مهم زندگی:</h3><ul class="anim-on-scroll" style="animation-delay:0.9s;">`;
            data.lifeEvents.forEach((e,i) => html += `<li class="anim-on-scroll" style="animation-delay:${0.9 + i*0.1}s">${e.event}</li>`);
            html += '</ul>';
        }
        if (data.keyConcepts) {
             html += `<h3 class="anim-on-scroll">مفاهیم کلیدی</h3>`;
            data.keyConcepts.forEach((concept, i) => {
                html += `<div class="knowledge-orb anim-on-scroll" style="animation-delay:${1 + i*0.2}s">
                            <div class="orb-icon">${concept.icon || '✨'}</div>
                            <h4 class="orb-title">${concept.title}</h4>
                            <p class="orb-content">${concept.content}</p>
                         </div>`;
            });
        }
        html += '<div style="clear:both;"></div>';
        container.innerHTML = html;
    }
    function renderScripture(data, container, sectionId) { /* ... (کد کامل از پاسخ قبلی) ... */
        let html = `<h2 class="anim-on-scroll">${data.pageTitle || 'اوستا - کتاب مقدس'}</h2>`;
        // Note: The immersive mode button from settings panel is now global.
        // If a specific button for *this* section is still desired, it can be added here,
        // but the global toggle in settings panel should control the body class.
        // For simplicity, we rely on the global settings panel toggle for immersive mode.
        // html += `<button id="toggle-immersive-${sectionId}" class="immersive-mode-button interactive-pulse anim-on-scroll" style="animation-delay:0.1s;" aria-pressed="false"><span class="icon-immersive">🌌</span> حالت مطالعه غوطه‌ور</button>`;

        if (data.introduction) html += `<p class="introduction anim-on-scroll" style="animation-delay:0.2s;">${data.introduction}</p>`;
        if (data.mainSections && data.mainSections.length > 0) {
            html += '<nav class="internal-nav anim-on-scroll" style="animation-delay:0.3s;" aria-label="ناوبری داخلی بخش اوستا"><h4>بخش‌های اصلی اوستا:</h4><ul>';
            data.mainSections.forEach(section => { html += `<li><a href="#scripture-${section.id}">${section.title}</a></li>`; });
            html += '</ul></nav>';
            html += '<div class="scripture-content-blocks">';
            data.mainSections.forEach((section, secIdx) => {
                html += `<article id="scripture-${section.id}" class="scripture-block anim-on-scroll" style="animation-delay:${0.4 + secIdx*0.1}s;" tabindex="-1">`;
                html += `<h3>${section.title}</h3>`;
                if (section.summary) html += `<p class="summary">${section.summary}</p>`;
                if (section.chapters && section.chapters.length > 0) {
                    section.chapters.forEach(chapter => {
                        html += `<div class="chapter"><h4>${chapter.chapterTitle}</h4>`;
                        if (chapter.verses && chapter.verses.length > 0) {
                            html += '<ol class="verses">'; chapter.verses.forEach(verse => { html += `<li>${verse}</li>`; }); html += '</ol>';
                        } html += `</div>`;
                    });
                }
                if (section.content) html += `<div class="general-content">${section.content}</div>`;
                html += `</article>`;
            });
            html += '</div>';
        }
        if (data.conclusion) html += `<p class="conclusion anim-on-scroll" style="animation-delay:0.5s;">${data.conclusion}</p>`;
        container.innerHTML = html;

        container.querySelectorAll('.internal-nav a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault(); const targetId = this.getAttribute('href'); const targetElement = container.querySelector(targetId);
                if (targetElement) { targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); targetElement.focus({preventScroll:true}); targetElement.classList.add('highlight-momentarily'); setTimeout(() => targetElement.classList.remove('highlight-momentarily'), 2500); }
            });
        });
    }
    function renderScriptLanguage(data, container) { /* ... (کد کامل از پاسخ قبلی) ... */
        let html = `<h2 class="anim-on-scroll">${data.pageTitle || 'خط و زبان'}</h2>`;
        if (data.introduction) html += `<p class="introduction anim-on-scroll" style="animation-delay:0.1s;">${data.introduction}</p>`;
        if (data.languages && data.languages.length > 0) {
            html += `<h3 class="anim-on-scroll" style="animation-delay:0.2s;">زبان‌ها:</h3>`;
            data.languages.forEach((lang, i) => { html += `<div class="language-item anim-on-scroll" style="animation-delay:${0.3 + i*0.1}s;"><h4>${lang.name}</h4><p>${lang.description}</p>${lang.era ? `<p><small>دوران: ${lang.era}</small></p>` : ''}</div>`; });
        }
        if (data.scripts && data.scripts.length > 0) {
            html += `<h3 class="anim-on-scroll" style="animation-delay:0.4s;">خطوط:</h3>`;
            data.scripts.forEach((script, i) => {
                html += `<div class="script-item anim-on-scroll" style="animation-delay:${0.5 + i*0.1}s;"><h4>${script.name}</h4><p>${script.description}</p>`;
                if (script.sampleText && script.sampleText.chars) {
                     html += `<div class="ancient-script-display"><p class="ancient-script" lang="${script.sampleText.lang || 'ae'}">`;
                     script.sampleText.chars.forEach(char_info => { html += `<span class="script-char" data-transliteration="${char_info.translit}" data-pronunciation="${char_info.pronun}" title="نویسه‌گردانی: ${char_info.translit}">${char_info.char}</span>`; });
                     html += `</p><div class="script-tooltip" style="display:none;"></div></div>`;
                }
                if (script.imageExample) html += `<img src="${script.imageExample}" alt="نمونه خط ${script.name}" class="script-example-img anim-on-scroll" style="animation-delay:${0.6 + i*0.1}s;">`;
                html += `</div>`;
            });
        }
        if (data.pronunciationTips && data.pronunciationTips.length > 0) {
            html += `<h3 class="anim-on-scroll" style="animation-delay:0.7s;">تلفظ:</h3><ul class="pronunciation-list anim-on-scroll" style="animation-delay:0.8s;">`;
            data.pronunciationTips.forEach((tip, i) => {
                html += `<li class="anim-on-scroll" style="animation-delay:${0.8 + i*0.05}s"><strong>${tip.term}</strong> <span class="phonetic">${tip.phonetic || ''}</span>`;
                if (tip.audioFile) html += `<button class="play-audio-btn interactive-pulse" data-audio="${tip.audioFile}" aria-label="پخش تلفظ ${tip.term}">🔊</button>`;
                html += `</li>`;
            }); html += '</ul>';
        }
        container.innerHTML = html;
        const scriptAreas = container.querySelectorAll('.ancient-script-display');
        scriptAreas.forEach(area => {
            const scriptCharsInArea = area.querySelectorAll('.script-char'); const tooltipInArea = area.querySelector('.script-tooltip');
            if (tooltipInArea) { scriptCharsInArea.forEach(charEl => { charEl.addEventListener('mouseenter', (event) => { const translit = event.target.dataset.transliteration; const pronun = event.target.dataset.pronunciation; if (translit || pronun) { tooltipInArea.innerHTML = `نویسه‌گردانی: ${translit || '؟'}<br>تلفظ: ${pronun || '؟'}`; tooltipInArea.classList.add('visible'); const charRect = event.target.getBoundingClientRect(); const areaRect = area.getBoundingClientRect(); let top = charRect.bottom - areaRect.top + 5; let left = charRect.left - areaRect.left + charRect.width / 2 - tooltipInArea.offsetWidth / 2; if (left < 0) left = 5; if (left + tooltipInArea.offsetWidth > area.clientWidth) left = area.clientWidth - tooltipInArea.offsetWidth - 5; if (top + tooltipInArea.offsetHeight > (window.innerHeight - areaRect.top) && (charRect.top - areaRect.top - tooltipInArea.offsetHeight - 5 > 0) ) { top = charRect.top - areaRect.top - tooltipInArea.offsetHeight - 5; } tooltipInArea.style.left = `${left}px`; tooltipInArea.style.top = `${top}px`; } }); charEl.addEventListener('mouseleave', () => { tooltipInArea.classList.remove('visible'); }); }); }
        });
        container.querySelectorAll('.play-audio-btn').forEach(button => { button.addEventListener('click', function() { playSoundFile(this.getAttribute('data-audio')); }); });
    }
    function playSoundFile(audioSrc) { if (soundEnabled && audioSrc) { const audio = new Audio(audioSrc); audio.volume = 0.4; audio.play().catch(e => console.warn("Error playing sound file:", e.message)); } }
    function renderGenealogy(data, container) { /* ... (کد کامل از پاسخ قبلی) ... */
        let html = `<h2 class="anim-on-scroll">${data.pageTitle || 'شجره‌نامه'}</h2>`;
        if (data.introduction) html += `<p class="introduction anim-on-scroll" style="animation-delay:0.1s;">${data.introduction}</p>`;
        function buildLineageHtml(node, delayBase) {
            let nodeHtml = `<li class="anim-on-scroll" style="animation-delay:${delayBase}s"><span>${node.name || node.ancestor} ${node.role ? `<small>(${node.role})</small>`:''}</span>`;
            const children = node.children || node.descendants;
            if (children && children.length > 0) {
                nodeHtml += '<ul>';
                children.forEach((child, idx) => nodeHtml += buildLineageHtml(child, delayBase + (idx + 1) * 0.05));
                nodeHtml += '</ul>';
            }
            nodeHtml += '</li>';
            return nodeHtml;
        }
        if (data.mainFigures && data.mainFigures.length > 0) {
            html += `<h3 class="anim-on-scroll" style="animation-delay:0.2s;">شخصیت‌های کلیدی:</h3>`;
            data.mainFigures.forEach((figure, i) => {
                html += `<div class="figure-card anim-on-scroll" style="animation-delay:${0.3 + i*0.1}s;"><h4>${figure.name} ${figure.role ? `<small>(${figure.role})</small>` : ''}</h4>`;
                if (figure.parents) html += `<p><strong>والدین:</strong> ${figure.parents.join(' و ')}</p>`;
                if (figure.spouse) html += `<p><strong>همسر:</strong> ${figure.spouse}</p>`;
                if (figure.children && figure.children.length > 0) html += `<p><strong>فرزندان:</strong> ${figure.children.join('، ')}</p>`;
                html += `</div>`;
            });
        }
        if (data.lineages && data.lineages.length > 0) {
            html += `<h3 class="anim-on-scroll" style="animation-delay:0.4s;">سلسله‌ها:</h3><ul class="genealogy-tree anim-on-scroll" style="animation-delay:0.5s;">`;
            data.lineages.forEach((lineage, i) => { html += buildLineageHtml(lineage, 0.5 + i * 0.1); });
            html += '</ul>';
        }
        container.innerHTML = html;
    }

    // --- Scroll-based Animations ---
    let scrollObserver;
    function observeNewAnimatedElements(container) {
        if (!('IntersectionObserver' in window)) { container.querySelectorAll('.anim-on-scroll').forEach(el => el.classList.add('is-visible')); return; }
        if (!scrollObserver) {
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
            scrollObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); } });
            }, observerOptions);
        }
        container.querySelectorAll('.anim-on-scroll').forEach(el => scrollObserver.observe(el));
    }

    // --- Search Functionality ---
    async function fetchAllDataForSearch() { /* ... (کد کامل از پاسخ قبلی، با دقت در استخراج متن) ... */
        if (isSearchDataFetched) return;
        const sectionFiles = ['general.json', 'history.json', 'prophet.json', 'scripture.json', 'script_language.json', 'genealogy.json'];
        searchableData = [];
        for (const fileName of sectionFiles) {
            try {
                const response = await fetch(`data/${fileName}`); if (!response.ok) continue;
                const data = await response.json(); const sectionIdFromFile = fileName.replace('.json', '');
                const addSearchableItem = (itemData) => { if (itemData.title && (itemData.text || itemData.summary)) { searchableData.push(itemData); } };
                if (data.pageTitle || data.title) addSearchableItem({ id: sectionIdFromFile, title: data.pageTitle || data.title, text: (data.introduction || data.summary || '').replace(/<[^>]+>/g, ' '), type: 'page', section: sectionIdFromFile });
                if (data.sections) data.sections.forEach(sec => addSearchableItem({ id: sec.id, title: sec.title, text: (sec.summary || '').replace(/<[^>]+>/g, ' '), type: 'tile', section: sec.id }));
                if (data.periods) data.periods.forEach(p => addSearchableItem({ id: p.id || sectionIdFromFile + '-' + (p.title||p.era_title||'event').replace(/\s+/g, '-').toLowerCase(), title: p.title || p.era_title, text: (p.summary || '') + (p.short_description || '') + (p.full_details || '').replace(/<[^>]+>/g, ' '), type: 'history_event', section: sectionIdFromFile }));
                if (data.mainSections) data.mainSections.forEach(ms => { addSearchableItem({ id: 'scripture-' + ms.id, title: ms.title, text: (ms.summary || '') + (ms.content || '').replace(/<[^>]+>/g, ' '), type: 'scripture_section', section: 'scripture' }); if (ms.chapters) ms.chapters.forEach(ch => addSearchableItem({ id: 'scripture-' + ms.id + '-' + ch.chapterTitle.replace(/\s+/g, '-').toLowerCase(), title: ch.chapterTitle, text: (ch.verses || []).join(' '), type: 'scripture_chapter', section: 'scripture' })); });
                if (data.teachings) data.teachings.forEach(t => addSearchableItem({id: sectionIdFromFile + '-teaching-' + t.title.replace(/\s+/g,'-').toLowerCase(), title: t.title, text: t.summary, type: 'detail_item', section: sectionIdFromFile}));
                if (data.languages) data.languages.forEach(l => addSearchableItem({id: sectionIdFromFile + '-lang-' + l.name.replace(/\s+/g,'-').toLowerCase(), title: l.name, text: l.description, type: 'detail_item', section: sectionIdFromFile}));
                if (data.scripts) data.scripts.forEach(s => addSearchableItem({id: sectionIdFromFile + '-script-' + s.name.replace(/\s+/g,'-').toLowerCase(), title: s.name, text: s.description, type: 'detail_item', section: sectionIdFromFile}));
                if (data.mainFigures) data.mainFigures.forEach(f => addSearchableItem({id: sectionIdFromFile + '-figure-' + f.name.replace(/\s+/g,'-').toLowerCase(), title: f.name, text: f.role || '', type: 'detail_item', section: sectionIdFromFile}));
            } catch (error) { console.warn(`Could not load/parse ${fileName} for search:`, error.message); }
        }
        isSearchDataFetched = true;
    }
    function performSearch() { /* ... (کد کامل از پاسخ قبلی، با دقت در dataset.itemId) ... */
        const query = searchInput.value.toLowerCase().trim();
        searchResultsList.innerHTML = ''; noResultsMessage.style.display = 'none';
        if (query.length < 2) { searchResultsContainer.style.display = 'none'; return; }
        if (!isSearchDataFetched) { searchResultsList.innerHTML = '<li>داده‌های جستجو در حال آماده‌سازی...</li>'; searchResultsContainer.style.display = 'block'; fetchAllDataForSearch(); return; }
        const results = searchableData.filter(item => (item.title && item.title.toLowerCase().includes(query)) || (item.text && item.text.toLowerCase().includes(query)));
        if (results.length > 0) {
            results.forEach(result => {
                const li = document.createElement('li'); const a = document.createElement('a');
                a.href = `#${result.section}`; a.innerHTML = highlightText(result.title, query);
                a.dataset.section = result.section; a.dataset.itemId = result.id;
                a.addEventListener('click', (e) => {
                    e.preventDefault(); searchResultsContainer.style.display = 'none'; searchInput.value = '';
                    loadSectionContent(a.dataset.section);
                    if (a.dataset.itemId && a.dataset.itemId !== a.dataset.section && !a.dataset.itemId.startsWith(a.dataset.section + '-page')) { // Avoid scrolling for main page/tile results
                        setTimeout(() => {
                            const elementToScroll = document.getElementById(a.dataset.itemId) || detailContentArea.querySelector(`[data-event-id="${a.dataset.itemId}"]`);
                            if (elementToScroll) {
                                elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                elementToScroll.classList.add('highlight-momentarily');
                                setTimeout(() => elementToScroll.classList.remove('highlight-momentarily'), 2500);
                                if (elementToScroll.hasAttribute('tabindex')) elementToScroll.focus({preventScroll:true});
                                else { elementToScroll.setAttribute('tabindex', '-1'); elementToScroll.focus({preventScroll:true});}
                            }
                        }, 800);
                    }
                });
                li.appendChild(a);
                if (result.text) {
                    const snippet = document.createElement('p'); const matchIndex = result.text.toLowerCase().indexOf(query);
                    const start = Math.max(0, matchIndex - 50); const end = Math.min(result.text.length, matchIndex + query.length + 80);
                    snippet.innerHTML = "..." + highlightText(result.text.substring(start, end), query) + "...";
                    li.appendChild(snippet);
                }
                searchResultsList.appendChild(li);
            });
            searchResultsContainer.style.display = 'block';
        } else { noResultsMessage.style.display = 'block'; searchResultsContainer.style.display = 'block'; }
        playSound('uiInteraction');
    }
    if (searchButton && searchInput && searchResultsList && searchResultsContainer && noResultsMessage) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('input', () => { clearTimeout(searchDebounceTimer); searchDebounceTimer = setTimeout(performSearch, 350); });
        searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { clearTimeout(searchDebounceTimer); performSearch(); } });
        document.addEventListener('click', (e) => { if (searchResultsContainer && searchInput && searchButton && !searchResultsContainer.contains(e.target) && !searchInput.contains(e.target) && !searchButton.contains(e.target)) { searchResultsContainer.style.display = 'none'; } });
    }

    // --- Parallax Effect ---
    const heroParallaxBg = document.querySelector('#hero-section .parallax-bg');
    function simpleHeroParallax() { if (heroParallaxBg) { const scrollTop = window.scrollY; const heroEl = document.getElementById('hero-section'); if (heroEl && scrollTop < heroEl.offsetHeight) { heroParallaxBg.style.transform = `translateY(${scrollTop * 0.25}px)`; } } }

    // --- Scroll To Top Button ---
    if (scrollToTopButton) { scrollToTopButton.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); if(siteTitleLogo) siteTitleLogo.focus(); playSound('uiInteraction'); }); }

    // --- Reading Settings Panel Logic ---
    if (readingSettingsToggleButton && settingsPanel && closeSettingsButton && settingsOverlay) { /* ... (کد کامل از پاسخ قبلی) ... */
        const openPanel = () => { settingsPanel.style.display = 'block'; settingsOverlay.style.display = 'block'; setTimeout(() => { settingsPanel.classList.add('visible'); settingsOverlay.classList.add('visible');}, 10); readingSettingsToggleButton.setAttribute('aria-expanded', 'true'); settingsPanel.querySelector('button, input, select, [tabindex="0"]')?.focus(); playSound('openPanel'); };
        const closePanel = () => { settingsPanel.classList.remove('visible'); settingsOverlay.classList.remove('visible'); setTimeout(() => { settingsPanel.style.display = 'none'; settingsOverlay.style.display = 'none'; }, 300); readingSettingsToggleButton.setAttribute('aria-expanded', 'false'); readingSettingsToggleButton.focus(); playSound('closePanel'); };
        readingSettingsToggleButton.addEventListener('click', openPanel);
        closeSettingsButton.addEventListener('click', closePanel);
        settingsOverlay.addEventListener('click', closePanel);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && settingsPanel.classList.contains('visible')) closePanel(); });
    }
    // Reading Settings Apply/Load functions
    function applyFontSize(multiplier) { root.style.setProperty('--reading-font-size-multiplier', multiplier); if (fontSizeValueDisplay) fontSizeValueDisplay.textContent = Math.round(multiplier * 100); localStorage.setItem('readingFontSize', multiplier); }
    function applyReadingTheme(themeName, playSnd = true) {
        body.classList.remove('reading-theme-light-override', 'reading-theme-sepia', 'reading-theme-dark-override');
        body.classList.remove('theme-light', 'theme-dark'); // Remove main themes first

        let mainThemeToSet = currentMainTheme; // Default to current main theme, will be overridden if reading theme implies a main theme

        if (themeName === 'sepia-theme') {
            body.classList.add('reading-theme-sepia');
            mainThemeToSet = 'theme-light'; // Sepia is best on a light base for starfield logic
        } else if (themeName === 'dark-theme') {
            mainThemeToSet = 'theme-dark';
            // body.classList.add('reading-theme-dark-override'); // No need for this if applyMainTheme is called
        } else { // light-theme
            mainThemeToSet = 'theme-light';
            // body.classList.add('reading-theme-light-override');
        }
        applyMainTheme(mainThemeToSet); // This handles starfield and main body classes

        if (themeOptionButtons) themeOptionButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.readingTheme === themeName));
        localStorage.setItem('readingTheme', themeName);
        if(playSnd) playSound('uiInteraction');
    }
    function applyLineHeight(height) { root.style.setProperty('--reading-line-height', height); if (lineHeightValueDisplay) lineHeightValueDisplay.textContent = parseFloat(height).toFixed(1); localStorage.setItem('readingLineHeight', height); }
    function applyTextAlign(align) { root.style.setProperty('--reading-text-align', align); if(alignOptionButtons) alignOptionButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.textAlign === align)); localStorage.setItem('readingTextAlign', align); }
    function applyFontFamily(fontVal) { root.style.setProperty('--dynamic-content-font-family', fontVal); if (fontFamilySelect) fontFamilySelect.value = fontVal; localStorage.setItem('readingFontFamily', fontVal); }
    function applyContentWidth(widthSettingOrValue) { /* ... (کد کامل از پاسخ قبلی) ... */
        let widthKey = 'medium', displayVal = 'متوسط', cssMaxW = '900px';
        if (String(widthSettingOrValue) === '1' || widthSettingOrValue === 'narrow') { widthKey = 'narrow'; displayVal = 'باریک'; cssMaxW = '700px'; }
        else if (String(widthSettingOrValue) === '3' || widthSettingOrValue === 'wide') { widthKey = 'wide'; displayVal = 'عریض'; cssMaxW = '1100px'; }
        root.style.setProperty('--dynamic-content-max-width', cssMaxW);
        if (contentWidthValueDisplay) contentWidthValueDisplay.textContent = displayVal;
        localStorage.setItem('readingContentWidth', widthKey);
    }
    // Reading Settings Event Listeners
    if (fontSizeSlider) fontSizeSlider.addEventListener('input', (e) => applyFontSize(parseFloat(e.target.value) / 100));
    if (decreaseFontButton && fontSizeSlider) decreaseFontButton.addEventListener('click', () => { fontSizeSlider.value = Math.max(parseFloat(fontSizeSlider.min), parseFloat(fontSizeSlider.value) - parseFloat(fontSizeSlider.step)); applyFontSize(parseFloat(fontSizeSlider.value) / 100); playSound('uiInteraction'); });
    if (increaseFontButton && fontSizeSlider) increaseFontButton.addEventListener('click', () => { fontSizeSlider.value = Math.min(parseFloat(fontSizeSlider.max), parseFloat(fontSizeSlider.value) + parseFloat(fontSizeSlider.step)); applyFontSize(parseFloat(fontSizeSlider.value) / 100); playSound('uiInteraction'); });
    if (resetFontSizeButton) resetFontSizeButton.addEventListener('click', () => { applyFontSize(defaultReadingSettings.fontSizeMultiplier); if(fontSizeSlider) fontSizeSlider.value = defaultReadingSettings.fontSizeMultiplier * 100; playSound('uiInteraction'); });
    if (themeOptionButtons) themeOptionButtons.forEach(button => button.addEventListener('click', (e) => applyReadingTheme(e.target.dataset.readingTheme)));
    if (lineHeightSlider) lineHeightSlider.addEventListener('input', (e) => applyLineHeight(parseFloat(e.target.value)));
    if (decreaseLineHeightButton && lineHeightSlider) decreaseLineHeightButton.addEventListener('click', () => { lineHeightSlider.value = (Math.max(parseFloat(lineHeightSlider.min), parseFloat(lineHeightSlider.value) - parseFloat(lineHeightSlider.step))).toFixed(1); applyLineHeight(lineHeightSlider.value); playSound('uiInteraction'); });
    if (increaseLineHeightButton && lineHeightSlider) increaseLineHeightButton.addEventListener('click', () => { lineHeightSlider.value = (Math.min(parseFloat(lineHeightSlider.max), parseFloat(lineHeightSlider.value) + parseFloat(lineHeightSlider.step))).toFixed(1); applyLineHeight(lineHeightSlider.value); playSound('uiInteraction'); });
    if (resetLineHeightButton) resetLineHeightButton.addEventListener('click', () => { applyLineHeight(defaultReadingSettings.lineHeight); if(lineHeightSlider) lineHeightSlider.value = defaultReadingSettings.lineHeight; playSound('uiInteraction'); });
    if (alignOptionButtons) alignOptionButtons.forEach(button => button.addEventListener('click', (e) => {applyTextAlign(e.target.dataset.textAlign); playSound('uiInteraction');}));
    if (fontFamilySelect) fontFamilySelect.addEventListener('change', (e) => {applyFontFamily(e.target.value); playSound('uiInteraction');});
    if (contentWidthSlider) contentWidthSlider.addEventListener('input', (e) => {applyContentWidth(e.target.value); playSound('uiInteraction');});

    // Fullscreen
    if (toggleFullscreenButton) { /* ... (کد کامل از پاسخ قبلی) ... */
        const updateFullscreenButtonText = () => { if(toggleFullscreenButton) toggleFullscreenButton.textContent = document.fullscreenElement ? 'خروج از حالت تمام صفحه' : 'ورود به حالت تمام صفحه'; };
        toggleFullscreenButton.addEventListener('click', () => { if (!document.fullscreenElement) enterFullscreen(); else exitFullscreen(); playSound('uiInteraction'); });
        document.addEventListener('fullscreenchange', updateFullscreenButtonText); updateFullscreenButtonText();
    }
    function enterFullscreen() { if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); else if (document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen(); /* Add other prefixes if needed */ }
    function exitFullscreen() { if (document.exitFullscreen) document.exitFullscreen(); else if (document.webkitExitFullscreen) document.webkitExitFullscreen(); /* Add other prefixes */ }

    // Wake Lock
    if (keepScreenOnToggle) { /* ... (کد کامل از پاسخ قبلی) ... */
        keepScreenOnToggle.addEventListener('change', () => {
            localStorage.setItem('readingKeepScreenOn', keepScreenOnToggle.checked);
            if (keepScreenOnToggle.checked) requestWakeLock(); else releaseWakeLock();
            playSound('uiInteraction');
        });
    }
    async function requestWakeLock() { /* ... (کد کامل از پاسخ قبلی) ... */
        if ('wakeLock' in navigator) { try { wakeLock = await navigator.wakeLock.request('screen'); if(wakeLockStatusDisplay){wakeLockStatusDisplay.textContent = 'روشن ماندن صفحه فعال است.'; wakeLockStatusDisplay.className = 'setting-note success visible'; wakeLockStatusDisplay.style.display = 'block';} wakeLock.addEventListener('release', () => { if(keepScreenOnToggle) keepScreenOnToggle.checked = false; localStorage.setItem('readingKeepScreenOn', 'false'); if(wakeLockStatusDisplay){wakeLockStatusDisplay.textContent = 'روشن ماندن صفحه غیرفعال شد (تغییر وضعیت).'; wakeLockStatusDisplay.className = 'setting-note visible'; wakeLockStatusDisplay.style.display = 'block';} }); } catch (err) { if(wakeLockStatusDisplay){wakeLockStatusDisplay.textContent = `خطا: ${err.message}`; wakeLockStatusDisplay.className = 'setting-note error visible'; wakeLockStatusDisplay.style.display = 'block';} if(keepScreenOnToggle) keepScreenOnToggle.checked = false; } } else { if(wakeLockStatusDisplay){wakeLockStatusDisplay.textContent = 'مرورگر پشتیبانی نمی‌کند.'; wakeLockStatusDisplay.className = 'setting-note error visible'; wakeLockStatusDisplay.style.display = 'block';} if(keepScreenOnToggle) keepScreenOnToggle.disabled = true; }
    }
    function releaseWakeLock() { if (wakeLock) { wakeLock.release(); wakeLock = null; if(wakeLockStatusDisplay){wakeLockStatusDisplay.textContent = 'روشن ماندن صفحه غیرفعال شد.'; wakeLockStatusDisplay.className = 'setting-note visible'; wakeLockStatusDisplay.style.display = 'block';}} }

    // Immersive Mode (from settings panel)
    function activateImmersiveModeGeneric() {
        body.classList.add('immersive-active');
        if (toggleImmersiveModeSettingsButton) toggleImmersiveModeSettingsButton.checked = true;
        // Update specific immersive buttons if they exist in the current view
        const specificImmersiveBtn = detailContentArea.querySelector(`#toggle-immersive-${currentDetailSectionId}`);
        if (specificImmersiveBtn) { specificImmersiveBtn.setAttribute('aria-pressed', 'true'); specificImmersiveBtn.innerHTML = '<span class="icon-immersive">📖</span> خروج از حالت مطالعه'; }
        // Ensure only current detail section is visible
        if (currentDetailSectionId && detailContentArea) {
             const currentSectionEl = detailContentArea.querySelector(`#${currentDetailSectionId}-details`);
             if (currentSectionEl) currentSectionEl.style.display = 'block';
        }
        playSound('uiInteraction');
    }
    function deactivateImmersiveMode() {
        body.classList.remove('immersive-active');
        if (toggleImmersiveModeSettingsButton) toggleImmersiveModeSettingsButton.checked = false;
        document.querySelectorAll('.immersive-mode-button[id^="toggle-immersive-"]').forEach(btn => {
            btn.setAttribute('aria-pressed', 'false'); btn.innerHTML = '<span class="icon-immersive">🌌</span> حالت مطالعه غوطه‌ور';
        });
        // Restore normal view if needed
        if (currentDetailSectionId && detailContentArea) {
            const currentSectionEl = detailContentArea.querySelector(`#${currentDetailSectionId}-details`);
            if (currentSectionEl) currentSectionEl.style.display = 'block';
        } else if (!currentDetailSectionId) { // on home page
            showHomePage(); // This will restore tile/constellation view
        }
        // playSound('uiInteraction'); // Sound might be redundant if called by other actions
    }
    if (toggleImmersiveModeSettingsButton) {
        toggleImmersiveModeSettingsButton.addEventListener('change', () => {
            const isPressed = toggleImmersiveModeSettingsButton.checked;
            if (isPressed) activateImmersiveModeGeneric(); else deactivateImmersiveMode();
            localStorage.setItem('readingImmersiveMode', isPressed);
            playSound('uiInteraction');
        });
    }
    // Event listener for specific immersive buttons within content (like scripture)
    if (detailContentArea) {
        detailContentArea.addEventListener('click', (event) => {
            const immersiveButton = event.target.closest('.immersive-mode-button[id^="toggle-immersive-"]');
            if (immersiveButton) {
                 const isCurrentlyImmersive = body.classList.contains('immersive-active');
                 if (isCurrentlyImmersive) deactivateImmersiveMode(); else activateImmersiveModeGeneric();
                 localStorage.setItem('readingImmersiveMode', !isCurrentlyImmersive);
                 playSound('uiInteraction');
            }
        });
    }


    // Reset All Reading Settings
    if (resetAllSettingsButton) { /* ... (کد کامل از پاسخ قبلی) ... */
        resetAllSettingsButton.addEventListener('click', () => {
            if (confirm('آیا مطمئنید که می‌خواهید تمام تنظیمات مطالعه را به حالت پیش‌فرض بازگردانید؟')) {
                localStorage.removeItem('readingFontSize'); localStorage.removeItem('readingTheme'); localStorage.removeItem('readingLineHeight');
                localStorage.removeItem('readingTextAlign'); localStorage.removeItem('readingFontFamily'); localStorage.removeItem('readingContentWidth');
                localStorage.removeItem('readingKeepScreenOn'); localStorage.removeItem('readingImmersiveMode');

                applyFontSize(defaultReadingSettings.fontSizeMultiplier); if (fontSizeSlider) fontSizeSlider.value = defaultReadingSettings.fontSizeMultiplier * 100;
                applyReadingTheme(defaultReadingSettings.readingTheme, false);
                applyLineHeight(defaultReadingSettings.lineHeight); if (lineHeightSlider) lineHeightSlider.value = defaultReadingSettings.lineHeight;
                applyTextAlign(defaultReadingSettings.textAlign);
                applyFontFamily(defaultReadingSettings.fontFamily); if (fontFamilySelect) fontFamilySelect.value = defaultReadingSettings.fontFamily;
                applyContentWidth(defaultReadingSettings.contentWidth); if (contentWidthSlider) { let sv = 2; if (defaultReadingSettings.contentWidth === 'narrow') sv = 1; else if (defaultReadingSettings.contentWidth === 'wide') sv = 3; contentWidthSlider.value = sv; }
                if (keepScreenOnToggle) { keepScreenOnToggle.checked = defaultReadingSettings.keepScreenOn; releaseWakeLock(); if (wakeLockStatusDisplay) wakeLockStatusDisplay.style.display = 'none'; }
                if (toggleImmersiveModeSettingsButton) toggleImmersiveModeSettingsButton.checked = defaultReadingSettings.immersiveMode;
                deactivateImmersiveMode();
                alert('تمام تنظیمات مطالعه به پیش‌فرض بازگردانده شدند.');
                playSound('uiInteraction');
            }
        });
    }

    // --- Initial Load & Hash Handling ---
    function loadInitialSettingsAndContent() {
        applyMainTheme(currentMainTheme); // Apply main site theme first
        loadReadingSettings(); // Apply all reading-specific settings
        loadGeneralData();
        fetchAllDataForSearch(); // Fetch in background

        const hash = window.location.hash.substring(1);
        if (hash) { setTimeout(() => loadSectionContent(hash), 100); }
        else { showHomePage(); }

        window.addEventListener('scroll', simpleHeroParallax);
        simpleHeroParallax();

        // Apply initial immersive mode if saved and toggle exists
        if (toggleImmersiveModeSettingsButton && localStorage.getItem('readingImmersiveMode') === 'true') {
            activateImmersiveModeGeneric();
        }
    }
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash && hash !== currentDetailSectionId) loadSectionContent(hash);
        else if (!hash && currentDetailSectionId) showHomePage();
        else if (!hash && !currentDetailSectionId) showHomePage();
    });

    function loadReadingSettings() {
        applyFontSize(parseFloat(localStorage.getItem('readingFontSize')) || defaultReadingSettings.fontSizeMultiplier);
        if (fontSizeSlider) fontSizeSlider.value = (parseFloat(localStorage.getItem('readingFontSize')) || defaultReadingSettings.fontSizeMultiplier) * 100;

        applyReadingTheme(localStorage.getItem('readingTheme') || defaultReadingSettings.readingTheme, false);

        applyLineHeight(parseFloat(localStorage.getItem('readingLineHeight')) || defaultReadingSettings.lineHeight);
        if (lineHeightSlider) lineHeightSlider.value = parseFloat(localStorage.getItem('readingLineHeight')) || defaultReadingSettings.lineHeight;

        applyTextAlign(localStorage.getItem('readingTextAlign') || defaultReadingSettings.textAlign);
        if(alignOptionButtons) alignOptionButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.textAlign === (localStorage.getItem('readingTextAlign') || defaultReadingSettings.textAlign)));


        applyFontFamily(localStorage.getItem('readingFontFamily') || defaultReadingSettings.fontFamily);
        if (fontFamilySelect) fontFamilySelect.value = localStorage.getItem('readingFontFamily') || defaultReadingSettings.fontFamily;

        applyContentWidth(localStorage.getItem('readingContentWidth') || defaultReadingSettings.contentWidth);
        if (contentWidthSlider) {
            const cw = localStorage.getItem('readingContentWidth') || defaultReadingSettings.contentWidth;
            contentWidthSlider.value = cw === 'narrow' ? 1 : (cw === 'wide' ? 3 : 2);
        }

        if (keepScreenOnToggle) {
            const savedKeepScreenOn = localStorage.getItem('readingKeepScreenOn') === 'true';
            keepScreenOnToggle.checked = savedKeepScreenOn;
            if (savedKeepScreenOn && wakeLockStatusDisplay && 'wakeLock' in navigator) {
                wakeLockStatusDisplay.textContent = 'روشن ماندن صفحه قبلاً فعال بود. برای فعال‌سازی مجدد، یک بار دکمه را خاموش و روشن کنید.';
                wakeLockStatusDisplay.className = 'setting-note visible'; wakeLockStatusDisplay.style.display = 'block';
            }
        }
        if (toggleImmersiveModeSettingsButton) {
             const savedImmersive = localStorage.getItem('readingImmersiveMode') === 'true';
             toggleImmersiveModeSettingsButton.checked = savedImmersive;
             // Actual application of immersive mode is handled in loadInitialSettingsAndContent
        }
    }

    loadInitialSettingsAndContent();

}); // End of DOMContentLoaded
