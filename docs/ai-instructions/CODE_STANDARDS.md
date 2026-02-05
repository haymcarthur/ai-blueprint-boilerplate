# Code Standards

**Quality standards for generated component code.**

## TypeScript Requirements

### All Code Must Be TypeScript

```typescript
// ✅ CORRECT: TypeScript with types
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button = ({ variant, onClick }: ButtonProps) => {
  // ...
};

// ❌ WRONG: JavaScript without types
export const Button = ({ variant, onClick }) => {
  // ...
};
```

### Strict Typing

```typescript
// ✅ CORRECT: Explicit types
const colors: Record<string, string> = { /* ... */ };
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => { /* ... */ };

// ❌ WRONG: any types
const colors: any = { /* ... */ };
const handleClick = (event: any) => { /* ... */ };
```

### Type Exports

```typescript
// ✅ CORRECT: Export types alongside components
export const Button = ({ ... }: ButtonProps) => { /* ... */ };
export type { ButtonProps };

// Or use interface export
export interface ButtonProps {
  // ...
}
```

## Naming Conventions

### Components: PascalCase
```typescript
export const Button = () => { /* ... */ };
export const CardHeader = () => { /* ... */ };
export const DialogOverlay = () => { /* ... */ };
```

### Props Interfaces: ComponentNameProps
```typescript
interface ButtonProps { /* ... */ }
interface CardProps { /* ... */ }
interface DialogProps { /* ... */ }
```

### Functions: camelCase
```typescript
const getVariantStyles = (variant: string) => { /* ... */ };
const handleClick = () => { /* ... */ };
```

### Constants: UPPER_SNAKE_CASE
```typescript
const MAX_WIDTH = 400;
const DEFAULT_VARIANT = 'primary';
```

### Files: PascalCase.tsx
```
Button.tsx
CardHeader.tsx
DialogOverlay.tsx
```

## Code Organization

### Imports Order
```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// 2. Internal utilities
import { colors, typography, spacing } from '../tokens';

// 3. Components
import { Button } from './Button';
import { Card } from './Card';

// 4. Types
import type { ComponentProps } from '../types';
```

### Component File Structure
```typescript
// 1. Imports
import { ... } from '...';

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Constants (if needed)
const DEFAULT_VALUE = 'value';

// 4. Main component
export const Component = (props: ComponentProps) => {
  // ...
};

// 5. Helper functions
function helperFunction() {
  // ...
}

// 6. Styled components (if using styled-components)
const StyledDiv = styled.div`
  // ...
`;
```

## React Best Practices

### Functional Components Only
```typescript
// ✅ CORRECT: Functional component
export const Button = ({ children }: ButtonProps) => (
  <button>{children}</button>
);

// ❌ WRONG: Class component
export class Button extends React.Component {
  // ...
}
```

### Destructure Props
```typescript
// ✅ CORRECT: Destructure in parameter
export const Button = ({ variant, children }: ButtonProps) => {
  // ...
};

// ❌ WRONG: Use props object
export const Button = (props: ButtonProps) => {
  return <button>{props.children}</button>;
};
```

### Default Values in Destructuring
```typescript
// ✅ CORRECT: Default in destructuring
export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
}: ButtonProps) => {
  // ...
};

// ❌ WRONG: Separate default assignment
export const Button = (props: ButtonProps) => {
  const variant = props.variant || 'primary';
  // ...
};
```

### Hooks Rules
```typescript
// ✅ CORRECT: Hooks at top level
export const Component = () => {
  const [state, setState] = useState(false);
  useEffect(() => { /* ... */ }, []);

  return <div>{/* ... */}</div>;
};

// ❌ WRONG: Conditional hooks
export const Component = ({ condition }) => {
  if (condition) {
    const [state, setState] = useState(false);  // ❌ Conditional hook
  }
  // ...
};
```

## Styling Standards

### Token Usage
```typescript
// ✅ CORRECT: Use tokens
<button style={{
  backgroundColor: colors.primary,
  padding: spacing.md,
  fontSize: typography.body.fontSize,
}}>

// ❌ WRONG: Hardcoded values
<button style={{
  backgroundColor: '#3B82F6',
  padding: '16px',
  fontSize: '16px',
}}>
```

### Style Objects
```typescript
// ✅ CORRECT: Define style objects
const buttonStyles: React.CSSProperties = {
  backgroundColor: colors.primary,
  padding: spacing.md,
};

export const Button = ({ children }: ButtonProps) => (
  <button style={buttonStyles}>{children}</button>
);

// Also acceptable: Inline for simple styles
<button style={{ padding: spacing.sm }}>{children}</button>
```

