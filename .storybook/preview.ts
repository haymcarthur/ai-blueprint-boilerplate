import type { Preview } from '@storybook/react';

// Import global styles and tokens
// Uncomment when token files are generated:
// import '../src/tokens/colors';
// import '../src/tokens/typography';
// import '../src/tokens/spacing';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },  // Auto-detect event handlers (onClick, onChange, etc.)
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // Design token integration
    designToken: {
      files: ['../design-tokens.json'],  // Path to Figma token export
    },
    // Layout
    layout: 'centered',  // Center components by default
    // Backgrounds
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
  },
};

export default preview;
