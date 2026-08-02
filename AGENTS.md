# Custom Agent Instructions & UI Skills

## 🎨 Professional UI/UX & Design System Guidelines

### 1. Visual Hierarchy & Typography
- **Font Pairing**: Use distinctive, high-readability typography hierarchy (e.g., Plus Jakarta Sans / Inter with clean tracking).
- **Scale Math**: Follow strict mathematical type scales (minimum body size 15px, 1.5–1.7 line height).
- **Whitespace Rhythm**: Use tight groupings for related content (4px–8px gap) and generous padding between major layout sections (24px–32px).

### 2. Color System & Aesthetics
- **Neutral Palette**: Sophisticated light backgrounds (e.g., `#F0F4F8`, `#F8FAFC`) paired with high-contrast slate text (`#2D3436`, `#1E293B`).
- **Accent Accents**: Use vivid, purposeful accent badges (e.g., Vibrant Blue `#4D96FF`, Emerald `#6BCB77`, Warm Yellow `#FFD93D`, Coral `#FF6B6B`).
- **No AI-Slop Clichés**: Avoid heavy purple-to-blue background gradients, harsh glowing borders, low-contrast gray text on colored backgrounds, or unstyled nested cards.

### 3. Motion & Micro-Interactions
- **Framer Motion / Motion**: Use `motion/react` for subtle entry transitions, hover lifts (`whileHover={{ scale: 1.02 }}`), and active press feedback (`whileTap={{ scale: 0.98 }}`).
- **Responsive Touch Targets**: Minimum 44px height for interactive touch controls on mobile devices.

### 4. Component Crafting Rules
- **Feedback States**: Always provide clear hover, active, focus, and disabled states for buttons and interactive controls.
- **Badges & Pills**: Text inside pills/badges must stay strictly on one line without awkward word breaks.
- **Rounded Corners Balance**: Inner element radius must mathematically equal `Outer Radius - Padding`.

---

## 🛠️ UI Stack & Libraries
- **Styling**: Tailwind CSS v4 with utility-first architecture.
- **Icons**: Lucide React (`lucide-react`).
- **Animations**: Motion (`motion/react`).
- **Data Visualization**: Recharts / D3.
