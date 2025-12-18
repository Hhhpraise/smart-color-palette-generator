// Color Theory Algorithms
class ColorTheory {
    static hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
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
        h = h % 360;
        s = s / 100;
        l = l / 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    static complementary(baseColor) {
        const [h, s, l] = this.hexToHsl(baseColor);
        return [
            baseColor,
            this.hslToHex((h + 180) % 360, s, l),
            this.hslToHex(h, Math.max(20, s - 20), Math.min(80, l + 10)),
            this.hslToHex((h + 180) % 360, Math.max(20, s - 20), Math.min(80, l + 10)),
            this.hslToHex(h, s, Math.max(20, l - 20)),
            this.hslToHex((h + 180) % 360, s, Math.max(20, l - 20))
        ];
    }

    static analogous(baseColor) {
        const [h, s, l] = this.hexToHsl(baseColor);
        return [
            this.hslToHex((h - 60 + 360) % 360, s, l),
            this.hslToHex((h - 30 + 360) % 360, s, l),
            baseColor,
            this.hslToHex((h + 30) % 360, s, l),
            this.hslToHex((h + 60) % 360, s, l),
            this.hslToHex(h, Math.max(20, s - 30), Math.min(90, l + 15))
        ];
    }

    static triadic(baseColor) {
        const [h, s, l] = this.hexToHsl(baseColor);
        return [
            baseColor,
            this.hslToHex((h + 120) % 360, s, l),
            this.hslToHex((h + 240) % 360, s, l),
            this.hslToHex(h, Math.max(30, s - 20), Math.min(85, l + 15)),
            this.hslToHex((h + 120) % 360, Math.max(30, s - 20), Math.min(85, l + 15)),
            this.hslToHex((h + 240) % 360, Math.max(30, s - 20), Math.min(85, l + 15))
        ];
    }

    static monochromatic(baseColor) {
        const [h, s, l] = this.hexToHsl(baseColor);
        return [
            this.hslToHex(h, s, Math.min(90, l + 30)),
            this.hslToHex(h, s, Math.min(80, l + 15)),
            baseColor,
            this.hslToHex(h, s, Math.max(20, l - 15)),
            this.hslToHex(h, s, Math.max(10, l - 30)),
            this.hslToHex(h, Math.max(20, s - 30), l)
        ];
    }

    static splitComplementary(baseColor) {
        const [h, s, l] = this.hexToHsl(baseColor);
        const comp = (h + 180) % 360;
        return [
            baseColor,
            this.hslToHex((comp - 30 + 360) % 360, s, l),
            this.hslToHex((comp + 30) % 360, s, l),
            this.hslToHex(h, Math.max(20, s - 20), Math.min(85, l + 10)),
            this.hslToHex((comp - 30 + 360) % 360, Math.max(20, s - 20), Math.min(85, l + 10)),
            this.hslToHex((comp + 30) % 360, Math.max(20, s - 20), Math.min(85, l + 10))
        ];
    }
}

