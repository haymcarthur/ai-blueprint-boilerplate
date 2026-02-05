#!/usr/bin/env node

/**
 * Generate Token Files
 * Regenerates token TypeScript files from design-tokens.json
 *
 * Usage: npm run generate:tokens
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const tokensFile = path.join(rootDir, 'design-tokens.json');

if (!fs.existsSync(tokensFile)) {
  console.error('❌ design-tokens.json not found');
  process.exit(1);
}

const tokens = JSON.parse(fs.readFileSync(tokensFile, 'utf-8'));

// Generate colors.ts
const colorsContent = `/**
 * Color Tokens
 * Generated from design-tokens.json
 * DO NOT EDIT: This file is auto-generated
 */

export const colors = {
${tokens.colors.map(t => `  '${t.name}': '${t.value}',`).join('\n')}
} as const;

export type ColorToken = keyof typeof colors;
`;
fs.writeFileSync(path.join(rootDir, 'src/tokens/colors.ts'), colorsContent);
console.log(`✓ Generated colors.ts (${tokens.colors.length} tokens)`);

// Generate typography.ts
const typographyContent = `/**
 * Typography Tokens
 * Generated from design-tokens.json
 * DO NOT EDIT: This file is auto-generated
 */

export const typography = {
${tokens.typography.map(t => `  '${t.name}': {
    fontFamily: '${t.fontFamily}',
    fontSize: '${t.fontSize}',
    fontWeight: ${t.fontWeight},
    lineHeight: '${t.lineHeight}',
  },`).join('\n')}
} as const;

export type TypographyToken = keyof typeof typography;
`;
fs.writeFileSync(path.join(rootDir, 'src/tokens/typography.ts'), typographyContent);
console.log(`✓ Generated typography.ts (${tokens.typography.length} tokens)`);

// Generate spacing.ts
const spacingTokens = tokens.spacing || [];
const spacingContent = `/**
 * Spacing Tokens
 * Generated from design-tokens.json
 * DO NOT EDIT: This file is auto-generated
 */

export const spacing = {
${spacingTokens.map(t => `  '${t.name}': '${t.value}',`).join('\n')}
} as const;

export type SpacingToken = keyof typeof spacing;
`;
fs.writeFileSync(path.join(rootDir, 'src/tokens/spacing.ts'), spacingContent);
console.log(`✓ Generated spacing.ts (${spacingTokens.length} tokens)`);

// Generate effects.ts
const effectsContent = `/**
 * Effect Tokens
 * Generated from design-tokens.json
 * DO NOT EDIT: This file is auto-generated
 */

export const effects = {
${tokens.effects.map(t => `  '${t.name}': '${t.value}',`).join('\n')}
} as const;

export type EffectToken = keyof typeof effects;
`;
fs.writeFileSync(path.join(rootDir, 'src/tokens/effects.ts'), effectsContent);
console.log(`✓ Generated effects.ts (${tokens.effects.length} tokens)`);

console.log('\n✅ Token generation complete!');