### Conditional Styles
```typescript
// ✅ CORRECT: Conditional style objects
const styles: React.CSSProperties = {
  ...baseStyles,
  ...(isActive && activeStyles),
};

// Or use functions
const getStyles = (variant: string): React.CSSProperties => {
  switch (variant) {
    case 'primary': return primaryStyles;
    case 'secondary': return secondaryStyles;
    default: return defaultStyles;
  }
};
```

## Error Handling

### Validate Props
```typescript
export const Button = ({ variant = 'primary' }: ButtonProps) => {
  if (!['primary', 'secondary', 'ghost'].includes(variant)) {
    console.warn(`Invalid variant: ${variant}. Using default.`);
    variant = 'primary';
  }
  // ...
};
```

### Handle Missing Data
```typescript
// ✅ CORRECT: Fallback for missing data
const backgroundColor = styles.backgroundColor?.tokenName
  ? colors[styles.backgroundColor.tokenName]
  : styles.backgroundColor?.value || colors.default;

// Optional chaining + fallback
```

## Performance

### Memoization for Expensive Computations
```typescript
import { useMemo } from 'react';

export const Component = ({ data }: ComponentProps) => {
  const processedData = useMemo(
    () => expensiveProcessing(data),
    [data]
  );

  return <div>{/* Use processedData */}</div>;
};
```

### Callback Memoization
```typescript
import { useCallback } from 'react';

export const Component = ({ onEvent }: ComponentProps) => {
  const handleClick = useCallback(() => {
    onEvent?.();
  }, [onEvent]);

  return <button onClick={handleClick}>Click</button>;
};
```

### Avoid Inline Function Creation in Renders
```typescript
// ✅ CORRECT: Define outside or use useCallback
const handleClick = () => { /* ... */ };

return <button onClick={handleClick}>Click</button>;

// ❌ WRONG: Inline function (creates new on every render)
return <button onClick={() => { /* ... */ }}>Click</button>;
```

## Comments

### When to Comment
```typescript
// ✅ Comment complex logic
const adjustedValue = Math.max(
  0,
  Math.min(100, value * scaleFactor)  // Clamp value to 0-100 range
);

// ✅ Comment non-obvious decisions
// Using optional chaining because tokenName may be undefined in older exports
const color = styles.color?.tokenName
  ? colors[styles.color.tokenName]
  : styles.color?.value;

// ❌ Don't comment obvious code
// Set the background color
const bg = colors.primary;
```

### JSDoc for Public APIs
```typescript
/**
 * Primary button component
 * @param variant - Visual variant (primary, secondary, ghost)
 * @param children - Button content
 */
export const Button = ({
  variant = 'primary',
  children,
}: ButtonProps) => {
  // ...
};
```

## Accessibility

### Semantic HTML
```typescript
// ✅ CORRECT: Use semantic elements
<button>Click me</button>
<nav>Navigation</nav>
<main>Content</main>

// ❌ WRONG: Generic divs everywhere
<div onClick={handleClick}>Click me</div>
```

### ARIA Attributes
```typescript
<button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  aria-disabled={isDisabled}
>
  Close
</button>
```

### Keyboard Navigation
```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
};

<div
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  onClick={handleClick}
>
  Interactive element
</div>
```

## Testing Conventions

### Test File Naming
```
Button.tsx → Button.test.tsx
Card.tsx → Card.test.tsx
```

### Test Structure
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<Button variant="secondary">Click me</Button>);
    // Assert styles
  });

  it('handles onClick', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Linting and Formatting

### ESLint
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "react/prop-types": "off",  // Using TypeScript
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### Prettier
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

## File Size Guidelines

### Keep Components Small
- **Target**: <200 lines per component
- **Maximum**: 300 lines
- **If larger**: Split into sub-components

### One Component Per File
```
Button.tsx         ← One component
ButtonGroup.tsx    ← Different component
```

## Import/Export Patterns

### Named Exports (Preferred)
```typescript
// Button.tsx
export const Button = () => { /* ... */ };
export type { ButtonProps };

// Usage
import { Button } from './Button';
```

### Barrel Exports
```typescript
// components/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Dialog } from './Dialog';

// Usage
import { Button, Card, Dialog } from './components';
```

## Critical Don'ts

- ❌ No `any` types (use `unknown` if needed)
- ❌ No class components
- ❌ No inline styles with hardcoded values
- ❌ No prop drilling (use composition)
- ❌ No premature optimization
- ❌ No commented-out code (delete it)
- ❌ No console.log in production (use proper logging)

## Summary

1. ✅ TypeScript with strict typing
2. ✅ Functional components only
3. ✅ PascalCase for components, camelCase for functions
4. ✅ Token-bound styles everywhere
5. ✅ Semantic HTML with ARIA
6. ✅ Memoize expensive operations
7. ✅ Test critical functionality
8. ✅ Keep components small (<300 lines)
9. ✅ Use ESLint + Prettier
10. ❌ No hardcoded values, no `any` types

**Clean code is maintainable code.**