// Utility Functions
function getContrastRatio(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function isValidHex(hex) {
    return /^#[0-9A-F]{6}$/i.test(hex);
}

function generateRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function showNotification(message) {
    const toast = document.getElementById('notificationToast');
    const messageSpan = toast.querySelector('.toast-message');

    messageSpan.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Color brightness calculator
function getColorBrightness(hex) {
    const rgb = hexToRgb(hex);
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

// Main Application Logic
const app = {
    currentAlgorithm: 'monochromatic',
    currentPalette: [],
    shuffledPalette: [],
    bestReadabilityArrangement: [],

    init() {
    this.bindEvents();
    this.bindKeyboardShortcuts();
    this.syncColorInputs();
    this.applyWebsiteColors(this.currentPalette);
},

    bindEvents() {
        // Color input synchronization
        document.getElementById('colorPicker').addEventListener('input', (e) => {
            const hex = e.target.value.toUpperCase();
            document.getElementById('hexInput').value = hex;
            document.getElementById('colorPreview').style.backgroundColor = hex;
            this.generatePalette();
        });

        document.getElementById('hexInput').addEventListener('input', (e) => {
            const hex = e.target.value.toUpperCase();
            if (isValidHex(hex)) {
                document.getElementById('colorPicker').value = hex;
                document.getElementById('colorPreview').style.backgroundColor = hex;
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                this.generatePalette();
            } else {
                e.target.style.borderColor = '#FF3B30';
            }
        });

        // Algorithm selection
        document.querySelectorAll('.harmony-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.harmony-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentAlgorithm = e.target.dataset.algorithm;
                this.generatePalette();
            });
        });

        // Generate palette
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generatePalette();
        });

        // Random color
        document.getElementById('randomBtn').addEventListener('click', () => {
            const randomColor = generateRandomColor();
            document.getElementById('colorPicker').value = randomColor;
            document.getElementById('hexInput').value = randomColor;
            document.getElementById('colorPreview').style.backgroundColor = randomColor;
            this.generatePalette();
        });

        // Optimize readability
        document.getElementById('optimizeBtn').addEventListener('click', () => {
            this.optimizeReadability();
        });

        // Shuffle colors
        document.getElementById('shuffleColorsBtn').addEventListener('click', () => {
            this.shuffleColors();
        });

        // Export buttons
        document.getElementById('exportPNG').addEventListener('click', () => {
            this.exportAsPNG();
        });

        document.getElementById('exportSVG').addEventListener('click', () => {
            this.exportAsSVG();
        });

        // Copy all colors
        document.getElementById('copyAllBtn').addEventListener('click', () => {
            this.copyAllColors();
        });
    },

    syncColorInputs() {
        const colorPicker = document.getElementById('colorPicker');
        const hexInput = document.getElementById('hexInput');
        const colorPreview = document.getElementById('colorPreview');

        hexInput.value = colorPicker.value.toUpperCase();
        colorPreview.style.backgroundColor = colorPicker.value;
        this.generatePalette();
    },

    calculateReadabilityScore(palette) {
        if (palette.length < 3) return { score: 0, rating: 'Poor', className: 'score-poor' };

        let totalScore = 0;
        let comparisons = 0;

        // Background to text contrast
        const bgColor = palette[0];
        const textColor = getContrastRatio(bgColor, '#FFFFFF') > 4.5 ? '#FFFFFF' : '#000000';
        const bgTextRatio = getContrastRatio(bgColor, textColor);

        // Button contrasts
        let buttonScores = 0;
        for (let i = 2; i < Math.min(5, palette.length); i++) {
            const btnColor = palette[i];
            const btnTextColor = getContrastRatio(btnColor, '#FFFFFF') > 4.5 ? '#FFFFFF' : '#000000';
            const btnRatio = getContrastRatio(btnColor, btnTextColor);

            if (btnRatio >= 7) buttonScores += 3;
            else if (btnRatio >= 4.5) buttonScores += 2;
            else if (btnRatio >= 3) buttonScores += 1;
            comparisons++;
        }

        // Color harmony contrast
        for (let i = 0; i < Math.min(4, palette.length - 1); i++) {
            for (let j = i + 1; j < Math.min(4, palette.length); j++) {
                const ratio = getContrastRatio(palette[i], palette[j]);
                if (ratio >= 4.5) totalScore += 2;
                else if (ratio >= 3) totalScore += 1;
                comparisons++;
            }
        }

        // Include background-text score
        if (bgTextRatio >= 7) totalScore += 3;
        else if (bgTextRatio >= 4.5) totalScore += 2;
        else if (bgTextRatio >= 3) totalScore += 1;
        comparisons++;

        totalScore += buttonScores;
        const averageScore = totalScore / Math.max(1, comparisons);

        return {
            score: averageScore,
            rating: averageScore >= 2.2 ? 'Excellent' : (averageScore >= 1.3 ? 'Good' : 'Needs Improvement'),
            className: averageScore >= 2.2 ? 'score-excellent' : (averageScore >= 1.3 ? 'score-good' : 'score-poor')
        };
    },

    findBestReadabilityArrangement(palette) {
        let bestArrangement = [...palette];
        let bestScore = this.calculateReadabilityScore(palette);
        let excellentFound = false;

        // Test random permutations (limited for performance)
        const maxAttempts = Math.min(200, 720);

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const testArrangement = shuffleArray(palette);
            const testScore = this.calculateReadabilityScore(testArrangement);

            if (testScore.score > bestScore.score) {
                bestScore = testScore;
                bestArrangement = [...testArrangement];

                if (testScore.rating === 'Excellent') {
                    excellentFound = true;
                    break;
                }
            }
        }

        return {
            arrangement: bestArrangement,
            score: bestScore,
            excellentFound: excellentFound
        };
    },

    generatePalette() {
        const hexInput = document.getElementById('hexInput');
        const baseColor = hexInput.value.toUpperCase();

        if (!isValidHex(baseColor)) {
            showNotification('Please enter a valid hex color (e.g., #FDDCD7)');
            return;
        }

        let palette = [];
        switch (this.currentAlgorithm) {
            case 'complementary':
                palette = ColorTheory.complementary(baseColor);
                break;
            case 'analogous':
                palette = ColorTheory.analogous(baseColor);
                break;
            case 'triadic':
                palette = ColorTheory.triadic(baseColor);
                break;
            case 'monochromatic':
                palette = ColorTheory.monochromatic(baseColor);
                break;
            case 'splitComplementary':
                palette = ColorTheory.splitComplementary(baseColor);
                break;
            default:
                palette = ColorTheory.monochromatic(baseColor);
        }

        this.currentPalette = palette;
        document.getElementById('paletteName').textContent = this.currentAlgorithm.charAt(0).toUpperCase() + this.currentAlgorithm.slice(1);

        // Find best readability arrangement
        const bestResult = this.findBestReadabilityArrangement(palette);
        this.bestReadabilityArrangement = bestResult.arrangement;
        this.shuffledPalette = [...bestResult.arrangement];

        // Apply colors to entire website preview
        this.applyWebsiteColors(this.shuffledPalette);

        // Display palette
        this.displayPalette(palette);

        // Update readability score
        const scoreResult = this.calculateReadabilityScore(this.shuffledPalette);
        const scoreElement = document.getElementById('readabilityScore');
        scoreElement.innerHTML = `<i class="fas fa-check-circle"></i> <span>${scoreResult.rating}</span>`;
        scoreElement.className = `readability-score ${scoreResult.className}`;

        if (bestResult.excellentFound) {
            showNotification('🎯 Excellent readability arrangement found!');
        }
    },

    applyWebsiteColors(palette) {
        if (palette.length < 3) return;

        // Apply colors to website mockup
        const mockup = document.querySelector('.website-mockup');
        const nav = document.querySelector('.mockup-nav');
        const hero = document.querySelector('.mockup-hero');
        const footer = document.querySelector('.mockup-footer');
        const featureCards = document.querySelectorAll('.feature-card');
        const buttons = document.querySelectorAll('.mockup-btn');

        // Background gradient for hero section
        if (hero) {
            hero.style.background = `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`;
            hero.style.color = getContrastRatio(palette[0], '#FFFFFF') > 4.5 ? '#FFFFFF' : '#000000';
        }

        // Nav and footer background
        if (nav) {
            nav.style.backgroundColor = palette[0];
            nav.style.color = getContrastRatio(palette[0], '#FFFFFF') > 4.5 ? '#FFFFFF' : '#000000';
        }

        if (footer) {
            footer.style.backgroundColor = palette[0];
            footer.style.color = getContrastRatio(palette[0], '#FFFFFF') > 4.5 ? '#FFFFFF' : '#000000';
        }

        // Buttons
        buttons.forEach((btn, index) => {
            if (index === 0 && palette[2]) {
                btn.style.backgroundColor = palette[2];
                btn.style.color = getContrastRatio(palette[2], '#FFFFFF') > 4.5 ? '#FFFFFF' : '#000000';
            } else if (index === 1 && palette[3]) {
                btn.style.backgroundColor = palette[3];
                btn.style.color = getContrastRatio(palette[3], '#FFFFFF') > 4.5 ? '#FFFFFF' : '#000000';
            }
        });

        // Feature cards
        featureCards.forEach((card, index) => {
            if (palette[index + 2]) {
                const bgColor = palette[index + 2] + '20'; // Add opacity
                card.style.backgroundColor = bgColor;
                card.style.color = getContrastRatio(palette[index + 2], '#FFFFFF') > 4.5 ? '#000000' : '#FFFFFF';

                // Icon color
                const icon = card.querySelector('i');
                if (icon) {
                    icon.style.color = palette[index + 2];
                }
            }
        });
        const allElements = document.querySelectorAll('.website-mockup, .mockup-nav, .mockup-hero, .mockup-footer, .feature-card, .mockup-btn');
    allElements.forEach(el => {
        el.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
    });


        // Update background animation with first two colors
        const bgAnimation = document.querySelector('.background-animation');
        if (bgAnimation) {
            bgAnimation.style.background = `linear-gradient(-45deg, ${palette[0]}, ${palette[1]}, ${palette[2] || palette[0]}, ${palette[3] || palette[1]})`;
        }
    },

