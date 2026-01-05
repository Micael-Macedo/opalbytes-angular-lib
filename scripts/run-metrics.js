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
    console.log(`[Metrics] ${message}`);
  }

  logError(message, error) {
    console.error(`[Metrics Error] ${message}`);
    if (error) {
      console.error(error);
    }
  }

  executeCommand(command, description) {
    this.log(`Running: ${description}...`);
    try {
      const output = execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      this.log(`Completed: ${description}`);
      return { success: true, output };
    } catch (error) {
      this.logError(`Failed: ${description}`, error.message);
      return { success: false, output: error.stdout || '', error: error.message };
    }
  }

  async runBuild() {
    this.log('Building all packages...');
    const result = this.executeCommand('npm run build:all', 'Build all packages');
    this.results.metrics.build = {
      success: result.success,
      output: result.output
    };
    return result.success;
  }

  async runSizeLimit() {
    this.log('Running size-limit...');
    const result = this.executeCommand('npm run size', 'Size limit check');

    const sizeData = [];
    try {
      const configPath = path.join(process.cwd(), '.size-limit.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      const lines = result.output.split('\n');
      config.forEach((item, index) => {
        const matchingLine = lines.find(line => line.includes(item.name));
        if (matchingLine) {
          const sizeMatch = matchingLine.match(/(\d+\.?\d*\s*[KMG]?B)/);
          sizeData.push({
            name: item.name,
            limit: item.limit,
            actual: sizeMatch ? sizeMatch[1] : 'N/A',
            passed: result.success
          });
        }
      });
    } catch (error) {
      this.logError('Error parsing size-limit output', error.message);
    }

    this.results.metrics.sizeLimit = {
      success: result.success,
      data: sizeData,
      output: result.output
    };
  }

  async runBundlesize() {
    this.log('Running bundlesize...');
    const result = this.executeCommand('npm run bundlesize', 'Bundlesize check');

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
      this.logError('Error parsing bundlesize output', error.message);
    }

    this.results.metrics.bundlesize = {
      success: result.success,
      data: bundlesizeData,
      output: result.output
    };
  }

  async runDepcheck() {
    this.log('Running depcheck...');
    const result = this.executeCommand('npm run deps:check', 'Dependency check');

    let depcheckData = {
      hasIssues: false,
      unusedDependencies: [],
      missingDependencies: []
    };

    try {
      const output = result.output || '';
      if (output.includes('Unused dependencies')) {
        depcheckData.hasIssues = true;
        const unusedMatch = output.match(/Unused dependencies[:\s]+([\s\S]*?)(?=\n\n|Missing|$)/);
        if (unusedMatch) {
          depcheckData.unusedDependencies = unusedMatch[1]
            .split('\n')
            .filter(line => line.trim().startsWith('*'))
            .map(line => line.trim().substring(1).trim());
        }
      }
      if (output.includes('Missing dependencies')) {
        depcheckData.hasIssues = true;
        const missingMatch = output.match(/Missing dependencies[:\s]+([\s\S]*?)(?=\n\n|Unused|$)/);
        if (missingMatch) {
          depcheckData.missingDependencies = missingMatch[1]
            .split('\n')
            .filter(line => line.trim().startsWith('*'))
            .map(line => line.trim().substring(1).trim());
        }
      }
    } catch (error) {
      this.logError('Error parsing depcheck output', error.message);
    }

    this.results.metrics.depcheck = {
      success: result.success,
      data: depcheckData,
      output: result.output
    };
  }

  async runTests() {
    this.log('Running tests...');
    const result = this.executeCommand('npm test', 'Unit tests');

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
      this.logError('Error parsing test output', error.message);
    }

    this.results.metrics.tests = {
      success: result.success,
      data: testData,
      output: result.output
    };
  }

  async runLint() {
    this.log('Running lint...');
    const result = this.executeCommand('npm run lint', 'Lint check');

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
      this.logError('Error parsing lint output', error.message);
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
    <title>Metrics Report - ${this.results.branch}</title>
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
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        }

        .output-section h3 {
            font-size: 1em;
            margin-bottom: 10px;
            color: #555;
        }

        .output-section pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 6px;
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
            <h1>Metrics Report</h1>
            <div class="meta">
                <div class="meta-item">
                    <strong>Branch:</strong> <span>${this.results.branch}</span>
                </div>
                <div class="meta-item">
                    <strong>Commit:</strong> <span>${this.results.commit}</span>
                </div>
                <div class="meta-item">
                    <strong>Date:</strong> <span>${new Date(this.results.timestamp).toLocaleString()}</span>
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
            <p>Generated at ${new Date(this.results.timestamp).toLocaleString()}</p>
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
        <h3>Total Metrics</h3>
        <div class="value">${totalMetrics}</div>
      </div>
      <div class="summary-card">
        <h3>Successful</h3>
        <div class="value">${successfulMetrics}</div>
      </div>
      <div class="summary-card">
        <h3>Failed</h3>
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
            ${build.success ? 'Success' : 'Failed'}
          </span>
        </div>
        <div class="metric-body">
          <p>${build.success ? 'All packages built successfully.' : 'Build failed. See output below.'}</p>
          ${build.output ? `
            <div class="output-section">
              <h3>Build Output</h3>
              <pre>${this.escapeHtml(build.output.substring(0, 2000))}${build.output.length > 2000 ? '...' : ''}</pre>
            </div>
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
          <h2>Size Limit</h2>
          <span class="status-badge ${sizeLimit.success ? 'status-success' : 'status-error'}">
            ${sizeLimit.success ? 'Passed' : 'Failed'}
          </span>
        </div>
        <div class="metric-body">
          ${sizeLimit.data && sizeLimit.data.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Limit</th>
                  <th>Actual Size</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${sizeLimit.data.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.limit}</td>
                    <td>${item.actual}</td>
                    <td><span class="status-badge ${item.passed ? 'status-success' : 'status-error'}">${item.passed ? 'OK' : 'Exceeded'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p>No size limit data available.</p>'}
          ${sizeLimit.output ? `
            <div class="output-section">
              <h3>Output</h3>
              <pre>${this.escapeHtml(sizeLimit.output.substring(0, 1500))}${sizeLimit.output.length > 1500 ? '...' : ''}</pre>
            </div>
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
          <h2>Bundle Size</h2>
          <span class="status-badge ${bundlesize.success ? 'status-success' : 'status-error'}">
            ${bundlesize.success ? 'Passed' : 'Failed'}
          </span>
        </div>
        <div class="metric-body">
          ${bundlesize.data && bundlesize.data.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th>Path</th>
                  <th>Max Size</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${bundlesize.data.map(item => `
                  <tr>
                    <td>${item.path}</td>
                    <td>${item.maxSize}</td>
                    <td><span class="status-badge ${item.passed ? 'status-success' : 'status-error'}">${item.passed ? 'OK' : 'Exceeded'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p>No bundle size data available.</p>'}
          ${bundlesize.output ? `
            <div class="output-section">
              <h3>Output</h3>
              <pre>${this.escapeHtml(bundlesize.output.substring(0, 1500))}${bundlesize.output.length > 1500 ? '...' : ''}</pre>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  generateDepcheckSection() {
    const depcheck = this.results.metrics.depcheck;
    if (!depcheck) return '';

    return `
      <div class="metric-section">
        <div class="metric-header">
          <h2>Dependency Check</h2>
          <span class="status-badge ${!depcheck.data.hasIssues ? 'status-success' : 'status-error'}">
            ${!depcheck.data.hasIssues ? 'Clean' : 'Issues Found'}
          </span>
        </div>
        <div class="metric-body">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="value">${depcheck.data.unusedDependencies.length}</div>
              <div class="label">Unused Dependencies</div>
            </div>
            <div class="stat-card">
              <div class="value">${depcheck.data.missingDependencies.length}</div>
              <div class="label">Missing Dependencies</div>
            </div>
          </div>

          ${depcheck.data.unusedDependencies.length > 0 ? `
            <div class="output-section">
              <h3>Unused Dependencies</h3>
              <ul class="list-items">
                ${depcheck.data.unusedDependencies.map(dep => `<li>${dep}</li>`).join('')}
              </ul>
            </div>
          ` : '<p class="no-items">No unused dependencies found.</p>'}

          ${depcheck.data.missingDependencies.length > 0 ? `
            <div class="output-section">
              <h3>Missing Dependencies</h3>
              <ul class="list-items">
                ${depcheck.data.missingDependencies.map(dep => `<li>${dep}</li>`).join('')}
              </ul>
            </div>
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
          <h2>Unit Tests</h2>
          <span class="status-badge ${tests.success ? 'status-success' : 'status-error'}">
            ${tests.success ? 'Passed' : 'Failed'}
          </span>
        </div>
        <div class="metric-body">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="value">${tests.data.total}</div>
              <div class="label">Total Tests</div>
            </div>
            <div class="stat-card">
              <div class="value">${tests.data.passed}</div>
              <div class="label">Passed</div>
            </div>
            <div class="stat-card">
              <div class="value">${tests.data.failed}</div>
              <div class="label">Failed</div>
            </div>
            <div class="stat-card">
              <div class="value">${tests.data.skipped}</div>
              <div class="label">Skipped</div>
            </div>
          </div>
          ${tests.output ? `
            <div class="output-section">
              <h3>Test Output</h3>
              <pre>${this.escapeHtml(tests.output.substring(0, 2000))}${tests.output.length > 2000 ? '...' : ''}</pre>
            </div>
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
            ${lint.success ? 'Passed' : 'Issues Found'}
          </span>
        </div>
        <div class="metric-body">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="value">${lint.data.files}</div>
              <div class="label">Files Checked</div>
            </div>
            <div class="stat-card">
              <div class="value">${lint.data.errors}</div>
              <div class="label">Errors</div>
            </div>
            <div class="stat-card">
              <div class="value">${lint.data.warnings}</div>
              <div class="label">Warnings</div>
            </div>
          </div>
          ${lint.output ? `
            <div class="output-section">
              <h3>Lint Output</h3>
              <pre>${this.escapeHtml(lint.output.substring(0, 2000))}${lint.output.length > 2000 ? '...' : ''}</pre>
            </div>
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
    this.log(`Report saved to: ${filepath}`);

    const latestPath = path.join(this.outputDir, 'latest.html');
    fs.writeFileSync(latestPath, html, 'utf-8');
    this.log(`Latest report saved to: ${latestPath}`);

    return filepath;
  }

  async run() {
    console.log('\n===========================================');
    console.log('     METRICS COLLECTION STARTED');
    console.log('===========================================\n');

    const buildSuccess = await this.runBuild();

    if (buildSuccess) {
      await this.runSizeLimit();
      await this.runBundlesize();
    } else {
      this.log('Build failed. Skipping size and bundle checks.');
    }

    await this.runDepcheck();
    await this.runTests();
    await this.runLint();

    console.log('\n===========================================');
    console.log('     GENERATING HTML REPORT');
    console.log('===========================================\n');

    const html = this.generateHTML();
    const filepath = this.saveHTML(html);

    console.log('\n===========================================');
    console.log('     METRICS COLLECTION COMPLETED');
    console.log('===========================================\n');

    const totalMetrics = Object.keys(this.results.metrics).length;
    const successfulMetrics = Object.values(this.results.metrics).filter(m => m.success).length;

    console.log(`Total metrics run: ${totalMetrics}`);
    console.log(`Successful: ${successfulMetrics}`);
    console.log(`Failed: ${totalMetrics - successfulMetrics}`);
    console.log(`\nReport available at: ${filepath}\n`);

    return true;
  }
}

if (require.main === module) {
  const runner = new MetricsRunner();
  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = MetricsRunner;
