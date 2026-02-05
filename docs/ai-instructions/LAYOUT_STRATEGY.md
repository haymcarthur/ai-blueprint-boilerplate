# Layout Strategy

**Implement layouts exactly as defined in Figma auto-layout specifications.**

## Figma Auto-Layout → Code Mapping

Figma's auto-layout maps directly to CSS Flexbox:

| Figma Property | CSS Equivalent | Description |
|----------------|----------------|-------------|
| `layoutMode: HORIZONTAL` | `flexDirection: 'row'` | Horizontal layout |
| `layoutMode: VERTICAL` | `flexDirection: 'column'` | Vertical layout |
| `primaryAxisAlignItems: MIN` | `justifyContent: 'flex-start'` | Align to start |
| `primaryAxisAlignItems: CENTER` | `justifyContent: 'center'` | Center align |
| `primaryAxisAlignItems: MAX` | `justifyContent: 'flex-end'` | Align to end |
| `primaryAxisAlignItems: SPACE_BETWEEN` | `justifyContent: 'space-between'` | Space between |
| `counterAxisAlignItems: MIN` | `alignItems: 'flex-start'` | Cross-axis start |
| `counterAxisAlignItems: CENTER` | `alignItems: 'center'` | Cross-axis center |
| `counterAxisAlignItems: MAX` | `alignItems: 'flex-end'` | Cross-axis end |
| `itemSpacing` | `gap` | Space between children |
| `paddingLeft/Right/Top/Bottom` | `padding` | Inner spacing |

## Reading Auto-Layout from Catalog

Component definitions include `autoLayout` data:

```json
{
  "name": "Card",
  "autoLayout": {
    "layoutMode": "VERTICAL",
    "primaryAxisAlignItems": "MIN",
    "counterAxisAlignItems": "MIN",
    "paddingLeft": { "value": 16, "tokenName": "md" },
    "paddingRight": { "value": 16, "tokenName": "md" },
    "paddingTop": { "value": 16, "tokenName": "md" },
    "paddingBottom": { "value": 16, "tokenName": "md" },
    "itemSpacing": { "value": 12, "tokenName": "sm" }
  }
}
```

## Implementation Pattern

### Step 1: Extract Auto-Layout Data
```typescript
const { autoLayout } = componentDef;
if (!autoLayout) {
  // No auto-layout, use absolute positioning
  return;
}
```

### Step 2: Map to CSS Flexbox
```typescript
const flexDirection = autoLayout.layoutMode === 'HORIZONTAL' ? 'row' : 'column';

const justifyContent = {
  'MIN': 'flex-start',
  'CENTER': 'center',
  'MAX': 'flex-end',
  'SPACE_BETWEEN': 'space-between',
}[autoLayout.primaryAxisAlignItems];

const alignItems = {
  'MIN': 'flex-start',
  'CENTER': 'center',
  'MAX': 'flex-end',
}[autoLayout.counterAxisAlignItems];
```

### Step 3: Apply Token-Bound Values
```typescript
const padding = {
  paddingLeft: autoLayout.paddingLeft.tokenName
    ? spacing[autoLayout.paddingLeft.tokenName]
    : autoLayout.paddingLeft.value,
  // ... repeat for right/top/bottom
};

const gap = autoLayout.itemSpacing.tokenName
  ? spacing[autoLayout.itemSpacing.tokenName]
  : autoLayout.itemSpacing.value;
```

### Step 4: Generate Component Style
```typescript
<div style={{
  display: 'flex',
  flexDirection,
  justifyContent,
  alignItems,
  gap,
  ...padding,
}}>
  {children}
</div>
```

## Complete Example

### Figma Export
```json
{
  "name": "CardHeader",
  "autoLayout": {
    "layoutMode": "HORIZONTAL",
    "primaryAxisAlignItems": "SPACE_BETWEEN",
    "counterAxisAlignItems": "CENTER",
    "paddingLeft": { "value": 24, "tokenName": "lg" },
    "paddingRight": { "value": 24, "tokenName": "lg" },
    "paddingTop": { "value": 16, "tokenName": "md" },
    "paddingBottom": { "value": 16, "tokenName": "md" },
    "itemSpacing": { "value": 12, "tokenName": "sm" }
  }
}
```

