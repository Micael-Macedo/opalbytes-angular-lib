#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const USAGE = `cao-comp — Copia um componente da lib ngx-opalbytes-components para qualquer projeto
e gera o setup de Storybook para visualizar os componentes

Uso:
  cao-comp <componente> <destino> [opcoes]
  cao-comp storybook <destino> [opcoes]

Argumentos:
  <componente>   Nome da pasta do componente em shared/components (ex: base-button)
  <destino>      Pasta de destino onde os arquivos serao gerados (criada se nao existir)

Opcoes:
  -h, --help      Exibe esta ajuda
  -l, --list      Lista os componentes disponiveis para copia
  -f, --force     Sobrescreve arquivos existentes no destino
  -v, --version   Exibe a versao

Subcomando storybook:
  Gera o setup minimo do Storybook (.storybook/, exemplo de story e STORYBOOK-SETUP.md)
  em <destino>, pronto para visualizar os componentes copiados.

Exemplos:
  cao-comp base-button ./src/app/components
  cao-comp stepper ./src/app/components --force
  cao-comp --list
  cao-comp storybook ./meu-projeto
  cao-comp base-button ./meu-projeto/src/app/components && cao-comp storybook ./meu-projeto
`;

const STORYBOOK_FILES = {
  '.storybook/main.ts': `import type { StorybookConfig } from '@storybook/angular-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": {
    "name": "@storybook/angular-vite",
    "options": {
      "compodoc": false,
      "compodocArgs": [
        "-e",
        "json",
        "-d",
        "."
      ]
    }
  }
};
export default config;
`,
  '.storybook/preview.ts': `import type { Preview } from '@storybook/angular-vite';

// Para habilitar as docs automaticas (argTypes) com Compodoc:
// 1. Gere o documentation.json:  npx @compodoc/compodoc -p tsconfig.json -e json -d .
// 2. Coloque "compodoc": true no framework options do .storybook/main.ts
// 3. Descomente as linhas abaixo:
// import { setCompodocJson } from '@storybook/addon-docs/angular';
// import docJson from '../documentation.json';
// setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
`,
  '.storybook/tsconfig.json': `{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["../src/**/*.stories.*", "./preview.ts", "./main.ts", "./typings.d.ts"]
}
`,
  '.storybook/typings.d.ts': `declare module '*.md';
