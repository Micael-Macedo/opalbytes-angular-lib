// @ts-check
const rootConfig = require("../../eslint.config.js");

module.exports = [
  ...rootConfig,
  {
    files: ["**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "cao",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "cao",
          style: "kebab-case",
        },
      ],
      "no-console": "error",
      "no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn"
    },
  },
  {
    files: ["**/*.html"],
    rules: {},
  }
];
