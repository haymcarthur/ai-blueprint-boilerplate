# Component Patterns

**Standard patterns for implementing components from Figma exports.**

## Component Structure

Every component follows this structure:

```typescript
// 1. Imports
import { colors, typography, spacing } from '../tokens';
import { ChildComponent } from './ChildComponent';

// 2. Props Interface
interface ComponentNameProps {
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
  // ... other props from catalog
}

// 3. Component Implementation
export const ComponentName = ({
  variant = 'primary',
  children,
}: ComponentNameProps) => {
  // 4. Variant-specific styles
  const variantStyles = getVariantStyles(variant);

  // 5. Render
  return (
    <div style={variantStyles}>
      {children}
    </div>
  );
};

// 6. Helper functions (if needed)
function getVariantStyles(variant: string) {
  // ...
}
```

## Props from Catalog

Component definitions include props:

```json
{
  "name": "Button",
  "props": [
    {
      "name": "variant",
      "type": "string",
      "values": ["primary", "secondary", "ghost"],
      "defaultValue": "primary"
    },
    {
      "name": "size",
      "type": "string",
      "values": ["sm", "md", "lg"],
      "defaultValue": "md"
    },
    {
      "name": "disabled",
      "type": "boolean",
      "defaultValue": false
    }
  ]
}
```

### Props Interface Generation

```typescript
// Map catalog props to TypeScript interface
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';  // ← From catalog
  size?: 'sm' | 'md' | 'lg';                    // ← From catalog
  disabled?: boolean;                            // ← From catalog
  children?: React.ReactNode;                    // ← Always add
}
```

### Default Values

```typescript
// Use default values from catalog
export const Button = ({
  variant = 'primary',  // ← From catalog.defaultValue
  size = 'md',          // ← From catalog.defaultValue
  disabled = false,     // ← From catalog.defaultValue
  children,
}: ButtonProps) => {
  // ...
};
```

## Variants

Components often have multiple variants (visual variations).

### Reading Variants from Catalog

```json
{
  "name": "Button",
  "variants": [
    {
      "name": "primary",
      "properties": { "variant": "primary" },
      "styles": {
        "backgroundColor": { "value": "#3B82F6", "tokenName": "primary" },
        "color": { "value": "#FFFFFF", "tokenName": "text-inverse" }
      }
    },
    {
      "name": "secondary",
      "properties": { "variant": "secondary" },
      "styles": {
        "backgroundColor": { "value": "transparent", "tokenName": null },
        "color": { "value": "#3B82F6", "tokenName": "primary" },
        "border": { "value": "1px solid #3B82F6", "tokenName": "primary" }
      }
    }
  ]
}
```

### Variant Implementation

```typescript
export const Button = ({ variant = 'primary', children }: ButtonProps) => {
  // Get variant styles from catalog data
  const variantData = variants.find(v => v.name === variant);

  // Apply token-bound styles
  const styles = {
    backgroundColor: variantData.styles.backgroundColor.tokenName
      ? colors[variantData.styles.backgroundColor.tokenName]
      : variantData.styles.backgroundColor.value,
    color: variantData.styles.color.tokenName
      ? colors[variantData.styles.color.tokenName]
      : variantData.styles.color.value,
    // ... other styles
  };

  return <button style={styles}>{children}</button>;
};
```

## Component Composition

Components often contain other components.

### Reading Component References

```json
{
  "name": "Dialog",
  "children": [
    {
      "type": "INSTANCE",
      "componentRef": "Button",  // ← Reference to catalog component
      "props": {
        "variant": "primary",
        "children": "Close"
      }
    },
    {
      "type": "TEXT",
      "text": "Dialog content"
    }
  ]
}
```

### Composition Implementation

```typescript
import { Button } from './Button';  // ← Import referenced component

export const Dialog = ({ children }) => {
  return (
    <div>
      {/* Use imported component, don't recreate inline */}
      <Button variant="primary">Close</Button>
      <div>{children}</div>
    </div>
  );
};
```

**Critical**: Always import and compose. Never recreate components inline.

## Children Prop

Components that contain content should accept `children`:

```typescript
interface CardProps {
  children?: React.ReactNode;  // ← Always optional
}

export const Card = ({ children }: CardProps) => (
  <div className="card">
    {children}
  </div>
);
```

