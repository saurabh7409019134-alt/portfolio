# Saurabh's Cinematic Portfolio

A single fixed cinematic background portfolio website crafted with pure HTML5, CSS3, and JavaScript.

## 🌟 Architecture & Implementation

### 1. Single Fixed Background Layer (`z-index: 0`)
The hero image is loaded once at the root level and stays permanently fixed in place across the entire user journey:
```css
.fixed-cinematic-bg {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.fixed-cinematic-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```
The subject (the person, chair, "Creativity", and handwritten keywords) remains completely stationary while the user scrolls.

### 2. Cinematic Navy/Blue Overlay
A multi-stop subtle radial and linear gradient sits above the fixed photo to guarantee crisp typography readability without sacrificing the vibrancy and presence of the subject on the right.

### 3. Foreground Scrolling Content (`z-index: 1`)
All sections have transparent backgrounds with semi-transparent frosted glass cards (`backdrop-filter: blur(16px)`), allowing the user to feel like they are moving through a single, continuous cinematic studio environment.

---

## 📑 Included Sections (In Order)

1. **Hero**: High-impact editorial title, status indicator, action buttons, key metrics strip, and scroll indicator. Left-aligned to balance the photography on the right.
2. **About (`01 / About`)**: Mindset narrative and three core pillars (*Systems Over Silos*, *Radical Simplicity*, *Speed & Conviction*).
3. **What I Do (`02 / What I Do`)**: 4 discipline cards with scope tags (0→1 Product Design, Design Systems, Interface & Kinetic Motion, Growth).
4. **Selected Work (`03 / Selected Work`)**: 4 featured case studies with metrics, tags, and detail breakdown links.
5. **Process (`04 / Process`)**: 4-phase delivery framework (Discovery, Systems, Kinetic Craft, Validation & Scale).
6. **Creating in Public (`05 / Creating in Public`)**: 4 essay and thought pieces with reading times and metadata.
7. **Currently Building (`06 / Currently Building`)**: Real-time "Now" feed showing active software experiments, current books, focus soundtracks, and technical explorations.
8. **Beyond the Work (`07 / Beyond the Work`)**: Personal obsessions and analog crafts (35mm Film, Custom Keyboards, Specialty Coffee, Ambient Sound).
9. **Final CTA (`08 / Final CTA`)**: High-impact closing statement with 1-click email copy button and direct contact CTA.
10. **Footer (`09 / Footer`)**: Live local timezone clock, navigation jumps, social links, and smooth back-to-top button.

*(Note: Tools/Tech Stack section was intentionally excluded per instructions).*

---

## 🚀 How to Preview Locally

You can open `index.html` directly in any web browser, or run a local development server using Python:

```bash
# In this directory:
python3 -m http.server 8080
```
Then navigate to `http://localhost:8080` in your browser.

---

## 🎨 Interactive Atmosphere Modes

The header includes a **Mood: Cinematic** pill button that allows cycling through 3 visual overlay treatments:
- **Cinematic (Default)**: Balanced readability and photo vibrancy.
- **Deep Focus**: Higher contrast dark overlay for focused reading sessions.
- **Pure Scene**: Lighter overlay to maximize photo brilliance.
