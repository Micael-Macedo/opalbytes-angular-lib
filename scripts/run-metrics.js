#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class MetricsRunner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      branch: this.getCurrentBranch(),
      commit: this.getCurrentCommit(),
      metrics: {}
    };
    this.outputDir = path.join(process.cwd(), 'metrics-reports');
  }

  getCurrentBranch() {
    try {
      return execSync('git symbolic-ref --short HEAD', { encoding: 'utf-8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  getCurrentCommit() {
    try {
      return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  log(message) {
    console.log(`[Metricas] ${message}`);
  }

  logError(message, error) {
    console.error(`[Erro de Metricas] ${message}`);
    if (error) {
      console.error(error);
    }
  }

  executeCommand(command, description) {
    this.log(`Executando: ${description}...`);
    try {
      const output = execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      this.log(`Concluido: ${description}`);
      return { success: true, output };
    } catch (error) {
      this.logError(`Falhou: ${description}`, error.message);
      return { success: false, output: error.stdout || '', error: error.message };
    }
  }

  async runBuild() {
    this.log('Construindo todos os pacotes...');
    const result = this.executeCommand('npm run build:all', 'Construcao de todos os pacotes');
    this.results.metrics.build = {
      success: result.success,
      output: result.output
    };
    return result.success;
  }

  async runSizeLimit() {
    this.log('Executando verificacao de tamanho...');
    const result = this.executeCommand('npm run size', 'Verificacao de limite de tamanho');

    const sizeData = [];
    try {
      const configPath = path.join(process.cwd(), '.size-limit.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      const output = result.output || '';

      // Divide a saída em seções, uma para cada pacote
      config.forEach((item) => {
        let actualSize = 'N/A';
        let passed = true;
        let exceeded = null;

        // Procura pela seção do pacote na saída
        // Formato esperado:
        // ngx-opalbytes-directives
        // Package size limit has exceeded by 36.94 kB
        // Size limit: 100 kB
        // Size:       136.94 kB with all dependencies, minified and gzipped

        // Cria um regex para encontrar a seção do pacote
        // Captura desde o nome até encontrar dupla quebra de linha (com possíveis espaços) ou fim do texto
        const packageRegex = new RegExp(`${this.escapeRegex(item.name)}[\\s\\S]*?(?=\\n\\s*\\n|$)`, 'i');
        const packageMatch = output.match(packageRegex);

        if (packageMatch) {
          const sectionText = packageMatch[0];

          // Captura o tamanho real: "Size:       136.94 kB with all dependencies..."
          const sizeMatch = sectionText.match(/Size:\s+(\d+(?:\.\d+)?)\s*([KMG]?B)/i);
          if (sizeMatch) {
            actualSize = `${sizeMatch[1]} ${sizeMatch[2]}`;
          }

          // Verifica se excedeu o limite: "Package size limit has exceeded by 36.94 kB"
          const exceedMatch = sectionText.match(/has exceeded by\s+(\d+(?:\.\d+)?)\s*([KMG]?B)/i);
          if (exceedMatch) {
            exceeded = `${exceedMatch[1]} ${exceedMatch[2]}`;
            passed = false;
          }
        }

        // Se o comando falhou e não encontramos informação específica, marca como failed
        if (!result.success && actualSize === 'N/A') {
          passed = false;
        }

        sizeData.push({
          name: item.name,
          limit: item.limit,
          actual: actualSize,
          exceeded: exceeded,
          passed: passed
        });
      });
    } catch (error) {
      this.logError('Erro ao processar saida do size-limit', error.message);
    }

    this.results.metrics.sizeLimit = {
      success: result.success,
      data: sizeData,
      output: result.output
    };
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async runBundlesize() {
    this.log('Executando verificacao de bundle...');
    const result = this.executeCommand('npm run bundlesize', 'Verificacao de tamanho do bundle');

    const bundlesizeData = [];
    try {
      const configPath = path.join(process.cwd(), 'bundlesize.config.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      config.files.forEach(file => {
        const pattern = file.path.replace(/\*/g, '.*');
        const match = result.output.match(new RegExp(pattern));
        bundlesizeData.push({
          path: file.path,
          maxSize: file.maxSize,
          passed: result.success
        });
      });
    } catch (error) {
      this.logError('Erro ao processar saida do bundlesize', error.message);
    }

    this.results.metrics.bundlesize = {
      success: result.success,
      data: bundlesizeData,
      output: result.output
    };
  }

  async runDepcheck() {
    this.log('Executando verificacao de dependencias...');

    const libraries = [
      'ngx-opalbytes-directives',
      'ngx-opalbytes-components',
      'ngx-opalbytes-services',
      'ngx-opalbytes-utils',
      'ngx-opalbytes-core-shared',
      'ngx-opalbytes-performance'
    ];

    const depcheckByLib = [];
    let globalOutput = '';
    let hasAnyIssues = false;

    for (const lib of libraries) {
      const libPath = path.join(process.cwd(), 'projects', lib);

      if (!fs.existsSync(libPath)) {
        continue;
      }

      this.log(`  Verificando dependencias de ${lib}...`);

      const result = this.executeCommand(
        `cd "${libPath}" && depcheck || true`,
        `Depcheck em ${lib}`
      );

      globalOutput += `\n\n=== ${lib} ===\n${result.output}`;

      let libData = {
        library: lib,
        hasIssues: false,
        unusedDependencies: [],
        missingDependencies: []
      };

      try {
        const output = result.output || '';
        if (output.includes('Unused dependencies')) {
          libData.hasIssues = true;
          hasAnyIssues = true;
          const unusedMatch = output.match(/Unused dependencies[:\s]+([\s\S]*?)(?=\n\n|Missing|$)/);
          if (unusedMatch) {
            libData.unusedDependencies = unusedMatch[1]
              .split('\n')
              .filter(line => line.trim().startsWith('*'))
              .map(line => line.trim().substring(1).trim());
          }
        }
        if (output.includes('Missing dependencies')) {
          libData.hasIssues = true;
          hasAnyIssues = true;
          const missingMatch = output.match(/Missing dependencies[:\s]+([\s\S]*?)(?=\n\n|Unused|$)/);
          if (missingMatch) {
            libData.missingDependencies = missingMatch[1]
              .split('\n')
              .filter(line => line.trim().startsWith('*'))
              .map(line => line.trim().substring(1).trim());
          }
        }
      } catch (error) {
        this.logError(`Erro ao processar saida do depcheck para ${lib}`, error.message);
      }

      depcheckByLib.push(libData);
    }

    this.results.metrics.depcheck = {
      success: true,
      hasAnyIssues: hasAnyIssues,
      libraries: depcheckByLib,
      output: globalOutput
    };
  }

  async runTests() {
    this.log('Executando testes...');
    const result = this.executeCommand('npm test', 'Testes unitarios');

    const testData = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0
    };

    try {
      const output = result.output || '';
      const testsMatch = output.match(/Tests:\s+(\d+)\s+passed/);
      const failedMatch = output.match(/(\d+)\s+failed/);
      const skippedMatch = output.match(/(\d+)\s+skipped/);

      if (testsMatch) testData.passed = parseInt(testsMatch[1]);
      if (failedMatch) testData.failed = parseInt(failedMatch[1]);
      if (skippedMatch) testData.skipped = parseInt(skippedMatch[1]);
      testData.total = testData.passed + testData.failed + testData.skipped;
    } catch (error) {
      this.logError('Erro ao processar saida dos testes', error.message);
    }

    this.results.metrics.tests = {
      success: result.success,
      data: testData,
      output: result.output
    };
  }

  async runLint() {
    this.log('Executando lint...');
    const result = this.executeCommand('npm run lint', 'Verificacao de lint');

    const lintData = {
      errors: 0,
      warnings: 0,
      files: 0
    };

    try {
      const output = result.output || '';
      const errorsMatch = output.match(/(\d+)\s+error/);
      const warningsMatch = output.match(/(\d+)\s+warning/);
      const filesMatch = output.match(/(\d+)\s+file/);

      if (errorsMatch) lintData.errors = parseInt(errorsMatch[1]);
      if (warningsMatch) lintData.warnings = parseInt(warningsMatch[1]);
      if (filesMatch) lintData.files = parseInt(filesMatch[1]);
    } catch (error) {
      this.logError('Erro ao processar saida do lint', error.message);
    }

    this.results.metrics.lint = {
      success: result.success,
      data: lintData,
      output: result.output
    };
  }

  generateHTML() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatorio de Metricas - ${this.results.branch}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header .meta {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 20px;
            font-size: 0.95em;
        }

        .header .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .header .meta-item strong {
            font-weight: 600;
        }

        .content {
            padding: 30px;
        }

        .metric-section {
            margin-bottom: 30px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
        }

        .metric-header {
            background: #f5f5f5;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e0e0e0;
        }

        .metric-header h2 {
            font-size: 1.3em;
            color: #333;
        }

        .status-badge {
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            text-transform: uppercase;
        }

        .status-success {
            background: #4caf50;
            color: white;
        }

        .status-error {
            background: #f44336;
            color: white;
        }

        .metric-body {
            padding: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }

        th {
            background: #f9f9f9;
            font-weight: 600;
            color: #555;
        }

        tr:hover {
            background: #f5f5f5;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 15px;
        }

        .stat-card {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e0e0e0;
        }

        .stat-card .value {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }

        .stat-card .label {
            font-size: 0.9em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .output-section {
            margin-top: 15px;
            background: #f5f5f5;
            padding: 0;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        }

        .output-section summary {
            padding: 12px 15px;
            cursor: pointer;
            font-weight: 600;
            color: #667eea;
            user-select: none;
            list-style: none;
            display: flex;
            align-items: center;
            transition: background 0.2s;
        }

        .output-section summary::-webkit-details-marker {
            display: none;
        }

        .output-section summary::before {
            content: '▶';
            display: inline-block;
            margin-right: 8px;
            transition: transform 0.2s;
            font-size: 0.8em;
        }

        .output-section[open] summary::before {
            transform: rotate(90deg);
        }

        .output-section summary:hover {
            background: #ebebeb;
        }

        .output-section pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            margin: 0;
            border-radius: 0 0 6px 6px;
            overflow-x: auto;
            font-size: 0.85em;
            line-height: 1.5;
        }

        .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }

        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .summary-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .summary-card h3 {
            font-size: 1.1em;
            margin-bottom: 10px;
            opacity: 0.9;
        }

        .summary-card .value {
            font-size: 2em;
            font-weight: bold;
        }

        .list-items {
            list-style: none;
            padding: 0;
        }

        .list-items li {
            padding: 8px 12px;
            margin: 5px 0;
            background: #f9f9f9;
            border-left: 3px solid #667eea;
            border-radius: 4px;
        }

        .no-items {
            color: #4caf50;
            font-style: italic;
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Relatorio de Metricas</h1>
            <div class="meta">
                <div class="meta-item">
                    <strong>Branch:</strong> <span>${this.results.branch}</span>
                </div>
                <div class="meta-item">
                    <strong>Commit:</strong> <span>${this.results.commit}</span>
                </div>
                <div class="meta-item">
                    <strong>Data:</strong> <span>${new Date(this.results.timestamp).toLocaleString('pt-BR')}</span>
                </div>
            </div>
        </div>

        <div class="content">
            <div class="summary-cards">
                ${this.generateSummaryCards()}
            </div>

            ${this.generateBuildSection()}
            ${this.generateSizeLimitSection()}
            ${this.generateBundlesizeSection()}
            ${this.generateDepcheckSection()}
            ${this.generateTestsSection()}
            ${this.generateLintSection()}
        </div>

        <div class="footer">
            <p>Gerado em ${new Date(this.results.timestamp).toLocaleString('pt-BR')}</p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  generateSummaryCards() {
    const totalMetrics = Object.keys(this.results.metrics).length;
    const successfulMetrics = Object.values(this.results.metrics).filter(m => m.success).length;
    const failedMetrics = totalMetrics - successfulMetrics;

    return `
      <div class="summary-card">
        <h3>Total de Metricas</h3>
        <div class="value">${totalMetrics}</div>
      </div>
      <div class="summary-card">
        <h3>Sucesso</h3>
        <div class="value">${successfulMetrics}</div>
      </div>
      <div class="summary-card">
        <h3>Falhas</h3>
        <div class="value">${failedMetrics}</div>
      </div>
    `;
  }

  generateBuildSection() {
    const build = this.results.metrics.build;
    if (!build) return '';

    return `
      <div class="metric-section">
        <div class="metric-header">
          <h2>Build</h2>
          <span class="status-badge ${build.success ? 'status-success' : 'status-error'}">
            ${build.success ? 'Sucesso' : 'Falhou'}
          </span>
        </div>
        <div class="metric-body">
          <p>${build.success ? 'Todos os pacotes foram construidos com sucesso.' : 'Build falhou. Veja a saida abaixo.'}</p>
          ${build.output ? `
            <details class="output-section">
              <summary>Ver Saida do Build</summary>
              <pre>${this.escapeHtml(build.output.substring(0, 2000))}${build.output.length > 2000 ? '...' : ''}</pre>
            </details>
          ` : ''}
        </div>
      </div>
    `;
  }

  generateSizeLimitSection() {
    const sizeLimit = this.results.metrics.sizeLimit;
    if (!sizeLimit) return '';

    return `
      <div class="metric-section">
        <div class="metric-header">
          <h2>Limite de Tamanho</h2>
          <span class="status-badge ${sizeLimit.success ? 'status-success' : 'status-error'}">
            ${sizeLimit.success ? 'Passou' : 'Falhou'}
          </span>
        </div>
        <div class="metric-body">
          ${sizeLimit.data && sizeLimit.data.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th>Pacote</th>
                  <th>Limite</th>
                  <th>Tamanho Atual</th>
                  <th>Excedeu</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${sizeLimit.data.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.limit}</td>
                    <td>${item.actual}</td>
                    <td>${item.exceeded || '-'}</td>
                    <td><span class="status-badge ${item.passed ? 'status-success' : 'status-error'}">${item.passed ? 'OK' : 'Excedeu'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p>Nenhum dado de limite de tamanho disponivel.</p>'}
          ${sizeLimit.output ? `
            <details class="output-section">
              <summary>Ver Saida Completa</summary>
              <pre>${this.escapeHtml(sizeLimit.output.substring(0, 1500))}${sizeLimit.output.length > 1500 ? '...' : ''}</pre>
            </details>
          ` : ''}
        </div>
      </div>
    `;
  }

  generateBundlesizeSection() {
    const bundlesize = this.results.metrics.bundlesize;
    if (!bundlesize) return '';

    return `
      <div class="metric-section">
        <div class="metric-header">
          <h2>Tamanho do Bundle</h2>
          <span class="status-badge ${bundlesize.success ? 'status-success' : 'status-error'}">
            ${bundlesize.success ? 'Passou' : 'Falhou'}
          </span>
        </div>
        <div class="metric-body">
          ${bundlesize.data && bundlesize.data.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th>Caminho</th>
                  <th>Tamanho Maximo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${bundlesize.data.map(item => `
                  <tr>
                    <td>${item.path}</td>
                    <td>${item.maxSize}</td>
                    <td><span class="status-badge ${item.passed ? 'status-success' : 'status-error'}">${item.passed ? 'OK' : 'Excedeu'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p>Nenhum dado de tamanho de bundle disponivel.</p>'}
          ${bundlesize.output ? `
            <details class="output-section">
              <summary>Ver Saida Completa</summary>
              <pre>${this.escapeHtml(bundlesize.output.substring(0, 1500))}${bundlesize.output.length > 1500 ? '...' : ''}</pre>
            </details>
          ` : ''}
        </div>
      </div>
    `;
  }

  generateDepcheckSection() {
    const depcheck = this.results.metrics.depcheck;
    if (!depcheck) return '';

    const totalUnused = depcheck.libraries.reduce((sum, lib) => sum + lib.unusedDependencies.length, 0);
    const totalMissing = depcheck.libraries.reduce((sum, lib) => sum + lib.missingDependencies.length, 0);

    return `
      <div class="metric-section">
        <div class="metric-header">
          <h2>Verificacao de Dependencias</h2>
          <span class="status-badge ${!depcheck.hasAnyIssues ? 'status-success' : 'status-error'}">
            ${!depcheck.hasAnyIssues ? 'Limpo' : 'Problemas Encontrados'}
          </span>
        </div>
        <div class="metric-body">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="value">${totalUnused}</div>
              <div class="label">Dependencias Nao Utilizadas</div>
            </div>
            <div class="stat-card">
              <div class="value">${totalMissing}</div>
              <div class="label">Dependencias Ausentes</div>
            </div>
            <div class="stat-card">
              <div class="value">${depcheck.libraries.filter(lib => lib.hasIssues).length}</div>
              <div class="label">Bibliotecas com Problemas</div>
            </div>
          </div>

          ${depcheck.libraries.map(lib => `
            <div style="margin-top: 20px; padding: 15px; background: ${lib.hasIssues ? '#fff3e0' : '#e8f5e9'}; border-radius: 8px; border-left: 4px solid ${lib.hasIssues ? '#ff9800' : '#4caf50'};">
              <h3 style="margin: 0 0 10px 0; color: #333; font-size: 1.1em;">
                ${lib.library}
                <span class="status-badge ${lib.hasIssues ? 'status-error' : 'status-success'}" style="margin-left: 10px; font-size: 0.75em;">
                  ${lib.hasIssues ? 'Com Problemas' : 'Limpo'}
                </span>
              </h3>

              ${lib.unusedDependencies.length > 0 ? `
                <div style="margin-top: 10px;">
                  <strong style="color: #666;">Dependencias Nao Utilizadas (${lib.unusedDependencies.length}):</strong>
                  <ul class="list-items" style="margin-top: 5px;">
                    ${lib.unusedDependencies.map(dep => `<li>${dep}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${lib.missingDependencies.length > 0 ? `
                <div style="margin-top: 10px;">
                  <strong style="color: #666;">Dependencias Ausentes (${lib.missingDependencies.length}):</strong>
                  <ul class="list-items" style="margin-top: 5px;">
                    ${lib.missingDependencies.map(dep => `<li>${dep}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${!lib.hasIssues ? '<p style="margin: 10px 0 0 0; color: #4caf50; font-style: italic;">Nenhum problema encontrado nesta biblioteca.</p>' : ''}
            </div>
          `).join('')}

          ${depcheck.output ? `
            <details class="output-section" style="margin-top: 20px;">
              <summary>Ver Saida Completa de Todas as Bibliotecas</summary>
              <pre>${this.escapeHtml(depcheck.output.substring(0, 3000))}${depcheck.output.length > 3000 ? '...' : ''}</pre>
            </details>
          ` : ''}
        </div>
      </div>
    `;
  }

  generateTestsSection() {
    const tests = this.results.metrics.tests;
    if (!tests) return '';

    return `
      <div class="metric-section">
        <div class="metric-header">
          <h2>Testes Unitarios</h2>
          <span class="status-badge ${tests.success ? 'status-success' : 'status-error'}">
            ${tests.success ? 'Passou' : 'Falhou'}
          </span>
        </div>
        <div class="metric-body">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="value">${tests.data.total}</div>
              <div class="label">Total de Testes</div>
            </div>
            <div class="stat-card">
              <div class="value">${tests.data.passed}</div>
              <div class="label">Passaram</div>
            </div>
            <div class="stat-card">
              <div class="value">${tests.data.failed}</div>
              <div class="label">Falharam</div>
            </div>
            <div class="stat-card">
              <div class="value">${tests.data.skipped}</div>
              <div class="label">Pulados</div>
            </div>
          </div>
          ${tests.output ? `
            <details class="output-section">
              <summary>Ver Saida dos Testes</summary>
              <pre>${this.escapeHtml(tests.output.substring(0, 2000))}${tests.output.length > 2000 ? '...' : ''}</pre>
            </details>
          ` : ''}
        </div>
      </div>
    `;
  }

  generateLintSection() {
    const lint = this.results.metrics.lint;
    if (!lint) return '';

    return `
      <div class="metric-section">
        <div class="metric-header">
          <h2>Lint</h2>
          <span class="status-badge ${lint.success ? 'status-success' : 'status-error'}">
            ${lint.success ? 'Passou' : 'Problemas Encontrados'}
          </span>
        </div>
        <div class="metric-body">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="value">${lint.data.files}</div>
              <div class="label">Arquivos Verificados</div>
            </div>
            <div class="stat-card">
              <div class="value">${lint.data.errors}</div>
              <div class="label">Erros</div>
            </div>
            <div class="stat-card">
              <div class="value">${lint.data.warnings}</div>
              <div class="label">Avisos</div>
            </div>
          </div>
          ${lint.output ? `
            <details class="output-section">
              <summary>Ver Saida do Lint</summary>
              <pre>${this.escapeHtml(lint.output.substring(0, 2000))}${lint.output.length > 2000 ? '...' : ''}</pre>
            </details>
          ` : ''}
        </div>
      </div>
    `;
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  sanitizeBranchName(branchName) {
    return branchName.replace(/[^a-zA-Z0-9-_]/g, '-');
  }

  saveHTML(html) {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedBranch = this.sanitizeBranchName(this.results.branch);
    const filename = `metrics-report-${sanitizedBranch}-${timestamp}.html`;
    const filepath = path.join(this.outputDir, filename);

    fs.writeFileSync(filepath, html, 'utf-8');
    this.log(`Relatorio salvo em: ${filepath}`);

    const latestPath = path.join(this.outputDir, 'latest.html');
    fs.writeFileSync(latestPath, html, 'utf-8');
    this.log(`Ultimo relatorio salvo em: ${latestPath}`);

    return filepath;
  }

  async run() {
    console.log('\n===========================================');
    console.log('     COLETA DE METRICAS INICIADA');
    console.log('===========================================\n');

    const buildSuccess = await this.runBuild();

    if (buildSuccess) {
      await this.runSizeLimit();
      await this.runBundlesize();
    } else {
      this.log('Build falhou. Pulando verificacoes de tamanho e bundle.');
    }

    await this.runDepcheck();
    await this.runTests();
    await this.runLint();

    console.log('\n===========================================');
    console.log('     GERANDO RELATORIO HTML');
    console.log('===========================================\n');

    const html = this.generateHTML();
    const filepath = this.saveHTML(html);

    console.log('\n===========================================');
    console.log('     COLETA DE METRICAS CONCLUIDA');
    console.log('===========================================\n');

    const totalMetrics = Object.keys(this.results.metrics).length;
    const successfulMetrics = Object.values(this.results.metrics).filter(m => m.success).length;

    console.log(`Total de metricas executadas: ${totalMetrics}`);
    console.log(`Sucesso: ${successfulMetrics}`);
    console.log(`Falhas: ${totalMetrics - successfulMetrics}`);
    console.log(`\nRelatorio disponivel em: ${filepath}\n`);

    return true;
  }
}

if (require.main === module) {
  const runner = new MetricsRunner();
  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = MetricsRunner;
