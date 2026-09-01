#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const componentsSrc = path.join(
  repoRoot,
  'projects',
  'ngx-opalbytes-components',
  'src',
  'lib',
  'shared',
  'components'
);
const distRoot = path.join(repoRoot, 'dist', 'ngx-opalbytes-components');
const templatesDest = path.join(distRoot, 'templates');
const cliSrc = path.join(
  repoRoot,
  'projects',
  'ngx-opalbytes-components',
  'cli',
  'cao-comp.cjs'
);
const cliDestDir = path.join(distRoot, 'cli');

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function listComponents(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function injectBin() {
  const pkgPath = path.join(distRoot, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.warn(
      '[copy-cli-assets] dist/package.json nao encontrado (rode o build primeiro). ' +
        'O bin nao foi injetado, mas os templates e o CLI foram copiados.'
    );
    return;
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.bin = Object.assign({}, pkg.bin, { 'cao-comp': 'cli/cao-comp.cjs' });
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('[copy-cli-assets] bin "cao-comp" injetado no package.json.');
}

function generateDocs() {
  const components = listComponents(componentsSrc);
  const lines = [];
  lines.push('# cao-comp — CLI de componentes ngx-opalbytes-components');
  lines.push('');
  lines.push('Copie os componentes da biblioteca para qualquer projeto,');
  lines.push('mantendo os arquivos originais (.ts, .html, .scss/.css, .spec.ts,');
  lines.push('subpastas e servicos) para customizacao livre de estilo e logica.');
  lines.push('');
  lines.push('Tambem gera o setup minimo de Storybook para visualizar os');
  lines.push('componentes em projetos externos.');
  lines.push('');
  lines.push('## Uso');
  lines.push('');
  lines.push('```bash');
  lines.push('cao-comp <componente> <destino> [--force]');
  lines.push('cao-comp storybook <destino> [--force]');
  lines.push('```');
  lines.push('');
  lines.push('| Argumento    | Descricao                                                 |');
  lines.push('|--------------|-----------------------------------------------------------|');
  lines.push('| `<componente>` | Nome da pasta em `shared/components` (ex: `base-button`) |');
  lines.push('| `<destino>`    | Pasta onde os arquivos serao gerados (criada se nao existir) |');
  lines.push('| `storybook`    | Gera o setup do Storybook (.storybook/ + exemplo + doc)  |');
  lines.push('');
  lines.push('## Opcoes');
  lines.push('');
  lines.push('| Opcao            | Descricao                                     |');
  lines.push('|------------------|-----------------------------------------------|');
  lines.push('| `-h`, `--help`    | Exibe a ajuda                                 |');
  lines.push('| `-l`, `--list`    | Lista os componentes disponiveis              |');
  lines.push('| `-f`, `--force`   | Sobrescreve arquivos existentes no destino    |');
  lines.push('| `-v`, `--version` | Exibe a versao                                |');
  lines.push('');
  lines.push('## Exemplos');
  lines.push('');
  lines.push('```bash');
  lines.push('cao-comp base-button ./src/app/components');
  lines.push('cao-comp stepper ./src/app/components --force');
  lines.push('cao-comp --list');
  lines.push('cao-comp storybook ./meu-projeto');
  lines.push('cao-comp base-button ./meu-projeto/src/app/components && cao-comp storybook ./meu-projeto');
  lines.push('```');
  lines.push('');
  lines.push(`## Componentes disponiveis (${components.length})`);
  lines.push('');
  for (const c of components) {
    lines.push(`- ${c}`);
  }
  lines.push('');
  lines.push('## Storybook em projetos externos');
  lines.push('');
  lines.push('O subcomando `storybook` gera: `.storybook/` (main.ts, preview.ts,');
  lines.push('tsconfig.json, typings.d.ts), um exemplo em `src/stories/` e o');
  lines.push('guia `STORYBOOK-SETUP.md`. Siga o guia para instalar as');
  lines.push('dependencias (`storybook`, `@storybook/angular-vite`, addons) e');
  lines.push('rodar com `npx storybook dev -c .storybook -p 6006`.');
  lines.push('');
  lines.push('## Observacoes');
  lines.push('');
  lines.push('O projeto de destino deve possuir as peer dependencies:');
  lines.push('`@angular/core`, `@angular/common`, `@angular/material`,');
  lines.push('`@lucide/angular`, `@angular/cdk` e `ngx-mask`.');
  lines.push('');
  lines.push('Componentes com dependencia mutua (ex: `stepper` -> `step`)');
  lines.push('ja sao copiados juntos. Se um componente importar outro de');
  lines.push('pasta diferente, copie tambem a dependencia correspondente.');
  lines.push('');

  const docPath = path.join(distRoot, 'CAO-COMP-COMMANDS.md');
  fs.writeFileSync(docPath, lines.join('\n'));
  console.log('[copy-cli-assets] CAO-COMP-COMMANDS.md gerado.');
}

function main() {
  if (!fs.existsSync(componentsSrc)) {
    console.error('[copy-cli-assets] Erro: source components nao encontrado.');
    process.exit(1);
  }

  console.log('[copy-cli-assets] Copiando templates dos componentes...');
  copyRecursive(componentsSrc, templatesDest);
  console.log(`[copy-cli-assets] Templates -> ${templatesDest}`);

  console.log('[copy-cli-assets] Copiando CLI...');
  fs.mkdirSync(cliDestDir, { recursive: true });
  fs.copyFileSync(cliSrc, path.join(cliDestDir, 'cao-comp.cjs'));
  console.log(`[copy-cli-assets] CLI -> ${path.join(cliDestDir, 'cao-comp.cjs')}`);

  injectBin();
  generateDocs();

  console.log('[copy-cli-assets] Concluido.');
}

main();
