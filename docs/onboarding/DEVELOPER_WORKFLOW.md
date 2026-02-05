# Developer Workflow

**Daily workflow for developers implementing components from Figma exports.**

## Overview

Your role:
1. Pull Figma exports from repository
2. Run bootstrap script to generate code
3. Implement component logic and interactions
4. Test in Storybook
5. Get designer approval
6. Merge to main

## Initial Setup (One Time)

```bash
# Clone repository
git clone https://github.com/YOUR_ORG/ai-blueprint-boilerplate.git
cd ai-blueprint-boilerplate

# Install dependencies
npm install

# Verify setup
npm run typecheck
npm run build:storybook
```

## Daily Workflow

### Step 1: Pull Latest Exports

```bash
# Pull from main
git pull origin main

# Check for new exports
git log --oneline -5 | grep "Figma"

# If new exports exist:
ls -la component-catalog.json design-tokens.json
```

### Step 2: Run Bootstrap

```bash
npm run bootstrap
```

**What it does**:
- Reads `component-catalog.json` and `design-tokens.json`
- Generates token files (`src/tokens/*.ts`)
- Creates component stubs (`src/components/*/`)
- Generates Storybook stories
- Updates `naming-registry.json`
- Runs formatting and hooks

**Output**:
```
✓ Generated src/tokens/colors.ts (15 tokens)
✓ Generated src/tokens/typography.ts (8 tokens)
✓ Generated src/tokens/spacing.ts (10 tokens)
✓ Created src/components/Button/Button.tsx
✓ Created src/components/Button/Button.stories.tsx
✓ Updated naming-registry.json
✓ Bootstrap complete!
```

### Step 3: Review Generated Code

```bash
# Check generated files
ls -la src/tokens/
ls -la src/components/

# Review token files
cat src/tokens/colors.ts
cat src/tokens/spacing.ts

# Review component stubs
cat src/components/Button/Button.tsx
```

### Step 4: Implement Components

Follow the **phased approach** (see [../ai-instructions/IMPLEMENTATION_PHASES.md](../ai-instructions/IMPLEMENTATION_PHASES.md)):

#### Phase 1: Plan
- Review component catalog
- Identify dependencies
- Create implementation order
- Save `IMPLEMENTATION_PLAN.md`

#### Phase 2: Tokens
- Verify token files generated correctly
- Test importing tokens
- Check TypeScript types

#### Phase 3: Components (Batch by Batch)
- Build 3-5 components at a time
- Use token-bound styles
- Match Figma layout exactly
- Add event handlers and state
- Test in Storybook

**Example Implementation**:

```typescript
// BEFORE (generated stub)
export const Button = ({ variant = 'primary', children }: ButtonProps) => {
  return <button>{children}</button>;
};

// AFTER (implemented)
import { colors, spacing, typography } from '../../tokens';

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
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
};
```

### Step 5: Test in Storybook

```bash
# Start Storybook
npm run storybook
```

**Opens at**: `http://localhost:6006`

**Test checklist for each component**:
- ✅ All variants render correctly
- ✅ Props work as expected
- ✅ Styles match Figma
- ✅ Colors use design tokens (inspect element)
- ✅ Spacing matches spec
- ✅ Interactive elements respond
- ✅ Accessibility tab shows no violations
- ✅ Keyboard navigation works

### Step 6: Get Designer Approval

**Option A: Local Storybook**
```bash
# Share local URL with designer
# (requires VPN or same network)
http://localhost:6006
```

**Option B: Deploy Storybook**
```bash
# Build static Storybook
npm run build:storybook

# Deploy to Netlify, Vercel, or GitHub Pages
# (See deployment guide)

# Share deployed URL
https://storybook.yourproject.com
```

**Notify designer**:
```
@designer Button component ready for review

Storybook: http://localhost:6006
Components: Button (all 3 variants)

Please review and approve when ready.
```

### Step 7: Iterate if Needed

If designer requests changes:
1. Make requested updates
2. Test again in Storybook
3. Notify designer for re-review
4. Repeat until approved

### Step 8: Commit and Merge

```bash
# Stage changes
git add src/components/Button src/tokens

# Commit with descriptive message
git commit -m "Implement Button component

- Add all 3 variants (primary, secondary, ghost)
- Bind to design tokens (colors, spacing, typography)
- Test all props and states
- Designer approved"

# Push to branch
git push origin feature/button-component

# Create PR (or merge to main)
```

## Working with Component Dependencies

Components often depend on other components.

### Detect Dependencies

Check catalog for `componentRef` fields:

```json
{
  "name": "Dialog",
  "children": [
    {
      "type": "INSTANCE",
      "componentRef": "Button"  // ← Dependency
    }
  ]
}
```

**Dialog depends on Button → Build Button first**

### Build Order

```
1. Leaf components (no dependencies)
   - Button
   - Input
   - Checkbox

2. Containers (use leaf components)
   - Card (may use Button)
   - Dialog (uses Button)

3. Screens (use all components)
   - HomePage (uses Card, Button, Input)
```

