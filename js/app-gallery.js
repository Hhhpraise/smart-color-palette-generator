'use strict';

window.Chromatic = window.Chromatic || {};
const C = window.Chromatic;

// ─── Curated Palettes ─────────────────────────────────────────────────────
const CURATED_PALETTES = [
    { id: 'cp1',  name: 'Sunset Boulevard',    colors: ['#FF6B6B','#FF8E72','#FFA07A','#FECA57','#FF9FF3','#F368E0'], algorithm: 'complementary', tags: ['warm', 'bold', 'summer'] },
    { id: 'cp2',  name: 'Nordic Frost',        colors: ['#DFE6E9','#B2BEC3','#636E72','#2D3436','#0984E3','#74B9FF'], algorithm: 'monochromatic', tags: ['cool', 'minimal', 'corporate'] },
    { id: 'cp3',  name: 'Forest Canopy',        colors: ['#00B894','#55EFC4','#81ECEC','#00CEC9','#6C5CE7','#A29BFE'], algorithm: 'analogous', tags: ['nature', 'fresh', 'green'] },
    { id: 'cp4',  name: 'Midnight Galaxy',      colors: ['#2D3436','#636E72','#6C5CE7','#A29BFE','#FD79A8','#FDCB6E'], algorithm: 'triadic', tags: ['dark', 'modern', 'tech'] },
    { id: 'cp5',  name: 'Citrus Burst',         colors: ['#FDCB6E','#F39C12','#E17055','#D63031','#FFEAA7','#FAB1A0'], algorithm: 'analogous', tags: ['warm', 'energetic', 'food'] },
    { id: 'cp6',  name: 'Ocean Depths',         colors: ['#0ABDE3','#0984E3','#341F97','#5F27CD','#01A3A4','#00D2D3'], algorithm: 'monochromatic', tags: ['blue', 'calm', 'tech'] },
    { id: 'cp7',  name: 'Autumn Harvest',       colors: ['#D63031','#E17055','#FDCB6E','#E58E26','#B71540','#6D214F'], algorithm: 'complementary', tags: ['fall', 'warm', 'rustic'] },
    { id: 'cp8',  name: 'Lavender Fields',      colors: ['#A29BFE','#6C5CE7','#B794F4','#9B59B6','#D6A2E8','#F8A5C2'], algorithm: 'monochromatic', tags: ['purple', 'soft', 'feminine'] },
    { id: 'cp9',  name: 'Retro Pop',            colors: ['#F368E0','#FF9FF3','#FF6B6B','#FECA57','#48DBFB','#0ABDE3'], algorithm: 'triadic', tags: ['vibrant', 'retro', 'playful'] },
    { id: 'cp10', name: 'Earthy Terracotta',    colors: ['#8B4513','#A0522D','#CD853F','#DEB887','#D2691E','#F4A460'], algorithm: 'analogous', tags: ['earthy', 'warm', 'natural'] },
    { id: 'cp11', name: 'Arctic Monochrome',     colors: ['#F5F6FA','#DCDDE1','#B2BEC3','#636E72','#2D3436','#0C0C0E'], algorithm: 'monochromatic', tags: ['minimal', 'bw', 'clean'] },
    { id: 'cp12', name: 'Tropical Punch',       colors: ['#FF6B6B','#FECA57','#48DBFB','#FF9FF3','#00D2D3','#55EFC4'], algorithm: 'splitComplementary', tags: ['bright', 'tropical', 'fun'] },
    { id: 'cp13', name: 'Royal Velvet',         colors: ['#341F97','#5F27CD','#6C5CE7','#A29BFE','#FD79A8','#E84393'], algorithm: 'analogous', tags: ['luxury', 'purple', 'elegant'] },
    { id: 'cp14', name: 'Mint Chocolate',       colors: ['#55EFC4','#00B894','#00CEC9','#00A8FF','#D63031','#6D214F'], algorithm: 'complementary', tags: ['fresh', 'contrast', 'modern'] },
    { id: 'cp15', name: 'Desert Rose',          colors: ['#E17055','#FDCB6E','#D63031','#B71540','#FAB1A0','#F39C12'], algorithm: 'analogous', tags: ['warm', 'desert', 'bold'] },
    { id: 'cp16', name: 'Cyberpunk Neon',       colors: ['#6C5CE7','#A29BFE','#F368E0','#FF9FF3','#00D2D3','#0ABDE3'], algorithm: 'splitComplementary', tags: ['neon', 'tech', 'vibrant'] },
    { id: 'cp17', name: 'Botanical Garden',     colors: ['#00B894','#55EFC4','#81ECEC','#74B9FF','#0984E3','#B794F4'], algorithm: 'analogous', tags: ['nature', 'fresh', 'spring'] },
    { id: 'cp18', name: 'Vintage Paper',        colors: ['#F5DEB3','#DEB887','#D2B48C','#F4A460','#CD853F','#8B4513'], algorithm: 'monochromatic', tags: ['vintage', 'warm', 'classic'] },
    { id: 'cp19', name: 'Electric Garden',      colors: ['#00B894','#55EFC4','#6C5CE7','#A29BFE','#F368E0','#FF9FF3'], algorithm: 'triadic', tags: ['vibrant', 'creative', 'bold'] },
    { id: 'cp20', name: 'Coastal Breeze',       colors: ['#74B9FF','#0984E3','#00CEC9','#55EFC4','#DFE6E9','#81ECEC'], algorithm: 'analogous', tags: ['blue', 'calm', 'beach'] },
    { id: 'cp21', name: 'Velvet Underground',   colors: ['#B71540','#D63031','#E84393','#FD79A8','#6D214F','#341F97'], algorithm: 'monochromatic', tags: ['dark', 'red', 'dramatic'] },
    { id: 'cp22', name: 'Golden Hour',          colors: ['#F39C12','#FDCB6E','#E58E26','#D63031','#E17055','#FAB1A0'], algorithm: 'analogous', tags: ['gold', 'warm', 'photography'] },
    { id: 'cp23', name: 'Arctic Aurora',        colors: ['#00D2D3','#74B9FF','#6C5CE7','#A29BFE','#55EFC4','#81ECEC'], algorithm: 'splitComplementary', tags: ['cool', 'aurora', 'magical'] },
    { id: 'cp24', name: 'Espresso Shot',        colors: ['#2D3436','#636E72','#B2BEC3','#8B4513','#A0522D','#CD853F'], algorithm: 'complementary', tags: ['dark', 'coffee', 'professional'] },
];

