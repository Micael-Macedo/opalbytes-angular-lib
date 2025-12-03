// @ts-check
const { defineConfig } = require("eslint/config");
const rootConfig = require("../../eslint.config.js");

module.exports = defineConfig([
  ...rootConfig,
  {
    files: ["**/*.ts"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@angular-eslint/recommended",
      "plugin:@angular-eslint/template/process-inline-templates",
      "plugin:prettier/recommended"
    ],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "lib",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "lib",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
          "error",
          {
            "argsIgnorePattern": "^_"
          }
        ],
        "no-console": ["warn", { "allow": ["warn", "error"] }],
        "import/order": [
          "error",
          {
            "groups": [
              "builtin",
              "external",
              "internal",
              "parent",
              "sibling",
              "index"
            ],
            "newlines-between": "always",
            "alphabetize": { "order": "asc" }
          }
        ]
    },
  },
  {
    files: ["**/*.html"],
    rules: {},
  }
]);
