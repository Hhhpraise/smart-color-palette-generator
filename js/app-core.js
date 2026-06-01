'use strict';

window.Chromatic = window.Chromatic || {};

const C = window.Chromatic;
const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

// ─── Notification ─────────────────────────────────────────────────────────
function showNotification(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    if (!toast) return;
    const icon = toast.querySelector('i');
    const span = toast.querySelector('.toast-message');
    icon.className = `fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}`;
    icon.style.color = type === 'error' ? '#FF3B30' : '#34C759';
    span.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── URL State ────────────────────────────────────────────────────────────
function saveState(color, algorithm) {
    const p = new URLSearchParams({ c: color.slice(1), a: algorithm });
    history.replaceState(null, '', `?${p}`);
}

function loadState() {
    const p = new URLSearchParams(location.search);
    const color = p.get('c') ? `#${p.get('c')}` : null;
    const algorithm = p.get('a') || null;
    return { color, algorithm };
}

// ─── Modal System ─────────────────────────────────────────────────────────
function createModal(id, content) {
    let existing = document.getElementById(id);
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'chr-modal';
    modal.innerHTML = `
        <div class="chr-modal-backdrop"></div>
        <div class="chr-modal-container">
            <button class="chr-modal-close" aria-label="Close">&times;</button>
            <div class="chr-modal-body">${content}</div>
        </div>`;
    document.body.appendChild(modal);

    const close = () => { modal.classList.remove('open'); setTimeout(() => modal.remove(), 300); };
    modal.querySelector('.chr-modal-backdrop').addEventListener('click', close);
    modal.querySelector('.chr-modal-close').addEventListener('click', close);
    modal.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    requestAnimationFrame(() => modal.classList.add('open'));
    return { modal, close };
}

// ─── Main App ─────────────────────────────────────────────────────────────
const App = {
    currentAlgorithm: 'monochromatic',
    currentPalette: [],
    displayedArrangement: [],
    lockedColors: new Set(),
    copyFormat: 'hex',

    init() {
        const settings = C.Storage.getSettings();
        this.copyFormat = settings.copyFormat || 'hex';
        this.applyTheme(settings.theme || 'dark');
        if (!settings.onboardingDone) this.showOnboarding();

        this.bindEvents();
        this.bindKeyboardShortcuts();
        this.setupDragDrop();
        this.setupTabs();

        const state = loadState();
        if (state.color && C.isValidHex(state.color)) {
            $('#colorPicker').value = state.color;
            $('#hexInput').value = state.color.toUpperCase();
        }
        if (state.algorithm) {
            this.currentAlgorithm = state.algorithm;
            $$('.harmony-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.algorithm === state.algorithm);
            });
        }

        const initial = $('#colorPicker').value;
        $('#colorPreview').style.backgroundColor = initial;
        $('#hexInput').value = initial.toUpperCase();
        this.generatePalette();
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const btn = $('#themeToggle');
        if (btn) {
            btn.innerHTML = theme === 'dark'
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
            btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
        }
    },

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        this.applyTheme(next);
        C.Storage.setSettings({ theme: next });
    },

    showOnboarding() {
        const content = `
            <div class="onboarding-content">
                <div class="onboarding-icon"><i class="fas fa-palette"></i></div>
                <h2>Welcome to Chromatic Studio</h2>
                <p class="onboarding-sub">Your intelligent color palette companion</p>
                <div class="onboarding-steps">
                    <div class="on-step">
                        <div class="on-step-num">1</div>
                        <div><strong>Pick a color</strong><span>Enter a hex code or use the color picker</span></div>
                    </div>
                    <div class="on-step">
                        <div class="on-step-num">2</div>
                        <div><strong>Choose harmony</strong><span>Select from 5 color theory algorithms</span></div>
                    </div>
                    <div class="on-step">
                        <div class="on-step-num">3</div>
                        <div><strong>Export & use</strong><span>Copy codes, download PNG/SVG/PDF, or save favorites</span></div>
                    </div>
                </div>
                <button class="btn btn-generate onboarding-cta">Get Started</button>
            </div>`;
        const { close } = createModal('onboardingModal', content);
        $('.onboarding-cta').addEventListener('click', () => {
            close();
            C.Storage.setSettings({ onboardingDone: true });
        });
    },

    setupTabs() {
        $$('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.dataset.tab;
                $$('.tab-pane').forEach(p => p.classList.remove('active'));
                const pane = $(`#tab-${tab}`);
                if (pane) pane.classList.add('active');

                if (tab === 'history') this.renderHistory();
                if (tab === 'gallery') this.renderGallery();
                if (tab === 'tools') this.renderTools();
            });
        });
    },

    // ── Events ──
    bindEvents() {
        const picker  = $('#colorPicker');
        const hexIn   = $('#hexInput');
        const preview = $('#colorPreview');

        picker.addEventListener('input', (e) => {
            const hex = e.target.value.toUpperCase();
            hexIn.value = hex;
            preview.style.backgroundColor = hex;
            this.generatePalette();
        });

        const debouncedGenerate = C.debounce(() => this.generatePalette(), 150);
        hexIn.addEventListener('input', (e) => {
            const hex = e.target.value.toUpperCase();
            if (C.isValidHex(hex)) {
                picker.value = hex;
                preview.style.backgroundColor = hex;
                hexIn.style.borderColor = '';
                debouncedGenerate();
            } else {
                hexIn.style.borderColor = '#FF3B30';
            }
        });

        $$('.harmony-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.harmony-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentAlgorithm = btn.dataset.algorithm;
                this.generatePalette();
            });
        });

        $('#generateBtn').addEventListener('click', () => this.generatePalette());
        $('#randomBtn').addEventListener('click', () => {
            const color = C.generateRandomColor();
            picker.value = color;
            hexIn.value = color.toUpperCase();
            preview.style.backgroundColor = color;
            this.generatePalette();
        });

        $('#optimizeBtn').addEventListener('click', () => this.optimizeReadability());
        $('#shuffleColorsBtn').addEventListener('click', () => this.shuffleColors());
        $('#exportPNG').addEventListener('click', () => this.exportAsPNG());
        $('#exportSVG').addEventListener('click', () => this.exportAsSVG());
        $('#copyAllBtn').addEventListener('click', () => this.copyAllColors());

        const themeBtn = $('#themeToggle');
        if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

        // Format toggle pills
        $$('.format-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                $$('.format-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.copyFormat = pill.dataset.format;
                C.Storage.setSettings({ copyFormat: this.copyFormat });
            });
        });

        // Delegate: Copy format toggle init
        const activeFormat = this.copyFormat;
        $$('.format-pill').forEach(p => {
            p.classList.toggle('active', p.dataset.format === activeFormat);
        });
    },

    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input, textarea, button')) {
                e.preventDefault();
                $('#randomBtn').click();
            }
            if (e.code === 'Enter' && document.activeElement === $('#hexInput')) {
                e.preventDefault();
                this.generatePalette();
            }
            if (e.code >= 'Digit1' && e.code <= 'Digit5' && !e.target.matches('input, textarea')) {
                const idx = parseInt(e.code.slice(-1)) - 1;
                $$('.harmony-btn')[idx]?.click();
            }
        });
    },

    // ── Palette Generation ──
    generatePalette() {
        const hex = $('#hexInput').value.toUpperCase();
        if (!C.isValidHex(hex)) {
            showNotification('Enter a valid hex code — e.g. #FF5733', 'error');
            return;
        }

        const generators = {
            complementary:     () => C.ColorTheory.complementary(hex),
            analogous:         () => C.ColorTheory.analogous(hex),
            triadic:           () => C.ColorTheory.triadic(hex),
            monochromatic:     () => C.ColorTheory.monochromatic(hex),
            splitComplementary:() => C.ColorTheory.splitComplementary(hex),
        };

        let palette = (generators[this.currentAlgorithm] ?? generators.monochromatic)();

        // Preserve locked colors
        if (this.lockedColors.size > 0) {
            const oldArr = [...this.displayedArrangement];
            palette = palette.map((c, i) => this.lockedColors.has(i) ? (oldArr[i] || c) : c);
        }

        this.currentPalette = palette;

        $('#paletteName').textContent =
            this.currentAlgorithm.charAt(0).toUpperCase() + this.currentAlgorithm.slice(1);

        const best = this.findBestReadabilityArrangement(this.currentPalette, this.lockedColors);
        this.displayedArrangement = best.arrangement;

        this.applyWebsiteColors(this.displayedArrangement);
        this.displayPalette(this.currentPalette);
        this.updateReadabilityUI(best.score);
        this.updateHarmonyPreviews(hex);

        C.Storage.addToHistory({
            colors: this.currentPalette.map(c => c),
            algorithm: this.currentAlgorithm,
            baseColor: hex,
            name: ''
        });

        saveState(hex, this.currentAlgorithm);
    },

    calculateReadabilityScore(palette) {
        if (palette.length < 3) return { score: 0, rating: 'Needs Work', className: 'score-poor' };

        let total = 0, count = 0;
        const bgRatio = C.getContrastRatio(palette[0], C.bestTextColor(palette[0]));
        total += bgRatio >= 7 ? 3 : bgRatio >= 4.5 ? 2 : bgRatio >= 3 ? 1 : 0;
        count++;

        for (let i = 2; i < Math.min(5, palette.length); i++) {
            const ratio = C.getContrastRatio(palette[i], C.bestTextColor(palette[i]));
            total += ratio >= 7 ? 3 : ratio >= 4.5 ? 2 : ratio >= 3 ? 1 : 0;
            count++;
        }

        for (let i = 0; i < Math.min(4, palette.length - 1); i++) {
            for (let j = i + 1; j < Math.min(4, palette.length); j++) {
                const ratio = C.getContrastRatio(palette[i], palette[j]);
                total += ratio >= 4.5 ? 2 : ratio >= 3 ? 1 : 0;
                count++;
            }
        }

        const avg = total / Math.max(1, count);
        const rating = avg >= 2.5 ? 'AAA' : avg >= 1.8 ? 'AA' : avg >= 1.2 ? 'Large Text' : 'Needs Work';
        return {
            score: avg,
            rating,
            className: avg >= 2.5 ? 'score-aaa' : avg >= 1.8 ? 'score-aa' : avg >= 1.2 ? 'score-lg' : 'score-poor',
        };
    },

    findBestReadabilityArrangement(palette, locked) {
        let best = { arrangement: [...palette], score: this.calculateReadabilityScore(palette) };
        const lockedSet = locked || this.lockedColors;
        for (let i = 0; i < 120; i++) {
            // Only shuffle unlocked indices
            let candidate;
            if (lockedSet && lockedSet.size > 0) {
                const unlocked = palette.filter((_, i) => !lockedSet.has(i));
                const shuffled = C.shuffleArray(unlocked);
                candidate = palette.map((c, i) => lockedSet.has(i) ? c : (shuffled.shift() || c));
            } else {
                candidate = C.shuffleArray(palette);
            }
            const score = this.calculateReadabilityScore(candidate);
            if (score.score > best.score.score) {
                best = { arrangement: candidate, score };
                if (score.rating === 'AAA') break;
            }
        }
        return best;
    },

    updateReadabilityUI(score) {
        const el = $('#readabilityScore');
        if (!el) return;
        const icons = { 'AAA': 'star', 'AA': 'check-circle', 'Large Text': 'info-circle', 'Needs Work': 'exclamation-triangle' };
        const colors = { 'AAA': '#2ed47a', 'AA': '#34C759', 'Large Text': '#f59e0b', 'Needs Work': '#ff4d4d' };
        el.innerHTML = `<i class="fas fa-${icons[score.rating] || 'exclamation-triangle'}" style="color:${colors[score.rating] || '#ff4d4d'}"></i><span>${score.rating}</span>`;
        el.className = `readability-score ${score.className}`;
    },

    // ── Harmony Preview Dots ──
    updateHarmonyPreviews(baseHex) {
        const algorithms = ['monochromatic', 'complementary', 'analogous', 'triadic', 'splitComplementary'];
        algorithms.forEach(algo => {
            const btn = $(`.harmony-btn[data-algorithm="${algo}"]`);
            if (!btn) return;
            const chips = btn.querySelector('.hbtn-chips');
            if (!chips) return;

            const generators = {
                complementary:     () => C.ColorTheory.complementary(baseHex),
                analogous:         () => C.ColorTheory.analogous(baseHex),
                triadic:           () => C.ColorTheory.triadic(baseHex),
                monochromatic:     () => C.ColorTheory.monochromatic(baseHex),
                splitComplementary:() => C.ColorTheory.splitComplementary(baseHex),
            };

            const colors = (generators[algo] || generators.monochromatic)();
            const previewColors = colors.slice(0, 4);
            chips.innerHTML = previewColors.map(c =>
                `<span class="hbtn-chip" style="background:${c}" title="${c.toUpperCase()}"></span>`
            ).join('');
        });
    },

    // ── Website Preview Colors ──
    applyWebsiteColors(palette) {
        if (palette.length < 3) return;
        const [c0, c1, c2, c3] = palette;

        const hero         = $('.mockup-hero');
        const nav          = $('.mockup-nav');
        const footer       = $('.mockup-footer');
        const buttons      = $$('.mockup-btn');
        const featureCards = $$('.feature-card');
        const bgAnimation  = $('.background-animation');

        if (hero) {
            hero.style.background = `linear-gradient(135deg, ${c0}, ${c1})`;
            hero.style.color = C.bestTextColor(c0);
        }
        if (nav) {
            nav.style.backgroundColor = c0;
            nav.style.color = C.bestTextColor(c0);
        }
        if (footer) {
            footer.style.backgroundColor = c0;
            footer.style.color = C.bestTextColor(c0);
        }
        buttons.forEach((btn, i) => {
            const color = i === 0 ? c2 : c3;
            if (!color) return;
            btn.style.backgroundColor = color;
            btn.style.color = C.bestTextColor(color);
        });
        featureCards.forEach((card, i) => {
            const color = palette[i + 2];
            if (!color) return;
            card.style.backgroundColor = `${color}20`;
            card.style.color = '#1d1d1f';
            const icon = card.querySelector('i');
            if (icon) icon.style.color = color;
        });
        if (bgAnimation) {
            bgAnimation.style.background =
                `linear-gradient(-45deg, ${c0}, ${c1}, ${c2 ?? c0}, ${c3 ?? c1})`;
        }
    },

    optimizeReadability() {
        if (!this.currentPalette.length) {
            showNotification('Generate a palette first.', 'error');
            return;
        }
        const btn = $('#optimizeBtn');
        btn.classList.add('loading');
        btn.disabled = true;
        requestAnimationFrame(() => {
            setTimeout(() => {
                const best = this.findBestReadabilityArrangement(this.currentPalette);
                this.displayedArrangement = best.arrangement;
                this.applyWebsiteColors(this.displayedArrangement);
                this.updateReadabilityUI(best.score);
                showNotification(
                    best.score.rating === 'AAA'
                        ? 'Optimal arrangement applied.'
                        : `Best found: ${best.score.rating}`
                );
                btn.classList.remove('loading');
                btn.disabled = false;
            }, 50);
        });
    },

    shuffleColors() {
        if (!this.currentPalette.length) return;
        this.displayedArrangement = C.shuffleArray(this.currentPalette);
        this.applyWebsiteColors(this.displayedArrangement);
        this.updateReadabilityUI(this.calculateReadabilityScore(this.displayedArrangement));
        showNotification('Preview arrangement shuffled.');
    },

    // ── Display Palette ──
    displayPalette(palette) {
        const grid = $('#paletteGrid');
        if (!grid) return;
        grid.innerHTML = '';
        grid.classList.add('animate');

        palette.forEach((color, index) => {
            const rgb = C.hexToRgb(color);
            const [h, s, l] = C.ColorTheory.hexToHsl(color);
            const contrastRatio = C.getContrastRatio(color, '#FFFFFF');
            const tier = C.getContrastTier(contrastRatio);
            const isLocked = this.lockedColors.has(index);

            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.setAttribute('role', 'button');
            swatch.setAttribute('tabindex', '0');
            swatch.setAttribute('aria-label', `Copy color ${color.toUpperCase()}`);
            swatch.dataset.index = index;

            swatch.innerHTML = `
                <div class="color-info">
                    <div class="hex-code">${color.toUpperCase()}</div>
                    <div class="rgb-code">RGB ${rgb.r}, ${rgb.g}, ${rgb.b}</div>
                    <div class="rgb-code">HSL ${Math.round(h)}° ${Math.round(s)}% ${Math.round(l)}%</div>
                    <div class="contrast-badge ${tier.cls}" title="White text contrast: ${contrastRatio.toFixed(1)}:1">${tier.tier}</div>
                </div>
                <button class="lock-btn ${isLocked ? 'locked' : ''}" data-index="${index}" aria-label="${isLocked ? 'Unlock' : 'Lock'} color" title="${isLocked ? 'Unlock' : 'Lock'} color">
                    <i class="fas fa-${isLocked ? 'lock' : 'lock-open'}"></i>
                </button>
                <div class="drag-handle" aria-hidden="true"><i class="fas fa-grip-vertical"></i></div>
                <div class="swatch-copied-overlay" aria-hidden="true">✓</div>
            `;

            // Copy action with format toggle
            const copyAction = async (e) => {
                let text = color.toUpperCase();
                const format = this.copyFormat;
                if (e.shiftKey || format === 'rgb') {
                    text = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                } else if (e.altKey || format === 'hsl') {
                    text = `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
                }
                try {
                    await C.copyToClipboard(text);
                    swatch.classList.add('copied');
                    setTimeout(() => swatch.classList.remove('copied'), 1200);
                    showNotification(`${text} copied.`);
                } catch {
                    showNotification('Copy failed — try manually.', 'error');
                }
            };

            swatch.addEventListener('click', copyAction);
            swatch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyAction(e); }
            });

            // Lock button
            swatch.querySelector('.lock-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.lockedColors.has(index)) {
                    this.lockedColors.delete(index);
                } else {
                    this.lockedColors.add(index);
                }
                this.displayPalette(this.currentPalette);
            });

            // Tints/shades on double-click
            swatch.addEventListener('dblclick', (e) => {
                e.preventDefault();
                this.showTintsShades(color);
            });

            grid.appendChild(swatch);
        });

        setTimeout(() => grid.classList.remove('animate'), 500);
    },

    // ── Drag & Drop ──
    setupDragDrop() {
        const grid = $('#paletteGrid');
        if (!grid) return;

        grid.addEventListener('dragstart', (e) => {
            const swatch = e.target.closest('.color-swatch');
            if (!swatch) { e.preventDefault(); return; }
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', swatch.dataset.index);
            swatch.classList.add('dragging');
        });

        grid.addEventListener('dragend', (e) => {
            const swatch = e.target.closest('.color-swatch');
            if (swatch) swatch.classList.remove('dragging');
        });

        grid.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const target = e.target.closest('.color-swatch');
            if (target) target.classList.add('drag-over');
        });

        grid.addEventListener('dragleave', (e) => {
            const target = e.target.closest('.color-swatch');
            if (target) target.classList.remove('drag-over');
        });

        grid.addEventListener('drop', (e) => {
            e.preventDefault();
            const target = e.target.closest('.color-swatch');
            if (target) target.classList.remove('drag-over');
            const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
            const toIdx = parseInt(target?.dataset?.index, 10);
            if (isNaN(fromIdx) || isNaN(toIdx) || fromIdx === toIdx) return;

            // Reorder
            const p = [...this.currentPalette];
            const d = [...this.displayedArrangement];
            const [movedPalette] = p.splice(fromIdx, 1);
            const [movedDisplay] = d.splice(fromIdx, 1);
            p.splice(toIdx, 0, movedPalette);
            d.splice(toIdx, 0, movedDisplay);
            this.currentPalette = p;
            this.displayedArrangement = d;
            this.applyWebsiteColors(this.displayedArrangement);
            this.displayPalette(this.currentPalette);
        });
    },

    // ── Tints & Shades ──
    showTintsShades(hex) {
        const { tints, shades } = C.ColorTheory.generateTintsShades(hex);
        const tintHtml = tints.map((c, i) =>
            `<div class="ts-cell" style="background:${c}" data-color="${c}" title="${c.toUpperCase()}"><span>${c.toUpperCase()}</span><small>${i*10}%</small></div>`
        ).join('');
        const shadeHtml = shades.map((c, i) =>
            `<div class="ts-cell" style="background:${c}" data-color="${c}" title="${c.toUpperCase()}"><span>${c.toUpperCase()}</span><small>${i*10}%</small></div>`
        ).join('');

        const content = `
            <div class="ts-explorer">
                <h3>Tints & Shades</h3>
                <div class="ts-original" style="background:${hex}"><span>${hex.toUpperCase()}</span><small>Original</small></div>
                <h4>Tints (+white)</h4>
                <div class="ts-strip">${tintHtml}</div>
                <h4>Shades (+black)</h4>
                <div class="ts-strip">${shadeHtml}</div>
            </div>`;

        const { close } = createModal('tintsShadesModal', content);
        $$('.ts-cell').forEach(cell => {
            cell.addEventListener('click', async () => {
                const c = cell.dataset.color;
                await C.copyToClipboard(c);
                showNotification(`${c} copied.`);
            });
        });
    },

    // ── History ──
    renderHistory() {
        const container = $('#historyGrid');
        if (!container) return;
        const history = C.Storage.getHistory();
        if (!history.length) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-history"></i><p>No recent palettes. Generate one first!</p></div>';
            return;
        }
        container.innerHTML = history.map(p => `
            <div class="history-card" data-id="${p.id}">
                <div class="hc-swatches">${p.colors.map(c => `<span class="hc-swatch" style="background:${c}"></span>`).join('')}</div>
                <div class="hc-info">
                    <span class="hc-name">${p.algorithm}</span>
                    <span class="hc-time">${timeAgo(p.createdAt)}</span>
                </div>
            </div>
        `).join('');

        $$('.history-card').forEach(card => {
            card.addEventListener('click', () => {
                const entry = history.find(p => p.id === card.dataset.id);
                if (!entry) return;
                $('#colorPicker').value = entry.baseColor || entry.colors[0];
                $('#hexInput').value = (entry.baseColor || entry.colors[0]).toUpperCase();
                $('#colorPreview').style.backgroundColor = entry.baseColor || entry.colors[0];
                this.currentAlgorithm = entry.algorithm;
                $$('.harmony-btn').forEach(b => b.classList.toggle('active', b.dataset.algorithm === entry.algorithm));
                this.currentPalette = [...entry.colors];
                this.displayedArrangement = [...entry.colors];
                this.displayPalette(this.currentPalette);
                this.applyWebsiteColors(this.displayedArrangement);
                this.updateReadabilityUI(this.calculateReadabilityScore(this.currentPalette));
                this.updateHarmonyPreviews(entry.baseColor || entry.colors[0]);

                // Switch to palette tab
                $$('.tab-btn').forEach(b => b.classList.remove('active'));
                const paletteTab = $('.tab-btn[data-tab="palette"]');
                if (paletteTab) paletteTab.classList.add('active');
                $$('.tab-pane').forEach(p => p.classList.remove('active'));
                const palettePane = $('#tab-palette');
                if (palettePane) palettePane.classList.add('active');

                showNotification('Palette restored from history.');
            });
        });
    },

    // ── Gallery ──
    renderGallery() {
        const container = $('#galleryGrid');
        if (!container) return;
        const palettes = C.Gallery ? C.Gallery.getCurated() : [];
        container.innerHTML = palettes.map(p => `
            <div class="gallery-card" data-id="${p.id}">
                <div class="gc-swatches">${p.colors.map(c => `<span class="gc-swatch" style="background:${c}"></span>`).join('')}</div>
                <div class="gc-name">${p.name}</div>
                <div class="gc-tags">${(p.tags || []).map(t => `<span class="gc-tag">${t}</span>`).join('')}</div>
            </div>
        `).join('');

        $$('.gallery-card').forEach(card => {
            card.addEventListener('click', () => {
                const p = palettes.find(pp => pp.id === card.dataset.id);
                if (!p) return;
                $('#colorPicker').value = p.colors[0];
                $('#hexInput').value = p.colors[0].toUpperCase();
                $('#colorPreview').style.backgroundColor = p.colors[0];
                this.currentAlgorithm = p.algorithm || 'monochromatic';
                $$('.harmony-btn').forEach(b => b.classList.toggle('active', b.dataset.algorithm === this.currentAlgorithm));
                this.currentPalette = [...p.colors];
                this.displayedArrangement = [...p.colors];
                this.displayPalette(this.currentPalette);
                this.applyWebsiteColors(this.displayedArrangement);
                this.updateReadabilityUI(this.calculateReadabilityScore(this.currentPalette));
                this.updateHarmonyPreviews(p.colors[0]);
                showNotification(`"${p.name}" loaded.`);
            });
        });
    },

    // ── Tools Tab ──
    renderTools() {
        const container = $('#toolsContainer');
        if (!container || container._rendered) return;
        container._rendered = true;

        // Image extraction setup
        const dropZone = $('#imageDropZone');
        const fileInput = $('#imageFileInput');
        if (dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());
            dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-active'); });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-active'));
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-active');
                const file = e.dataTransfer.files[0];
                if (file) this.extractImageColors(file);
            });
            fileInput.addEventListener('change', (e) => {
                if (e.target.files[0]) this.extractImageColors(e.target.files[0]);
            });
        }

        // Gradient builder setup
        const angleSlider = $('#gradientAngle');
        const angleVal = $('#angleValue');
        if (angleSlider && angleVal) {
            angleSlider.addEventListener('input', () => {
                angleVal.textContent = angleSlider.value + '°';
                this.updateGradientPreview();
            });
        }

        // Bind gradient color pickers
        $$('.grad-stop-color').forEach(picker => {
            picker.addEventListener('input', () => this.updateGradientPreview());
        });
        $$('.grad-stop-pos').forEach(input => {
            input.addEventListener('input', () => this.updateGradientPreview());
        });

        this.updateGradientPreview();
    },

    extractImageColors(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxDim = 200;
                const scale = Math.min(maxDim / img.width, maxDim / img.height);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                // 64-bucket color quantization
                const buckets = {};
                for (let i = 0; i < pixels.length; i += 4) {
                    const r = Math.floor(pixels[i] / 64);
                    const g = Math.floor(pixels[i + 1] / 64);
                    const b = Math.floor(pixels[i + 2] / 64);
                    const key = `${r},${g},${b}`;
                    if (!buckets[key]) buckets[key] = { r: 0, g: 0, b: 0, count: 0 };
                    buckets[key].r += pixels[i];
                    buckets[key].g += pixels[i + 1];
                    buckets[key].b += pixels[i + 2];
                    buckets[key].count++;
                }

                const sorted = Object.values(buckets)
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6)
                    .map(b => {
                        const r = Math.round(b.r / b.count).toString(16).padStart(2, '0');
                        const g = Math.round(b.g / b.count).toString(16).padStart(2, '0');
                        const bv = Math.round(b.b / b.count).toString(16).padStart(2, '0');
                        return `#${r}${g}${bv}`;
                    });

                const extractedContainer = $('#extractedColors');
                if (extractedContainer) {
                    extractedContainer.innerHTML = sorted.map(c =>
                        `<span class="extracted-swatch" style="background:${c}" title="${c.toUpperCase()}"><span>${c.toUpperCase()}</span></span>`
                    ).join('');
                }

                const useBtn = $('#useExtractedBtn');
                if (useBtn) {
                    useBtn.style.display = 'block';
                    // Remove old listener by cloning
                    const newBtn = useBtn.cloneNode(true);
                    useBtn.parentNode.replaceChild(newBtn, useBtn);
                    newBtn.addEventListener('click', () => {
                    if (sorted.length === 0) return;
                    $('#colorPicker').value = sorted[0];
                    $('#hexInput').value = sorted[0].toUpperCase();
                    $('#colorPreview').style.backgroundColor = sorted[0];
                    this.currentPalette = [...sorted];
                    this.displayedArrangement = [...sorted];
                    this.displayPalette(this.currentPalette);
                    this.applyWebsiteColors(this.displayedArrangement);
                    this.updateReadabilityUI(this.calculateReadabilityScore(this.currentPalette));
                    this.updateHarmonyPreviews(sorted[0]);
                        showNotification('Colors extracted from image.');
                    });
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    updateGradientPreview() {
        const angle = $('#gradientAngle')?.value || '135';
        const type = $('input[name="gradType"]:checked')?.value || 'linear';

        const stops = [];
        $$('.grad-stop').forEach(stop => {
            const color = stop.querySelector('.grad-stop-color')?.value || '#000000';
            const pos = stop.querySelector('.grad-stop-pos')?.value || '0';
            stops.push(`${color} ${pos}%`);
        });

        const css = type === 'linear'
            ? `background: linear-gradient(${angle}deg, ${stops.join(', ')});`
            : `background: radial-gradient(circle, ${stops.join(', ')});`;

        const preview = $('#gradientPreview');
        if (preview) preview.style.cssText = css;

        const codeEl = $('#gradientCode');
        if (codeEl) codeEl.textContent = css;

        if ($('#angleValue')) $('#angleValue').textContent = angle + '°';
    },

    copyGradientCSS() {
        const code = $('#gradientCode')?.textContent || '';
        C.copyToClipboard(code).then(() => showNotification('Gradient CSS copied.')).catch(() => showNotification('Copy failed.', 'error'));
    },

    // ── Copy All ──
    async copyAllColors() {
        if (!this.currentPalette.length) {
            showNotification('No palette to copy.', 'error');
            return;
        }
        try {
            await C.copyToClipboard(this.currentPalette.map(c => c.toUpperCase()).join('\n'));
            showNotification('All hex codes copied.');
        } catch {
            showNotification('Copy failed.', 'error');
        }
    },

    // ── PNG Export ──
    exportAsPNG() {
        const canvas = $('#exportCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = 1200, H = 600;
        canvas.width = W; canvas.height = H;

        const grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, this.currentPalette[0]);
        grad.addColorStop(1, this.currentPalette[1] ?? this.currentPalette[0]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        const SW = 140, SH = 140, GAP = 24;
        const total = this.currentPalette.length;
        const startX = (W - (total * (SW + GAP) - GAP)) / 2;
        const startY = (H - SH) / 2 - 20;

        this.currentPalette.forEach((color, i) => {
            const x = startX + i * (SW + GAP);
            ctx.fillStyle = color;
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(x, startY, SW, SH, 12);
                ctx.fill();
            } else {
                ctx.fillRect(x, startY, SW, SH);
            }
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, startY, SW, SH);

            ctx.fillStyle = C.bestTextColor(color);
            ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, Arial';
            ctx.textAlign = 'center';
            ctx.fillText(color.toUpperCase(), x + SW / 2, startY + SH + 28);
        });

        const label = this.currentAlgorithm.charAt(0).toUpperCase() + this.currentAlgorithm.slice(1);
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${label} Palette`, W / 2, startY - 30);

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '15px Arial';
        ctx.fillText('Smart Color Palette · hhhpraise.github.io', W / 2, H - 24);

        const link = document.createElement('a');
        link.download = `palette-${this.currentAlgorithm}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showNotification('PNG exported.');
    },

    // ── SVG Export ──
    exportAsSVG() {
        const W = 1200, H = 600;
        const SW = 140, SH = 140, GAP = 24;
        const total = this.currentPalette.length;
        const startX = (W - (total * (SW + GAP) - GAP)) / 2;
        const startY = (H - SH) / 2 - 20;
        const label = this.currentAlgorithm.charAt(0).toUpperCase() + this.currentAlgorithm.slice(1);

        let svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${this.currentPalette[0]}"/>
      <stop offset="100%" stop-color="${this.currentPalette[1] ?? this.currentPalette[0]}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <text x="${W / 2}" y="${startY - 30}" text-anchor="middle" font-family="-apple-system,Arial" font-size="38" font-weight="bold" fill="rgba(255,255,255,0.92)">${label} Palette</text>\n`;

        this.currentPalette.forEach((color, i) => {
            const x = startX + i * (SW + GAP);
            const textColor = C.bestTextColor(color);
            svg += `  <rect x="${x}" y="${startY}" width="${SW}" height="${SH}" rx="12" fill="${color}" stroke-opacity="0.3" stroke="#ffffff" stroke-width="2"/>
  <text x="${x + SW / 2}" y="${startY + SH + 28}" text-anchor="middle" font-family="Arial" font-size="15" font-weight="bold" fill="${textColor}">${color.toUpperCase()}</text>\n`;
        });

        svg += `  <text x="${W / 2}" y="${H - 24}" text-anchor="middle" font-family="Arial" font-size="15" fill-opacity="0.5" fill="#ffffff">Smart Color Palette · hhhpraise.github.io</text>
</svg>`;

        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = `palette-${this.currentAlgorithm}.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
        showNotification('SVG exported.');
    },

    // ── Favorites ──
    saveCurrentToFavorites(name) {
        const fav = C.Storage.saveFavorite({
            colors: this.currentPalette.map(c => c),
            algorithm: this.currentAlgorithm,
            baseColor: $('#hexInput').value.toUpperCase(),
            name: name || this.currentAlgorithm,
            collection: ''
        });
        showNotification(`"${fav.name}" saved to favorites.`);
        this.renderFavoritesMini();
    },

    renderFavoritesMini() {
        const container = $('#favoritesMini');
        if (!container) return;
        const favs = C.Storage.getFavorites().slice(0, 3);
        if (!favs.length) {
            container.innerHTML = '<div class="fav-empty">No favorites yet</div>';
            return;
        }
        container.innerHTML = favs.map(f => `
            <div class="fav-mini-row" data-id="${f.id}">
                <div class="fav-mini-swatches">${f.colors.slice(0, 4).map(c => `<span style="background:${c}"></span>`).join('')}</div>
                <span class="fav-mini-name">${f.name}</span>
            </div>
        `).join('');

        $$('.fav-mini-row', container).forEach(row => {
            row.addEventListener('click', () => {
                const fav = favs.find(f => f.id === row.dataset.id);
                if (!fav) return;
                $('#colorPicker').value = fav.baseColor;
                $('#hexInput').value = fav.baseColor.toUpperCase();
                $('#colorPreview').style.backgroundColor = fav.baseColor;
                this.currentAlgorithm = fav.algorithm;
                $$('.harmony-btn').forEach(b => b.classList.toggle('active', b.dataset.algorithm === fav.algorithm));
                this.currentPalette = [...fav.colors];
                this.displayedArrangement = [...fav.colors];
                this.displayPalette(this.currentPalette);
                this.applyWebsiteColors(this.displayedArrangement);
                this.updateReadabilityUI(this.calculateReadabilityScore(this.currentPalette));
                this.updateHarmonyPreviews(fav.baseColor);
            });
        });
    },

    // ── PDF Export ──────────────────────────────────────────────────────
    exportAsPDF() {
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            showNotification('PDF library not loaded.', 'error');
            return;
        }
        const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1200, 700] });
        const W = 1200, H = 700;
        const bgColors = this.currentPalette;
        const steps = 20;
        for (let i = 0; i < steps; i++) {
            const ratio = i / (steps - 1);
            const c = C.ColorTheory.mix(bgColors[0], bgColors[1] || bgColors[0], ratio);
            doc.setFillColor(c);
            doc.rect(0, (H / steps) * i, W, H / steps + 1, 'F');
        }
        const SW = 145, SH = 145, GAP = 28;
        const total = bgColors.length;
        const startX = (W - (total * (SW + GAP) - GAP)) / 2;
        const startY = (H - SH) / 2 - 30;
        bgColors.forEach((color, i) => {
            const x = startX + i * (SW + GAP);
            doc.setFillColor(color);
            doc.roundedRect(x, startY, SW, SH, 10, 10, 'F');
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(2);
            doc.roundedRect(x, startY, SW, SH, 10, 10, 'S');
            doc.setTextColor(C.bestTextColor(color));
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13);
            doc.text(color.toUpperCase(), x + SW / 2, startY + SH + 20, { align: 'center' });
        });
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);
        const label = this.currentAlgorithm.charAt(0).toUpperCase() + this.currentAlgorithm.slice(1);
        doc.text(`${label} Palette`, W / 2, startY - 40, { align: 'center' });
        const score = this.calculateReadabilityScore(this.currentPalette);
        doc.setFontSize(14);
        doc.setTextColor(200, 200, 200);
        doc.text(`WCAG Rating: ${score.rating}`, W / 2, startY - 16, { align: 'center' });
        doc.setFontSize(11);
        doc.setTextColor(150, 150, 150);
        doc.text('Generated by Smart Color Palette', W / 2, H - 30, { align: 'center' });
        doc.save(`palette-${this.currentAlgorithm}.pdf`);
        showNotification('PDF exported.');
    },

    // ── Tailwind Config Export ──────────────────────────────────────────
    exportTailwindConfig() {
        if (!this.currentPalette.length) {
            showNotification('Generate a palette first.', 'error');
            return;
        }
        const names = ['primary', 'secondary', 'accent', 'neutral', 'base', 'muted'];
        const colors = this.currentPalette.map((c, i) =>
            `        '${names[i] || `color-${i + 1}`}': '${c.toUpperCase()}',`).join('\n');
        const config = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors}\n      }\n    }\n  },\n  plugins: [],\n};`;
        C.copyToClipboard(config).then(() => {
            showNotification('Tailwind config copied.');
        }).catch(() => showNotification('Copy failed.', 'error'));
    },

    // ── CSS Variables ───────────────────────────────────────────────────
    copyCSSVariables() {
        if (!this.currentPalette.length) {
            showNotification('Generate a palette first.', 'error');
            return;
        }
        const label = this.currentAlgorithm.toLowerCase();
        const vars = this.currentPalette.map((c, i) => `  --${label}-${i + 1}: ${c.toUpperCase()};`).join('\n');
        C.copyToClipboard(`:root {\n${vars}\n}`).then(() => {
            showNotification('CSS variables copied.');
        }).catch(() => showNotification('Copy failed.', 'error'));
    },

    // ── Share ──────────────────────────────────────────────────────────
    async sharePalette() {
        try {
            await C.copyToClipboard(window.location.href);
            showNotification('Share URL copied!');
        } catch { showNotification('Copy failed.', 'error'); }
    },
};

// ─── Helper: timeAgo ──────────────────────────────────────────────────────
function timeAgo(ts) {
    const diff = Date.now() - ts;
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return 'just now';
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const d = Math.floor(hr / 24);
    if (d < 30) return `${d}d ago`;
    return new Date(ts).toLocaleDateString();
}

window.Chromatic.App = App;
window.Chromatic.showNotification = showNotification;
window.Chromatic.createModal = createModal;