## Token Usage Guidelines

### Always Use Tokens

```typescript
// ✅ CORRECT
<button style={{
  backgroundColor: colors.primary,
  padding: spacing.md,
}}>

// ❌ WRONG
<button style={{
  backgroundColor: '#3B82F6',
  padding: '16px',
}}>
```

### Check Token Binding

```typescript
// Read from catalog
const bgColor = component.styles.backgroundColor;

// Use token if bound, fallback to value
const backgroundColor = bgColor.tokenName
  ? colors[bgColor.tokenName]
  : bgColor.value;
```

**See [../ai-instructions/TOKEN_BINDING.md](../ai-instructions/TOKEN_BINDING.md) for details**

## Common Tasks

### Update Tokens After Figma Change

```bash
# Designer updated tokens in Figma
# Pull new design-tokens.json
git pull origin main

# Regenerate token files
npm run generate:tokens

# Components automatically use new values
npm run storybook  # Verify visually
```

### Add New Component

```bash
# Designer added new component
# Pull new component-catalog.json
git pull origin main

# Run bootstrap (generates new stub)
npm run bootstrap

# Implement new component
code src/components/NewComponent/NewComponent.tsx

# Test and get approval
npm run storybook
```

### Fix Component After Feedback

```bash
# Designer requested changes
# Update component implementation
code src/components/Button/Button.tsx

# Test changes
npm run storybook

# Notify designer
# "Changes made, please re-review"
```

## Scripts Reference

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `npm run bootstrap` | Generate code from exports | After new Figma exports |
| `npm run generate:tokens` | Regenerate token files only | After token updates |
| `npm run storybook` | Start Storybook dev server | During development |
| `npm run build:storybook` | Build static Storybook | For deployment |
| `npm run format` | Auto-format code | Before committing |
| `npm run lint` | Lint code | Before committing |
| `npm run typecheck` | Check TypeScript | Before committing |

## Best Practices

### Code Quality

1. ✅ **Use TypeScript strictly** - No `any` types
2. ✅ **Follow component patterns** - See [../ai-instructions/COMPONENT_PATTERNS.md](../ai-instructions/COMPONENT_PATTERNS.md)
3. ✅ **Token-bound styles only** - No hardcoded values
4. ✅ **Match Figma exactly** - Don't "improve" designs
5. ✅ **Add accessibility** - ARIA, keyboard nav
6. ✅ **Write tests** - At least for complex logic
7. ✅ **Document with JSDoc** - For public APIs

### Git Workflow

1. ✅ **Pull before starting** - Get latest exports
2. ✅ **Branch per component/batch** - Easy to review
3. ✅ **Descriptive commits** - What and why
4. ✅ **Small PRs** - 3-5 components max
5. ✅ **Get designer approval first** - Before merging
6. ✅ **Keep exports in git** - Track changes over time

### Communication

1. ✅ **Notify designer when ready** - Don't wait
2. ✅ **Be specific about issues** - "Token X not found"
3. ✅ **Share Storybook link** - Visual review is key
4. ✅ **Document decisions** - Update CHANGELOG.md
5. ✅ **Ask questions early** - Don't guess

## Troubleshooting

### Bootstrap Script Fails

**Check**:
```bash
# Verify exports exist
ls -la component-catalog.json design-tokens.json

# Verify valid JSON
node -e "JSON.parse(require('fs').readFileSync('component-catalog.json'))"

# Check script logs
npm run bootstrap 2>&1 | tee bootstrap.log
```

### Components Don't Import

**Check**:
```bash
# Verify component files exist
ls -la src/components/Button/

# Check exports
cat src/components/Button/index.ts

# Verify TypeScript config
cat tsconfig.json
```

### Tokens Not Working

**Check**:
```bash
# Verify token files generated
ls -la src/tokens/

# Check token exports
cat src/tokens/index.ts

# Test import
node -e "console.log(require('./src/tokens').colors)"
```

**See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more issues**

## Success Metrics

You're doing great if:
- ✅ Bootstrap runs without errors
- ✅ Components approved on first review (>80%)
- ✅ Token coverage maintained (70%+)
- ✅ Storybook builds successfully
- ✅ TypeScript checks pass
- ✅ Commits are descriptive and focused

## Resources

- **AI Instructions**: `docs/ai-instructions/` - How to implement patterns
- **Component Patterns**: [../ai-instructions/COMPONENT_PATTERNS.md](../ai-instructions/COMPONENT_PATTERNS.md)
- **Token Binding**: [../ai-instructions/TOKEN_BINDING.md](../ai-instructions/TOKEN_BINDING.md)
- **Layout Strategy**: [../ai-instructions/LAYOUT_STRATEGY.md](../ai-instructions/LAYOUT_STRATEGY.md)
- **Code Standards**: [../ai-instructions/CODE_STANDARDS.md](../ai-instructions/CODE_STANDARDS.md)

## Next Steps

- Implement your first batch of components
- Review with designer in Storybook
- Iterate until approved
- Repeat for all components

**Questions? Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**
