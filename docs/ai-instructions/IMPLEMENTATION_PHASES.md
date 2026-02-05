# Implementation Phases

**Phased approach for building component libraries from Figma exports.**

## Overview

Building a component library is complex. This phased approach:
- Breaks work into manageable chunks
- Provides clear stopping points for review
- Enables designer approval at every stage
- Supports session recovery if interrupted

## Phase Structure

### Phase 1: Plan & Document

**Goal**: Create comprehensive implementation plan

**Tasks**:
1. Review `component-catalog.json` thoroughly
2. Identify component dependencies (dependency tree)
3. Group components into batches (3-5 per batch)
4. Plan token implementation strategy
5. **Create `IMPLEMENTATION_PLAN.md`** with:
   - Component build order
   - Batching strategy
   - Token implementation plan
   - Timeline and checkpoints
6. **Create `CHANGELOG.md`** to track progress

**Deliverables**:
- `IMPLEMENTATION_PLAN.md` (saved to project root)
- `CHANGELOG.md` (initialized with Phase 1 complete)

**⏸️ STOP**: Wait for plan approval before proceeding

---

### Phase 2: Setup

**Goal**: Initialize project structure and dependencies

**Tasks**:
1. Initialize project (Vite, Next.js, etc.)
2. Configure `package.json`, `tsconfig.json`
3. Set up build tools and dev server
4. Configure styling system (Tailwind, CSS-in-JS, etc.)
5. Add testing framework (optional but recommended)

**Deliverables**:
- Working development environment
- Build scripts functioning
- Can run `npm start` and see blank app

**Update**: Add to `CHANGELOG.md`: "✅ Phase 2: Setup complete"

**⏸️ STOP**: Verify setup works before proceeding

---

### Phase 3: Tokens

**Goal**: Generate and verify design token files

**Tasks**:
1. Read `design-tokens.json` (from Figma export)
2. Generate token files:
   - `src/tokens/colors.ts`
   - `src/tokens/typography.ts`
   - `src/tokens/spacing.ts`
   - `src/tokens/effects.ts`
   - `src/tokens/index.ts` (unified export)
3. Test token imports in a sample file
4. Verify TypeScript autocomplete works
5. See [TOKEN_BINDING.md](./TOKEN_BINDING.md) for usage guidelines

**Deliverables**:
- All token files generated and working
- Can import: `import { colors, typography } from './tokens'`

**Update**: Add to `CHANGELOG.md`: "✅ Phase 3: Tokens verified"

**⏸️ STOP**: Verify tokens work before building components

---

### Phase 4: Showcase Setup (Bootstrap Mode Only)

**Goal**: Build component showcase infrastructure

**Purpose**: Enable designer to review each component as it's built

**Tasks**:
1. Create showcase app structure
2. Build navigation (list of components, click to select)
3. Build viewer (renders selected component with default props)
4. Build prop controls (dynamic inputs based on component props)
5. Style minimally (neutral colors, let components shine)
6. **DO NOT** add actual components yet (just the framework)

**Deliverables**:
- Empty showcase app that runs
- Navigation, viewer, and prop controls functional
- Ready to add components incrementally

**Update**: Add to `CHANGELOG.md`: "✅ Phase 4: Showcase infrastructure ready"

**⏸️ STOP**: Verify showcase framework works

**Note**: For Screen Export mode, skip this phase

---

### Phase 5+: Component Batches (Iterative)

**Goal**: Build components in batches with designer approval

**Critical Workflow** (for EACH batch):

1. **Build** 3-5 components (in dependency order)
   - Implement component code
   - Use design tokens (no hardcoded values)
   - Match catalog exactly (see [NO_INVENTION_CONTRACT.md](./NO_INVENTION_CONTRACT.md))
   - Add component-level tests (optional)

2. **Add to showcase** (Bootstrap mode only)
   - Import new components
   - Add to component list
   - Test in showcase viewer

3. **Test**
   - Verify all props work
   - Test all variants
   - Check styling matches Figma
   - Verify token usage

4. **Document**
   - Update `CHANGELOG.md`:
     ```markdown
     ## ✅ Batch N: [ComponentA, ComponentB, ComponentC]
     - 3 components built and tested
     - **Designer review pending**
     ```

5. **⏸️ STOP**: **DESIGNER MUST APPROVE** before next batch

**Example Batches**:
- Batch 1: Button, Input, Checkbox (leaf components)
- Batch 2: Card, CardHeader, CardFooter (depends on Button)
- Batch 3: Dialog, DialogOverlay, DialogContent (depends on Button, Card)

**Rules**:
- ✅ Build in dependency order (leaves first, containers later)
- ✅ Maximum 5 components per batch
- ✅ Stop after every batch for approval
- ❌ Never build more than 5 components without stopping
- ❌ Never skip designer approval

**Repeat** this phase until all components are built and approved.

---

### Final Phase: Documentation

**Goal**: Complete project documentation

**Tasks**:
1. Write comprehensive `README.md`
2. Document component usage (props, variants, examples)
3. Add Storybook stories (if using Storybook)
4. Create migration guide (if updating existing library)
5. Final `CHANGELOG.md` update: "✅ Library complete - all components approved"

**Deliverables**:
- Complete documentation
- Usage examples
- Component library ready for production

---

## Session Recovery

**If session gets interrupted**, use these files to recover:

1. **Check `CHANGELOG.md`**: See last completed phase/batch
2. **Check `IMPLEMENTATION_PLAN.md`**: See overall plan
3. **Resume**: Pick up from next uncompleted batch
4. **Continue**: Follow the build-showcase-approve cycle

### Example CHANGELOG.md for Recovery

```markdown
# Component Library Changelog

## ✅ Phase 1: Plan & Document (Completed)
- Implementation plan created and approved
- Dependency tree: Button, Input → Card → Dialog

## ✅ Phase 2: Setup (Completed)
- Project initialized with Vite + React + Tailwind
- Build configuration complete

## ✅ Phase 3: Tokens (Completed)
- 15 color tokens implemented
- 8 typography tokens implemented
- 3 effect tokens implemented

## ✅ Phase 4: Showcase Setup (Completed)
- Showcase infrastructure ready

## ✅ Batch 1: [Button, Input, Checkbox] (Designer Approved ✓)
- 3 components built and tested

## 🚧 Batch 2: [Card, CardHeader, CardFooter] (IN PROGRESS)
- Components built
- **Waiting for designer approval**

## ⏸️ Next: Batch 3: [Dialog, DialogOverlay, DialogContent]
```

**Resume Point**: After designer approves Batch 2, proceed with Batch 3.

---

## Key Principles

1. **Plan first, code later**: Phase 1 is critical
2. **Small batches**: 3-5 components maximum
3. **Frequent approvals**: Designer reviews every batch
4. **Document everything**: CHANGELOG.md is your session state
5. **Dependency order**: Leaf components before containers
6. **Stop often**: Pauses are mandatory, not optional

## Success Criteria

- ✅ `IMPLEMENTATION_PLAN.md` saved and approved
- ✅ `CHANGELOG.md` tracking all phases/batches
- ✅ All components match catalog exactly
- ✅ Every component approved by designer
- ✅ No batch exceeds 5 components
- ✅ Design tokens used throughout (no hardcoded values)

## Related Documents

- [NO_INVENTION_CONTRACT.md](./NO_INVENTION_CONTRACT.md) - What to build
- [TOKEN_BINDING.md](./TOKEN_BINDING.md) - How to use tokens
- [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md) - Component structure
- [CODE_STANDARDS.md](./CODE_STANDARDS.md) - Code quality
