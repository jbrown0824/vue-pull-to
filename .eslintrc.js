// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  'extends': [
    'plugin:vue/essential',
    // '@vue/prettier',
  ],
  // add your custom rules here
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'semi': [ 1 ],
    'indent': [ 'error', 'tab', { 'SwitchCase': 1 } ],

  },
}