`,
};

const EXAMPLE_STORY_LINES = [
  `import { Component, EventEmitter, Input, Output } from '@angular/core';`,
  `import type { Meta, StoryObj } from '@storybook/angular-vite';`,
  `import { fn } from 'storybook/test';`,
  ``,
  `@Component({`,
  `  standalone: true,`,
  `  selector: 'storybook-example-button',`,
  `  template: \``,
  `    <button`,
  `      type="button"`,
  `      (click)="onClick.emit()"`,
  `      [disabled]="isDisabled"`,
  `      style="padding:10px 18px;font-size:14px;cursor:pointer;border-radius:6px;border:1px solid #4f46e5;background:#4f46e5;color:#fff;">`,
  `      {{ label }}`,
  `    </button>`,
  `  \`,`,
  `})`,
  `export class StorybookExampleButtonComponent {`,
  `  @Input() label = 'Clique!';`,
  `  @Input() isDisabled = false;`,
  `  @Output() readonly onClick = new EventEmitter<void>();`,
  `}`,
  ``,
  `const meta: Meta<StorybookExampleButtonComponent> = {`,
  `  title: 'Exemplo/Cao Button',`,
  `  component: StorybookExampleButtonComponent,`,
  `  tags: ['autodocs'],`,
  `  args: { onClick: fn() },`,
  `};`,
  ``,
  `export default meta;`,
  `type Story = StoryObj<StorybookExampleButtonComponent>;`,
  ``,
  `export const Default: Story = {`,
  `  args: { label: 'Clique!' },`,
  `};`,
  ``,
  `export const ComIconeTexto: Story = {`,
  `  args: { label: 'Salvar' },`,
  `};`,
  ``,
  `export const Desabilitado: Story = {`,
  `  args: { label: 'Bloqueado', isDisabled: true },`,
  `};`,
  ``,
];

const STORYBOOK_SETUP_DOC = `# Storybook — Setup gerado pelo cao-comp

Este diretorio contem o setup minimo do Storybook para visualizar os
componentes da lib ngx-opalbytes-components em um projeto externo.

## 1. Instalar as dependencias (no destino)

Adicione as dependencias de desenvolvimento:

\`\`\`bash
npm i -D storybook @storybook/angular-vite @storybook/addon-essentials @storybook/addon-a11y @storybook/addon-docs @storybook/addon-onboarding @compodoc/compodoc
\`\`\`

Certifique-se de que as peer dependencies dos componentes estao instaladas:
\`@angular/core\`, \`@angular/common\`, \`@angular/material\`, \`@angular/cdk\`,
\`@lucide/angular\` e \`ngx-mask\`.

## 2. Copiar os componentes que deseja visualizar

\`\`\`bash
cao-comp base-button ./src/app/components
cao-comp base-input ./src/app/components
cao-comp --list   # lista todos os componentes disponiveis
\`\`\`

## 3. Criar stories para os componentes copiados

Abra \`src/stories/CaoButton.stories.ts\` (exemplo gerado) ou crie arquivos
\`*.stories.ts\` junto dos componentes. Exemplo:

\`\`\`ts
import type { Meta, StoryObj } from '@storybook/angular-vite';
import { fn } from 'storybook/test';
import { CaoBaseButtonComponent } from '../../app/components/base-button/base-button.component';

const meta: Meta<CaoBaseButtonComponent> = {
  title: 'Components/Base Button',
  component: CaoBaseButtonComponent,
  tags: ['autodocs'],
  args: { buttonClick: fn() },
};

export default meta;
type Story = StoryObj<CaoBaseButtonComponent>;

export const Default: Story = { args: { buttonText: 'Clique!' } };
export const ComIcone: Story = { args: { buttonText: 'Salvar', leadingIcon: 'Save', isLucideIcon: true } };
\`\`\`

## 4. Rodar

\`\`\`bash
# Servidor de desenvolvimento (porta 6006)
npx storybook dev -c .storybook -p 6006

# Build estatico
npx storybook build -c .storybook -o storybook-static
\`\`\`

Dica: adicione ao package.json do projeto de destino:

\`\`\`json
{
  "scripts": {
    "storybook": "storybook dev -c .storybook -p 6006",
    "build-storybook": "storybook build -c .storybook -o storybook-static"
  }
}
\`\`\`

## Opcional: Compodoc (docs automaticas)

1. Gere o JSON de documentacao na raiz do destino:
   \`\`\`bash
   npx @compodoc/compodoc -p tsconfig.json -e json -d .
   \`\`\`
2. No \`.storybook/main.ts\`, altere \`"compodoc": false\` para \`"compodoc": true\`.
3. No \`.storybook/preview.ts\`, descomente o bloco do Compodoc.

> O \`--force\` sobrescreve os arquivos gerados pelo cao-comp no destino.
`;

function resolveTemplatesDir() {
  const candidates = [
    path.join(__dirname, '..', 'templates'),
    path.join(__dirname, '..', 'src', 'lib', 'shared', 'components'),
    path.join(__dirname, '..', '..', 'src', 'lib', 'shared', 'components'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      return dir;
    }
  }
  return null;
}

function resolvePackageVersion() {
  const candidates = [
    path.join(__dirname, '..', 'package.json'),
    path.join(__dirname, '..', '..', 'package.json'),
    path.join(__dirname, '..', '..', '..', 'package.json'),
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (pkg && pkg.version) {
          return pkg.version;
        }
      } catch (_) {
        /* ignore */
      }
    }
  }
  return 'desconhecida';
}