## Component Dependencies

Build components in dependency order:

```
Button (no dependencies)
  ↓
Card (uses Button)
  ↓
Dialog (uses Button + Card)
```

### Detecting Dependencies

```json
{
  "name": "Dialog",
  "componentRefs": ["Button", "Card"]  // ← Dependencies
}
```

**Build Button and Card before Dialog.**

## Styling Approaches

### Inline Styles (Simple)
```typescript
<button style={{
  backgroundColor: colors.primary,
  padding: spacing.md,
}}>
```

### CSS-in-JS (Styled Components)
```typescript
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: ${colors.primary};
  padding: ${spacing.md};
`;
```

### CSS Modules
```typescript
import styles from './Button.module.css';

<button className={styles.button}>
```

### Tailwind CSS
```typescript
<button className="bg-primary px-4 py-2">
```

**Choose the approach that matches the profile's `stylingSystem`.**

## Event Handlers

Components may need event handlers (not exported from Figma):

```typescript
interface ButtonProps {
  onClick?: () => void;  // ← Not in catalog, but needed
  children?: React.ReactNode;
}

export const Button = ({ onClick, children }: ButtonProps) => (
  <button onClick={onClick}>
    {children}
  </button>
);
```

**This is acceptable** - event handlers are implementation details, not design deviations.

## State Management

Components may need internal state:

```typescript
export const Checkbox = ({ defaultChecked = false }) => {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
};
```

**This is acceptable** - state management is an implementation detail.

## Accessibility

Add ARIA attributes and keyboard navigation:

```typescript
export const Button = ({ children, onClick }: ButtonProps) => (
  <button
    onClick={onClick}
    aria-label={typeof children === 'string' ? children : undefined}
    role="button"
    tabIndex={0}
  >
    {children}
  </button>
);
```

**This is encouraged** - accessibility is always good practice.

## TypeScript Types

### Generate from Catalog
```typescript
// If prop type is "string" with values
type Variant = 'primary' | 'secondary' | 'ghost';

// If prop type is "boolean"
disabled?: boolean;

// If prop type is "number"
count?: number;
```

### Children Type
```typescript
children?: React.ReactNode;  // ← Most flexible
// or
children?: string;           // ← If only text
// or
children?: React.ReactElement;  // ← If only elements
```

## File Organization

```
src/
  components/
    Button/
      Button.tsx         ← Component implementation
      Button.test.tsx    ← Tests (optional)
      Button.stories.tsx ← Storybook stories
      index.ts           ← Export
    Card/
      Card.tsx
      CardHeader.tsx
      CardFooter.tsx
      index.ts
```

### Index File Pattern
```typescript
// components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

## Testing Pattern

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<Button variant="secondary">Click me</Button>);
    // Assert styles match catalog definition
  });
});
```

## Common Patterns

### Icon + Text Button
```typescript
interface ButtonProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = ({ icon, children }: ButtonProps) => (
  <button style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
    {icon}
    <span>{children}</span>
  </button>
);
```

### Conditional Rendering
```typescript
export const Card = ({ header, children, footer }: CardProps) => (
  <div>
    {header && <div className="header">{header}</div>}
    <div className="content">{children}</div>
    {footer && <div className="footer">{footer}</div>}
  </div>
);
```

### Forwarding Refs
```typescript
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => (
    <input ref={ref} {...props} />
  )
);
```

## Critical Don'ts

- ❌ Don't create components not in catalog
- ❌ Don't add props not defined in catalog (except event handlers, ref)
- ❌ Don't create inline components (always import)
- ❌ Don't hardcode styles (use tokens)
- ❌ Don't skip TypeScript types
- ❌ Don't ignore variants from catalog

## Summary

1. ✅ Follow standard component structure
2. ✅ Generate props from catalog definitions
3. ✅ Implement all variants exactly
4. ✅ Import and compose (never inline)
5. ✅ Build in dependency order
6. ✅ Use token-bound styles everywhere
7. ✅ Add TypeScript types
8. ✅ Include accessibility attributes
9. ✅ Event handlers and state are acceptable
10. ❌ Never deviate from catalog specifications

**Components are the building blocks. Get them right.**
