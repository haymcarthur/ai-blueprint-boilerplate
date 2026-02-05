# Storybook Integration

**How to set up and use Storybook for component testing and documentation.**

## Why Storybook?

Storybook provides:
- **Visual testing**: See components in isolation
- **Props playground**: Test all prop combinations
- **Designer review**: Non-technical stakeholders can review
- **Documentation**: Auto-generated component docs
- **Design token integration**: View tokens alongside components

## Installation

Already included in `package.json`:
```json
{
  "devDependencies": {
    "@storybook/addon-essentials": "^7.6.0",
    "@storybook/addon-a11y": "^7.6.0",
    "@storybook/react": "^7.6.0",
    "@storybook/react-vite": "^7.6.0",
    "storybook": "^7.6.0",
    "storybook-design-token": "^3.0.0"
  }
}
```

## Configuration

### Main Configuration (`.storybook/main.ts`)

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',     // Controls, docs, actions, etc.
    '@storybook/addon-a11y',           // Accessibility testing
    'storybook-design-token',          // Design token viewer
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',                   // Generate docs from stories
  },
};

export default config;
```

### Preview Configuration (`.storybook/preview.ts`)

```typescript
import type { Preview } from '@storybook/react';

// Import global styles and tokens
import '../src/tokens/colors';
import '../src/tokens/typography';
import '../src/tokens/spacing';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },  // Auto-detect event handlers
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // Design token integration
    designToken: {
      files: ['../design-tokens.json'],
    },
  },
};

export default preview;
```

### Manager Configuration (`.storybook/manager.ts`)

```typescript
import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: themes.light,  // or themes.dark
  sidebar: {
    showRoots: true,     // Show component categories
  },
});
```

## Story Files

### Basic Story Structure

```typescript
// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',           // ← Sidebar location
  component: Button,
  tags: ['autodocs', 'figma-component'],  // ← Enable auto-docs
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Visual variant of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    onClick: {
      action: 'clicked',                // ← Auto-log clicks
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Default story
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

// Variant stories
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

// With icon (composition)
export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: (
      <>
        <span>🚀</span>
        <span>Launch</span>
      </>
    ),
  },
};
```

### Advanced Story Patterns

#### All Variants Grid

```typescript
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};
```

#### Interactive Story

```typescript
export const Interactive: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <div>
        <Button onClick={() => setCount(count + 1)}>
          Clicked {count} times
        </Button>
      </div>
    );
  },
};
```

#### With Context/Providers

```typescript
import { ThemeProvider } from '../ThemeProvider';

export const ThemedButton: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider theme="dark">
        <Story />
      </ThemeProvider>
    ),
  ],
  args: {
    children: 'Themed button',
  },
};
```

## Organizing Stories

### Directory Structure

```
src/
  components/
    Button/
      Button.tsx
      Button.stories.tsx       ← Co-located with component
      Button.test.tsx
      index.ts
    Card/
      Card.tsx
      Card.stories.tsx
      CardHeader.tsx
      CardHeader.stories.tsx   ← Separate stories for sub-components
      index.ts
```

### Sidebar Organization

```typescript
// Use title property to organize
const meta: Meta<typeof Button> = {
  title: 'Components/Forms/Button',    // ← Creates nested categories
  // or
  title: 'Primitives/Button',          // ← Group by type
  // or
  title: '01-Atoms/Button',            // ← Atomic design
};
```

## Design Token Addon

The `storybook-design-token` addon shows tokens in Storybook sidebar.

### Configuration

```typescript
// .storybook/preview.ts
export default {
  parameters: {
    designToken: {
      files: ['../design-tokens.json'],  // ← Point to token export
    },
  },
};
```

### Usage

1. Start Storybook: `npm run storybook`
2. Click "Design Tokens" tab in sidebar
3. View all colors, typography, spacing, effects
4. Click to copy token values

## Accessibility Testing

The `@storybook/addon-a11y` addon checks accessibility issues.

### Enable in Stories

```typescript
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};
```

### Review Results

1. Open story in Storybook
2. Click "Accessibility" tab
3. Review violations, passes, incomplete checks
4. Fix issues in component code

## Auto-Generated Documentation

Storybook can generate docs from TypeScript types and JSDoc comments.

### Component Documentation

```typescript
/**
 * Primary button component for user actions.
 * Supports multiple variants and sizes.
 */
interface ButtonProps {
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'ghost';

  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';

  /** Whether the button is disabled */
  disabled?: boolean;

  /** Click handler */
  onClick?: () => void;

  /** Button content */
  children?: React.ReactNode;
}