optimizeReadability() {
    if (this.currentPalette.length === 0) {
        showNotification('Please generate a palette first!');
        return;
    }

    const optimizeBtn = document.getElementById('optimizeBtn');
    const originalText = optimizeBtn.innerHTML;

    // Add loading state
    optimizeBtn.classList.add('loading');
    optimizeBtn.innerHTML = '<i class="fas fa-search"></i>';

    showNotification('🔍 Finding optimal arrangement...');

    setTimeout(() => {
        const bestResult = this.findBestReadabilityArrangement(this.currentPalette);
        this.shuffledPalette = [...bestResult.arrangement];
        this.applyWebsiteColors(this.shuffledPalette);

        const message = bestResult.excellentFound
            ? '🎯 Found excellent readability arrangement!'
            : `✨ Best arrangement found (${bestResult.score.rating})`;

        showNotification(message);

        // Update readability score
        const scoreElement = document.getElementById('readabilityScore');
        scoreElement.innerHTML = `<i class="fas fa-${bestResult.score.rating === 'Excellent' ? 'check-circle' : 'star'}"></i> <span>${bestResult.score.rating}</span>`;
        scoreElement.className = `readability-score ${bestResult.score.className}`;

        // Remove loading state
        optimizeBtn.classList.remove('loading');
        optimizeBtn.innerHTML = originalText;
    }, 100);
},

    shuffleColors() {
        this.shuffledPalette = shuffleArray(this.currentPalette);
        this.applyWebsiteColors(this.shuffledPalette);
        showNotification('Colors shuffled! Check the new arrangement.');
    },

    displayPalette(palette) {
        const grid = document.getElementById('paletteGrid');

        grid.innerHTML = '';
        grid.classList.add('animate');

        palette.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;

            const rgb = hexToRgb(color);
            const contrastRatio = getContrastRatio(color, '#FFFFFF');
            const hasGoodContrast = contrastRatio >= 4.5;

            swatch.innerHTML = `
                <div class="color-info">
                    <div class="hex-code">${color.toUpperCase()}</div>
                    <div class="rgb-code">RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</div>
                    ${!hasGoodContrast ? '<div class="contrast-warning">Low contrast</div>' : ''}
                </div>
            `;

            swatch.addEventListener('click', () => {
                navigator.clipboard.writeText(color.toUpperCase()).then(() => {
                    showNotification(`${color.toUpperCase()} copied to clipboard!`);
                });
            });

            grid.appendChild(swatch);
        });

        setTimeout(() => {
            grid.classList.remove('animate');
        }, 500);
    },

    copyAllColors() {
        if (this.currentPalette.length === 0) {
            showNotification('No colors to copy!');
            return;
        }

        const colorsText = this.currentPalette.map(color => color.toUpperCase()).join('\n');
        navigator.clipboard.writeText(colorsText).then(() => {
            showNotification('All colors copied to clipboard!');
        });
    },

    exportAsPNG() {
        const canvas = document.getElementById('exportCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1000;
        canvas.height = 500;

        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, this.currentPalette[0]);
        gradient.addColorStop(1, this.currentPalette[1] || this.currentPalette[0]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw palette swatches
        const swatchWidth = 100;
        const swatchHeight = 100;
        const spacing = 20;
        const startX = (canvas.width - (this.currentPalette.length * (swatchWidth + spacing) - spacing)) / 2;
        const startY = 150;

        this.currentPalette.forEach((color, index) => {
            const x = startX + index * (swatchWidth + spacing);

            // Draw swatch
            ctx.fillStyle = color;
            ctx.fillRect(x, startY, swatchWidth, swatchHeight);

            // Add border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, startY, swatchWidth, swatchHeight);

            // Add hex code
            ctx.fillStyle = getContrastRatio(color, '#FFFFFF') > 4.5 ? '#FFFFFF' : '#000000';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(color.toUpperCase(), x + swatchWidth/2, startY + swatchHeight + 30);
        });

        // Add title
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.currentAlgorithm.charAt(0).toUpperCase() + this.currentAlgorithm.slice(1)} Palette`, canvas.width / 2, 100);

        // Add footer
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '16px Arial';
        ctx.fillText('Generated with Hhhpraise Color Studio', canvas.width / 2, canvas.height - 30);

        // Download
        const link = document.createElement('a');
        link.download = `chroma-glass-${this.currentAlgorithm}-palette.png`;
        link.href = canvas.toDataURL();
        link.click();

        showNotification('Palette exported as PNG!');
    },
    bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Space for random color
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            document.getElementById('randomBtn').click();
        }

        // Enter to generate palette
        if (e.code === 'Enter' && document.activeElement === document.getElementById('hexInput')) {
            e.preventDefault();
            this.generatePalette();
        }

        // Number keys 1-5 for harmony modes
        if (e.code >= 'Digit1' && e.code <= 'Digit5') {
            const index = parseInt(e.code.slice(-1)) - 1;
            const harmonyBtns = document.querySelectorAll('.harmony-btn');
            if (harmonyBtns[index]) {
                harmonyBtns[index].click();
            }
        }
    });
},

    exportAsSVG() {
        const svgWidth = 1000;
        const svgHeight = 500;
        const swatchWidth = 100;
        const swatchHeight = 100;
        const spacing = 20;
        const startX = (svgWidth - (this.currentPalette.length * (swatchWidth + spacing) - spacing)) / 2;
        const startY = 150;

        let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

        // Background gradient
        svgContent += `<defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${this.currentPalette[0]}" />
                <stop offset="100%" stop-color="${this.currentPalette[1] || this.currentPalette[0]}" />
            </linearGradient>
        </defs>`;

        svgContent += `<rect width="100%" height="100%" fill="url(#bgGradient)" />`;

        // Swatches
        this.currentPalette.forEach((color, index) => {
            const x = startX + index * (swatchWidth + spacing);

            svgContent += `<rect x="${x}" y="${startY}" width="${swatchWidth}" height="${swatchHeight}" fill="${color}" stroke="rgba(255,255,255,0.3)" stroke-width="2" />`;

            const textColor = getContrastRatio(color, '#FFFFFF') > 4.5 ? '#FFFFFF' : '#000000';
            svgContent += `<text x="${x + swatchWidth/2}" y="${startY + swatchHeight + 30}" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="${textColor}">${color.toUpperCase()}</text>`;
        });

        // Title
        svgContent += `<text x="${svgWidth/2}" y="100" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="36" font-weight="bold" fill="rgba(255,255,255,0.9)">${this.currentAlgorithm.charAt(0).toUpperCase() + this.currentAlgorithm.slice(1)} Palette</text>`;

        // Footer
        svgContent += `<text x="${svgWidth/2}" y="${svgHeight - 30}" text-anchor="middle" font-family="Arial" font-size="16" fill="rgba(255,255,255,0.6)">Generated with Hhhpraise - Color Studio</text>`;

        svgContent += '</svg>';

        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = `chroma-glass-${this.currentAlgorithm}-palette.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();

        showNotification('Palette exported as SVG!');
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});