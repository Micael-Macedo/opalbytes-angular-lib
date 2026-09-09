# Como Contribuir

Agradecemos seu interesse em contribuir com o **Opalbytes Angular Libs**! Este é um monorepo que centraliza bibliotecas Angular reutilizáveis. Para garantir qualidade e consistência, pedimos que siga as diretrizes abaixo.

## Sumário

- [Introdução](#introdução)
- [Perguntas ou Problemas](#perguntas-ou-problemas)
- [Encontrou um Bug?](#encontrou-um-bug)
- [Falta uma Feature?](#falta-um-feature)
- [Diretrizes de Submissão](#diretrizes-de-submissão)
  - [Quality Contribution](#quality-contribution)
  - [Enviando um Pull Request](#enviando-um-pull-request)
  - [Revisando um Pull Request](#revisando-um-pull-request)
- [Convenção de Branches](#convenção-de-branches)
- [Regras de Codificação](#regras-de-codificação)
- [Guia de Mensagens de Commit](#guia-de-mensagens-de-commit)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
  - [Compilação](#compilação)
  - [Testes](#testes)
  - [Lint](#lint)
  - [Medidas e Qualidade](#medidas-e-qualidade)
- [Adicionando Funcionalidades a uma Biblioteca](#adicionando-funcionalidades-a-uma-biblioteca)
- [Adicionando uma Nova Biblioteca](#adicionando-uma-nova-biblioteca)

---

## Introdução

O **Opalbytes Angular Libs** é um monorepo Angular 21 com **11 bibliotecas distribuíveis** sob o diretório `projects/`:

| Biblioteca | Descrição |
|---|---|
| `ngx-opalbytes-core` | Serviços essenciais, interceptors, guards e modelos |
| `ngx-opalbytes-components` | Componentes de UI reutilizáveis |
| `ngx-opalbytes-directives` | Diretivas de atributo e estruturais |
| `ngx-opalbytes-services` | Serviços reutilizáveis |
| `ngx-opalbytes-shared` | Módulos, pipes e componentes compartilhados |
| `ngx-opalbytes-utils` | Funções utilitárias |
| `ngx-opalbytes-performance` | Monitoramento de performance em runtime |
| `ngx-opalbytes-feature-pdf` | Geração de PDF |
| `ngx-opalbytes-video` | Player de vídeo |
| `ngx-opalbytes-chart` | Gráficos |
| `ngx-opalbytes-websocket` | Comunicação via WebSocket |

### Independência das Bibliotecas

Cada biblioteca `ngx-opalbytes-*` é **autocontida**: ela **NÃO** pode importar de outra lib opalbytes e **NÃO** pode listar qualquer pacote `ngx-opalbytes-*` em suas `peerDependencies`/`dependencies`.

Se uma funcionalidade precisa de peças de múltiplos escopos (ex: um componente que precisa de seu próprio serviço), co-locate-as **dentro dessa mesma lib**. Se tiver um propósito distinto, crie uma **nova biblioteca dedicada**.

---

## Perguntas ou Problemas

Para dúvidas gerais ou problemas de suporte, utilize os canais internos de comunicação da equipe. Não abra issues para perguntas gerais — o repositório de issues é dedicado a bugs e solicitações de features.

---

## Encontrou um Bug?

Se encontrou um bug no código fonte, pode ajudar reportando-o. Antes de abrir um issue, verifique se já existe um issue similar aberto.

Ao reportar um bug, fornreça uma **reprodução mínima** que permita confirmar o problema. Uma reprodução mínima economiza tempo dos mantenedores e ajuda a resolver o bug mais rapidamente.

> **Nota**: Não é possível investigar/corrigir bugs sem uma reprodução mínima. Issues sem informações suficientes serão fechados.

---

## Falta uma Feature?

Você pode _solicitar_ uma nova feature abrindo um issue. Se deseja _implementar_ uma nova feature, considere o tamanho da mudança:

- **Feature Grande**: Abra um issue primeiro descrevendo a proposta para discussão. Isso ajuda a coordenar esforços e evitar duplicação de trabalho.
- **Features Pequenas**: Podem ser implementadas diretamente em um Pull Request.

---

## Diretrizes de Submissão

### Quality Contribution

Valorizamos contribuições da comunidade. Todo Pull Request é revisado por uma pessoa da equipe, o que leva tempo e esforço. Existem expectativas mínimas para contribuições:

1. **Busque esforços existentes** no [GitHub](https://github.com/renova-devs/opalbytes-angular-lib/pulls) — não duplique trabalho já em andamento.
2. **Descreva claramente** o problema que está corrigindo ou a feature que deseja adicionar.
3. **Discuta o design** em um issue antes de implementar. Pull Requests não são o lugar para design work.
4. Idealmente, o PR deve estar vinculado a um issue, mas isso não é obrigatório.
5. A mudança deve melhorar a qualidade do código ou impactar/melhorar uma funcionalidade.
6. A mudança deve ser bem testada.

Pull Requests que não atenderem a essas expectativas podem ser fechados.

### Enviando um Pull Request

Antes de enviar seu Pull Request, siga estas diretrizes:

1. Faça um [Fork](https://docs.github.com/pt/github/getting-started-with-github/fork-a-repo) do repositório.

2. Crie uma nova branch a partir da `main` seguindo a [convenção de branches](#convenção-de-branches):
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature(components)/minha-nova-feature
   ```

3. Crie sua alteração, **incluindo testes unitários adequados**.

4. Siga as [Regras de Codificação](#regras-de-codificação).

5. Execute os testes e o lint para garantir que tudo está funcionando:
   ```bash
   npm run lint
   npm test
   ```

6. Faça o commit seguindo as [convenções de commit](#guia-de-mensagens-de-commit):
   ```bash
   git commit --all
   ```

7. Envie sua branch para o GitHub:
   ```bash
   git push origin feature(components)/minha-nova-feature
   ```

8. No GitHub, abra um Pull Request para a branch `main`.

### Revisando um Pull Request

Se solicitarmos alterações via code review:

1. Faça as atualizações necessárias no código.

2. Execute novamente os testes para garantir que continuam passando.

3. Crie um commit de fixup e envie para o GitHub:
   ```bash
   git commit --all --fixup HEAD
   git push
   ```

#### Atualizando a mensagem do commit

Se um revisor sugerir alterações na mensagem do commit:

1. Verifique sua branch:
   ```bash
   git checkout feature(components)/minha-feature
   ```

2. Altere o último commit e modifique a mensagem:
   ```bash
   git commit --amend
   ```

3. Envie para o GitHub:
   ```bash
   git push --force-with-lease
   ```

#### Após seu Pull Request ser mesclado

Após o merge, você pode deletar sua branch:

```bash
git push origin --delete feature(components)/minha-feature
git checkout main -f
git branch -D feature(components)/minha-feature
git pull --ff upstream main
```

---

## Convenção de Branches

O nome da branch **define qual biblioteca será publicada** e qual changelog receberá os commits do PR. O formato é:

```
<tipo>(<escopo>)/descrição-breve
```

### Tipos recomendados

| Tipo | Descrição |
|---|---|
| `feature` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `refactor` | Refatoração de código |
| `test` | Adição ou correção de testes |
| `chore` | Tarefas de manutenção |

### Escopos válidos

| Escopo | Biblioteca publicada |
|---|---|
| `components` | `ngx-opalbytes-components` |
| `core` | `ngx-opalbytes-core` |
| `directives` | `ngx-opalbytes-directives` |
| `services` | `ngx-opalbytes-services` |
| `shared` | `ngx-opalbytes-shared` |
| `performance` | `ngx-opalbytes-performance` |
| `utils` | `ngx-opalbytes-utils` |
| `pdf` | `ngx-opalbytes-feature-pdf` |
| `video` | `ngx-opalbytes-video` |
| `chart` | `ngx-opalbytes-chart` |
| `websocket` | `ngx-opalbytes-websocket` |
| `libs` | Root (`libs`) |

### Exemplos

```bash
# Nova funcionalidade na biblioteca de diretivas
git checkout -b feature(directives)/add-currency-mask

# Correção de bug na biblioteca de componentes
git checkout -b fix(components)/correct-button-alignment

# Documentação do projeto raiz
git checkout -b docs(libs)/update-readme

# Refatoração na lib de services
git checkout -b refactor(services)/improve-websocket-retry
```

---

## Regras de Codificação

Para garantir consistência, siga estas regras:

### Prefixo `cao`

Todo componente e diretiva deve usar o prefixo `cao`:

- **Componentes**: tipo elemento, prefixo `cao`, kebab-case
  ```html
  <cao-base-button>...</cao-base-button>
  <cao-alert>...</cao-alert>
  ```

- **Diretivas**: tipo atributo, prefixo `cao`, camelCase
  ```html
  <input caoMask="000.000.000-00">
  ```

### Interfaces prefixadas com `ICao`

Interfaces devem ser prefixadas com `ICao`:

```typescript
export interface ICaoAlertConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
```

Tipos, enums e classes usam PascalCase. Propriedades e métodos usam camelCase.

### Componentes Standalone

Componentes devem ser **standalone** (sem NgModules). Utilize `imports` diretamente no decorator `@Component`:

```typescript
@Component({
  selector: 'cao-base-button',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './base-button.component.html',
})
export class CaoBaseButtonComponent { }
```

### Barrel Exports

Toda biblioteca e subpasta deve expor seus módulos através de um arquivo `index.ts` barrel. Consumidores devem importar do barrel, não de caminhos profundos:

```typescript
// ✅ Correto
import { CaoBaseButtonComponent } from 'ngx-opalbytes-components';

// ❌ Incorreto
import { CaoBaseButtonComponent } from 'ngx-opalbytes-components/src/lib/shared/components/base-button/base-button.component';
```

### Peer Dependencies

Os seguintes pacotes são **peer dependencies** (não bundled). Projetos consumidores devem instalá-los:

- `@angular/material`
- `ngx-mask`
- `@lucide/angular`
- `ngx-webstorage`

---

## Guia de Mensagens de Commit

Este projeto utiliza o padrão **Conventional Commits**, validado pelo commitlint. O escopo na mensagem do commit **não é obrigatório** — ele fica no nome da branch.

### Formato

```
<tipo>: <descrição>
```

### Exemplos

```bash
feat: add componente kpi
fix: correção validação de CPF
docs: atualizar README
refactor: melhorar lógica de paginação
test: adicionar testes para base-table
chore: atualizar dependências
```

### Tipos e impacto no versionamento

| Tipo | Release |
|---|---|
| `feat` | Minor |
| `fix` / `refactor` | Patch |
| `docs` / `chore` / `test` / `style` | Sem release |

### De onde vem o Escopo

O escopo que decide qual biblioteca é publicada está no **nome da branch** do Pull Request, não na mensagem do commit.

---

## Fluxo de Desenvolvimento

### Compilação

```bash
# Compilar todas as 8 libs principais
npm run build:all

# Compilar uma lib específica
npm run build:components
npm run build:directives
npm run build:core

# Compilar libs especiais individualmente
npm run build:video
npm run build:chart
npm run build:pdf

# Compilar components com CLI (obrigatório para components)
npm run build:components:cli

# Modo observação (watch)
ng build ngx-opalbytes-directives --watch
```

> **Importante**: Para publicar `ngx-opalbytes-components`, use **sempre** `build:components:cli` (não `build:components`). Ele injeta o binário `cao-comp` e copia os templates para o `dist/`.

### Testes

O projeto possui **dois runners de teste**:

- **`ng test`** (Angular builder): usado pelos scripts `test:<lib>` (`--watch=false`)
- **Vitest**: usado para coverage (`test:coverage*`, `test:perf`)

```bash
# Executar todos os testes
npm test

# Executar testes de uma lib específica
npm run test:components
npm run test:directives
npm run test:services

# Gerar relatório de coverage
npm run test:coverage

# Coverage de uma lib específica
npm run test:coverage:components
npm run test:coverage:utils
```

> **Nota**: `ngx-opalbytes-core` **NÃO** possui arquivos de teste nem architect de test. Não execute `test:core`.

### Lint

```bash
# Verificar lint
npm run lint

# Corrigir problemas automaticamente
npm run lint:fix
```

O lint verifica:
- Regras de nomenclatura (prefixo `cao`, interfaces `I`, PascalCase/camelCase)
- Regras de acessibilidade (A11y) em templates
- Import ordering
- `no-console` (apenas `warn`/`error` permitidos)
- Complexidade máxima, tamanho de arquivos e funções

### Medidas e Qualidade

```bash
# Executar pipeline completo de métricas (build → size-limit → bundlesize → depcheck → tests → lint)
npm run metrics:report

# Verificar tamanho dos bundles
npm run size
npm run bundlesize

# Verificar dependências não utilizadas
npm run deps:check

# Verificar atualizações disponíveis
npm run deps:update
```

---

## Adicionando Funcionalidades a uma Biblioteca

1. **Crie os arquivos** da nova funcionalidade (componente, diretiva, serviço, etc.) dentro da pasta `src/lib/` da biblioteca correspondente.

2. **Exponha sua funcionalidade** na API pública, adicionando a exportação no arquivo `public-api.ts` (ou no barrel `index.ts` intermediário).

3. **Adicione testes unitários** para garantir a cobertura da nova funcionalidade.

4. **Crie o commit** seguindo as regras de Conventional Commits. O escopo na mensagem do commit é livre — o que define a biblioteca é o nome da branch.

---

## Adicionando uma Nova Biblioteca

Para adicionar uma nova biblioteca ao monorepo (ex: `ngx-opalbytes-nova-lib`):

1. **Gere a nova biblioteca** com o Angular CLI:
   ```bash
   ng generate library ngx-opalbytes-nova-lib
   ```

2. **Atualize o `package.json`** na raiz. Adicione os scripts de build e test:
   ```json
   {
     "scripts": {
       "build:nova-lib": "ng build ngx-opalbytes-nova-lib",
       "test:nova-lib": "ng test ngx-opalbytes-nova-lib --watch=false"
     }
   }
   ```

3. **Crie o arquivo `.releaserc.js`** em `projects/ngx-opalbytes-nova-lib/`:
   ```javascript
   module.exports = {
     branches: ['main'],
     plugins: [
       ['@semantic-release/commit-analyzer', { analyzeCommits: 'conventional-commits' }],
       '@semantic-release/release-notes-generator',
       '@semantic-release/npm',
       '@semantic-release/github',
     ],
   };
   ```

4. **Atualize o Workflow de Release** (`.github/workflows/release.yml`):
   - Adicione o escopo da nova biblioteca à detecção de releases no job `check-commits`.
   - Adicione um item no `matrix` do job `publish-sequentially`.

5. **Atualize o `README.md`** e o `CONTRIBUTING.md`: Adicione o escopo da nova biblioteca à lista de escopos válidos.