function listComponents(templatesDir) {
  return fs
    .readdirSync(templatesDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function copyRecursive(src, dest, force, conflicts) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath, force, conflicts);
    } else {
      if (fs.existsSync(destPath) && !force) {
        conflicts.push(destPath);
        continue;
      }
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function writeFileIfAllowed(filePath, content, force, conflicts) {
  if (fs.existsSync(filePath) && !force) {
    conflicts.push(filePath);
    return false;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  return true;
}

function setupStorybook(destination, force) {
  const root = path.resolve(destination);
  const conflicts = [];
  const created = [];

  for (const [rel, content] of Object.entries(STORYBOOK_FILES)) {
    const file = path.join(root, rel);
    if (writeFileIfAllowed(file, content, force, conflicts)) {
      created.push(path.relative(root, file));
    }
  }

  const storyFile = path.join(root, 'src', 'stories', 'CaoButton.stories.ts');
  if (writeFileIfAllowed(storyFile, EXAMPLE_STORY_LINES.join('\n'), force, conflicts)) {
    created.push(path.relative(root, storyFile));
  }

  const docFile = path.join(root, 'STORYBOOK-SETUP.md');
  if (writeFileIfAllowed(docFile, STORYBOOK_SETUP_DOC, force, conflicts)) {
    created.push(path.relative(root, docFile));
  }

  if (conflicts.length) {
    process.stderr.write(
      `Erro: os seguintes arquivos ja existem no destino (use --force para sobrescrever):\n` +
        conflicts.map((c) => `  - ${c}`).join('\n') +
        '\n'
    );
    return 1;
  }

  process.stdout.write(
    `Setup de Storybook gerado em "${root}".\n` +
      `Arquivos criados:\n` +
      created.map((c) => `  - ${c}`).join('\n') +
      '\n' +
      `Leia ${path.join(root, 'STORYBOOK-SETUP.md')} para instalar as dependencias e rodar.\n`
  );
  return 0;
}

function parseArgs(argv) {
  const positionals = [];
  const flags = { help: false, list: false, force: false, version: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '-h':
      case '--help':
        flags.help = true;
        break;
      case '-l':
      case '--list':
        flags.list = true;
        break;
      case '-f':
      case '--force':
        flags.force = true;
        break;
      case '-v':
      case '--version':
        flags.version = true;
        break;
      default:
        positionals.push(arg);
    }
  }
  return { positionals, flags };
}

function main() {
  const argv = process.argv.slice(2);
  const { positionals, flags } = parseArgs(argv);

  if (flags.help) {
    process.stdout.write(USAGE + '\n');
    return 0;
  }

  if (flags.version) {
    process.stdout.write(`cao-comp ${resolvePackageVersion()}\n`);
    return 0;
  }

  const templatesDir = resolveTemplatesDir();
  if (!templatesDir) {
    process.stderr.write(
      'Erro: nao foi possivel localizar a pasta de templates dos componentes.\n'
    );
    return 1;
  }

  if (flags.list) {
    const components = listComponents(templatesDir);
    process.stdout.write('Componentes disponiveis:\n');
    for (const c of components) {
      process.stdout.write(`  - ${c}\n`);
    }
    return 0;
  }

  const [first, second] = positionals;

  if (first === 'storybook') {
    if (!second) {
      process.stderr.write(
        'Erro: informe o destino do Storybook.\n\n' + USAGE + '\n'
      );
      return 1;
    }
    return setupStorybook(second, flags.force);
  }

  const component = first;
  const destination = second;
  if (!component || !destination) {
    process.stderr.write(
      'Erro: informe o componente e o destino.\n\n' + USAGE + '\n'
    );
    return 1;
  }

  const sourceDir = path.join(templatesDir, component);
  if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
    const available = listComponents(templatesDir).join(', ');
    process.stderr.write(
      `Erro: componente "${component}" nao encontrado.\n` +
        `Componentes disponiveis: ${available}\n`
    );
    return 1;
  }

  fs.mkdirSync(destination, { recursive: true });
  const conflicts = [];
  copyRecursive(sourceDir, destination, flags.force, conflicts);

  if (conflicts.length) {
    process.stderr.write(
      `Erro: os seguintes arquivos ja existem no destino (use --force para sobrescrever):\n` +
        conflicts.map((c) => `  - ${c}`).join('\n') +
        '\n'
    );
    return 1;
  }

  process.stdout.write(
    `Componente "${component}" copiado para "${destination}".\n`
  );
  return 0;
}

process.exit(main());