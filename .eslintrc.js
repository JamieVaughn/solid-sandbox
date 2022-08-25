module.exports = {
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["solid"],
  extends: [
    'eslint:recommended',
    'plugin:solid/typescript',
    "prettier"
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'no-unused-vars': 'error'
    "solid/reactivity": "warn",
    "solid/no-destructure": "warn",
    "solid/jsx-no-undef": "error",
    "solid/components-return-once": "warn",
    "solid/event-handlers": "warn",
    "solid/no-react-specific-props": "error",
    "solid/no-unknown-namespaces": "error",
    "solid/prefer-for": "warn",
    "solid/prefer-show": "warn",
    "solid/prefer-classlist": "warn",
    "solid/style-prop": "warn"
  }
}
