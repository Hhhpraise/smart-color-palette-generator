'use strict';

// ─── Color Theory ────────────────────────────────────────────────────────────
class ColorTheory {
    static hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s * 100, l * 100];
    }

    // FIX: use safe modulo so negative hue values wrap correctly
    static hslToHex(h, s, l) {
        h = ((h % 360) + 360) % 360;
        s /= 100; l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;
        if      (h < 60)  { r = c; g = x; }
        else if (h < 120) { r = x; g = c; }
        else if (h < 180) { g = c; b = x; }
        else if (h < 240) { g = x; b = c; }
        else if (h < 300) { r = x; b = c; }
        else              { r = c; b = x; }
        return '#' + [r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
    }

    static complementary(hex) {
        const [h, s, l] = this.hexToHsl(hex);
        return [
            hex,
            this.hslToHex(h + 180, s, l),
            this.hslToHex(h, Math.max(20, s - 20), Math.min(80, l + 10)),
            this.hslToHex(h + 180, Math.max(20, s - 20), Math.min(80, l + 10)),
            this.hslToHex(h, s, Math.max(20, l - 20)),
            this.hslToHex(h + 180, s, Math.max(20, l - 20)),
        ];
    }

    static analogous(hex) {
        const [h, s, l] = this.hexToHsl(hex);
        return [
            this.hslToHex(h - 60, s, l),
            this.hslToHex(h - 30, s, l),
            hex,
            this.hslToHex(h + 30, s, l),
            this.hslToHex(h + 60, s, l),
            this.hslToHex(h, Math.max(20, s - 30), Math.min(90, l + 15)),
        ];
    }

    static triadic(hex) {
        const [h, s, l] = this.hexToHsl(hex);
        return [
            hex,
            this.hslToHex(h + 120, s, l),
            this.hslToHex(h + 240, s, l),
            this.hslToHex(h, Math.max(30, s - 20), Math.min(85, l + 15)),
            this.hslToHex(h + 120, Math.max(30, s - 20), Math.min(85, l + 15)),
            this.hslToHex(h + 240, Math.max(30, s - 20), Math.min(85, l + 15)),
        ];
    }

    static monochromatic(hex) {
        const [h, s, l] = this.hexToHsl(hex);
        return [
            this.hslToHex(h, s, Math.min(90, l + 30)),
            this.hslToHex(h, s, Math.min(80, l + 15)),
            hex,
            this.hslToHex(h, s, Math.max(20, l - 15)),
            this.hslToHex(h, s, Math.max(10, l - 30)),
            this.hslToHex(h, Math.max(20, s - 30), l),
        ];
    }

    static splitComplementary(hex) {
        const [h, s, l] = this.hexToHsl(hex);
        const comp = h + 180;
        return [
            hex,
            this.hslToHex(comp - 30, s, l),
            this.hslToHex(comp + 30, s, l),
            this.hslToHex(h, Math.max(20, s - 20), Math.min(85, l + 10)),
            this.hslToHex(comp - 30, Math.max(20, s - 20), Math.min(85, l + 10)),
            this.hslToHex(comp + 30, Math.max(20, s - 20), Math.min(85, l + 10)),
        ];
    }
}

// ─── Utilities ───────────────────────────────────────────────────────────────
function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

// FIX: WCAG 2.1 uses 0.04045, not 0.03928
function getLuminance(r, g, b) {
    return [r, g, b].reduce((sum, c, i) => {
        c /= 255;
        c = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        return sum + c * [0.2126, 0.7152, 0.0722][i];
    }, 0);
}

function getContrastRatio(hex1, hex2) {
    const rgb1 = hexToRgb(hex1), rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return 1;
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// Picks white or black based on whichever actually has higher contrast
function bestTextColor(bgHex) {
    return getContrastRatio(bgHex, '#FFFFFF') >= getContrastRatio(bgHex, '#000000')
        ? '#FFFFFF' : '#000000';
}

function isValidHex(hex) {
    return /^#[0-9A-F]{6}$/i.test(hex);
}

// FIX: was 16777215, which excludes #FFFFFF
function generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
}

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// FIX: clipboard fallback for HTTP or older browsers
async function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(text);
    }
    const el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    if (!ok) throw new Error('Copy failed');
}

// ─── URL State (shareable palettes) ──────────────────────────────────────────
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