// ─── AI Color Naming (Heuristic) ──────────────────────────────────────────
function nameColor(hex) {
    const [h, s, l] = C.ColorTheory.hexToHsl(hex);

    const hueNames = [
        [0, 15, 'Red'], [15, 35, 'Orange-Red'], [35, 50, 'Orange'],
        [50, 65, 'Gold'], [65, 80, 'Yellow'], [80, 150, 'Green'],
        [150, 180, 'Teal'], [180, 200, 'Cyan'], [200, 230, 'Sky Blue'],
        [230, 260, 'Blue'], [260, 285, 'Indigo'], [285, 310, 'Purple'],
        [310, 335, 'Magenta'], [335, 360, 'Rose']
    ];

    let hueName = 'Unknown';
    for (const [lo, hi, name] of hueNames) {
        if (h >= lo && h < hi) { hueName = name; break; }
    }

    const satDesc = s > 70 ? 'Vivid' : s > 30 ? 'Muted' : 'Neutral';
    const lightDesc = l > 80 ? 'Very Light' : l > 65 ? 'Light' : l > 45 ? 'Medium' : l > 25 ? 'Dark' : 'Very Dark';

    // Simplify
    if (lightDesc === 'Very Light' && satDesc === 'Neutral') return `Pale ${hueName}`;
    if (lightDesc === 'Very Dark' && satDesc === 'Neutral') return `Deep ${hueName}`;
    if (satDesc === 'Neutral' && lightDesc === 'Medium') return `Soft ${hueName}`;
    if (satDesc === 'Vivid' && lightDesc === 'Medium') return `Bright ${hueName}`;

    return `${satDesc} ${lightDesc} ${hueName}`;
}

