# Token Binding Guidelines

**Design tokens are the bridge between design and code. Use them consistently.**

## What Are Design Tokens?

Design tokens are design decisions exported from Figma:
- **Colors**: Background, text, border colors
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Padding, margin, gap values
- **Effects**: Shadows, blurs

## Token Structure

### Colors
```typescript
export const colors = {
  'primary': '#3B82F6',
  'primary-hover': '#2563EB',
  'background': '#FFFFFF',
  'text': '#1F2937',
  // ...
};
```

### Typography
```typescript
export const typography = {
  'heading-lg': {
    fontFamily: 'Inter',
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: '40px',
  },
  'body': {
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
  },
  // ...
};
```

### Spacing
```typescript
export const spacing = {
  'xs': '4px',
  'sm': '8px',
  'md': '16px',
  'lg': '24px',
  'xl': '32px',
  // ...
};
```

### Effects
```typescript
export const effects = {
  'shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  // ...
};
```

## Usage Requirements

### ✅ DO: Use Tokens Everywhere

```typescript
// ✅ CORRECT: Using color tokens
<button style={{ backgroundColor: colors.primary }}>

// ✅ CORRECT: Using typography tokens
<h1 style={{ ...typography['heading-lg'] }}>

// ✅ CORRECT: Using spacing tokens
<div style={{ padding: spacing.md }}>

// ✅ CORRECT: Using effect tokens
<div style={{ boxShadow: effects['shadow-md'] }}>
```

### ❌ DON'T: Hardcode Values

```typescript
// ❌ WRONG: Hardcoded color
<button style={{ backgroundColor: '#3B82F6' }}>

// ❌ WRONG: Hardcoded typography
<h1 style={{ fontSize: '32px', fontWeight: 700 }}>

// ❌ WRONG: Hardcoded spacing
<div style={{ padding: '16px' }}>

// ❌ WRONG: Hardcoded shadow
<div style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
```

## Framework-Specific Usage

### React with CSS-in-JS
```typescript
import { colors, typography, spacing } from './tokens';

const Button = styled.button`
  background-color: ${colors.primary};
  font-size: ${typography.body.fontSize};
  padding: ${spacing.md};
`;
```

### React with Tailwind CSS
```typescript
// Generate Tailwind config from tokens
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: colors,
      spacing: spacing,
      boxShadow: effects,
    },
  },
};
```

### React with Inline Styles
```typescript
import { colors, spacing } from './tokens';

const Button = ({ children }) => (
  <button style={{
    backgroundColor: colors.primary,
    padding: spacing.md,
  }}>
    {children}
  </button>
);
```

## Token Binding in Component Catalog

Component definitions include token references:

```json
{
  "name": "Button",
  "styles": {
    "backgroundColor": {
      "value": "#3B82F6",
      "tokenName": "primary"  // ← Token binding
    },
    "padding": {
      "value": "16px",
      "tokenName": "md"  // ← Token binding
    }
  }
}
```

**Your job**: Use `tokenName` when it exists, fall back to `value` only if undefined.

### Implementation Pattern

```typescript
// Read from catalog
const bgColor = component.styles.backgroundColor;

// Use token if bound, fallback to value
const backgroundColor = bgColor.tokenName
  ? colors[bgColor.tokenName]
  : bgColor.value;
```

## Token Coverage

The preflight report shows token coverage:
- **Colors**: Percentage of colors using tokens vs. hardcoded
- **Typography**: Percentage of text using tokens
- **Spacing**: Percentage of spacing using tokens

**Aim for 70%+ coverage** across all categories.

### Low Coverage = Bad Practice

```
⚠️ Token Coverage:
- Colors: 45% (9/20) - BLOCKED
- Typography: 30% (3/10) - BLOCKED
- Spacing: 20% (2/10) - BLOCKED
```

**This means**: Too many hardcoded values. Bind more tokens in Figma.

### High Coverage = Good Practice

```
✅ Token Coverage:
- Colors: 85% (17/20) - READY
- Typography: 90% (9/10) - READY
- Spacing: 80% (8/10) - READY
```

**This means**: Most values use tokens. Code is maintainable.

## Token Updates

When tokens change in Figma:
1. Designer re-exports `design-tokens.json`
2. Run `npm run generate:tokens`
3. Token files regenerate automatically
4. Components pick up new values without code changes

**This is the power of tokens**: Change once, update everywhere.

## Common Mistakes

### Mistake 1: Not Checking for Token Binding
```typescript
// ❌ WRONG: Ignores tokenName
const color = component.styles.color.value;

// ✅ CORRECT: Checks tokenName first
const color = component.styles.color.tokenName
  ? colors[component.styles.color.tokenName]
  : component.styles.color.value;
```

### Mistake 2: Mixing Tokens and Hardcoded Values
```typescript
// ❌ WRONG: Some use tokens, some don't
<div style={{
  backgroundColor: colors.primary,  // Token
  color: '#1F2937',                 // Hardcoded!
  padding: spacing.md,              // Token
  margin: '8px',                    // Hardcoded!
}}>
```

### Mistake 3: Creating Custom Values
```typescript
// ❌ WRONG: Creating values not in catalog
const customPadding = '18px'; // Not exported!

// ✅ CORRECT: Use closest token or exact value from catalog
const padding = spacing.md; // From catalog
```

## Token Generation Script

The `npm run generate:tokens` script reads `design-tokens.json` and generates TypeScript files:

```bash
$ npm run generate:tokens
✓ Generated src/tokens/colors.ts (15 tokens)
✓ Generated src/tokens/typography.ts (8 tokens)
✓ Generated src/tokens/spacing.ts (10 tokens)
✓ Generated src/tokens/effects.ts (5 tokens)
✓ Generated src/tokens/index.ts
```

**Do not** manually edit generated token files. They're regenerated on every export.

## Summary

1. ✅ Use tokens for all colors, typography, spacing, effects
2. ✅ Check `tokenName` in component definitions
3. ✅ Aim for 70%+ token coverage
4. ❌ Never hardcode values
5. ❌ Never mix tokens and hardcoded values
6. ✅ Regenerate tokens when Figma exports change

**Tokens are your source of truth for design values.**
