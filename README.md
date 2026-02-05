# AI Blueprint Boilerplate

**Streamlined Figma → Code workflow powered by AI Blueprint plugin**

This repository provides the external structure and instructions needed to generate production-ready code from Figma designs using the AI Blueprint plugin + Claude.

## 🚀 Quick Start

```bash
# 1. Clone this repository
git clone https://github.com/haymcarthur/ai-blueprint-boilerplate.git
cd ai-blueprint-boilerplate

# 2. Install dependencies
npm install

# 3. Export from Figma and save files here
# - component-catalog.json (Bootstrap export)
# - design-tokens.json (Token export)

# 4. Run bootstrap to generate code
npm run bootstrap

# 5. Start Storybook
npm run storybook
```

## 📁 Repository Structure

```
design-system/
├── docs/
│   ├── ai-instructions/     # AI-readable instruction files
│   └── onboarding/          # Human-readable guides
├── src/
│   ├── tokens/              # Generated token definitions
│   └── components/          # Generated component source
├── assets/
│   ├── manifest.json        # Asset registry
│   ├── icons/               # Icon exports
│   ├── images/              # Image assets
│   └── fonts/               # Font files
├── .storybook/              # Storybook configuration
├── naming-registry.json     # Component name mappings
├── plugin-hooks.json        # Automation config
├── design-tokens.json       # Token exports from Figma
└── component-catalog.json   # Bootstrap export data
```

## 🎨 Workflow

### For Designers

1. **Set up Figma**: Install AI Blueprint plugin, configure design tokens
2. **Create components**: Build component library with token bindings
3. **Export**: Run Bootstrap mode in plugin
4. **Save**: Place `component-catalog.json` and `design-tokens.json` in repo root
5. **Notify**: Tell developers exports are ready

See [docs/onboarding/DESIGNER_WORKFLOW.md](docs/onboarding/DESIGNER_WORKFLOW.md) for details.

### For Developers

1. **Pull exports**: Get latest Figma exports from designer
2. **Bootstrap**: Run `npm run bootstrap` to generate code
3. **Implement**: Fill in component logic and interactions
4. **Test**: Review in Storybook (`npm run storybook`)
5. **Verify**: Check token bindings and preflight validation

See [docs/onboarding/DEVELOPER_WORKFLOW.md](docs/onboarding/DEVELOPER_WORKFLOW.md) for details.

## 📚 Documentation

- **Getting Started**: [docs/onboarding/GETTING_STARTED.md](docs/onboarding/GETTING_STARTED.md)
- **Figma Setup**: [docs/onboarding/FIGMA_SETUP.md](docs/onboarding/FIGMA_SETUP.md)
- **Designer Workflow**: [docs/onboarding/DESIGNER_WORKFLOW.md](docs/onboarding/DESIGNER_WORKFLOW.md)
- **Developer Workflow**: [docs/onboarding/DEVELOPER_WORKFLOW.md](docs/onboarding/DEVELOPER_WORKFLOW.md)
- **Troubleshooting**: [docs/onboarding/TROUBLESHOOTING.md](docs/onboarding/TROUBLESHOOTING.md)

## 🤖 AI Instructions

The `docs/ai-instructions/` directory contains structured instructions for AI code generation. These files are referenced by the AI Blueprint plugin prompts to ensure consistent, high-quality code generation.

- **BOOTSTRAP_WORKFLOW.md**: Bootstrap process flow
- **TOKEN_BINDING.md**: Token usage requirements
- **IMPLEMENTATION_PHASES.md**: Phased implementation strategy
- **NO_INVENTION_CONTRACT.md**: Don't create non-exported components
- **LAYOUT_STRATEGY.md**: Layout implementation rules
- **COMPONENT_PATTERNS.md**: Component structure patterns
- **STORYBOOK_INTEGRATION.md**: Storybook setup guide
- **CODE_STANDARDS.md**: Code quality standards

## 🎯 Key Features

- **61% smaller prompts**: Instructions externalized to files
- **Token binding**: Automatic design token integration
- **Consistent naming**: Component name sanitization rules
- **Storybook ready**: Pre-configured with token addon
- **Automation hooks**: Run scripts on export (formatting, builds, etc.)
- **Type safety**: TypeScript definitions for tokens and components

## 🔧 Scripts

- `npm run bootstrap`: Generate tokens and component stubs from Figma exports
- `npm run generate:tokens`: Generate token TypeScript files
- `npm run generate:components`: Generate component stubs
- `npm run storybook`: Start Storybook development server
- `npm run build:storybook`: Build Storybook for deployment
- `npm run format`: Format code with Prettier
- `npm run lint`: Lint code with ESLint
- `npm run typecheck`: Check TypeScript types

## 📦 What Gets Generated

### From Bootstrap Export

- `src/tokens/*.ts`: Type-safe token definitions (colors, typography, spacing, effects)
- `src/components/*/`: Component stubs with proper imports and types
- `naming-registry.json`: Updated with sanitized component names
- Storybook stories for each component

### From Screen Export

- `src/screens/*/`: Screen implementations with token bindings
- Component instances mapped to catalog references
- Layout code following design structure

## ✅ Preflight Validation

The AI Blueprint plugin runs preflight checks on exports:

- **Token Coverage**: Ensures sufficient token binding (colors, typography, spacing)
- **Component Mapping**: Verifies all instances map to catalog components
- **Layout Validation**: Checks for valid auto-layout configurations
- **Asset Inventory**: Lists required images, icons, fonts

Preflight results guide implementation priorities.

## 🤝 Contributing

This is a template repository. To customize for your project:

1. Fork this repository
2. Update `package.json` with your project name
3. Customize AI instructions in `docs/ai-instructions/`
4. Modify naming rules in `naming-registry.json`
5. Add project-specific patterns to `docs/`

## 📄 License

MIT

## 🔗 Related

- [AI Blueprint Figma Plugin](https://github.com/haymcarthur/ai-blueprint)
- [Plugin Documentation](https://github.com/haymcarthur/ai-blueprint/blob/main/PROJECT_SPEC.md)
- [Render Contract Spec](https://github.com/haymcarthur/ai-blueprint/blob/main/RENDER_CONTRACT_SPEC.md)

---

**Generated by AI Blueprint** • Design systems that code themselves
