import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: themes.light,  // or themes.dark
  sidebar: {
    showRoots: true,     // Show root-level categories
    collapsedRoots: [],  // Keep all categories expanded by default
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
