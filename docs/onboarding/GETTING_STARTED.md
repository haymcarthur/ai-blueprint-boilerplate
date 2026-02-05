# Getting Started

**Quick start guide for the AI Blueprint boilerplate repository.**

## Welcome!

This repository streamlines the Figma → Code workflow using the AI Blueprint plugin + Claude AI. It generates production-ready component code from Figma designs with minimal manual work.

## What You'll Learn

- How the workflow works (Figma → Export → Bootstrap → Code)
- Prerequisites and setup
- Your first export and bootstrap
- Key concepts and terminology

## Prerequisites

### For Designers
- Figma account with editor access
- AI Blueprint plugin installed ([installation guide](./FIGMA_SETUP.md))
- Basic understanding of Figma components and design tokens

### For Developers
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)
- Basic React + TypeScript knowledge

## Quick Start (5 Minutes)

### Step 1: Clone Repository
```bash
git clone https://github.com/YOUR_ORG/ai-blueprint-boilerplate.git
cd ai-blueprint-boilerplate
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Get Figma Exports
Ask your designer to export from Figma using the AI Blueprint plugin, or use the sample exports:

```bash
# Sample exports included in docs/examples/
cp docs/examples/sample-component-catalog.json ./component-catalog.json
cp docs/examples/sample-design-tokens.json ./design-tokens.json
```

### Step 4: Bootstrap
```bash
npm run bootstrap
```

**Output**:
```
✓ Generated src/tokens/colors.ts (15 tokens)
✓ Generated src/tokens/typography.ts (8 tokens)
✓ Created src/components/Button/Button.tsx
✓ Updated naming-registry.json
✓ Bootstrap complete!
```

### Step 5: Start Storybook
```bash
npm run storybook
```

**Opens at**: `http://localhost:6006`

**Congrats! You've bootstrapped your first component library.**

## Key Concepts

### Component Catalog
**What**: JSON export from Figma containing component definitions
**Location**: `component-catalog.json` (root directory)
**Contains**: Component names, props, variants, styles, layout specs

### Design Tokens
**What**: JSON export from Figma containing design tokens
**Location**: `design-tokens.json` (root directory)
**Contains**: Colors, typography, spacing, effects (shadows, blurs)

### Bootstrap Script
**What**: Script that generates code from Figma exports
**Command**: `npm run bootstrap`
**Does**: Generates token files, component stubs, Storybook stories

### Storybook
**What**: Visual testing environment for components
**Command**: `npm run storybook`
**Purpose**: Test components, review with designer, document usage

### Naming Registry
**What**: Maps Figma component names to code-friendly names
**Location**: `naming-registry.json`
**Example**: `DS/Components/Button/Primary` → `Button` (variant: primary)

### Plugin Hooks
**What**: Automation scripts that run after exports
**Location**: `plugin-hooks.json`
**Example**: Auto-format code, rebuild Storybook, run tests

## Workflow Overview

```
┌─────────────┐
│   Designer  │
│  (Figma)    │
└──────┬──────┘
       │ 1. Create components
       │ 2. Bind design tokens
       │ 3. Run AI Blueprint plugin
       ↓
┌─────────────────────────────┐
│  Figma Exports              │
│  - component-catalog.json   │
│  - design-tokens.json       │
└──────┬──────────────────────┘
       │ 4. Save to repo
       ↓
┌─────────────┐
│  Developer  │
│  (Local)    │
└──────┬──────┘
       │ 5. npm run bootstrap
       ↓
┌─────────────────────────────┐
│  Generated Code             │
│  - src/tokens/*.ts          │
│  - src/components/*/*.tsx   │
│  - Storybook stories        │
└──────┬──────────────────────┘
       │ 6. Implement components
       │ 7. Test in Storybook
       ↓
┌─────────────┐
│  Designer   │
│  Reviews    │
└──────┬──────┘
       │ 8. Approves or requests changes
       ↓
    Repeat until complete
```

## Repository Structure

```
ai-blueprint-boilerplate/
├── docs/
│   ├── ai-instructions/      # AI-readable instruction files
│   └── onboarding/           # Human-readable guides (you are here!)
├── src/
│   ├── tokens/               # Generated token definitions
│   └── components/           # Generated component source
├── assets/                   # Icons, images, fonts
├── .storybook/               # Storybook configuration
├── component-catalog.json    # Figma component export
├── design-tokens.json        # Figma token export
├── naming-registry.json      # Name mappings
└── plugin-hooks.json         # Automation config
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run bootstrap` | Generate code from Figma exports |
| `npm run storybook` | Start Storybook dev server |
| `npm run build:storybook` | Build Storybook for deployment |
| `npm run format` | Auto-format code with Prettier |
| `npm run lint` | Lint code with ESLint |
| `npm run typecheck` | Check TypeScript types |

## Next Steps

- **Designers**: Read [FIGMA_SETUP.md](./FIGMA_SETUP.md) to configure the plugin
- **Designers**: Read [DESIGNER_WORKFLOW.md](./DESIGNER_WORKFLOW.md) for export workflow
- **Developers**: Read [DEVELOPER_WORKFLOW.md](./DEVELOPER_WORKFLOW.md) for implementation workflow
- **Everyone**: Bookmark [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues

## Getting Help

- **Documentation**: Check `docs/onboarding/` and `docs/ai-instructions/`
- **Issues**: Open issue on GitHub repository
- **Examples**: See `docs/examples/` for sample exports and components

## Success Metrics

After completing this guide, you should be able to:
- ✅ Clone and set up the repository
- ✅ Install dependencies
- ✅ Run bootstrap script with sample exports
- ✅ Start Storybook and view components
- ✅ Understand the Figma → Code workflow
- ✅ Know where to find documentation

**Ready to dive deeper? Continue with the role-specific guides:**
- [FIGMA_SETUP.md](./FIGMA_SETUP.md) - For designers
- [DEVELOPER_WORKFLOW.md](./DEVELOPER_WORKFLOW.md) - For developers
