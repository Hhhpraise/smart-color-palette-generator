# 🎨 Smart Color Palette Generator

A powerful, intelligent color palette generator that creates harmonious color schemes based on established color theory principles. Perfect for designers, developers, and anyone working with colors.

## ✨ Features

### Core Functionality
- **Smart Color Input**: HEX code input with live validation + visual color picker
- **5 Color Theory Algorithms**:
  - **Complementary**: Perfect contrast pairs
  - **Analogous**: Harmonious adjacent colors  
  - **Triadic**: Balanced three-color schemes
  - **Monochromatic**: Elegant single-hue variations
  - **Split-Complementary**: Sophisticated contrast combinations
- **Interactive Palette Display**: Click any color to copy HEX code instantly
- **Random Inspiration Generator**: Discover new color combinations

### Advanced Features
- **WCAG Contrast Checker**: Accessibility warnings for text readability
- **Palette Export**: Download as PNG or SVG files
- **Live UI Preview**: See your colors in realistic design contexts
- **Color Information**: RGB, HSL values and color names
- **Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Live Demo

**[View Live Demo](https://Hhhpraise.github.io/smart-color-palette-generator/)**

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Deployment**: GitHub Pages
- **Color Science**: Custom algorithms based on HSL color space
- **Export**: Canvas API for image generation

## 📋 Getting Started

### Prerequisites
- Modern web browser
- Git installed on your machine

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hhhpraise/smart-color-palette-generator.git
   cd smart-color-palette-generator
   ```

2. **Open locally**
   ```bash
   # Option 1: Direct file opening
   open index.html
   
   # Option 2: Local server (recommended)
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Deploy to GitHub Pages**
   - Push to your GitHub repository
   - Go to Settings → Pages
   - Select "Deploy from branch" → main branch
   - Your site will be live at `https://Hhhpraise.github.io/smart-color-palette-generator/`

## 🎯 Usage

1. **Input a Color**
   - Enter any HEX code (e.g., `#FF5733`)
   - Or use the color picker for visual selection

2. **Choose Color Theory**
   - Select from 5 different harmony algorithms
   - Each generates 5-6 perfectly matched colors

3. **Interact with Results**
   - Click any color swatch to copy HEX code
   - View accessibility warnings for text contrast
   - Preview colors in realistic UI mockups

4. **Export & Save**
   - Download palettes as PNG or SVG
   - Perfect for design handoffs and documentation

## 🧮 Color Theory Implementation

### Complementary Colors
Uses 180° hue rotation for maximum contrast while maintaining visual harmony.

### Analogous Schemes  
Generates colors within 30° hue range for natural, pleasing combinations.

### Triadic Palettes
Creates balanced schemes using 120° hue spacing for vibrant, dynamic results.

### Monochromatic Variations
Adjusts saturation and lightness while preserving hue for elegant, cohesive palettes.

### Split-Complementary
Combines base color with two colors adjacent to its complement for sophisticated contrast.

## 🎨 Project Structure

```
smart-color-palette-generator/
├── index.html              # Main application
├── styles/
│   ├── main.css            # Core styles
│   └── responsive.css      # Mobile optimization
├── scripts/
│   ├── colorTheory.js      # Color algorithm implementations
│   ├── uiController.js     # User interface logic
│   └── exportUtils.js      # PNG/SVG export functionality
├── assets/
│   ├── icons/              # UI icons
│   └── mockups/            # Preview templates
└── README.md
```

## 🔧 Development

### Adding New Color Algorithms
1. Implement algorithm in `scripts/colorTheory.js`
2. Add UI controls in `scripts/uiController.js`
3. Update algorithm selector in `index.html`

### Customizing Export Formats
Modify `scripts/exportUtils.js` to add new export options or customize existing formats.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Follow ES6+ JavaScript standards
- Maintain responsive design principles
- Test across modern browsers
- Document new color theory implementations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Color theory algorithms based on traditional design principles
- WCAG accessibility guidelines implementation
- Canvas API for export functionality

## 📬 Contact

- **GitHub**: [@Hhhpraise](https://github.com/Hhhpraise)
- **Project Link**: [https://github.com/Hhhpraise/smart-color-palette-generator](https://github.com/Hhhpraise/smart-color-palette-generator)

---

⭐ **Star this repository if you find it helpful!**