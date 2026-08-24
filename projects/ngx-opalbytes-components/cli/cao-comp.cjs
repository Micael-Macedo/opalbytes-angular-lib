#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const USAGE = `cao-comp — Copia um componente da lib ngx-opalbytes-components para qualquer projeto

Uso:
  cao-comp <componente> <destino> [opcoes]

Argumentos:
  <componente>   Nome da pasta do componente em shared/components (ex: base-button)
  <destino>      Pasta de destino onde os arquivos serao gerados (criada se nao existir)

Opcoes:
  -h, --help      Exibe esta ajuda
  -l, --list      Lista os componentes disponiveis para copia
  -f, --force     Sobrescreve arquivos existentes no destino
  -v, --version   Exibe a versao

Exemplos:
  cao-comp base-button ./src/app/components
  cao-comp stepper ./src/app/components --force
  cao-comp --list
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

  const [component, destination] = positionals;
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
