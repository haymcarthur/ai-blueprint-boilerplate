# Troubleshooting Guide

**Common issues and solutions for the AI Blueprint workflow.**

## Table of Contents

- [Figma Plugin Issues](#figma-plugin-issues)
- [Export Issues](#export-issues)
- [Bootstrap Script Issues](#bootstrap-script-issues)
- [Token Issues](#token-issues)
- [Component Issues](#component-issues)
- [Storybook Issues](#storybook-issues)
- [Build & Deployment Issues](#build--deployment-issues)

---

## Figma Plugin Issues

### Plugin Not Appearing

**Symptoms**: Can't find AI Blueprint in Plugins menu

**Solutions**:
```
1. Check if installed:
   - Figma menu → Plugins → Manage plugins
   - Search for "AI Blueprint"
   - Click "Install" if not installed

2. Refresh Figma:
   - Close and reopen Figma
   - Or: Cmd/Ctrl + R to reload

3. Check file permissions:
   - Must be Editor or Owner
   - Viewer cannot run plugins
```

### "No Variables Found"

**Symptoms**: Plugin says no variables/tokens exist

**Solutions**:
```
1. Create variable collections:
   - Open Variables panel (Cmd/Ctrl + /)
   - Click "+" to create collection
   - Add variables

2. Check variable scope:
   - Variables must be in current file
   - Not in external library (must be local)

3. Grant plugin permissions:
   - Plugin → Settings → Permissions
   - Enable "Read variables"
```

### Preflight Status: BLOCKED

**Symptoms**: Cannot export, status shows BLOCKED

**Common causes & fixes**:

**Low Token Coverage**:
```
Error: "Color token coverage: 35% (need 50%)"

Fix:
1. Check which colors are not bound
2. Create/select color variables
3. Bind unbound colors to variables
4. Re-run preflight
```

**Missing Dependencies**:
```
Error: "Dialog references Button, but Button not selected"

Fix:
1. Select all referenced components
2. Or use "Select all components"
3. Re-export
```

**Invalid Component Structure**:
```
Error: "Component has no auto-layout"

Fix:
1. Select component
2. Add auto-layout (Shift + A)
3. Configure spacing and padding
4. Re-run preflight
```

---

## Export Issues

### Export File Empty or Corrupted

**Symptoms**: JSON file is 0 bytes or invalid

**Solutions**:
```bash
# Check file size
ls -lh component-catalog.json

# Validate JSON
node -e "JSON.parse(require('fs').readFileSync('component-catalog.json'))"

# If invalid, re-export from Figma
# Ensure:
# 1. Components are selected
# 2. Preflight passes
# 3. Export completes (progress bar finishes)
```

### Wrong Components Exported

**Symptoms**: Expected components missing from export

**Solutions**:
```
1. Verify selection in Figma:
   - Only selected components are exported
   - Use Shift+Click for multiple
   - Or "Select all components"

2. Check if main component vs instance:
   - Must select main components (not instances)
   - Main components have purple outline

3. Check layer visibility:
   - Hidden layers not exported
   - Unlock and show all layers
```

### Tokens Missing from Export

**Symptoms**: `design-tokens.json` is empty or incomplete

**Solutions**:
```
1. Check variable collections exist:
   - Variables panel should show collections
   - Collections must have variables

2. Verify token binding:
   - Select component
   - Check if properties use variables
   - Look for purple indicators (bound)

3. Re-export with "Include tokens" checked:
   - Plugin settings
   - Ensure checkbox is enabled
```

---

## Bootstrap Script Issues

### "Cannot find module 'component-catalog.json'"

**Symptoms**: Bootstrap script fails with module not found

**Solutions**:
```bash
# Verify files exist in root
ls -la component-catalog.json design-tokens.json

# Check current directory
pwd  # Should be project root

# If files in wrong location, move them
mv ~/Downloads/component-catalog.json ./
mv ~/Downloads/design-tokens.json ./
```

### "JSON Parse Error"

**Symptoms**: `SyntaxError: Unexpected token in JSON`

**Solutions**:
```bash
# Validate JSON
node -e "JSON.parse(require('fs').readFileSync('component-catalog.json'))"

# If invalid:
# 1. Re-export from Figma
# 2. Don't manually edit JSON files
# 3. Check file isn't truncated (incomplete download)
```

### Bootstrap Generates No Files

**Symptoms**: Script runs but no files created

**Solutions**:
```bash
# Check if components in catalog
cat component-catalog.json | grep '"name"'

# Check output directory permissions
ls -la src/tokens src/components

# Run with verbose logging
npm run bootstrap -- --verbose
```

### "Token file already exists"

**Symptoms**: Script fails because files exist

**Solutions**:
```bash
# Token files are auto-generated, safe to overwrite
# If concerned, back up first:
cp -r src/tokens src/tokens.backup

# Then run bootstrap
npm run bootstrap

# Or delete and regenerate:
rm -rf src/tokens/*.ts
npm run generate:tokens
```

---

## Token Issues

### Token Not Found

**Symptoms**: `colors.primary is undefined`

**Solutions**:
```typescript
// Check token exists in file
import { colors } from '../tokens';
console.log(colors);  // Should show 'primary' key

// If missing:
// 1. Check design-tokens.json has the token
// 2. Run: npm run generate:tokens
// 3. Verify src/tokens/colors.ts updated

// Use fallback in code:
const color = colors.primary || '#3B82F6';
```

### Token Value Wrong

**Symptoms**: Color/spacing doesn't match Figma

**Solutions**:
```bash
# Check token value in Figma
# Compare to generated file

# If different:
# 1. Re-export from Figma
# 2. Ensure latest design-tokens.json pulled
# 3. Regenerate tokens:
npm run generate:tokens

# 4. Hard refresh Storybook (Cmd/Ctrl + Shift + R)
```

### TypeScript Error: "Property does not exist"

**Symptoms**: `Property 'newToken' does not exist on type...`

**Solutions**:
```bash
# Regenerate token types
npm run generate:tokens

# Restart TypeScript server
# VS Code: Cmd/Ctrl + Shift + P → "Restart TS Server"

# If still failing:
# 1. Check token exists in design-tokens.json
# 2. Check token file exports it
# 3. Rebuild:
npm run typecheck
```

---

## Component Issues

### Component Won't Import

**Symptoms**: `Cannot find module './Button'`

**Solutions**:
```typescript
// Check file exists
ls -la src/components/Button/Button.tsx

// Check export in index file
cat src/components/Button/index.ts
// Should have: export { Button } from './Button';

// Check import path
import { Button } from '../Button';  // ✅ From index.ts
import { Button } from '../Button/Button';  // ✅ Direct
import { Button } from '../Button.tsx';  // ❌ Wrong

// Restart dev server
npm run storybook
```

### Styles Don't Match Figma

**Symptoms**: Component looks different than Figma design

**Debugging steps**:
```
1. Check token binding:
   - Inspect element in browser
   - Verify values match tokens
   - Check token-bound properties used

2. Compare layout:
   - Open Figma side-by-side with Storybook
   - Check padding, margins, spacing
   - Verify auto-layout direction

3. Check variant:
   - Ensure correct variant selected
   - Verify variant styles applied
   - Test all variants

4. Verify token values:
   - Check src/tokens/*.ts files
   - Compare to Figma variables
   - Regenerate if mismatch
```

### Variants Not Working

**Symptoms**: Changing variant prop doesn't change appearance

**Solutions**:
```typescript
// Check prop is used in component
export const Button = ({ variant = 'primary' }: ButtonProps) => {
  // ❌ variant not used
  return <button style={primaryStyles}>

  // ✅ variant determines styles
  const styles = variant === 'primary' ? primaryStyles : secondaryStyles;
  return <button style={styles}>
};

// Check variant passed to component
<Button variant="secondary">  // ✅ Passed
<Button>  // ⚠️ Uses default

// Check Story args
export const Secondary: Story = {
  args: {
    variant: 'secondary',  // ✅ Correct
  },
};
```

---

## Storybook Issues

### Storybook Won't Start

**Symptoms**: `npm run storybook` fails

**Solutions**:
```bash
# Check port not in use
lsof -i :6006
# If in use, kill process:
kill -9 <PID>

# Clear cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node version
node -v  # Should be 18+

# Try building instead
npm run build:storybook
```

### Stories Don't Appear

**Symptoms**: Component exists but doesn't show in Storybook

**Solutions**:
```typescript
// Check story file naming
// ✅ Button.stories.tsx
// ❌ Button.story.tsx
// ❌ Button.stories.ts (should be .tsx for components)

// Check story matches glob pattern
// .storybook/main.ts:
// stories: ['../src/components/**/*.stories.@(ts|tsx)']

// Check default export exists
export default meta;  // ✅ Required

// Restart Storybook
# Ctrl+C to stop
npm run storybook
```

### Controls Don't Work

**Symptoms**: Can't change props in Storybook

**Solutions**:
```typescript
// Check argTypes defined
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {  // ← Add this
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
};

// Check component uses props
export const Button = (props: ButtonProps) => {
  // ❌ props not destructured
  return <button>Click</button>;

  // ✅ props used
  const { variant, children } = props;
  return <button style={getStyles(variant)}>{children}</button>;
};
```

### Design Tokens Tab Empty

**Symptoms**: Design Tokens addon shows no tokens

**Solutions**:
```typescript
// Check addon installed
npm list storybook-design-token

// Check config in .storybook/preview.ts
export default {
  parameters: {
    designToken: {
      files: ['../design-tokens.json'],  // ← Path must be correct
    },
  },
};

// Verify design-tokens.json exists
ls -la design-tokens.json

// Restart Storybook
```

---

## Build & Deployment Issues

### Build Fails

**Symptoms**: `npm run build` or `npm run build:storybook` fails

**Solutions**:
```bash
# Check TypeScript errors
npm run typecheck

# Check linting errors
npm run lint

# Fix formatting
npm run format

# Clear cache and rebuild
rm -rf node_modules/.cache dist storybook-static
npm run build:storybook
```

### Build Succeeds But Site Broken

**Symptoms**: Deployed Storybook doesn't work

**Solutions**:
```
1. Check base URL config:
   // .storybook/main.ts
   export default {
     // ...
     features: {
       buildStoriesJson: true,
     },
     managerHead: (head) => (`
       ${head}
       <base href="/storybook/">
     `),
   };

2. Check asset paths:
   - Images/fonts should use relative paths
   - Check browser console for 404s

3. Test build locally:
   npx http-server storybook-static -p 8080
   # Open http://localhost:8080
```

---

## Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Search GitHub issues
3. ✅ Check error messages carefully
4. ✅ Try reproducing with minimal example
5. ✅ Gather relevant logs and screenshots

### When Asking for Help

**Provide**:
- Error message (full text)
- Steps to reproduce
- Environment (OS, Node version, npm version)
- Relevant files (component-catalog.json structure, etc.)
- Screenshots if visual issue

**Template**:
```markdown
## Issue

[Brief description]

## Steps to Reproduce

1. Run `npm run bootstrap`
2. See error: [error message]

## Environment

- OS: macOS 14.0
- Node: v18.17.0
- npm: 9.6.7

## Files

[Attach or paste relevant files]

## Screenshots

[If applicable]
```

### Resources

- **Documentation**: `docs/` directory
- **GitHub Issues**: [link to repo issues]
- **Team Slack**: #design-system channel
- **Figma Plugin Docs**: [link]

---

## Common Error Messages

### "Cannot resolve module"

**Cause**: Import path incorrect or file doesn't exist

**Fix**: Check file exists, fix import path, restart TypeScript

### "Unexpected token"

**Cause**: Syntax error in code or JSON

**Fix**: Check syntax, run linter, validate JSON

### "Module not found"

**Cause**: Package not installed or wrong path

**Fix**: `npm install`, check import path

### "Property 'x' does not exist"

**Cause**: Type definition out of date or wrong import

**Fix**: Regenerate types, check import, restart TS server

### "Cannot read property of undefined"

**Cause**: Accessing property of undefined/null value

**Fix**: Add defensive checks, use optional chaining

---

## Prevention Tips

1. ✅ **Pull before working**: `git pull origin main`
2. ✅ **Keep dependencies updated**: `npm outdated`
3. ✅ **Run typecheck before commit**: `npm run typecheck`
4. ✅ **Test in Storybook frequently**: `npm run storybook`
5. ✅ **Clear cache when weird**: `rm -rf node_modules/.cache`
6. ✅ **Commit working state often**: `git commit -am "WIP"`
7. ✅ **Document custom changes**: Update CHANGELOG.md

**Still stuck? Ask in team Slack or open a GitHub issue!**