function namePalette(palette) {
    // Analyze the overall palette character
    const hsls = palette.map(c => C.ColorTheory.hexToHsl(c));
    const avgH = hsls.reduce((s, v) => s + v[0], 0) / hsls.length;
    const avgS = hsls.reduce((s, v) => s + v[1], 0) / hsls.length;
    const spread = Math.max(...hsls.map(h => h[0])) - Math.min(...hsls.map(h => h[0]));

    const hueFamilies = [
        [0, 'Red'], [1, 'Coral'], [2, 'Orange'], [3, 'Gold'], [4, 'Yellow'],
        [5, 'Lime'], [6, 'Green'], [7, 'Teal'], [8, 'Cyan'], [9, 'Blue'],
        [10, 'Indigo'], [11, 'Purple'], [12, 'Mauve'], [13, 'Rose']
    ];

    const primaryHue = hueFamilies[Math.round(((avgH % 360) / 360) * hueFamilies.length) % hueFamilies.length][1];

    const moods = [];
    if (avgS > 60) moods.push('Vibrant');
    if (avgS < 25) moods.push('Subdued');
    if (spread > 120) moods.push('Dramatic');
    if (spread < 30) moods.push('Refined');

    // Combine primary hue with a random evocative word
    const descriptors = [];
    if (primaryHue === 'Blue') descriptors.push('Ocean', 'Sky', 'Arctic', 'Azure', 'Sapphire');
    if (primaryHue === 'Green') descriptors.push('Forest', 'Garden', 'Emerald', 'Meadow', 'Verdant');
    if (primaryHue === 'Purple' || primaryHue === 'Mauve') descriptors.push('Lavender', 'Royal', 'Velvet', 'Orchid', 'Amethyst');
    if (primaryHue === 'Red' || primaryHue === 'Coral') descriptors.push('Crimson', 'Ruby', 'Sunset', 'Blaze', 'Scarlet');
    if (primaryHue === 'Orange' || primaryHue === 'Gold') descriptors.push('Sunset', 'Amber', 'Citrus', 'Copper', 'Ember');
    if (primaryHue === 'Teal' || primaryHue === 'Cyan') descriptors.push('Ocean', 'Coastal', 'Lagoon', 'Tide', 'Aqua');
    if (primaryHue === 'Yellow' || primaryHue === 'Gold') descriptors.push('Golden', 'Sunlit', 'Honey', 'Dawn', 'Harvest');
    if (primaryHue === 'Rose' || primaryHue === 'Magenta') descriptors.push('Blush', 'Rose', 'Flamingo', 'Peony', 'Berry');
    if (primaryHue === 'Indigo') descriptors.push('Midnight', 'Cosmos', 'Galaxy', 'Deep', 'Stellar');

    const desc = descriptors[Math.floor(Math.random() * descriptors.length)] || primaryHue;
    const mood = moods[Math.floor(Math.random() * moods.length)] || '';

    return mood ? `${mood} ${desc}` : desc;
}

// ─── Compare Mode ─────────────────────────────────────────────────────────
function showCompareMode() {
    const app = C.App;
    if (!app.currentPalette.length) {
        C.showNotification('Generate a palette first.', 'error');
        return;
    }

    const favorites = C.Storage.getFavorites();
    const curated = CURATED_PALETTES;

    // Build combined options: favorites first, then curated
    let options = '';
    if (favorites.length > 0) {
        options += '<optgroup label="Your Favorites">';
        favorites.forEach((f, i) => {
            options += `<option value="fav:${i}">⭐ ${f.name} (${f.algorithm})</option>`;
        });
        options += '</optgroup>';
    }
    if (curated.length > 0) {
        options += '<optgroup label="Curated Gallery">';
        curated.forEach((p, i) => {
            options += `<option value="cur:${i}">${p.name} (${p.tags.join(', ')})</option>`;
        });
        options += '</optgroup>';
    }

    const hasPalettes = favorites.length > 0 || curated.length > 0;

    const currentColors = app.currentPalette.map(c =>
        `<span class="cmp-swatch" style="background:${c}"><span>${c.toUpperCase()}</span></span>`
    ).join('');

    const content = `
        <div class="compare-view">
            <h3>Compare Palettes</h3>
            <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:16px">
                See how your current palette contrasts with any saved favorite or curated gallery palette.
                Green cells meet WCAG AA (≥4.5:1), yellow is marginal (≥3:1), red fails.
            </p>
            <div class="cmp-columns">
                <div class="cmp-col">
                    <h4>Current Palette</h4>
                    <div class="cmp-strip">${currentColors}</div>
                </div>
                <div class="cmp-col">
                    <h4>Compare With</h4>
                    ${hasPalettes
                        ? `<select id="cmpSelect" class="cmp-select">${options}</select>`
                        : '<p class="cmp-empty">No palettes available to compare.</p>'}
                    <div class="cmp-strip" id="cmpTarget"></div>
                </div>
            </div>
            <div id="cmpGrid" class="cmp-grid"></div>
        </div>`;

    const { close } = C.createModal('compareModal', content);

    if (!hasPalettes) return;

    const updateCompare = (value) => {
        let targetPalette;
        const [type, idxStr] = value.split(':');
        const idx = parseInt(idxStr, 10);

        if (type === 'fav') {
            targetPalette = favorites[idx];
        } else if (type === 'cur') {
            targetPalette = curated[idx];
        }

        if (!targetPalette) return;
        const targetColors = targetPalette.colors;

        const targetEl = document.getElementById('cmpTarget');
        if (targetEl) {
            targetEl.innerHTML = targetColors.map(c =>
                `<span class="cmp-swatch" style="background:${c}"><span>${c.toUpperCase()}</span></span>`
            ).join('');
        }

        // Contrast grid
        const grid = document.getElementById('cmpGrid');
        if (!grid) return;
        let table = '<table class="cmp-table"><thead><tr><th></th>';
        targetColors.forEach((c, i) => {
            table += `<th style="background:${c};color:${C.bestTextColor(c)}">C${i + 1}</th>`;
        });
        table += '</tr></thead><tbody>';
        app.currentPalette.forEach((c1, i) => {
            table += `<tr><th style="background:${c1};color:${C.bestTextColor(c1)}">P${i + 1}</th>`;
            targetColors.forEach((c2) => {
                const ratio = C.getContrastRatio(c1, c2);
                const tier = C.getContrastTier(ratio);
                table += `<td class="${tier.cls}" title="${ratio.toFixed(1)}:1 — ${tier.title || ''}">${ratio.toFixed(1)}</td>`;
            });
            table += '</tr>';
        });
        table += '</tbody>';

        // Summary
        const allRatios = [];
        app.currentPalette.forEach(c1 => {
            targetColors.forEach(c2 => {
                allRatios.push(C.getContrastRatio(c1, c2));
            });
        });
        const passAA = allRatios.filter(r => r >= 4.5).length;
        const total = allRatios.length;
        const pct = total > 0 ? Math.round(passAA / total * 100) : 0;
        const summaryColor = pct >= 80 ? '#2ed47a' : pct >= 50 ? '#f59e0b' : '#ff4d4d';
        table += `<tfoot><tr><td colspan="${targetColors.length + 1}" style="text-align:center;padding:10px;font-size:0.78rem;color:${summaryColor}">
            <strong>${pct}%</strong> of pairings pass WCAG AA (${passAA}/${total} ≥ 4.5:1)
        </td></tr></tfoot></table>`;

        grid.innerHTML = table;
    };

    const select = document.getElementById('cmpSelect');
    if (select) {
        select.addEventListener('change', () => updateCompare(select.value));
        // Trigger with first option
        updateCompare(select.value);
    }
}

