# No Invention Contract

**Core Principle**: Implement only what was exported from Figma. Do not invent, improvise, or "improve" designs.

## What This Means

### ✅ DO:
- Implement components exactly as defined in `component-catalog.json`
- Use props, variants, and styles from the export
- Match layout, spacing, and dimensions precisely
- Use design tokens for all values
- Follow component dependencies and composition
- Implement designer annotations as specified

### ❌ DON'T:
- Create components not in the catalog
- Add props not defined in the export
- Invent variants or states not exported
- "Improve" or "modernize" designs
- Add features "that might be useful"
- Deviate from specified layouts
- Hardcode values instead of using tokens
- Recreate components inline (always import and compose)

## Why This Matters

1. **Design Fidelity**: Maintains exact design-to-code match
2. **Designer Control**: Respects designer's decisions and specifications
3. **Predictability**: Output matches expectations 100%
4. **Maintainability**: Changes happen in Figma, then re-export
5. **Accountability**: Implementation traceable to export data

## Common Violations to Avoid

### Inventing Components
```typescript
// ❌ WRONG: Creating a component not in catalog
const LoadingSpinner = () => <div className="spinner">...</div>;

// ✅ CORRECT: Only implement exported components
// If LoadingSpinner isn't in catalog, don't create it
```

### Adding Props
```typescript
// ❌ WRONG: Adding props not in export
interface ButtonProps {
  variant: 'primary' | 'secondary';
  disabled?: boolean; // Not in export!
  onClick?: () => void; // Not in export!
}

// ✅ CORRECT: Only exported props
interface ButtonProps {
  variant: 'primary' | 'secondary'; // From catalog
}
```

### Improving Layouts
```typescript
// ❌ WRONG: "Improving" spacing
<div className="p-4"> {/* Export said p-3 */}

// ✅ CORRECT: Exact spacing from export
<div className="p-3"> {/* Matches export exactly */}
```

### Inventing Variants
```typescript
// ❌ WRONG: Adding variants not exported
export const Button = ({ variant = 'primary' }) => {
  if (variant === 'ghost') return <GhostButton />; // Not in export!
  // ...
};

// ✅ CORRECT: Only exported variants
export const Button = ({ variant = 'primary' }) => {
  if (variant === 'primary') return <PrimaryButton />;
  if (variant === 'secondary') return <SecondaryButton />;
  // Only variants from catalog
};
```

## When You Need Something Not Exported

**STOP and ask the designer**. Do not proceed with assumptions.

### Scenarios:
1. **Missing component**: Designer needs to export it from Figma
2. **Missing prop**: Designer needs to add it in Figma and re-export
3. **Unclear behavior**: Check designer annotations or ask for clarification
4. **Missing variant**: Designer needs to create it in Figma

## Preflight Validation

The export includes preflight validation:
- Lists what was exported (components, tokens, props)
- Flags missing dependencies
- Reports token coverage

**Trust the preflight report**. It tells you exactly what should exist.

## Exception: Implementation Details

You may make decisions about:
- Internal state management (useState, useReducer, etc.)
- Event handler implementation (onClick, onChange, etc.)
- Performance optimizations (useMemo, useCallback, etc.)
- Accessibility enhancements (ARIA, focus management, keyboard nav)

These are **implementation concerns**, not design deviations.

## Summary

**If it's not in the export, don't build it.**

This contract ensures design fidelity, maintains designer control, and creates predictable, maintainable code.
