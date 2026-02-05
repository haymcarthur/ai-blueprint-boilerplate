# Designer Workflow

**Daily workflow for designers using the AI Blueprint plugin.**

## Overview

As a designer, your role is to:
1. Create and maintain component library in Figma
2. Bind design tokens to components
3. Export to code using AI Blueprint plugin
4. Review generated components in Storybook
5. Approve or request changes

## When to Use Each Export Mode

### Bootstrap Mode
**Use when**: Building initial component library or adding new components

**Exports**: Complete component definitions with all props, variants, and styles

**Frequency**: Once initially, then when adding/changing components

**Output**: `component-catalog.json` + `design-tokens.json`

### Screen Export Mode
**Use when**: Implementing specific screens/features

**Exports**: Screen layouts with component instances

**Frequency**: For each new screen or feature

**Output**: `screen-export.json` (references existing component catalog)

## Daily Workflow

### Morning: Check for Updates
```bash
# Pull latest from git
git pull origin main

# Check if developers need new exports
# Look for issues labeled "needs-export"
```

### During Design Work

#### 1. Create/Update Components
- Follow naming conventions
- Use auto-layout for spacing
- Define variants properly
- Add descriptive property names

#### 2. Bind Design Tokens
- Colors → Color variables
- Spacing → Spacing variables
- Typography → Text styles
- Effects → Effect styles

**Aim for 70%+ token coverage** (plugin shows this)

#### 3. Add Annotations (Optional)
For complex behaviors:
- Right-click component → Add annotation
- Types: Behavior, Data, Accessibility
- Be specific (developers implement these exactly)

### End of Day: Export

#### Step 1: Open Plugin
1. Right-click canvas
2. Plugins → AI Blueprint
3. Select export mode (Bootstrap or Screen)

#### Step 2: Select Components/Screens
- Shift+Click for multiple selection
- Or click "Select all components"
- Plugin shows selection count

#### Step 3: Review Preflight
Plugin runs checks and shows status:

**If READY ✅**: Proceed with export

**If WARNING ⚠️**: Review warnings, optionally fix, then export

**If BLOCKED 🔴**: Must fix errors before export
- Check token coverage (must be >50% for colors, >40% for typography)
- Verify all dependencies are selected
- Fix invalid component structures

#### Step 4: Export
1. Click "Export Bootstrap" or "Export Screen"
2. Plugin generates JSON file(s)
3. Save to downloads folder

#### Step 5: Commit to Repository
```bash
# Navigate to project
cd path/to/ai-blueprint-boilerplate

# Copy exports
cp ~/Downloads/component-catalog.json ./
cp ~/Downloads/design-tokens.json ./

# Commit
git add component-catalog.json design-tokens.json
git commit -m "Update Figma exports - added Button variants"
git push origin main

# Notify developer
# Slack/email: "New exports pushed - run npm run bootstrap"
```

## Reviewing Generated Code

### Step 1: Developer Shares Storybook Link
After running bootstrap, developer shares Storybook URL:
- Local: `http://localhost:6006`
- Deployed: `https://storybook.yourproject.com`

### Step 2: Review Each Component
For each component:
1. **Visual Check**: Does it match Figma design?
2. **Variants Check**: Test all variants (primary, secondary, etc.)
3. **Props Check**: Test all props (size, disabled, etc.)
4. **Spacing Check**: Compare padding, margins to Figma
5. **Colors Check**: Verify colors match design tokens

### Step 3: Provide Feedback

#### If Approved ✅
```
Comment on PR or Slack:
"Button component approved ✓
- All variants match
- Spacing is correct
- Colors are accurate"
```

#### If Changes Needed ❌
```
Be specific:
"Button needs changes:
- Primary variant: padding should be 16px (currently 12px)
- Disabled state: opacity should be 0.5 (currently 0.3)
- Secondary variant: border is missing"

Screenshots help!
```

## Best Practices

### Component Design

#### DO ✅
- Use auto-layout for all spacing
- Bind 70%+ of properties to tokens
- Name components clearly (Button, not btn)
- Create variants for all states (default, hover, disabled)
- Use constraints for responsive behavior

#### DON'T ❌
- Use absolute positioning (use auto-layout)
- Hardcode values (use variables)
- Create components without variants
- Use unclear names (comp1, element2)
- Skip annotations for complex behaviors

