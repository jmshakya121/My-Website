# JM Shakya — 3D Developer Portfolio

Ultra-modern, interactive 3D developer portfolio for **JM Shakya** —
Computer Science Student & Full-Stack Developer from Bagbazar, Kathmandu, Nepal.

Built with **React 18 + Vite + Tailwind CSS + Three.js (React Three Fiber) + Framer Motion + Lucide Icons**.

## Features

- **Hero** — animated 3D WebGL scene (particles, neon shapes, starfield) with a glowing profile frame
- **Project Showcase** — "Service Desk Pro" spotlight with a cursor-tracked 3D tilt card
- **Software & Utilities Hub** — searchable download center with a secure download gate
  (captcha → wait timer → optional ad-funnel → download), copy-to-clipboard, and password-protected archives
- **Media & Social Connect** — YouTube / Instagram (with scannable QR modal) / Facebook cards
- **Contact & Footer** — WhatsApp click-to-chat, email launcher form, location & postal code
- Dark glassmorphism theme with neon cyan/violet glow, fully responsive (mobile / tablet / desktop)

## Tech Stack

| Area | Tool |
| --- | --- |
| Framework | React 18, Vite 5 |
| Styling | Tailwind CSS 3, custom neon theme |
| 3D | three, @react-three/fiber, @react-three/drei |
| Animation | framer-motion |
| Icons | lucide-react |
| QR | qrcode.react |

## Getting Started

```bash
npm install
npm run dev        # start dev server at http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # preview production build
npm run lint       # eslint check
```

## Project Structure

```
src/
├── components/
│   ├── three/HeroScene.jsx   # lazy-loaded 3D WebGL scene
│   ├── Hero.jsx              # hero section + glowing profile frame
│   ├── Skills.jsx            # tech stack marquee
│   ├── Projects.jsx          # Service Desk Pro tilt card
│   ├── SoftwareHub.jsx       # search + download gate center
│   ├── Connect.jsx           # social/media cards + QR modal
│   ├── Contact.jsx           # form + WhatsApp/email launch
│   └── Footer.jsx
└── data/profile.js           # ALL personal data, links & software items
```

## Customizing

All personal information, social links, software listings, and download URLs
live in one file: **`src/data/profile.js`**.

- Add/replace your photo at `src/assets/profile.jpg`
- Add/replace your Instagram QR at `src/assets/instagram-qr.png`
- To monetize downloads via an ad-locker, add a `funnelUrl` per software item
- Real downloadable scripts go in `public/software/` and get a `downloadUrl`
  in `src/data/profile.js` for direct download (bypassing the placeholder)

## Deployment

The build outputs a static site (`dist/`) — deploy anywhere (GitHub Pages, Netlify,
Vercel, or your own server at `jmshakya.com.np`).

## License

© JM Shakya — `jmshakya.com.np`. All rights reserved.