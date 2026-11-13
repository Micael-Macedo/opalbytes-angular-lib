#!/usr/bin/env node
'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');

const USAGE = `cao-comp — Copia um componente da lib ngx-opalbytes-components para qualquer projeto
e gera o setup de Storybook para visualizar os componentes

Uso:
  cao-comp <componente> <destino> [opcoes]
  cao-comp storybook <destino> [opcoes]
  cao-comp new [nome] [opcoes]

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

Subcomando new:
  Cria um novo projeto interativamente (ou via flags).

Opcoes de new:
  -n, --name <nome>       Nome do projeto
  -p, --port <porta>      Porta do projeto (default: 4206)
`;

const STORYBOOK_FILES = {
  '.storybook/main.ts': `import type { StorybookConfig } from '@storybook/angular-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": {
    "name": "@storybook/angular-vite",
    "options": {
      "compodoc": false,
      "compodocArgs": ["-e", "json", "-d", "."]
    }
  }
};
export default config;
`,
  '.storybook/preview.ts': `import type { Preview } from '@storybook/angular-vite';

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

const EXAMPLE_STORY = [
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
  `export const Default: Story = { args: { label: 'Clique!' } };`,
  `export const ComIconeTexto: Story = { args: { label: 'Salvar' } };`,
  `export const Desabilitado: Story = { args: { label: 'Bloqueado', isDisabled: true } };`,
  ``,
].join('\n');

const STORYBOOK_SETUP_DOC = `# Storybook — Setup gerado pelo cao-comp

## 1. Instalar dependencias

\`\`\`bash
npm i -D storybook @storybook/angular-vite @storybook/addon-a11y @storybook/addon-docs @storybook/addon-onboarding @compodoc/compodoc
\`\`\`

## 2. Rodar

\`\`\`bash
npx storybook dev -c .storybook -p 6006
npx storybook build -c .storybook -o storybook-static
\`\`\`
`;

// ---------- utilitarios puros (facilmente testaveis) ----------

function resolveTemplatesDir() {
  const candidates = [
    path.join(__dirname, '..', 'templates'),
    path.join(__dirname, '..', 'src', 'lib', 'shared', 'components'),
    path.join(__dirname, '..', '..', 'src', 'lib', 'shared', 'components'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) return dir;
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
        if (pkg && pkg.version) return pkg.version;
      } catch (_) { /* ignore */ }
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
  if (writeFileIfAllowed(storyFile, EXAMPLE_STORY, force, conflicts)) {
    created.push(path.relative(root, storyFile));
  }

  const docFile = path.join(root, 'STORYBOOK-SETUP.md');
  if (writeFileIfAllowed(docFile, STORYBOOK_SETUP_DOC, force, conflicts)) {
    created.push(path.relative(root, docFile));
  }

  if (conflicts.length) {
    process.stderr.write(
      `Erro: os seguintes arquivos ja existem no destino (use --force para sobrescrever):\n` +
        conflicts.map((c) => `  - ${c}`).join('\n') + '\n'
    );
    return 1;
  }

  process.stdout.write(
    `Setup de Storybook gerado em "${root}".\n` +
      `Arquivos criados:\n` +
      created.map((c) => `  - ${c}`).join('\n') + '\n'
  );
  return 0;
}

// ---------- parse de argumentos ----------

function parseArgs(argv) {
  const positionals = [];
  const flags = {
    help: false,
    list: false,
    force: false,
    version: false,
    name: null,
    port: null,
    repo: null,
    websocket: false,
    stage: false,
  };

  const valueFlags = new Set(['--name', '--port', '--repo']);
  const normalized = [];
  for (const arg of argv) {
    if (typeof arg === 'string' && arg.startsWith('--') && arg.includes('=')) {
      const eq = arg.indexOf('=');
      const key = arg.slice(0, eq);
      if (valueFlags.has(key)) {
        normalized.push(key, arg.slice(eq + 1));
        continue;
      }
    }
    normalized.push(arg);
  }

  for (let i = 0; i < normalized.length; i++) {
    const arg = normalized[i];
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
      case '-n':
      case '--name':
        flags.name = normalized[++i];
        break;
      case '-p':
      case '--port':
        flags.port = normalized[++i];
        break;
      case '-r':
      case '--repo':
        flags.repo = normalized[++i];
        break;
      case '-ws':
      case '--websocket':
        flags.websocket = true;
        break;
      case '-s':
      case '--stage':
        flags.stage = true;
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

function isValidName(name){
  const regex = /^[a-z-]+$/
  return regex.test(name)
}

function isValidPort(port){
  if(port >= 4206 && port < 4300) return true

  return false
}


const DEFAULT_BASE_PROJECT_URL = 'https://github.com/Micael-Macedo/opalbytes-base-repo.git'
// ---------- acao: new ----------

function createNewProject(projectName, flags = {}, prompt = defaultPrompt) {

  const providedName = projectName || flags.name;
  if (providedName && !isValidName(providedName)) {
    process.stderr.write(
      `Erro: nome de projeto invalido "${providedName}". Use apenas letras minusculas e hifens.\n`
    );
    return 1;
  }

  let name = providedName || prompt.text('Nome do projeto: ');
  while (!isValidName(name)) {
    writeText("Nome de projeto invalido \n")
    name = prompt.text('Nome do projeto: ');
  }

  if (flags.port && !isValidPort(parseInt(flags.port))) {
    process.stderr.write(
      `Erro: porta invalida "${flags.port}". Use um valor entre 4206 e 4299.\n`
    );
    return 1;
  }

  let port =
    flags.port || prompt.text('Porta do projeto [4206]: ') || '4206';
  while (!isValidPort(parseInt(port))) {
    writeText("porta invalida \n")
    port = prompt.text('Porta do projeto [4206]: ') || '4206';
  }

  const destination = path.resolve();
  const newRepoPath = path.join(destination, name);

  if (fs.existsSync(newRepoPath)) {
    process.stderr.write(
      `Erro: a pasta "${newRepoPath}" ja existe. Remova-a ou escolha outro nome.\n`
    );
    return 1;
  }

  const withWebsocket =
    typeof flags.websocket === 'boolean' && flags.websocket
      ? true
      : prompt.confirm('Integracao com Websocket?');

  const withStage =
    typeof flags.stage === 'boolean' && flags.stage
      ? true
      : prompt.confirm('Ambiente stage?');

  const urlRepository =
    flags.repo || prompt.text('Link repositorio azure: ');

  process.stdout.write(
    `Projeto "${name}" configurado:\n` +
      `  destino: ${destination}\n` +
      `  porta: ${port}\n` +
      `  websocket: ${withWebsocket}\n` +
      `  stage: ${withStage}\n` +
      `  repo: ${urlRepository || '(nao informado)'}\n`
  );

  cloneRepository(DEFAULT_BASE_PROJECT_URL, newRepoPath)

  // updatePackageJson(newRepoPath, name, port)

  // updateAngularFile(newRepoPath, name)

  // installNpmPackages(newRepoPath)

  deleteFolder(path.join(newRepoPath, '.git'))

  if(urlRepository){
    console.log(newRepoPath)
    initRepo(newRepoPath, urlRepository)
  }

  writeText("🎆Projeto instalado com sucesso🎆")
  return 0;
}
const DEFAULT_REPO_NAME = 'opalbytes-base-repo'

function updatePackageJson(destination, name, port) {
  printLine()
  writeText("Modificando arquivos package")
  replaceLineMatching(path.join(destination, 'package.json'), '"name":', `  "name": "${name}",`);
  replaceLineMatching(path.join(destination, 'package.json'), '"port":', `  "port": ${port},`);
  
  replaceLineMatching(path.join(destination, 'package-lock.json'), `"name":`, `  "name": "${name}",`);
  replaceLineMatching(path.join(destination, 'package-lock.json'), `      "name": "opalbytes-base-repo",`, `      "name": "${name}",`);
  printLine()
}

const ENV_PATHS = [
  "production",
  "homologation",
  "development",
  "local",
]

function writeText(message){
  process.stdout.write(message + " \n")
}

function updateAngularFile(destination, name) {
  console.log(destination, name)
  replaceLineMatching(path.join(destination, 'angular.json'), `"${DEFAULT_REPO_NAME}"`, `    "${name}": {`);

  for (const env of ENV_PATHS) {
    replaceLineMatching(path.join(destination, 'angular.json'), `"buildTarget": "${DEFAULT_REPO_NAME}:build:${env}"`, `              "buildTarget": "${name}:build:${env}"`);
  }
}


// Abstracao do prompt para permitir testes sem stdin
const defaultPrompt = {
  text: (msg) => readlineSync.question(msg),
  confirm: (msg) => readlineSync.keyInYN(msg),
};

// ---------- subcomandos ----------

const subcommands = {
  storybook: (dest, flags) => {
    if (!dest) {
      process.stderr.write('Erro: informe o destino do Storybook.\n');
      return 1;
    }
    return setupStorybook(dest, flags.force);
  },
  new: (name, flags) => createNewProject(name, flags),
};

// ---------- entrypoint ----------

function main(argv = process.argv.slice(2), deps = {}) {
  const { positionals, flags } = parseArgs(argv);
  const prompt = deps.prompt || defaultPrompt;
  const templatesDir = deps.templatesDir || resolveTemplatesDir();

  if (flags.help) {
    writeText((USAGE + '\n'));
    return 0;
  }

  if (flags.version) {
    writeText((`cao-comp ${resolvePackageVersion()}\n`));
    return 0;
  }

  if (!templatesDir) {
    process.stderr.write(
      'Erro: nao foi possivel localizar a pasta de templates dos componentes.\n'
    );
    return 1;
  }

  if (flags.list) {
    writeText('Componentes disponiveis:\n');
    for (const c of listComponents(templatesDir)) {
      writeText(`  - ${c}\n`);
    }
    return 0;
  }

  const [first, second] = positionals;

  if (subcommands[first]) {
    // passa `second` como nome/destino e o objeto de flags
    if (first === 'new') {
      return createNewProject(second, flags, prompt);
    }
    return subcommands[first](second, flags);
  }

  // copia de componente (comportamento default)
  if (!first || !second) {
    process.stderr.write('Erro: informe o componente e o destino.\n\n' + USAGE + '\n');
    return 1;
  }

  const sourceDir = path.join(templatesDir, first);
  if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
    process.stderr.write(
      `Erro: componente "${first}" nao encontrado.\n` +
        `Componentes disponiveis: ${listComponents(templatesDir).join(', ')}\n`
    );
    return 1;
  }

  fs.mkdirSync(second, { recursive: true });
  const conflicts = [];
  copyRecursive(sourceDir, second, flags.force, conflicts);

  if (conflicts.length) {
    process.stderr.write(
      `Erro: os seguintes arquivos ja existem no destino (use --force para sobrescrever):\n` +
        conflicts.map((c) => `  - ${c}`).join('\n') + '\n'
    );
    return 1;
  }

  process.stdout.write(`Componente "${first}" copiado para "${second}".\n`);
  return 0;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = {
  main,
  parseArgs,
  listComponents,
  copyRecursive,
  writeFileIfAllowed,
  setupStorybook,
  createNewProject,
  resolveTemplatesDir,
  resolvePackageVersion,
  defaultPrompt,
};


function replaceLine(filePath, lineIndex /* 0-based */, newLine) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);   // preserva CRLF se existir
  if (lineIndex < 0 || lineIndex >= lines.length) {
    throw new RangeError(`Linha ${lineIndex} fora do intervalo (0..${lines.length - 1})`);
  }
  lines[lineIndex] = newLine;
  fs.writeFileSync(filePath, lines.join('\n'));
}

function installNpmPackages(cwd) {
  printLine()
  writeText("Baixando pacotes npm")
  const isWin = process.platform === 'win32';
  execFileSync(isWin ? 'npm.cmd' : 'npm', ['install'], { 
    stdio: 'inherit', 
    cwd,
    shell: isWin
  });
  writeText("Pacotes npm instalados")
  printLine()
}

function cloneRepository(url, destination){
  printLine()
  writeText("Clonando repositorio base")
  execFileSync('git', ['clone', url, destination], { stdio: 'inherit' });
  writeText("Repositorio base clonado")
  printLine()
}

function printLine(){
  process.stdout.write("------------------------------------------------------ \n")

}

function deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
  }
  
  function deleteFolder(folder) {
    if (fs.existsSync(folder)) {
      fs.rmSync(folder, { recursive: true, force: true });
    }
  }

function initRepo(projectName, repoLink){
  printLine()
  process.chdir(projectName)
  writeText("fazendo commit no repositorio " + repoLink)
  execFileSync('git', ['init'], { stdio: 'inherit' });
  execFileSync('git', ['branch', '-M', 'main'], { stdio: 'inherit' });
  execFileSync('git', ['add', '.'], { stdio: 'inherit' });
  execFileSync('git', ['commit', '-m', '"feat: add base project"'], { stdio: 'inherit' });
  execFileSync('git', ['remote', 'add', 'origin', repoLink], { stdio: 'inherit' });
  execFileSync('git', ['push', '-u', 'origin', 'main'], { stdio: 'inherit' });
  writeText("Commit realizado com sucesso")
  printLine()
}

function replaceLineMatching(filePath, match, newLine) {
  const content = fs.readFileSync(filePath, 'utf8');
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const re = typeof match === 'string' ? new RegExp(escapeRegExp(match)) : match;
  const lines = content.split(/\r?\n/);
  const idx = lines.findIndex((l) => re.test(l));
  if (idx === -1) return false;       // nada alterado
  lines[idx] = newLine;
  fs.writeFileSync(filePath, lines.join(eol));
  return true;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}