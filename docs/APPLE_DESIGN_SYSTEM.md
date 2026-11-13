# EpicPix Media — Apple Theme & Bento Liquid Glass Design System

## Overview

The EpicPix Media platform has been redesigned following Apple's iconic design language (macOS / iOS / Keynote product presentation aesthetic), combined with Liquid Glass components (`glisse` + custom Apple Bento Box primitives).

---

## 1. Design Principles

- **Pure OLED Space Black (`#000000`) Foundation**: High-contrast, cinematic dark background allowing 4K/8K media content to be visually dominant.
- **Apple Typography**: Native SF Pro font stack (`-apple-system`, `BlinkMacSystemFont`, `SF Pro Display`, `SF Pro Text`, `Helvetica Neue`, `Inter`).
- **Titanium & Cosmic Gradients**:
  - **Titanium**: `linear-gradient(180deg, #ffffff 20%, #d2d2d7 60%, #86868b 100%)`
  - **Cosmic**: `linear-gradient(135deg, #2997ff 0%, #af52de 50%, #ff2d55 100%)`
  - **Gold**: `linear-gradient(135deg, #ffe082 0%, #d4af37 50%, #f5f5f7 100%)`
- **Bento Box Grids**: Modular `rounded-[28px]` cards with translucent hairline borders (`rgba(255, 255, 255, 0.12)`), subtle specular shine, and depth elevation.
- **Apple Pill Controls**: Pill-shaped action controls (`apple-pill-primary` with Apple Blue `#0071e3`, `apple-pill-secondary` with frosted glass).

---

## 2. Color Palette & Tokens

| Token | Hex / HSL | Usage |
|---|---|---|
| `apple.black` | `#000000` | Canvas base & OLED surface |
| `apple.dark` | `#0a0a0c` | Secondary deep sections & footer |
| `apple.surface` | `#161617` | Bento card background |
| `apple.elevated` | `#1d1d1f` | Elevated card & modal surface |
| `apple.border` | `rgba(255, 255, 255, 0.12)` | Hairline translucent borders |
| `apple.blue` | `#0071e3` | Apple primary accent & call-to-actions |
| `apple.blue-vibrant`| `#2997ff` | Neon accent, glow highlights, active state |
| `apple.gray` | `#86868b` | Subheadings, muted metadata, labels |
| `apple.lightgray`| `#d2d2d7` | Body text, readable secondary content |
| `apple.purple` | `#af52de` | Spatial audio & creative badges |
| `apple.green` | `#30d158` | Escrow verification & instant status |
| `apple.gold` | `#d4af37` | Ratings & enterprise tiers |

---

## 3. Key Pages Redesigned

1. **Header (`components/layout/header.tsx`)**:
   - Floating pill navbar with frosted glass (`backdrop-blur-xl`, `bg-black/82`), SF Pro text, and Apple blue pill button.
2. **Homepage (`app/page.tsx`)**:
   - Apple Keynote Hero with Titanium and Cosmic text gradients.
   - Studio Display hardware bezel showcase featuring 8K master reel with ProRes 422 telemetry.
   - Apple Bento Box Grid highlighting 8K Cinema Pipeline, YouPI Smart Escrow, Spatial Cinema Audio, and Curated Elite Creators.
   - Apple 3-step workflow and keynote closing banner.
3. **Portfolio (`app/portfolio/page.tsx`)**:
   - Client-interactive Apple Pro Gallery with category filter pills (Video, Photography, Drone, Commercial).
   - Bento project cards with specular highlights and high-res lightbox preview modal.
4. **Creator Discovery (`app/explore/page.tsx`)**:
   - Bento creator cards with verified Pro badges, starting prices in INR, camera specs, and direct booking links.
5. **Services & Packages (`app/services/page.tsx`)**:
   - Apple Store product matrix layout with upfront INR pricing, SLA turnaround guarantees, and 18% GST calculation.
6. **Footer (`components/layout/footer.tsx`)**:
   - Apple directory structure with subtle typography, dark `#0a0a0c` canvas, and hairline dividers.

---

## 4. Verification & Testing

- `npx tsc --noEmit`: 0 errors
- `npm run lint`: 0 errors / 0 warnings
- `npm run test`: 24/24 tests passed (4/4 test suites)
- `npm run build`: 21/21 routes compiled successfully (Static & Dynamic SSR)
