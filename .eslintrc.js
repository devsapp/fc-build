module.exports = {
  extends: 'eslint-config-ali/typescript',
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'max-len': 'off',
  },
};