// ─── Notification ─────────────────────────────────────────────────────────────
function showNotification(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    const icon = toast.querySelector('i');
    const span = toast.querySelector('.toast-message');
    icon.className = `fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}`;
    icon.style.color = type === 'error' ? '#FF3B30' : '#34C759';
    span.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Main App ─────────────────────────────────────────────────────────────────
const app = {
    currentAlgorithm: 'monochromatic',
    currentPalette: [],
    displayedArrangement: [],

    init() {
        this.bindEvents();
        this.bindKeyboardShortcuts();

        // Restore from URL if present
        const state = loadState();
        if (state.color && isValidHex(state.color)) {
            document.getElementById('colorPicker').value = state.color;
            document.getElementById('hexInput').value = state.color.toUpperCase();
        }
        if (state.algorithm) {
            this.currentAlgorithm = state.algorithm;
            document.querySelectorAll('.harmony-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.algorithm === state.algorithm);
            });
        }

        const initial = document.getElementById('colorPicker').value;
        document.getElementById('colorPreview').style.backgroundColor = initial;
        document.getElementById('hexInput').value = initial.toUpperCase();
        this.generatePalette();
    },

    bindEvents() {
        const picker  = document.getElementById('colorPicker');
        const hexIn   = document.getElementById('hexInput');
        const preview = document.getElementById('colorPreview');

        picker.addEventListener('input', (e) => {
            const hex = e.target.value.toUpperCase();
            hexIn.value = hex;
            preview.style.backgroundColor = hex;
            this.generatePalette();
        });

        // FIX: debounce hex input — was calling generatePalette on every keystroke
        const debouncedGenerate = debounce(() => this.generatePalette(), 150);
        hexIn.addEventListener('input', (e) => {
            const hex = e.target.value.toUpperCase();
            if (isValidHex(hex)) {
                picker.value = hex;
                preview.style.backgroundColor = hex;
                hexIn.style.borderColor = '';
                debouncedGenerate();
            } else {
                hexIn.style.borderColor = '#FF3B30';
            }
        });

        // FIX: use `btn` from forEach closure, not e.target (which can be the <i> icon)
        document.querySelectorAll('.harmony-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.harmony-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentAlgorithm = btn.dataset.algorithm;
                this.generatePalette();
            });
        });

        document.getElementById('generateBtn').addEventListener('click', () => this.generatePalette());

        document.getElementById('randomBtn').addEventListener('click', () => {
            const color = generateRandomColor();
            picker.value = color;
            hexIn.value = color.toUpperCase();
            preview.style.backgroundColor = color;
            this.generatePalette();
        });

        document.getElementById('optimizeBtn').addEventListener('click', () => this.optimizeReadability());
        document.getElementById('shuffleColorsBtn').addEventListener('click', () => this.shuffleColors());
        document.getElementById('exportPNG').addEventListener('click', () => this.exportAsPNG());
        document.getElementById('exportSVG').addEventListener('click', () => this.exportAsSVG());
        document.getElementById('copyAllBtn').addEventListener('click', () => this.copyAllColors());

        const cssBtn = document.getElementById('copyCSSBtn');
        if (cssBtn) cssBtn.addEventListener('click', () => this.copyCSSVariables());

        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) shareBtn.addEventListener('click', () => this.sharePalette());
    },

    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Space = random (only when not in an input)
            if (e.code === 'Space' && !e.target.matches('input, textarea, button')) {
                e.preventDefault();
                document.getElementById('randomBtn').click();
            }
            // Enter in hex field = generate
            if (e.code === 'Enter' && document.activeElement === document.getElementById('hexInput')) {
                e.preventDefault();
                this.generatePalette();
            }
            // 1–5 = switch harmony mode (only when not in input)
            if (e.code >= 'Digit1' && e.code <= 'Digit5' && !e.target.matches('input, textarea')) {
                const idx = parseInt(e.code.slice(-1)) - 1;
                document.querySelectorAll('.harmony-btn')[idx]?.click();
            }
        });
    },

    generatePalette() {
        const hex = document.getElementById('hexInput').value.toUpperCase();
        if (!isValidHex(hex)) {
            showNotification('Enter a valid hex code — e.g. #FF5733', 'error');
            return;
        }

        const generators = {
            complementary:     () => ColorTheory.complementary(hex),
            analogous:         () => ColorTheory.analogous(hex),
            triadic:           () => ColorTheory.triadic(hex),
            monochromatic:     () => ColorTheory.monochromatic(hex),
            splitComplementary:() => ColorTheory.splitComplementary(hex),
        };

        this.currentPalette = (generators[this.currentAlgorithm] ?? generators.monochromatic)();

        document.getElementById('paletteName').textContent =
            this.currentAlgorithm.charAt(0).toUpperCase() + this.currentAlgorithm.slice(1);

        const best = this.findBestReadabilityArrangement(this.currentPalette);
        this.displayedArrangement = best.arrangement;

        this.applyWebsiteColors(this.displayedArrangement);
        this.displayPalette(this.currentPalette);
        this.updateReadabilityUI(best.score);

        saveState(hex, this.currentAlgorithm);
    },

    calculateReadabilityScore(palette) {
        if (palette.length < 3) return { score: 0, rating: 'Poor', className: 'score-poor' };

        let total = 0, count = 0;

        // Background vs its best text color
        const bgRatio = getContrastRatio(palette[0], bestTextColor(palette[0]));
        total += bgRatio >= 7 ? 3 : bgRatio >= 4.5 ? 2 : bgRatio >= 3 ? 1 : 0;
        count++;

        // Button colors vs their text
        for (let i = 2; i < Math.min(5, palette.length); i++) {
            const ratio = getContrastRatio(palette[i], bestTextColor(palette[i]));
            total += ratio >= 7 ? 3 : ratio >= 4.5 ? 2 : ratio >= 3 ? 1 : 0;
            count++;
        }

        // Adjacent pair contrasts
        for (let i = 0; i < Math.min(4, palette.length - 1); i++) {
            for (let j = i + 1; j < Math.min(4, palette.length); j++) {
                const ratio = getContrastRatio(palette[i], palette[j]);
                total += ratio >= 4.5 ? 2 : ratio >= 3 ? 1 : 0;
                count++;
            }
        }

        const avg = total / Math.max(1, count);
        const rating = avg >= 2.2 ? 'Excellent' : avg >= 1.3 ? 'Good' : 'Needs Improvement';
        return {
            score: avg,
            rating,
            className: avg >= 2.2 ? 'score-excellent' : avg >= 1.3 ? 'score-good' : 'score-poor',
        };
    },

    // FIX: reduced from 200 to 120 iterations; still finds excellent arrangements
    // but more importantly this is now only called when palette changes, not on every keypress
    findBestReadabilityArrangement(palette) {
        let best = { arrangement: [...palette], score: this.calculateReadabilityScore(palette) };
        for (let i = 0; i < 120; i++) {
            const candidate = shuffleArray(palette);
            const score = this.calculateReadabilityScore(candidate);
            if (score.score > best.score.score) {
                best = { arrangement: candidate, score };
                if (score.rating === 'Excellent') break;
            }
        }
        return best;
    },

    updateReadabilityUI(score) {
        const el = document.getElementById('readabilityScore');
        const iconName = score.rating === 'Excellent' ? 'check-circle'
                       : score.rating === 'Good'      ? 'star'
                       : 'exclamation-triangle';
        el.innerHTML = `<i class="fas fa-${iconName}"></i> <span>${score.rating}</span>`;
        el.className = `readability-score ${score.className}`;
    },

    applyWebsiteColors(palette) {
        if (palette.length < 3) return;
        const [c0, c1, c2, c3] = palette;

        const hero         = document.querySelector('.mockup-hero');
        const nav          = document.querySelector('.mockup-nav');
        const footer       = document.querySelector('.mockup-footer');
        const buttons      = document.querySelectorAll('.mockup-btn');
        const featureCards = document.querySelectorAll('.feature-card');
        const bgAnimation  = document.querySelector('.background-animation');

        if (hero) {
            hero.style.background = `linear-gradient(135deg, ${c0}, ${c1})`;
            hero.style.color = bestTextColor(c0);
        }
        if (nav) {
            nav.style.backgroundColor = c0;
            nav.style.color = bestTextColor(c0);
        }
        if (footer) {
            footer.style.backgroundColor = c0;
            footer.style.color = bestTextColor(c0);
        }
        buttons.forEach((btn, i) => {
            const color = i === 0 ? c2 : c3;
            if (!color) return;
            btn.style.backgroundColor = color;
            btn.style.color = bestTextColor(color);
        });
        featureCards.forEach((card, i) => {
            const color = palette[i + 2];
            if (!color) return;
            card.style.backgroundColor = `${color}20`;
            // Keep card text readable against near-transparent background
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
        const btn = document.getElementById('optimizeBtn');
        btn.classList.add('loading');
        btn.disabled = true;

        // Yield to browser so the loading state actually renders before the sync work runs
        requestAnimationFrame(() => {
            setTimeout(() => {
                const best = this.findBestReadabilityArrangement(this.currentPalette);
                this.displayedArrangement = best.arrangement;
                this.applyWebsiteColors(this.displayedArrangement);
                this.updateReadabilityUI(best.score);
                showNotification(
                    best.score.rating === 'Excellent'
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
        this.displayedArrangement = shuffleArray(this.currentPalette);
        this.applyWebsiteColors(this.displayedArrangement);
        this.updateReadabilityUI(this.calculateReadabilityScore(this.displayedArrangement));
        showNotification('Preview arrangement shuffled.');
    },

    displayPalette(palette) {
        const grid = document.getElementById('paletteGrid');
        grid.innerHTML = '';
        grid.classList.add('animate');

        palette.forEach(color => {
            const rgb = hexToRgb(color);
            const [h, s, l] = ColorTheory.hexToHsl(color);
            const contrastRatio = getContrastRatio(color, '#FFFFFF');

            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            // FIX: swatches are interactive but weren't keyboard-accessible
            swatch.setAttribute('role', 'button');
            swatch.setAttribute('tabindex', '0');
            swatch.setAttribute('aria-label', `Copy color ${color.toUpperCase()}`);

            swatch.innerHTML = `
                <div class="color-info">
                    <div class="hex-code">${color.toUpperCase()}</div>
                    <div class="rgb-code">RGB ${rgb.r}, ${rgb.g}, ${rgb.b}</div>
                    <div class="rgb-code">HSL ${Math.round(h)}° ${Math.round(s)}% ${Math.round(l)}%</div>
                    ${contrastRatio < 4.5 ? '<div class="contrast-warning">Low contrast</div>' : ''}
                </div>
                <div class="swatch-copied-overlay" aria-hidden="true">✓</div>
            `;

            const copyAction = async () => {
                try {
                    await copyToClipboard(color.toUpperCase());
                    swatch.classList.add('copied');
                    setTimeout(() => swatch.classList.remove('copied'), 1200);
                    showNotification(`${color.toUpperCase()} copied.`);
                } catch {
                    showNotification('Copy failed — try manually.', 'error');
                }
            };

            swatch.addEventListener('click', copyAction);
            swatch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyAction(); }
            });

            grid.appendChild(swatch);
        });

        setTimeout(() => grid.classList.remove('animate'), 500);
    },

    async copyAllColors() {
        if (!this.currentPalette.length) {
            showNotification('No palette to copy.', 'error');
            return;
        }
        try {
            await copyToClipboard(this.currentPalette.map(c => c.toUpperCase()).join('\n'));
            showNotification('All hex codes copied.');
        } catch {
            showNotification('Copy failed.', 'error');
        }
    },

    // NEW: Export as CSS custom properties — useful for developers
    async copyCSSVariables() {
        if (!this.currentPalette.length) {
            showNotification('Generate a palette first.', 'error');
            return;
        }
        const label = this.currentAlgorithm.toLowerCase();
        const vars = this.currentPalette
            .map((c, i) => `  --${label}-${i + 1}: ${c.toUpperCase()};`)
            .join('\n');
        const css = `:root {\n${vars}\n}`;
        try {
            await copyToClipboard(css);
            showNotification('CSS variables copied.');
        } catch {
            showNotification('Copy failed.', 'error');
        }
    },

    // NEW: Share current palette via URL copy
    async sharePalette() {
        const url = window.location.href;
        try {
            await copyToClipboard(url);
            showNotification('Share URL copied to clipboard!');
        } catch {
            showNotification('Copy failed.', 'error');
        }
    },

    exportAsPNG() {
        const canvas = document.getElementById('exportCanvas');
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

            ctx.fillStyle = bestTextColor(color);
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
            const textColor = bestTextColor(color);
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
};

document.addEventListener('DOMContentLoaded', () => app.init());

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
});