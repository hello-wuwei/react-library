export default {
  '*.@(js|jsx|ts|tsx|mjs)': [
    'eslint --ext .js,.jsx,.ts,.tsx --fix',
    'prettier --write',
  ],
  '*.@(css|less)': ['stylelint --fix --custom-syntax postcss-less'],
  '*.@(html|mdx)': ['prettier --write', 'eslint --ext .html,.mdx --fix'],
  '*.@(json|md)': ['prettier --write'],
};