// ─── Bulk Generate ────────────────────────────────────────────────────────
function bulkGenerate() {
    const app = C.App;
    const baseHex = document.getElementById('hexInput').value.toUpperCase();
    if (!C.isValidHex(baseHex)) {
        C.showNotification('Enter a valid base color first.', 'error');
        return;
    }

    const algorithms = ['monochromatic', 'complementary', 'analogous', 'triadic', 'splitComplementary'];
    const variations = [];

    algorithms.forEach(algo => {
        const generators = {
            complementary:     () => C.ColorTheory.complementary(baseHex),
            analogous:         () => C.ColorTheory.analogous(baseHex),
            triadic:           () => C.ColorTheory.triadic(baseHex),
            monochromatic:     () => C.ColorTheory.monochromatic(baseHex),
            splitComplementary:() => C.ColorTheory.splitComplementary(baseHex),
        };
        variations.push({ colors: (generators[algo] || generators.monochromatic)(), algorithm: algo });
    });

    // 7 more with random shuffles
    for (let i = 0; i < 7; i++) {
        const algo = algorithms[Math.floor(Math.random() * algorithms.length)];
        const generators = {
            complementary:     () => C.ColorTheory.complementary(baseHex),
            analogous:         () => C.ColorTheory.analogous(baseHex),
            triadic:           () => C.ColorTheory.triadic(baseHex),
            monochromatic:     () => C.ColorTheory.monochromatic(baseHex),
            splitComplementary:() => C.ColorTheory.splitComplementary(baseHex),
        };
        variations.push({ colors: C.shuffleArray((generators[algo] || generators.monochromatic)()), algorithm: algo });
    }

    const grid = document.getElementById('bulkGrid');
    if (!grid) return;
    grid.innerHTML = variations.map((v, i) => `
        <div class="bulk-card" data-idx="${i}">
            <div class="bulk-swatches">${v.colors.map(c => `<span style="background:${c}"></span>`).join('')}</div>
            <div class="bulk-name">${v.algorithm}</div>
        </div>
    `).join('');

    document.querySelectorAll('.bulk-card').forEach(card => {
        card.addEventListener('click', () => {
            const v = variations[parseInt(card.dataset.idx)];
            if (!v) return;
            app.currentAlgorithm = v.algorithm;
            document.querySelectorAll('.harmony-btn').forEach(b => b.classList.toggle('active', b.dataset.algorithm === v.algorithm));
            app.currentPalette = [...v.colors];
            app.displayedArrangement = [...v.colors];
            app._rawPreviewColors = [...v.colors];
            app.displayPalette(app.currentPalette);
            app.applyWebsiteColors(app.displayedArrangement);
            app.updateReadabilityUI(app.calculateReadabilityScore(app.currentPalette));
            app.updateHarmonyPreviews(baseHex);
            C.showNotification('Variation applied.');
            app.switchToPaletteTab();
        });
    });
}

// Attach
const Gallery = {
    getCurated: () => CURATED_PALETTES,
    nameColor,
    namePalette,
    showCompareMode,
    bulkGenerate,
};

window.Chromatic.Gallery = Gallery;
