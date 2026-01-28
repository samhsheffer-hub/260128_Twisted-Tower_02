# 260128_Twisted_Tower

A parametric tower generator that stacks floor slabs in 3D, with live controls for twist, scale, height, and color gradients. The scene runs locally in the browser using three.js and a lightweight GUI for rapid iteration.

## Features
- Stacked slab tower with adjustable floor count and floor height
- Min/max gradient controls for twist and scale across floors
- Base/top size controls for tapering
- Bottom-to-top color gradient
- Live updates via on-change UI sliders

## Getting Started
1. Install Node.js (includes npm).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in the terminal.

## Controls
- Structure: floors, floorHeight, baseSize, topSize
- Twist/Scale: twistMin, twistMax, scaleMin, scaleMax
- Color: colorBottom, colorTop
