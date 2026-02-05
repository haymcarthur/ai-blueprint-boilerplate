# Bootstrap Workflow

**Complete workflow for bootstrapping a component library from Figma exports.**

## Overview

Bootstrap mode creates a new component library from Figma component exports. The workflow:
1. Designer exports from Figma
2. Developer runs bootstrap script
3. Code is generated automatically
4. Developer implements component logic
5. Components are tested in Storybook

## Step-by-Step Process

### Step 1: Figma Export (Designer)

**In Figma**:
1. Open AI Blueprint plugin
2. Select components to export
3. Click "Bootstrap Mode"
4. Plugin generates two files:
   - `component-catalog.json` - Component definitions
   - `design-tokens.json` - Design tokens

**Save to Repository**:
```bash
# Copy exports to project root
cp ~/Downloads/component-catalog.json ./
cp ~/Downloads/design-tokens.json ./
git add component-catalog.json design-tokens.json
git commit -m "Add Figma exports"
```

### Step 2: Bootstrap Script (Developer)

**Run the bootstrap script**:
```bash
npm run bootstrap
```

**What it does**:
1. Reads `component-catalog.json` and `design-tokens.json`
2. Generates token files (`src/tokens/*.ts`)
3. Creates component stubs (`src/components/*/`)
4. Updates `naming-registry.json`
5. Generates Storybook stories
6. Runs plugin hooks (formatting, etc.)

**Output**:
```
✓ Generated src/tokens/colors.ts (15 tokens)
✓ Generated src/tokens/typography.ts (8 tokens)
✓ Generated src/tokens/spacing.ts (10 tokens)
✓ Generated src/tokens/effects.ts (5 tokens)
✓ Generated src/tokens/index.ts
✓ Created src/components/Button/Button.tsx (stub)
✓ Created src/components/Button/Button.stories.tsx
✓ Created src/components/Card/Card.tsx (stub)
✓ Created src/components/Card/Card.stories.tsx
✓ Updated naming-registry.json (2 aliases)
✓ Ran post-export hooks: format, build:storybook
```

### Step 3: Component Implementation (Developer)

**Implement each component**:

```typescript
// src/components/Button/Button.tsx (BEFORE - stub)
import { colors, spacing } from '../../tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  children,
}: ButtonProps) => {
  return (
    <button>
      {/* TODO: Implement button styles and logic */}
      {children}
    </button>
  );
};
```

```typescript
// src/components/Button/Button.tsx (AFTER - implemented)
import { colors, spacing, typography } from '../../tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  onClick,
  disabled = false,
  children,
}: ButtonProps) => {
  const variantStyles = variant === 'primary'
    ? {
        backgroundColor: colors.primary,
        color: colors['text-inverse'],
      }
    : {
        backgroundColor: 'transparent',
        color: colors.primary,
        border: `1px solid ${colors.primary}`,
      };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variantStyles,
        padding: `${spacing.sm} ${spacing.md}`,
        fontSize: typography.body.fontSize,
        fontFamily: typography.body.fontFamily,
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
};
```

**See also**:
- [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md) - Component structure
- [TOKEN_BINDING.md](./TOKEN_BINDING.md) - Token usage
- [LAYOUT_STRATEGY.md](./LAYOUT_STRATEGY.md) - Layout implementation

### Step 4: Test in Storybook (Developer)

**Start Storybook**:
```bash
npm run storybook
```

**Test component**:
1. Navigate to component in sidebar
2. Test all variants
3. Verify styles match Figma
4. Check token binding (inspect element)

**Update story if needed**:
```typescript
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['figma-component'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Click me',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Click me',
  },
};
```

### Step 5: Designer Approval (Designer)

**Designer reviews in Storybook**:
1. Check each component matches Figma
2. Test all variants
3. Verify spacing and colors
4. Approve or request changes

**If changes needed**:
- Developer makes changes
- Repeat Step 4 (test in Storybook)
- Designer re-reviews

### Step 6: Repeat for All Components

Follow the **phased approach** (see [IMPLEMENTATION_PHASES.md](./IMPLEMENTATION_PHASES.md)):
- Build 3-5 components at a time
- Test each batch in Storybook
- Get designer approval before next batch
- Update `CHANGELOG.md` after each batch

## Bootstrap Script Internals

### What Gets Generated?

#### Token Files
```typescript
// src/tokens/colors.ts
export const colors = {
  'primary': '#3B82F6',
  'secondary': '#10B981',
  'background': '#FFFFFF',
  'text': '#1F2937',
  // ... (from design-tokens.json)
} as const;

export type ColorToken = keyof typeof colors;
```

#### Component Stubs
```typescript
// src/components/Button/Button.tsx
import { colors, spacing } from '../../tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary';  // ← From catalog
  children?: React.ReactNode;
}

export const Button = ({
  variant = 'primary',  // ← Default from catalog
  children,
}: ButtonProps) => {
  // TODO: Implement button
  return <button>{children}</button>;
};
```

