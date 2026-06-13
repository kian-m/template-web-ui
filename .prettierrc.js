// prettier.config.cjs or prettier.config.js (if using "type": "module" you can use prettier.config.mjs)
module.exports = {
  semi: true, // ✅ Recommended: Keep semicolons for clarity
  singleQuote: true, // ✅ Recommended: Consistent single quotes (except in JSX where double quotes are conventional)
  tabWidth: 2, // ✅ Recommended: 2 spaces for readability, standard in JS/TS/React/Next
  trailingComma: 'all', // ✅ Recommended: Easier diffing and cleaner additions/removals
  printWidth: 100, // ✅ Good balance between readability + fitting in typical editor windows
  bracketSpacing: true, // ✅ Standard spacing inside object literals
  arrowParens: 'always', // ✅ Avoids ambiguity in arrow function syntax; better for consistency + maintainability
  endOfLine: 'lf', // ✅ Ensures consistent line endings, especially in team/cross-OS projects
  plugins: [import('prettier-plugin-tailwindcss')],
};
