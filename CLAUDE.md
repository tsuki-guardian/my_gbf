# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Granblue Fantasy (GBF) gacha analysis tool built with Vue 3 + TypeScript + Vite. The application provides utilities for analyzing gacha pools, calculating probabilities, and simulating gacha draws.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (TypeScript compilation + Vite build)
npm run build

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Frontend Framework**: Vue 3 with `<script setup>` SFC syntax
- **Build Tool**: Vite (using rolldown-vite@7.2.5)
- **Language**: TypeScript with strict mode enabled
- **UI Library**: Element Plus (全局引入 / globally imported)
- **State Management**: Pinia (setup stores pattern)
- **Routing**: Vue Router 4 (HTML5 History mode)
- **Styling**: SCSS

### Project Structure

```
src/
├── layout/           # Layout components (Header, Sidebar)
│   └── index.vue    # Main layout wrapper with collapsible sidebar
├── views/           # Page components
│   ├── Home.vue
│   ├── About.vue
│   └── GachaParse.vue  # Main gacha analysis tool
├── stores/          # Pinia stores
│   ├── menu.ts      # Sidebar collapse state
│   ├── counter.ts   # Example counter store
│   ├── user.ts      # User authentication store
│   └── index.ts     # Centralized exports
├── router/          # Vue Router configuration
└── main.ts          # App entry point

json/                # Static data files
├── character.json   # Character database
├── summons.json     # Summon database
└── example_data.json
```

### Key Architectural Patterns

1. **Layout System**: All routes use a nested layout structure with:
   - Fixed collapsible sidebar (210px expanded, 64px collapsed)
   - Fixed header with menu toggle
   - Scrollable main content area
   - Layout state managed via Pinia `useMenuStore`

2. **Routing**: All pages are children of the Layout component:
   ```typescript
   {
     path: '/',
     component: Layout,
     children: [/* page routes */]
   }
   ```

3. **State Management**:
   - Uses Pinia setup stores (Composition API style)
   - Stores are centrally exported from `src/stores/index.ts`
   - Import pattern: `import { useMenuStore, useUserStore } from '@/stores'`

4. **Path Aliases**:
   - `@/` maps to `src/` directory
   - Configured in both `vite.config.ts` and `tsconfig.app.json`

5. **Element Plus Integration**:
   - Globally imported in `main.ts` (no auto-import)
   - Icons imported from `@element-plus/icons-vue`
   - All components available without individual imports

### GachaParse Feature

The main feature (`src/views/GachaParse.vue`) provides:
- **Data Input**: Textarea for pasting gacha pool JSON data
- **Data Parsing**: Matches weapon names to character database, summon names to summon database
- **Visual Display**: Grid of character/summon images with:
  - Black semi-transparent mask overlay (60% opacity)
  - Click to toggle selection (removes mask, adds blue border)
  - Rate badge on each item
- **Probability Calculator**:
  - Sums rates of selected items only
  - Displays rounded to 2 decimal places using `Math.round(total * 100) / 100`
- **Gacha Simulator**: Weighted random draw from all pool items based on their rates

### Data Structure

Character database (`json/character.json`):
```typescript
{
  unlockWeapon: string  // Used to match gacha data
  characterId: string   // Used to construct image URL
  rare: "SSR" | "SR" | "R"
  name: string
}
```

Summon database (`json/summons.json`):
```typescript
{
  name: string  // Used to match gacha data
  id: string    // Used to construct image URL
}
```

Image URL patterns:
- Characters: `https://prd-game-a1-granbluefantasy.akamaized.net/assets/img/sp/assets/npc/m/304${characterId}000_01.jpg`
- Summons: `https://prd-game-a1-granbluefantasy.akamaized.net/assets/img/sp/assets/summon/m/204${id}000.jpg`

## Important Notes

- This project uses `rolldown-vite` as a Vite replacement (specified in package.json overrides)
- TypeScript strict mode is enabled with additional linting rules
- All Vue components use `<script setup lang="ts">` syntax
- SCSS is available in all `.vue` files with `<style lang="scss" scoped>`
- Element Plus messages (`ElMessage`) are used for user feedback