### Generated Component
```typescript
import { spacing } from '../tokens';

export const CardHeader = ({ children }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  }}>
    {children}
  </div>
);
```

## Absolute Positioning (Non-Auto-Layout)

Some Figma frames don't use auto-layout. They use absolute positioning.

### Detecting Absolute Positioning
```json
{
  "name": "HeroSection",
  "autoLayout": null,  // ← No auto-layout
  "absoluteBounds": {
    "x": 0,
    "y": 0,
    "width": 1440,
    "height": 600
  },
  "children": [
    {
      "name": "Background",
      "x": 0,
      "y": 0,
      "width": 1440,
      "height": 600
    },
    {
      "name": "Title",
      "x": 100,
      "y": 200,
      "width": 600,
      "height": 80
    }
  ]
}
```

### Implementation Pattern
```typescript
// Parent container
<div style={{
  position: 'relative',
  width: component.absoluteBounds.width,
  height: component.absoluteBounds.height,
}}>
  {/* Children with absolute positioning */}
  {children.map(child => (
    <div key={child.id} style={{
      position: 'absolute',
      left: child.x,
      top: child.y,
      width: child.width,
      height: child.height,
    }}>
      {renderChild(child)}
    </div>
  ))}
</div>
```

## Responsive Considerations

### Fixed Layouts
Figma exports fixed dimensions. For responsive layouts:

1. **Use percentage widths** where appropriate
2. **Add media queries** for breakpoints
3. **Convert fixed spacing to relative** (em, rem)

**But**: Only do this if specified in design annotations. Otherwise, match Figma exactly.

### Example: Responsive Card
```typescript
// Figma: width: 400px
// Responsive: max-width with percentage

<div style={{
  maxWidth: '400px',
  width: '100%',  // ← Responsive
  // ... rest of styles from Figma
}}>
```

## Common Layout Patterns

### Stack (Vertical Auto-Layout)
```typescript
// Common pattern: Vertical stack with consistent spacing
<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
}}>
```

### Row (Horizontal Auto-Layout)
```typescript
// Common pattern: Horizontal row with space-between
<div style={{
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}}>
```

### Grid (Not from Auto-Layout)
```typescript
// If design uses grid (rare in Figma exports)
// Implement with CSS Grid, not Flexbox
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: spacing.md,
}}>
```

## Layout Props

Components may have layout-related props:

```json
{
  "name": "Button",
  "props": [
    {
      "name": "fullWidth",
      "type": "boolean",
      "defaultValue": false
    }
  ]
}
```

### Implementation
```typescript
interface ButtonProps {
  fullWidth?: boolean;
}

export const Button = ({ fullWidth, children }) => (
  <button style={{
    // ... other styles
    width: fullWidth ? '100%' : 'auto',
  }}>
    {children}
  </button>
);
```

## Sizing Constraints

Figma exports may include sizing constraints:

```json
{
  "minWidth": 100,
  "maxWidth": 400,
  "minHeight": 40,
  "layoutGrow": 1  // ← Flex-grow
}
```

### Implementation
```typescript
<div style={{
  minWidth: '100px',
  maxWidth: '400px',
  minHeight: '40px',
  flexGrow: layoutGrow || 0,
}}>
```

## Critical Rules

1. ✅ **Map Figma auto-layout to CSS Flexbox** exactly
2. ✅ **Use token-bound spacing values** (never hardcode)
3. ✅ **Implement absolute positioning** when auto-layout is null
4. ✅ **Match dimensions exactly** (don't "improve" layouts)
5. ❌ **Never add responsive behavior** unless specified in annotations
6. ❌ **Never change layout direction** (vertical ↔ horizontal)
7. ❌ **Never adjust spacing** to "look better"

## Debugging Layouts

If layout doesn't match Figma:
1. Check `autoLayout` values in catalog
2. Verify token-bound spacing is correct
3. Compare flexbox properties to Figma properties
4. Check if absolute positioning is needed
5. Validate child component dimensions

**Use browser DevTools** to inspect computed styles and compare to Figma.

## Summary

- Figma auto-layout → CSS Flexbox (direct mapping)
- Use token-bound spacing values always
- Implement absolute positioning when needed
- Match layouts exactly (no improvisation)
- Only add responsiveness if specified

**The layout is part of the design. Implement it faithfully.**
