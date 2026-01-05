#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script para adicionar link do relatório de métricas ao CHANGELOG.md
 * Usado durante o processo de release do semantic-release
 */

const metricsReportPath = path.join(process.cwd(), 'metrics-reports', 'latest.html');
const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');

// Verifica se o relatório existe
if (!fs.existsSync(metricsReportPath)) {
  console.log('[Changelog] Nenhum relatorio de metricas encontrado. Pulando...');
  process.exit(0);
}

// Lê o relatório para extrair informações
const htmlContent = fs.readFileSync(metricsReportPath, 'utf-8');

// Extrai informações do relatório
const branchMatch = htmlContent.match(/<strong>Branch:<\/strong>\s*<span>(.*?)<\/span>/);
const commitMatch = htmlContent.match(/<strong>Commit:<\/strong>\s*<span>(.*?)<\/span>/);
const dateMatch = htmlContent.match(/<strong>Data:<\/strong>\s*<span>(.*?)<\/span>/);

const branch = branchMatch ? branchMatch[1] : 'unknown';
const commit = commitMatch ? commitMatch[1] : 'unknown';
const date = dateMatch ? dateMatch[1] : new Date().toLocaleString('pt-BR');

// Extrai estatísticas do relatório
const totalMetricsMatch = htmlContent.match(/<h3>Total de Metricas<\/h3>\s*<div class="value">(\d+)<\/div>/);
const successMatch = htmlContent.match(/<h3>Sucesso<\/h3>\s*<div class="value">(\d+)<\/div>/);
const failuresMatch = htmlContent.match(/<h3>Falhas<\/h3>\s*<div class="value">(\d+)<\/div>/);

const totalMetrics = totalMetricsMatch ? totalMetricsMatch[1] : '0';
const successMetrics = successMatch ? successMatch[1] : '0';
const failures = failuresMatch ? failuresMatch[1] : '0';

// Cria o conteúdo do relatório de métricas para adicionar ao changelog
const metricsSection = `

## 📊 Relatório de Métricas

**Data**: ${date}
**Branch**: ${branch}
**Commit**: ${commit}

### Resumo
- Total de métricas: ${totalMetrics}
- Sucessos: ${successMetrics}
- Falhas: ${failures}

[📈 Ver Relatório Completo (HTML)](./metrics-reports/latest.html)

---
`;

// Verifica se o CHANGELOG existe
if (!fs.existsSync(changelogPath)) {
  console.log('[Changelog] CHANGELOG.md nao encontrado. Criando...');
  fs.writeFileSync(changelogPath, `# Changelog\n\n${metricsSection}`, 'utf-8');
} else {
  // Lê o CHANGELOG atual
  let changelogContent = fs.readFileSync(changelogPath, 'utf-8');

  // Verifica se já existe uma seção de métricas
  if (changelogContent.includes('## 📊 Relatório de Métricas')) {
    console.log('[Changelog] Relatorio de metricas ja existe no CHANGELOG. Atualizando...');
    // Remove a seção antiga de métricas
    changelogContent = changelogContent.replace(/## 📊 Relatório de Métricas[\s\S]*?(?=\n##|\n#|$)/, '');
  }

  // Encontra a primeira seção do changelog (geralmente ## [version])
  const firstSectionMatch = changelogContent.match(/\n##\s/);

  if (firstSectionMatch) {
    // Insere o relatório de métricas antes da primeira seção
    const insertIndex = firstSectionMatch.index;
    changelogContent = changelogContent.slice(0, insertIndex) + metricsSection + changelogContent.slice(insertIndex);
  } else {
    // Se não houver seções, adiciona ao final
    changelogContent += metricsSection;
  }

  // Salva o CHANGELOG atualizado
  fs.writeFileSync(changelogPath, changelogContent, 'utf-8');
  console.log('[Changelog] Relatorio de metricas adicionado ao CHANGELOG.md com sucesso!');
}

process.exit(0);
