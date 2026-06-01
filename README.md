# 🎨 Smart Color Palette Generator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://hhhpraise.github.io/smart-color-palette-generator/)
[![GitHub Stars](https://img.shields.io/github/stars/Hhhpraise/smart-color-palette-generator?style=social)](https://github.com/Hhhpraise/smart-color-palette-generator/stargazers)

> A powerful, intelligent color palette generator that creates harmonious color schemes based on established color theory principles. Perfect for designers, developers, and anyone working with colors — built with accessibility-first design.

## 🌟 Key Highlights

- **🎯 Professional Grade**: WCAG 2.1 compliant contrast checking with AAA, AA, Large Text and Fail tier ratings
- **🎨 5 Color Theory Algorithms**: Monochromatic, Complementary, Analogous, Triadic, and Split-Complementary
- **⚡ Real-Time Live Preview**: See your palette applied to a realistic website mockup — nav, hero, buttons, cards, and footer update dynamically
- **👁️ Color Blindness Simulation**: View palettes through Protanopia, Deuteranopia, and Tritanopia lenses using LMS-space projection (Brettel-Viénot-Mollon 1999)
- **🖼️ 24 Curated Palettes**: Pre-built palettes organized by mood and use-case — Sunset Boulevard, Nordic Frost, Cyberpunk Neon, and more
- **🔬 Compare Mode**: Side-by-side contrast grid between any two palettes with WCAG pass-rate summary
- **📦 Bulk Generate**: Create 12 palette variations from a single base color across all algorithms
- **💾 Multi-Format Export**: Download as PNG, SVG, or PDF; copy as Tailwind config, CSS variables, or raw hex
- **📱 Fully Responsive**: Works seamlessly across all devices with dark and light themes

## ✨ Features

### 🎨 Core Functionality

- **Intelligent Color Input**: HEX code input with real-time validation, visual color picker, auto-sync between input methods
- **5 Color Theory Algorithms**: Complementary (180° hue), Analogous (±30°), Triadic (120° spacing), Monochromatic (saturation/lightness), Split-Complementary (base + two adjacent to complement)
- **Interactive Palette Swatches**: One-click color copying, RGB/HSL value display, contrast ratio badges with WCAG tier labels, drag-to-reorder, lock individual colors during regeneration, double-click for tints & shades explorer

### 👁️ Accessibility & Color Blindness

- **WCAG Contrast Scoring**: Real-time rating per swatch (AAA ≥7:1, AA ≥4.5:1, Large Text ≥3:1, Fail <3:1) with detailed tooltip explanations
- **Readability Optimization**: Auto-arrange palette order for best text readability, shuffle for quick reordering
- **Color Blindness Simulation**: Click any of the four CVD buttons (Normal, Protanopia, Deuteranopia, Tritanopia) in the live preview panel to see how your palette renders for different types of color vision deficiency. Uses scientifically-accurate LMS-space projection matrices (Machado 2009 / Viénot-Brettel-Mollon).

### 🖼️ Gallery & Bulk Generation

- **24 Curated Palettes**: Professionally designed palettes organized by theme — from "Arctic Monochrome" to "Cyberpunk Neon" to "Espresso Shot". Each palette is tagged (e.g. warm, cool, nature, tech, luxury) and one click applies it to the live preview.
- **Bulk Generate**: Click "Generate 12 Variations" to produce one palette for each harmony algorithm plus 7 shuffled variants — all at once from your current base color.

### 🔬 Compare Mode

- **Side-by-Side Contrast Grid**: Click the **Compare** button to open a modal that shows a full contrast ratio matrix between your current palette and any saved favorite or curated gallery palette.
- **WCAG Pass-Rate Summary**: See at a glance what percentage of color pairings meet WCAG AA (≥4.5:1).
- **Works with favorites and curated palettes**: No need to save anything first — compare against any of the 24 built-in palettes.

### 📦 Export Options

- **PNG**: High-quality raster export with gradient background and color labels
- **SVG**: Scalable vector export for design tools
- **PDF**: Landscape PDF with gradient background and WCAG rating overlay
- **Tailwind Config**: Copy a ready-to-use `tailwind.config.js` color extension
- **CSS Variables**: Copy `:root` custom properties for any web project
- **Copy All**: Bulk copy all hex codes, one per line
- **Share URL**: Copy a shareable link with current color and algorithm encoded

### 🛠️ Tools

- **Image Color Extraction**: Upload or drag-and-drop an image to extract its 6 dominant colors via color quantization
- **Gradient Builder**: Visual gradient editor with angle control, radial/linear toggle, and CSS copy
- **Palette History**: Automatic history of up to 50 generated palettes with time-ago labels
- **Favorites System**: Save and name palettes to a persistent favorites list (stored in localStorage)

### 🎭 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Random base color |
| `1`–`5` | Select harmony algorithm |
| `Enter` | Generate palette (when hex input is focused) |

## 🌐 Live Demo

**[🚀 Try it now](https://hhhpraise.github.io/smart-color-palette-generator/)**

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure & semantic markup |
| **CSS3** | Custom properties, animations, dark/light themes |
| **JavaScript ES6+** | Color theory math, LMS color space transforms, drag-drop, localStorage |
| **Canvas API** | PNG export rendering |
| **jsPDF** | PDF export with gradient backgrounds |
| **Font Awesome 6** | Iconography |
| **Google Fonts** | Syne (display), DM Sans (body), DM Mono (code) |

## 📋 Quick Start

### 🔧 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git (for development)

### ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hhhpraise/smart-color-palette-generator.git
   cd smart-color-palette-generator
   ```

2. **Run locally**
   ```bash
   # Option 1: Open directly in browser
   open index.html

   # Option 2: Local server (recommended for development)
   python -m http.server 8000
   # Then visit http://localhost:8000

   # Option 3: Using Node.js
   npx serve .
   ```

3. **Deploy to GitHub Pages**
   ```bash
   git add .
   git commit -m "Deploy updates"
   git push origin main
   ```

## 🎯 How to Use

1. **Choose Your Base Color** — Enter a HEX code or use the color picker. Press `Space` for random inspiration.
2. **Select Color Harmony** — Pick from 5 algorithms. Each harmony button shows a live preview of the colors it will generate.
3. **Interact with Your Palette** — Click swatches to copy, double-click for tints & shades, drag to reorder, lock colors to preserve them during regeneration.
4. **Preview in Context** — Switch to the Palette tab to see colors applied to a realistic website mockup. Toggle color blindness simulation in the CVD bar.
5. **Browse the Gallery** — Explore 24 curated palettes in the Gallery tab, or bulk-generate 12 variations from your base color.
6. **Compare Palettes** — Click the Compare button to see a contrast matrix between any two palettes.
7. **Export & Save** — Download as PNG/SVG/PDF, copy as Tailwind/CSS vars, or share a URL.

## 🎨 Color Theory Reference

### Monochromatic
Variations of a single hue by adjusting lightness and saturation. Creates elegant, cohesive designs. Best for corporate sites, minimalist interfaces, luxury brands.

### Complementary
Colors 180° apart on the color wheel. Maximum contrast and visual impact. Best for CTAs, hero sections, bold branding.

### Analogous
Colors adjacent on the wheel (±30–60°). Natural harmony with gentle transitions. Best for gradients, nature themes, subtle UI.

### Triadic
Three colors evenly spaced at 120° intervals. Balanced and vibrant without being jarring. Best for playful interfaces, creative projects, data visualization.

### Split-Complementary
Base color plus the two colors adjacent to its complement. Sophisticated contrast with more nuance than pure complementary. Best for complex interfaces, editorial design, premium products.

## 👁️ Color Blindness Simulation

The simulator uses the scientifically-validated LMS (Long, Medium, Short wavelength) cone response model with Viénot-Brettel-Mollon dichromatic projection matrices:

- **Protanopia**: Absent or non-functional L-cones (red-deficient) — affects ~1% of males
- **Deuteranopia**: Absent or non-functional M-cones (green-deficient) — affects ~1% of males
- **Tritanopia**: Absent or non-functional S-cones (blue-deficient) — very rare (~0.003%)

The algorithm converts sRGB to linear RGB, projects through the Hunt-Pointer-Estevez LMS transform, applies the deficiency-specific projection matrix, and converts back. This ensures results match what a dichromatic viewer would actually perceive rather than a simple hue-shift approximation.

## 📁 Project Structure

```
smart-color-palette-generator/
├── index.html              # Main HTML with all UI structure
├── style.css               # Core design system (tokens, layout, dark theme)
├── style-additions.css     # Extended styles (light theme, tabs, modals, gallery, CVD, compare)
├── js/
│   ├── color-theory.js     # Color math: HSL/HEX/RGB conversion, harmony algorithms, contrast
│   ├── storage.js          # localStorage manager (history, favorites, settings)
│   ├── app-core.js         # Main app controller (rendering, events, palette generation)
│   ├── app-gallery.js      # Curated palettes, bulk generate, compare mode
│   └── app-tools.js        # CVD simulation, image extraction, gradient builder
├── LICENSE
└── README.md
```

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 70+ | ✅ Fully Supported |
| Firefox | 65+ | ✅ Fully Supported |
| Safari | 12+ | ✅ Fully Supported |
| Edge | 79+ | ✅ Fully Supported |
| Mobile Safari | 12+ | ✅ Fully Supported |
| Chrome Mobile | 70+ | ✅ Fully Supported |

## 🔧 Troubleshooting

**"The live preview / CVD simulation / gallery / compare isn't working"**

If you've recently updated the code and features aren't appearing, your browser may have cached the old JavaScript files. Hard-refresh with **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac) to force-reload all assets.

**"The color blindness buttons don't change the preview"**

Make sure you have generated a palette first (click **Generate Palette**). The CVD simulation applies to the live website preview in the Palette tab. Watch the nav, hero, buttons, and feature cards change color as you toggle between Normal, Protanopia, Deuteranopia, and Tritanopia.

**"The Compare button says I need to save favorites first"**

The Compare feature now works with both your saved favorites AND the 24 built-in curated gallery palettes. If you haven't saved any favorites, you'll still see the curated options in the dropdown. Click **Compare**, pick a palette from the "Curated Gallery" group, and the contrast grid appears instantly.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Reporting Issues
- Use the [issue tracker](https://github.com/Hhhpraise/smart-color-palette-generator/issues)
- Include browser version and steps to reproduce
- Provide screenshots for UI issues

### 🔄 Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with clear commit messages
4. Test thoroughly across different browsers
5. Submit a pull request with a detailed description

### 📋 Development Guidelines
- **Code Style**: ES6+ standards, `'use strict'` mode
- **Responsive Design**: Test on mobile devices
- **Accessibility**: Maintain WCAG 2.1 compliance
- **Performance**: Keep bundle lightweight (<100KB)
- **Documentation**: Comment complex algorithms (especially color math)

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

✅ Use in personal and commercial projects · ✅ Modify and customize · ✅ Distribute and share · ✅ No obligation to share changes

## 🙏 Acknowledgments

- **Color Theory**: Traditional design principles adapted for digital
- **Accessibility**: WCAG 2.1 contrast ratio guidelines
- **CVD Simulation**: Machado 2009 / Viénot-Brettel-Mollon 1999 LMS projection model
- **Export**: Canvas API, SVG spec, jsPDF library

## 📬 Connect & Support

<div align="center">

### 👨‍💻 Developer

**Hhhpraise**

[![Portfolio](https://img.shields.io/badge/🚀_Portfolio-View_My_Work-blue?style=for-the-badge)](https://hhhpraise.github.io/portfolio/)
[![Email](https://img.shields.io/badge/📧_Email-Contact_Me-red?style=for-the-badge)](mailto:hhhpraise33@gmail.com)
[![GitHub](https://img.shields.io/badge/💻_GitHub-Follow_Me-black?style=for-the-badge)](https://github.com/hhhpraise)

### 📊 Project Stats

[![GitHub Issues](https://img.shields.io/github/issues/Hhhpraise/smart-color-palette-generator)](https://github.com/Hhhpraise/smart-color-palette-generator/issues)
[![GitHub Forks](https://img.shields.io/github/forks/Hhhpraise/smart-color-palette-generator)](https://github.com/Hhhpraise/smart-color-palette-generator/network/members)
[![GitHub Stars](https://img.shields.io/github/stars/Hhhpraise/smart-color-palette-generator)](https://github.com/Hhhpraise/smart-color-palette-generator/stargazers)

</div>

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

*Made with ❤️ for the design and development community*

</div>
