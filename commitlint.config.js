module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nova funcionalidade
        'fix',      // Correção de bug
        'docs',     // Documentação
        'style',    // Formatação
        'refactor', // Refatoração
        'perf',     // Performance
        'test',     // Testes
        'build',    // Build/dependências
        'ci',       // CI/CD
        'chore',    // Outras alterações
        'revert'    // Reverter commit
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'directives',
        'form',
        'ui',
        'structural',
        'core',
        'deps',
        'config'
      ]
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100]
  }
};