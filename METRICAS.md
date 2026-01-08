# Sistema de Metricas Automatizado

Este documento descreve o sistema automatizado de coleta e publicacao de metricas implementado no projeto.

## Visao Geral

O sistema de metricas coleta automaticamente informacoes sobre:
- **Build**: Status da construcao de todos os pacotes
- **Size Limit**: Verificacao de tamanho dos pacotes
- **Bundle Size**: Tamanho dos bundles gerados
- **Dependency Check**: Analise de dependencias nao utilizadas ou ausentes
- **Testes**: Resultados dos testes unitarios
- **Lint**: Verificacao de qualidade de codigo

## Como Funciona

### 1. Pre-Push Hook (Local)

Ao fazer push de qualquer branch:
1. Os testes sao executados
2. Se os testes passarem, as metricas sao coletadas
3. Um relatorio HTML e gerado em `metrics-reports/`

**Localizacao**: `.husky/pre-push`

### 2. GitHub Actions (CI/CD)

Ao fazer push para `main`:
1. O workflow verifica quais bibliotecas foram alteradas
2. Para cada biblioteca alterada:
   - Executa build e testes
   - **Gera relatorio de metricas**
   - **Adiciona metricas ao CHANGELOG.md**
   - Executa o semantic-release
   - **Publica o relatorio como artifact do GitHub**

**Localizacao**: `.github/workflows/release.yml`

### 3. Relatorios Gerados

Os relatorios sao salvos em duas formas:

#### Local (metrics-reports/)
- `latest.html`: Sempre o relatorio mais recente
- `metrics-report-[branch]-[timestamp].html`: Relatorios especificos

#### GitHub
- **Artifacts**: Cada release gera um artifact no GitHub Actions com o relatorio HTML
- **CHANGELOG.md**: Um resumo das metricas e inserido no changelog de cada release

## Onde Encontrar os Relatorios

### 1. No Repositorio Local
```bash
./metrics-reports/latest.html
```

### 2. No GitHub Actions
1. Acesse: Actions > Publish Libs Sequentially
2. Clique no workflow da release
3. Role ate o final e veja "Artifacts"
4. Baixe: `metrics-report-[library]`

### 3. No CHANGELOG.md
Cada release inclui uma secao com:
- Data e hora da coleta
- Branch e commit
- Resumo das metricas (total, sucessos, falhas)
- Link para o relatorio HTML completo

Exemplo:
```markdown
## 📊 Relatorio de Metricas

**Data**: 05/01/2026, 09:32:13
**Branch**: main
**Commit**: abc1234

### Resumo
- Total de metricas: 6
- Sucessos: 5
- Falhas: 1

[📈 Ver Relatorio Completo (HTML)](./metrics-reports/latest.html)
```

## Comparacao Entre Versoes

Para comparar o crescimento entre versoes:

1. **Via CHANGELOG.md**:
   - Cada release tem sua secao de metricas
   - Compare os numeros entre diferentes releases
   - Exemplo: v1.9.0 vs v1.10.0

2. **Via Artifacts do GitHub**:
   - Baixe relatorios de releases anteriores
   - Compare visualmente os HTMLs
   - Use ferramentas de diff para comparar

3. **Historico de Relatorios**:
   - O repositorio versiona o `metrics-reports/latest.html`
   - Use `git log` para ver historico de mudancas

## Scripts Disponiveis

### `npm run metrics:report`
Gera um relatorio completo de metricas.

**O que faz**:
- Executa build de todos os pacotes
- Verifica tamanhos (size-limit e bundlesize)
- Analisa dependencias
- Executa testes
- Executa lint
- Gera HTML com todos os resultados

**Quando usar**: Para gerar relatorios manualmente

### `npm run metrics:changelog`
Adiciona um resumo das metricas ao CHANGELOG.md.

**O que faz**:
- Le o relatorio HTML mais recente
- Extrai estatisticas principais
- Insere no CHANGELOG.md

**Quando usar**: Usado automaticamente pelo workflow, mas pode ser executado manualmente

## Estrutura dos Arquivos

```
opalbytes-angular-lib/
├── scripts/
│   ├── run-metrics.js           # Coleta metricas e gera HTML
│   └── add-metrics-to-changelog.js  # Adiciona metricas ao changelog
│
├── metrics-reports/
│   ├── latest.html              # Relatorio mais recente
│   └── metrics-report-*.html    # Relatorios historicos
│
├── .husky/
│   └── pre-push                 # Hook que executa metricas no push
│
├── .github/workflows/
│   └── release.yml              # Workflow que publica metricas
│
├── .releaserc.js                # Config do semantic-release (inclui metricas)
└── projects/*/
    └── .releaserc.js            # Configs por biblioteca
```

## Configuracoes

### Size Limit (`.size-limit.json`)
```json
{
  "name": "ngx-opalbytes-utils",
  "limit": "150 KB"
}
```

### Bundlesize (`bundlesize.config.json`)
```json
{
  "files": [{
    "path": "dist/ngx-opalbytes-utils/fesm2022/*.mjs",
    "maxSize": "150 KB"
  }]
}
```

## Notas Importantes

- **Todas as mensagens estao em PT-BR**
- **O relatorio HTML nao contem emojis**
- **Relatorios sao versionados no Git** (exceto historicos, que estao no .gitignore)
- **Cada release no GitHub tem seu artifact com o relatorio**
- **O CHANGELOG.md sempre tem o resumo da ultima coleta de metricas**

## Exemplo de Uso

### Desenvolvimento Local
```bash
# Fazer commit
git add .
git commit -m "feat(components): adicionar novo componente"

# Push (automaticamente executa metricas)
git push origin feature/novo-componente

# Ver relatorio local
open metrics-reports/latest.html
```

### Release no GitHub
1. PR e mergeado para `main`
2. Workflow executa automaticamente
3. Metricas sao geradas e publicadas
4. CHANGELOG.md e atualizado
5. Artifact e disponibilizado
6. Semantic-release cria tag e release

### Comparar Versoes
```bash
# Ver changelog
cat CHANGELOG.md

# Ou acessar no GitHub
https://github.com/[seu-repo]/blob/main/CHANGELOG.md
```

## Troubleshooting

### Relatorio nao foi gerado
- Verifique se os testes passaram
- Veja os logs do pre-push hook
- Execute manualmente: `npm run metrics:report`

### Metricas no workflow falharam
- Acesse Actions > workflow > logs
- Metricas tem `continue-on-error: true`
- O workflow nao falha se metricas falharem

### CHANGELOG nao tem metricas
- Verifique se `metrics-reports/latest.html` existe
- Execute manualmente: `npm run metrics:changelog`
- Verifique se o workflow executou o step "Add Metrics to Changelog"
