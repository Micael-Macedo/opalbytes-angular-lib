const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const angularEslint = require("@angular-eslint/eslint-plugin");
const unusedImports = require("eslint-plugin-unused-imports");
const importPlugin = require("eslint-plugin-import");

module.exports = [
  {
    ignores: [
      "**/dist/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/out-tsc/**",
      "**/.angular/**",
      "**/*.js",
      "!eslint.config.js",
      "**/.vscode/**",
      "**/.git/**",
      "**/compodoc/**",
      "**/*.spec.ts",
      "**/*.css",
      "**/*.scss",
    ],
  },

  // ========================================
  // JavaScript Files
  // ========================================
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },

  // ========================================
  // TypeScript Files
  // ========================================
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        // Project config para habilitar regras avançadas (type checking)
        // Incluir todos os tsconfig dos projetos no workspace
        project: [
          "./tsconfig.json",
          "./projects/*/tsconfig.app.json",
          "./projects/*/tsconfig.lib.json",
          "./projects/*/*/tsconfig.lib.json",
        ],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "@angular-eslint": angularEslint,
      "unused-imports": unusedImports,
      "import": importPlugin,
    },
    rules: {
      // ========================================
      // TypeScript Rules - Qualidade de Código
      // ========================================
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/no-deprecated": "error",

      // ========================================
      // TypeScript Rules - Naming Convention
      // ========================================
      "@typescript-eslint/naming-convention": [
        "error",
        // Interfaces devem começar com I
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
        // Types devem ser PascalCase
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        // Enums devem ser PascalCase
        {
          selector: "enum",
          format: ["PascalCase"],
        },
        // Classes devem ser PascalCase
        {
          selector: "class",
          format: ["PascalCase"],
        },
        // Variáveis devem ser camelCase ou UPPER_CASE (constantes)
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        // Parâmetros devem ser camelCase
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        // Métodos devem ser camelCase
        {
          selector: "method",
          format: ["camelCase"],
        },
        // Propriedades devem ser camelCase
        {
          selector: "property",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
      ],

      // ========================================
      // Unused Imports
      // ========================================
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // ========================================
      // Import Rules - Organização
      // ========================================
      "import/order": [
        "error",
        {
          "groups": [
            "builtin", // Node built-in modules
            "external", // npm packages
            "internal", // Alias (@shared, @core, etc)
            ["parent", "sibling"], // Relative imports
            "index",
          ],
          "pathGroups": [
            {
              pattern: "@angular/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "@core.*/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@domain.*/**",
              group: "internal",
            },
            {
              pattern: "@shared.*/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@config/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@environments/**",
              group: "internal",
              position: "after",
            },
          ],
          "pathGroupsExcludedImportTypes": ["builtin"],
          "newlines-between": "always",
          "alphabetize": {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-duplicates": "error",
      "import/no-unresolved": "off", // TypeScript já faz isso
      "import/first": "error",
      "import/newline-after-import": "error",

      // ========================================
      // Angular Rules - Component/Directive
      // ========================================
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: ["app"],
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: ["app"],
          style: "kebab-case",
        },
      ],
      "@angular-eslint/no-empty-lifecycle-method": "error",
      "@angular-eslint/use-injectable-provided-in": "error",
      "@angular-eslint/no-input-prefix": "warn",
      "@angular-eslint/no-input-rename": "warn",
      "@angular-eslint/no-output-rename": "warn",
      "@angular-eslint/use-lifecycle-interface": "error",
      "@angular-eslint/prefer-output-readonly": "error",
      "@angular-eslint/no-output-native": "error",
      "@angular-eslint/no-output-on-prefix": "error",
      "@angular-eslint/contextual-lifecycle": "error",
      "@angular-eslint/component-class-suffix": "warn",
      "@angular-eslint/directive-class-suffix": "error",
      "@angular-eslint/prefer-on-push-component-change-detection": "warn",

      // ========================================
      // Code Quality - Geral
      // ========================================
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "warn",
      "no-duplicate-imports": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-return-await": "error",
      "require-await": "error",
      "no-nested-ternary": "warn",
      "max-depth": ["warn", 4],
      "max-lines": ["warn", { max: 500, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["warn", { max: 100, skipBlankLines: true, skipComments: true }],
      "complexity": ["warn", 20],
    },
  },

  // ========================================
  // HTML Template Files
  // ========================================
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: require("@angular-eslint/template-parser"),
    },
    plugins: {
      "@angular-eslint/template": require("@angular-eslint/eslint-plugin-template"),
    },
    rules: {
      // ========================================
      // Angular Template Rules
      // ========================================
      "@angular-eslint/template/prefer-control-flow": "error",
      "@angular-eslint/template/banana-in-box": "error",
      "@angular-eslint/template/no-negated-async": "warn",
      "@angular-eslint/template/use-track-by-function": "warn",
      "@angular-eslint/template/no-duplicate-attributes": "error",
      "@angular-eslint/template/prefer-self-closing-tags": "warn",
      "@angular-eslint/template/cyclomatic-complexity": [
        "warn",
        {
          maxComplexity: 10,
        },
      ],
      "@angular-eslint/template/conditional-complexity": [
        "warn",
        {
          maxComplexity: 5,
        },
      ],
      "@angular-eslint/template/eqeqeq": [
        "error",
        {
          allowNullOrUndefined: true,
        },
      ],
      "@angular-eslint/template/no-call-expression": "warn",
      "@angular-eslint/template/no-any": "warn",
      "@angular-eslint/template/no-inline-styles": "warn",
      "@angular-eslint/template/prefer-ngsrc": "error",

      // ========================================
      // Acessibilidade (A11y) - Básico
      // ========================================
      "@angular-eslint/template/alt-text": "error",
      "@angular-eslint/template/elements-content": "error",
      "@angular-eslint/template/label-has-associated-control": "error",
      "@angular-eslint/template/table-scope": "error",
      "@angular-eslint/template/valid-aria": "error",
      "@angular-eslint/template/click-events-have-key-events": "error",
      "@angular-eslint/template/mouse-events-have-key-events": "error",
      "@angular-eslint/template/interactive-supports-focus": "error",

      // ========================================
      // Acessibilidade (A11y) - Avançado
      // ========================================
      // Evita autofocus (problemas para usuários com leitores de tela)
      "@angular-eslint/template/no-autofocus": "error",

      // Evita tabindex positivo (quebra ordem natural de navegação)
      "@angular-eslint/template/no-positive-tabindex": "error",

      // Evita elementos distrativos (<marquee>, <blink>)
      "@angular-eslint/template/no-distracting-elements": "error",

      // Garante que roles ARIA têm propriedades obrigatórias
      "@angular-eslint/template/role-has-required-aria": "error",

      // ========================================
      // HTML Performance & Semântica
      // ========================================
      // Garante que botões sempre têm type (button, submit, reset)
      "@angular-eslint/template/button-has-type": "error",

      // Ordena atributos de forma consistente
      "@angular-eslint/template/attributes-order": "warn",

      // ========================================
      // Tailwind CSS
      // ========================================
      // NOTA: Plugin eslint-plugin-tailwindcss removido temporariamente
      // Aguardando suporte oficial para Tailwind CSS v4
      // Quando disponível, adicionar:
      // - tailwindcss/classnames-order
      // - tailwindcss/no-custom-classname
      // - tailwindcss/no-contradicting-classname
      // Ver: https://github.com/francoismassart/eslint-plugin-tailwindcss/issues
    },
  },
];
