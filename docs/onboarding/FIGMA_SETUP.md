# Figma Setup Guide

**Configure Figma and the AI Blueprint plugin for optimal exports.**

## Installing the AI Blueprint Plugin

### Step 1: Find the Plugin
1. Open Figma
2. Click **Plugins** menu → **Browse plugins in Community**
3. Search for "AI Blueprint"
4. Click **Install**

### Step 2: Grant Permissions
The plugin needs permissions to:
- Read component definitions
- Read design tokens (Variables)
- Read annotations
- Access file metadata

**Click "Allow" when prompted.**

### Step 3: Verify Installation
1. Right-click on canvas
2. **Plugins** → Check "AI Blueprint" appears
3. Click to open plugin panel

**Success!** You're ready to configure.

## Setting Up Design Tokens

Design tokens ensure consistent styling between Figma and code.

### Step 1: Create Variable Collections
1. Open **Variables** panel (⌘/Ctrl + /)
2. Create collections:
   - **Colors** (e.g., primary, secondary, background, text)
   - **Spacing** (e.g., xs=4, sm=8, md=16, lg=24, xl=32)
   - **Typography** (font sizes, weights, line heights)

### Step 2: Define Variables
```
Colors Collection:
  primary: #3B82F6
  secondary: #10B981
  background: #FFFFFF
  text: #1F2937

Spacing Collection:
  xs: 4
  sm: 8
  md: 16
  lg: 24
  xl: 32
```

### Step 3: Bind Variables to Components
1. Select component
2. In **Design** panel, click dropdown next to property
3. Select variable instead of hardcoded value
4. Repeat for colors, spacing, effects

**Example**: Button background color → Bind to `colors/primary`

## Component Library Best Practices

### Naming Conventions
```
✅ GOOD:
  Button
  Card
  DialogOverlay

❌ AVOID:
  DS/Components/Button/Primary (will be sanitized)
  button (lowercase)
  btn (abbreviation)
```

### Variants Setup
```
Component: Button
  ├─ Variant: variant
  │   ├─ primary
  │   ├─ secondary
  │   └─ ghost
  └─ Variant: size
      ├─ sm
      ├─ md
      └─ lg
```

### Auto-Layout Usage
**Always use auto-layout for spacing:**
- Padding: Bind to spacing variables
- Item spacing: Bind to spacing variables
- Direction: Horizontal or Vertical
- Alignment: Start, Center, End, Space Between

## Configuring the Plugin

### Step 1: Open Plugin
1. Right-click canvas
2. **Plugins** → **AI Blueprint**
3. Plugin panel opens

### Step 2: Create Profile
1. Click "Create Profile"
2. Fill in:
   - **Profile Name**: (e.g., "React + Tailwind")
   - **Framework**: React, Vue, Svelte
   - **UI Library**: None, shadcn/ui, Material UI
   - **Styling System**: Tailwind CSS, CSS-in-JS, CSS Modules
   - **Token Strategy**: Variables, Styles, Both
   - **Library Path**: (e.g., `@/components`)

3. Click "Save Profile"

### Step 3: Configure Patterns (Optional)
**External Library Detection**:
If you use icon libraries (Lucide, Heroicons), add patterns:
```
icon/          → Matches icon/arrow-left
@heroicons/    → Matches @heroicons/outline/arrow
```

**Custom Naming Rules**:
Add sanitization rules for your naming conventions:
```
Remove: DS/, Components/, Primitive
Convert: kebab-case → PascalCase
```

## Pre-Export Checklist

Before running Bootstrap or Screen Export:

### Component Checklist
- ✅ All components use auto-layout (not absolute positioning)
- ✅ Components have clear, descriptive names
- ✅ Variants are properly configured
- ✅ Component props are defined

### Token Binding Checklist
- ✅ Colors bound to color variables (>70% coverage)
- ✅ Spacing bound to spacing variables (>70% coverage)
- ✅ Typography bound to text styles (>60% coverage)
- ✅ Effects bound to effect styles (>50% coverage)

### File Organization Checklist
- ✅ Components in logical groups (pages, components, etc.)
- ✅ Naming is consistent
- ✅ No duplicate component names

## Running Your First Export

### Bootstrap Mode (Component Library)
**When to use**: Building a new component library

1. Open AI Blueprint plugin
2. Select "Bootstrap" tab
3. Select components to export (Shift+Click for multi-select)
4. Click "Export Bootstrap"
5. Plugin generates:
   - `component-catalog.json`
   - `design-tokens.json`
6. Save both files to repository root

### Screen Export (Implementation)
**When to use**: Implementing specific screens

1. Open AI Blueprint plugin
2. Select "Screen Export" tab
3. Select screen frames
4. Click "Export Screen"
5. Plugin generates:
   - `screen-export.json`
   - Uses existing `component-catalog.json` for component references
6. Save to repository

## Preflight Validation

The plugin runs preflight checks before export:

### Status: READY ✅
All checks passed. Safe to export.

### Status: WARNING ⚠️
Minor issues detected. Review warnings:
- Low token coverage (but above threshold)
- Some components not bound to catalog
- Missing some assets

**Action**: Export is safe, but consider fixing warnings.

### Status: BLOCKED 🔴
Critical issues must be fixed:
- Token coverage below threshold (<50%)
- Missing required component dependencies
- Invalid component structures

**Action**: Fix errors before exporting.

## Common Issues

### "No variables found"
**Fix**: Create variable collections in Figma

### "Token coverage too low"
**Fix**: Bind more properties to variables
- Colors → Color variables
- Spacing → Spacing variables
- Typography → Text styles

### "Component has no variants"
**Fix**: Add component properties in Figma
1. Select main component
2. **Design panel** → **Component** → Add property

### "Cannot read component properties"
**Fix**: Ensure you're selecting main components, not instances

## Tips for High-Quality Exports

1. **Use variables everywhere**: Aim for 80%+ token coverage
2. **Consistent naming**: Follow team conventions
3. **Auto-layout always**: Makes responsive code easier
4. **Document with annotations**: Add notes for complex behaviors
5. **Test preflight**: Fix issues before exporting
6. **Version control**: Export regularly, track changes

## Next Steps

- Read [DESIGNER_WORKFLOW.md](./DESIGNER_WORKFLOW.md) for daily workflow
- Share exports with developers
- Review generated components in Storybook
- Iterate based on developer feedback

## Resources

- AI Blueprint Plugin Documentation: (link)
- Figma Variables Guide: https://help.figma.com/hc/en-us/articles/15339657135383
- Figma Auto-Layout Guide: https://help.figma.com/hc/en-us/articles/360040451373

**Ready to export? Continue with [DESIGNER_WORKFLOW.md](./DESIGNER_WORKFLOW.md)**
