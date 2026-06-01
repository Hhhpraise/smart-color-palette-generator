'use strict';

window.Chromatic = window.Chromatic || {};
const C = window.Chromatic;

// ─── Color Blindness Simulation (Brettel-Vienot-Mollon method) ────────────
// RGB → LMS → deficiency transform → RGB

function rgbToLinear(r, g, b) {
    return [r, g, b].map(c => {
        c /= 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
}

function linearToRgb(l) {
    return Math.round((l <= 0.0031308 ? l * 12.92 : 1.055 * l ** (1 / 2.4) - 0.055) * 255);
}

// RGB → LMS (using Hunt-Pointer-Estevez transform)
function rgbToLms(r, g, b) {
    const lin = rgbToLinear(r, g, b);
    const l = lin[0] * 0.31399022 + lin[1] * 0.63951294 + lin[2] * 0.04649755;
    const m = lin[0] * 0.15537241 + lin[1] * 0.75789446 + lin[2] * 0.08670142;
    const s = lin[0] * 0.01775239 + lin[1] * 0.10944209 + lin[2] * 0.87256922;
    return [l, m, s];
}

// LMS → RGB (inverse)
function lmsToRgb(l, m, s) {
    const r = l *  5.47221206 + m * -4.6419601  + s *  0.16963708;
    const g = l * -1.1252419  + m *  2.29317098 + s * -0.1678952;
    const b = l *  0.02980165 + m * -0.19318073 + s *  1.16364789;
    return [
        Math.max(0, Math.min(255, linearToRgb(r))),
        Math.max(0, Math.min(255, linearToRgb(g))),
        Math.max(0, Math.min(255, linearToRgb(b)))
    ];
}

function hexToRgbArr(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
}

function rgbArrToHex([r, g, b]) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// Deficiency matrices (simplified Brettel approach on LMS space)
const DEFICIENCY_MATRICES = {
    protanopia: {
        // Red-green deficiency: L channel is shifted
        apply: function(l, m, s) {
            const newL = m * 2.02344 - s * 0.02344;
            const newM = m;
            return [newL, newM, s];
        }
    },
    deuteranopia: {
        // Green deficiency: M channel is shifted
        apply: function(l, m, s) {
            const newM = l * 0.49421 + s * 0.50579;
            return [l, newM, s];
        }
    },
    tritanopia: {
        // Blue-yellow deficiency: S channel is shifted
        apply: function(l, m, s) {
            const newS = l * 0.01611 + m * 0.98389;
            return [l, m, newS];
        }
    }
};

function simulateColorBlindness(hex, type) {
    const rgb = hexToRgbArr(hex);
    const lms = rgbToLms(rgb[0], rgb[1], rgb[2]);
    const matrix = DEFICIENCY_MATRICES[type];
    if (!matrix) return hex;
    const [newL, newM, newS] = matrix.apply(lms[0], lms[1], lms[2]);
    const newRgb = lmsToRgb(newL, newM, newS);
    return rgbArrToHex(newRgb);
}

function applyColorBlindSim(type) {
    const app = C.App;
    if (!app.currentPalette.length) return;

    const btns = document.querySelectorAll('.cvd-btn');
    btns.forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.cvd-btn[data-cvd="${type}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    if (type === 'normal') {
        app.applyWebsiteColors(app.displayedArrangement);
        return;
    }

    const simulated = app.displayedArrangement.map(c => simulateColorBlindness(c, type));
    app.applyWebsiteColors(simulated);
}

// Attach
const Tools = {
    simulateColorBlindness,
    applyColorBlindSim,
};

window.Chromatic.Tools = Tools;
