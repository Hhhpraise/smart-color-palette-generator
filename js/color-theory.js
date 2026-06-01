'use strict';

// ─── Namespace ────────────────────────────────────────────────────────────
window.Chromatic = window.Chromatic || {};

// ─── Color Theory ─────────────────────────────────────────────────────────
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

    static generateTintsShades(hex) {
        const [h, s, l] = this.hexToHsl(hex);
        const tints = [];
        const shades = [];
        for (let i = 0; i <= 10; i++) {
            tints.push(this.hslToHex(h, s, l + (100 - l) * (i / 10)));
            shades.push(this.hslToHex(h, s, l * (1 - i / 10)));
        }
        return { tints, shades };
    }

    static mix(hex1, hex2, ratio) {
        const rgb1 = this.hexToHsl(hex1);
        const rgb2 = this.hexToHsl(hex2);
        const h = rgb1[0] + (rgb2[0] - rgb1[0]) * ratio;
        const s = rgb1[1] + (rgb2[1] - rgb1[1]) * ratio;
        const l = rgb1[2] + (rgb2[2] - rgb1[2]) * ratio;
        return this.hslToHex(h, s, l);
    }
}

// ─── Utility Functions ────────────────────────────────────────────────────
function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

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

function bestTextColor(bgHex) {
    return getContrastRatio(bgHex, '#FFFFFF') >= getContrastRatio(bgHex, '#000000')
        ? '#FFFFFF' : '#000000';
}

function isValidHex(hex) {
    return /^#[0-9A-F]{6}$/i.test(hex);
}

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

function getContrastTier(ratio) {
    if (ratio >= 7) return { tier: 'AAA', cls: 'tier-aaa', icon: 'star' };
    if (ratio >= 4.5) return { tier: 'AA', cls: 'tier-aa', icon: 'check-circle' };
    if (ratio >= 3) return { tier: 'Lg', cls: 'tier-lg', icon: 'info-circle', label: 'Large Text' };
    return { tier: '!', cls: 'tier-fail', icon: 'exclamation-triangle', label: 'Fail' };
}

window.Chromatic.ColorTheory = ColorTheory;
window.Chromatic.hexToRgb = hexToRgb;
window.Chromatic.getLuminance = getLuminance;
window.Chromatic.getContrastRatio = getContrastRatio;
window.Chromatic.bestTextColor = bestTextColor;
window.Chromatic.isValidHex = isValidHex;
window.Chromatic.generateRandomColor = generateRandomColor;
window.Chromatic.shuffleArray = shuffleArray;
window.Chromatic.debounce = debounce;
window.Chromatic.copyToClipboard = copyToClipboard;
window.Chromatic.getContrastTier = getContrastTier;
