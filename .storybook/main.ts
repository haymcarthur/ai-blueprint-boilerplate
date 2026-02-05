import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',     // Controls, docs, actions, viewport, etc.
    '@storybook/addon-a11y',           // Accessibility testing
    'storybook-design-token',          // Design token viewer
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',                   // Generate docs from stories tagged with 'autodocs'
  },
  typescript: {
    check: false,                      // Disable type checking (faster builds)
    reactDocgen: 'react-docgen-typescript',  // Extract props from TypeScript
  },
};

export default config;
