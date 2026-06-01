'use strict';

// C is already declared in app-core.js which loads first — do NOT redeclare

// ─── Color Blindness Simulation (Machado 2009 / Brettel-Vienot-Mollon) ──────
// Uses LMS-space projection matrices to simulate dichromatic vision.

function rgbToLinear(r, g, b) {
    return [r, g, b].map(c => {
        c /= 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
}

function linearToRgb(l) {
    const v = l <= 0.0031308 ? l * 12.92 : 1.055 * l ** (1 / 2.4) - 0.055;
    return Math.round(v * 255);
}

// Linear RGB → LMS (Hunt-Pointer-Estevez)
const RGB2LMS = [
    [0.31399022, 0.63951294, 0.04649755],
    [0.15537241, 0.75789446, 0.08670142],
    [0.01775239, 0.10944209, 0.87256922],
];

// LMS → Linear RGB
const LMS2RGB = [
    [ 5.47221206, -4.6419601,   0.16963708],
    [-1.1252419,   2.29317098, -0.1678952 ],
    [ 0.02980165, -0.19318073,  1.16364789],
];

function rgbToLms(r, g, b) {
    const lin = rgbToLinear(r, g, b);
    const l = lin[0] * RGB2LMS[0][0] + lin[1] * RGB2LMS[0][1] + lin[2] * RGB2LMS[0][2];
    const m = lin[0] * RGB2LMS[1][0] + lin[1] * RGB2LMS[1][1] + lin[2] * RGB2LMS[1][2];
    const s = lin[0] * RGB2LMS[2][0] + lin[1] * RGB2LMS[2][1] + lin[2] * RGB2LMS[2][2];
    return [l, m, s];
}

function lmsToRgb(l, m, s) {
    const r = l * LMS2RGB[0][0] + m * LMS2RGB[0][1] + s * LMS2RGB[0][2];
    const g = l * LMS2RGB[1][0] + m * LMS2RGB[1][1] + s * LMS2RGB[1][2];
    const b = l * LMS2RGB[2][0] + m * LMS2RGB[2][1] + s * LMS2RGB[2][2];
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

// Projection matrices for dichromatic vision (Vienot-Brettel-Mollon 1999).
// These map the LMS response of a normal trichromat onto the dichromat's
// reduced-colour plane (the plane of constant L+M+S).
const DEFICIENCY_MATRICES = {
    protanopia: [
        [0.0,      2.02344, -0.02344],
        [0.0,      1.0,      0.0     ],
        [0.0,      0.0,      1.0     ],
    ],
    deuteranopia: [
        [1.0,      0.0,      0.0     ],
        [0.494207, 0.0,      0.505793],
        [0.0,      0.0,      1.0     ],
    ],
    tritanopia: [
        [1.0,      0.0,      0.0     ],
        [0.0,      1.0,      0.0     ],
        [-0.395913, 0.801109, 0.0     ],
    ],
};

function simulateColorBlindness(hex, type) {
    const rgb = hexToRgbArr(hex);
    const lms = rgbToLms(rgb[0], rgb[1], rgb[2]);
    const M = DEFICIENCY_MATRICES[type];
    if (!M) return hex;

    const newL = lms[0] * M[0][0] + lms[1] * M[0][1] + lms[2] * M[0][2];
    const newM = lms[0] * M[1][0] + lms[1] * M[1][1] + lms[2] * M[1][2];
    const newS = lms[0] * M[2][0] + lms[1] * M[2][1] + lms[2] * M[2][2];

    const newRgb = lmsToRgb(newL, newM, newS);
    return rgbArrToHex(newRgb);
}

function applyColorBlindSim(type) {
    const app = C.App;
    if (!app.currentPalette.length) return;

    const btns = document.querySelectorAll('.cvd-btn');
    btns.forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector('.cvd-btn[data-cvd="' + type + '"]');
    if (activeBtn) activeBtn.classList.add('active');

    app.currentCVD = type === 'normal' ? null : type;

    // Always pass the raw displayed colors — applyWebsiteColors handles CVD via currentCVD flag
    const raw = app._rawPreviewColors && app._rawPreviewColors.length
        ? app._rawPreviewColors.slice()
        : app.displayedArrangement.slice();
    app.applyWebsiteColors(raw);

    if (type === 'normal') {
        app.updateReadabilityUI(app.calculateReadabilityScore(app.displayedArrangement));
    } else {
        const simulated = raw.map(function(c) { return simulateColorBlindness(c, type); });
        app.updateReadabilityUI(app.calculateReadabilityScore(simulated));
        C.showNotification('Simulating ' + (activeBtn ? activeBtn.textContent : type) + '.');
    }
}

// Attach
var Tools = {
    simulateColorBlindness: simulateColorBlindness,
    applyColorBlindSim: applyColorBlindSim,
};

window.Chromatic.Tools = Tools;