export const Button = ({ ... }: ButtonProps) => { /* ... */ };
```

**Result**: Storybook automatically generates:
- Props table with types and descriptions
- Default values
- Control inputs for testing

### Custom MDX Documentation

```mdx
<!-- src/components/Button/Button.mdx -->
import { Meta, Story, Canvas, ArgsTable } from '@storybook/blocks';
import { Button } from './Button';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button

Primary button component for user actions.

## Usage

```tsx
import { Button } from './components/Button';

<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
```

## Variants

<Canvas>
  <Story of={ButtonStories.Primary} />
  <Story of={ButtonStories.Secondary} />
  <Story of={ButtonStories.Ghost} />
</Canvas>

## Props

<ArgsTable of={Button} />

## Design Tokens

This component uses the following tokens:
- `colors.primary` - Primary background color
- `spacing.md` - Horizontal padding
- `typography.body` - Button text style
```

## Testing in Storybook

### Manual Testing Checklist

For each component:
1. ✅ All variants render correctly
2. ✅ Props work as expected
3. ✅ Styles match Figma design
4. ✅ Colors use design tokens (inspect element)
5. ✅ Spacing matches spec
6. ✅ Interactive elements respond to clicks
7. ✅ Accessibility tab shows no violations
8. ✅ Keyboard navigation works

### Visual Regression Testing

Add visual regression testing with Chromatic (optional):

```bash
npm install --save-dev chromatic
```

```json
// package.json
{
  "scripts": {
    "chromatic": "chromatic --project-token=<token>"
  }
}
```

**Usage**:
```bash
npm run chromatic
```

## Scripts

### Development
```bash
npm run storybook      # Start Storybook dev server
```

**Opens at**: `http://localhost:6006`

### Build
```bash
npm run build:storybook    # Build static Storybook
```

**Output**: `storybook-static/` directory

**Deploy**: Upload to hosting (Netlify, Vercel, GitHub Pages, etc.)

### CI/CD Integration

```yaml
# .github/workflows/storybook.yml
name: Build Storybook

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build:storybook
      - uses: actions/upload-artifact@v2
        with:
          name: storybook
          path: storybook-static
```

## Designer Review Workflow

### Step 1: Build Components
Developer implements components following catalog specs.

### Step 2: Add to Storybook
Developer creates stories for each component showing all variants.

### Step 3: Share Storybook Link
Deploy Storybook and share link with designer:
```bash
npm run build:storybook
# Deploy storybook-static/ folder
```

### Step 4: Designer Reviews
Designer checks:
- Visual appearance vs Figma
- All variants present
- Spacing and colors accurate
- Interactive behavior

### Step 5: Feedback Loop
- Designer approves → Move to next component
- Designer requests changes → Developer updates → Re-review

## Common Patterns

### Loading States

```typescript
export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading...',
  },
};
```

### Error States

```typescript
export const Error: Story = {
  args: {
    variant: 'danger',
    children: 'Error: Something went wrong',
  },
};
```

### Empty States

```typescript
export const Empty: Story = {
  render: () => (
    <Card>
      <p>No items to display</p>
    </Card>
  ),
};
```

### Responsive Layouts

```typescript
export const Responsive: Story = {
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
      },
    },
  },
};
```

## Troubleshooting

### Stories Don't Appear

**Check**:
1. Story files match glob pattern in `.storybook/main.ts`
2. Default export exists in story file
3. Component is exported from its module

### Controls Don't Work

**Check**:
1. Props interface is exported
2. Component uses destructured props
3. `argTypes` are defined in meta

### Tokens Don't Show

**Check**:
1. `design-tokens.json` exists in root
2. `storybook-design-token` addon installed
3. Path in `.storybook/preview.ts` is correct

### Build Fails

**Check**:
1. All dependencies installed
2. TypeScript compiles (`npm run typecheck`)
3. Check Storybook logs for specific errors

## Best Practices

1. ✅ **Co-locate stories with components** - Easy to find and maintain
2. ✅ **Create stories for all variants** - Comprehensive testing
3. ✅ **Use argTypes for controls** - Better DX
4. ✅ **Enable autodocs** - Free documentation
5. ✅ **Test accessibility** - Use a11y addon
6. ✅ **Share Storybook link** - Enable designer review
7. ❌ **Don't skip stories for sub-components** - Test everything
8. ❌ **Don't hardcode data** - Use realistic examples

## Summary

- **Storybook** = Visual testing + documentation + designer review
- **Stories** = Component examples showing all variants
- **Addons** = Accessibility, design tokens, controls
- **Workflow** = Build → Story → Review → Approve
- **Testing** = Manual visual checks + accessibility checks
- **Deployment** = Build static site, share link

**Storybook is your component showcase. Use it well.**