### Token Management

#### DO ✅
- Create semantic token names (primary, not blue)
- Group related tokens (spacing-sm, spacing-md)
- Use consistent naming (kebab-case)
- Update tokens globally (change once, update everywhere)
- Document token purposes in descriptions

#### DON'T ❌
- Create one-off tokens for single use
- Use generic names (color1, color2)
- Mix naming conventions
- Hardcode values in components

### Export Timing

**Export when**:
- New components added
- Existing components changed
- Design tokens updated
- Variants added/removed
- After major design revisions

**Don't export**:
- For minor tweaks still in progress
- Before components are finalized
- Without running preflight checks

## Common Scenarios

### Scenario 1: Adding a New Component

1. Design component in Figma
2. Add variants and properties
3. Bind design tokens
4. Run preflight (ensure READY status)
5. Export Bootstrap mode
6. Commit and notify developer
7. Review in Storybook when ready
8. Approve or request changes

### Scenario 2: Updating Existing Component

1. Modify component in Figma
2. Re-bind any changed properties
3. Export Bootstrap mode (will update existing)
4. Commit and notify developer
5. Developer re-runs bootstrap
6. Review updated component
7. Approve or request changes

### Scenario 3: Changing Design Tokens

1. Update variables in Figma
2. No need to modify components (bindings are preserved)
3. Export Bootstrap mode
4. Commit and notify developer
5. Developer runs `npm run generate:tokens`
6. All components update automatically

### Scenario 4: Creating a New Screen

1. Design screen using existing components
2. Export Screen mode (not Bootstrap)
3. Commit screen-export.json
4. Notify developer
5. Developer implements screen layout
6. Review in Storybook

## Troubleshooting

### "Token coverage too low"
**Issue**: Less than required percentage bound to variables

**Fix**:
1. Check preflight report for exact coverage
2. Bind more properties to variables
3. Focus on colors (need 70%+) and spacing (70%+)
4. Re-run preflight

### "Component dependencies missing"
**Issue**: Component A uses Component B, but B not selected

**Fix**:
1. Select both components
2. Or use "Select all components"
3. Plugin will warn if dependencies missing

### "Export looks different in Storybook"
**Issue**: Visual differences between Figma and code

**Possible causes**:
- Tokens not bound (developer used fallback values)
- Auto-layout not used (developer had to guess spacing)
- Variants missing (developer couldn't test all states)

**Fix**:
- Check token binding in Figma
- Verify auto-layout is applied
- Ensure all variants exported

### "Developer says component is missing"
**Issue**: Component in Figma but not in export

**Fix**:
- Verify component was selected during export
- Check it's a main component (not instance)
- Ensure it's not hidden in Figma
- Re-export and verify in JSON file

## Communication Templates

### Export Notification
```
📦 New Figma export pushed!

Changes:
- Added Button ghost variant
- Updated spacing tokens (md: 16px → 20px)
- Fixed Card padding binding

Files:
- component-catalog.json
- design-tokens.json

Next steps:
1. Pull latest from main
2. Run npm run bootstrap
3. Review in Storybook
4. Tag me for approval
```

### Approval Message
```
✅ Component approved: Button

Checked:
- All 3 variants match Figma
- Spacing is accurate
- Colors use design tokens
- Disabled state looks correct

Approved to merge!
```

### Change Request
```
🔄 Button needs changes

Issues:
1. Primary variant padding: Should be 12px top/bottom, 24px left/right (currently all 16px)
2. Ghost variant: Border color should be token `border-subtle`, not `text`
3. Disabled opacity: Should be 0.5, currently 0.4

Screenshots attached showing expected vs actual.

Please update and ping me for re-review.
```

## Success Metrics

You're doing great if:
- ✅ Token coverage consistently >70%
- ✅ Preflight status usually READY (not BLOCKED)
- ✅ Components approved on first review (>80%)
- ✅ Exports happen regularly (daily/weekly)
- ✅ Developers rarely need clarification

## Next Steps

- Read [DEVELOPER_WORKFLOW.md](./DEVELOPER_WORKFLOW.md) to understand developer process
- Bookmark [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Set up regular export schedule with team
- Create feedback loop with developers

**Questions? Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or ask in team Slack**