#### Storybook Stories
```typescript
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['figma-component'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Click me' },
};
```

#### Index Files
```typescript
// src/components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

### Naming Registry

The bootstrap script updates `naming-registry.json`:

```json
{
  "aliases": [
    {
      "figmaName": "DS/Components/Button/Primary",
      "codeName": "Button",
      "variant": "primary"
    },
    {
      "figmaName": "icon/arrow-left",
      "codeName": "ArrowLeftIcon",
      "isExternalLibrary": true
    }
  ]
}
```

**Sanitization rules**:
- Strip prefixes: `DS/`, `Components/`, `Primitive`
- Convert to PascalCase: `button-primary` → `ButtonPrimary`
- Detect external libraries: `icon/`, `@heroicons/` → mark as external

### Plugin Hooks

After generation, the bootstrap script runs hooks from `plugin-hooks.json`:

```json
{
  "onBootstrapExport": [
    "npm run generate:tokens",
    "npm run format",
    "npm run build:storybook"
  ]
}
```

**Common hooks**:
- `npm run format` - Auto-format generated code
- `npm run lint -- --fix` - Auto-fix linting issues
- `npm run build:storybook` - Pre-build Storybook for faster startup
- `git add .` - Stage generated files (optional)

## Incremental Updates

**When Figma designs change**:

1. **Designer re-exports**:
   ```bash
   # Replace old exports
   cp ~/Downloads/component-catalog.json ./
   cp ~/Downloads/design-tokens.json ./
   ```

2. **Developer re-runs bootstrap**:
   ```bash
   npm run bootstrap
   ```

3. **Bootstrap script compares**:
   - Detects new components → generates stubs
   - Detects changed tokens → updates token files
   - Detects removed components → warns (doesn't delete)
   - Preserves existing component implementations

4. **Developer updates affected components**:
   - Review changed tokens
   - Update component styles if needed
   - Test in Storybook

## Preflight Validation

The Figma export includes a preflight report:

```json
{
  "status": "READY",
  "tokenCoverage": {
    "colorsWithTokens": 17,
    "colorsFallback": 3,
    "typographyWithTokens": 9,
    "typographyFallback": 1,
    "spacingWithTokens": 8,
    "spacingFallback": 2
  },
  "warnings": [],
  "errors": []
}
```

**Check preflight before bootstrapping**:
- `status: "READY"` → Safe to proceed
- `status: "WARNING"` → May have issues, review warnings
- `status: "BLOCKED"` → Must fix errors before proceeding

**Common preflight issues**:
- Low token coverage → Bind more tokens in Figma
- Missing component dependencies → Export dependencies first
- Invalid component names → Fix naming in Figma

## Troubleshooting

### Bootstrap Script Fails

**Check**:
1. Are exports in project root?
   ```bash
   ls -la | grep 'component-catalog\|design-tokens'
   ```

2. Are exports valid JSON?
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('component-catalog.json'))"
   ```

3. Check bootstrap script logs for errors

### Components Don't Import

**Check**:
1. Are components exported from index files?
   ```typescript
   // src/components/index.ts
   export { Button } from './Button';
   ```

2. Is TypeScript configured correctly?
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       }
     }
   }
   ```

### Tokens Not Working

**Check**:
1. Are token files generated?
   ```bash
   ls -la src/tokens/
   ```

2. Are tokens exported from index?
   ```typescript
   // src/tokens/index.ts
   export { colors } from './colors';
   ```

3. Import correctly:
   ```typescript
   import { colors } from '../tokens';  // ✅ Correct
   import { colors } from '../tokens/colors';  // Also works
   ```

## Best Practices

1. ✅ **Commit exports to git** - Enables diff tracking
2. ✅ **Re-run bootstrap on export updates** - Keeps code in sync
3. ✅ **Review generated code** - Ensure quality before implementing
4. ✅ **Test each component in Storybook** - Verify before approval
5. ✅ **Update CHANGELOG.md** - Track progress and changes
6. ❌ **Don't edit generated files directly** - They're regenerated on updates
7. ❌ **Don't skip preflight validation** - Catch issues early

## Summary

**Workflow**:
1. Designer exports from Figma → `component-catalog.json`, `design-tokens.json`
2. Developer runs `npm run bootstrap` → Generates code
3. Developer implements components → Following patterns
4. Designer approves in Storybook → Visual review
5. Repeat for all components → Phased approach

**Key Files**:
- `component-catalog.json` - Component definitions
- `design-tokens.json` - Design tokens
- `naming-registry.json` - Name mappings
- `plugin-hooks.json` - Automation config
- `CHANGELOG.md` - Progress tracking

**See Also**:
- [IMPLEMENTATION_PHASES.md](./IMPLEMENTATION_PHASES.md) - Phased approach
- [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md) - Component structure
- [TOKEN_BINDING.md](./TOKEN_BINDING.md) - Token usage
- [STORYBOOK_INTEGRATION.md](./STORYBOOK_INTEGRATION.md) - Storybook setup
