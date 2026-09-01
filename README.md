#  Tecnologias

*   **Angular**: Framework principal para a criação da biblioteca.
*   **TypeScript**: Linguagem base do projeto.
*   **Conventional Commits**: Padrão para mensagens de commit.
*   **Husky**: Ferramenta para executar scripts em hooks do Git.
*   **Commitlint**: Validador de mensagens de commit.
*   **Semantic Release**: Ferramenta para automação de versionamento e releases.

## Framework e Linguagens
|Tecnologia  |	Versão  |   Descrição  |
|------------|----------|-------------------------------------|
|   Angular	 |  ^21.0.0	|  Framework principal para desenvolvimento da biblioteca |
| TypeScript |	~5.9.2	| Linguagem base com tipagem estática |
|    RxJS	 |  ~7.8.0  | Biblioteca para programação reativa |

---

#  Opalbytes Angular Libs

Este é um monorepo que centraliza uma coleção de bibliotecas Angular reutilizáveis. O objetivo é fornecer um conjunto coeso e padronizado de componentes, diretivas, serviços e utilitários para acelerar o desenvolvimento de projetos.

O projeto está configurado com um fluxo de trabalho moderno, utilizando automação para testes, lint, versionamento e publicação, garantindo a qualidade e a consistência do código em todas as bibliotecas.

---

##  Começo Rápido

1.  **Instalar Dependências**
    ```bash
    npm install
    ```

2. Desenvolver a Biblioteca

### Compilação com Observação de Alterações
Para compilar a biblioteca e recompilá-la automaticamente a cada modificação, utilize o modo **watch**:

```bash
ng build ngx-opalbytes-directives --watch
```
ou
```bash
npm run watch
```

### Uso em Projeto Local (Desenvolvimento)
Para testar a biblioteca em um projeto local durante o desenvolvimento, siga estas opções:

#### **Opção 1: Usando `npm link` (Recomendado)**
1. No diretório da biblioteca:
   ```bash
   npm link
   ```
2. No diretório do projeto de destino:
   ```bash
   npm link ngx-opalbytes-directives
   ```

#### **Opção 2: Instalação Direta via Caminho Local**
Caso encontre problemas com `npm link`, instale diretamente pelo caminho da biblioteca compilada:
```bash
npm i "caminho-da-biblioteca/opalbytes-directive-components/dist/ngx-opalbytes-directives"
```

---

## 📂 Estrutura do Monorepo

Este é um monorepo Angular que gerencia múltiplas bibliotecas. Todas as bibliotecas residem no diretório `projects/`.

```
opalbytes-angular-lib/
├── projects/
│   ├── ngx-opalbytes-components/    # Biblioteca de componentes de UI
│   ├── ngx-opalbytes-core/   # Biblioteca central com serviços, guards e modelos
│   ├── ngx-opalbytes-directives/    # Biblioteca de diretivas de atributo e estruturais
│   ├── ngx-opalbytes-services/      # Biblioteca de serviços reutilizáveis
│   ├── ngx-opalbytes-feature-pdf/   # Biblioteca para geração de PDF
│   ├── ngx-opalbytes-shared/        # Módulos, pipes e componentes compartilhados
│   ├─── ngx-opalbytes-utils/         # Funções e utilitários
│   └── ngx-opalbytes-performance/   # Monitoramento de performance em runtime
│
├── .github/                         # Workflows de CI/CD (Release)
├── .husky/                          # Hooks do Git para validações
├── commitlint.config.js             # Regras para o formato dos commits
└── .releaserc.js                    # Configuração do semantic-release
```

---

##  Bibliotecas Disponíveis

### `ngx-opalbytes-core`

Biblioteca central que serve como base para as demais. Contém a lógica de negócio principal, serviços essenciais, interceptors, guards e modelos de dados.

- **`core`**: Módulo com a lógica central da aplicação.
  - **`services`**: Serviços essenciais como `AuthService`, `StorageService` e `HttpErrorHandlerService`.
  - **`interceptors`**: Interceptors para adicionar headers, tratar erros HTTP e gerenciar o cache.
  - **`guards`**: Guards de rota para proteger o acesso a determinadas áreas da aplicação.
  - **`models`**: Modelos de dados globais, como `User` e `HttpError`.

### `ngx-opalbytes-components`

Biblioteca de componentes de UI reutilizáveis e desacoplados, prontos para serem usados em qualquer projeto Angular.

| Componente          | Descrição                                             |
| ------------------- | ----------------------------------------------------- |
| `autocomplete`      | Campo de formulário com preenchimento automático.     |
| `base-alert`        | Alerta para exibir mensagens de sucesso, erro, etc.   |
| `base-button`       | Botão padrão com diferentes estilos.                  |
| `base-dialog`       | Janela de diálogo modal.                              |
| `base-table`        | Tabela de dados com ordenação, paginação e filtros.   |
| `base-time-range`   | Seletor de intervalo de tempo.                        |
| `drop-down`         | Menu suspenso (dropdown).                             |
| `footer`            | Rodapé padrão.                                        |
| `links-button`      | Botão que renderiza uma lista de links.               |
| `paginator`         | Controle de paginação para tabelas.                   |
| `time-picker`       | Seletor de horário.                                   |

### `ngx-opalbytes-directives`

Diretivas para adicionar comportamentos dinâmicos a elementos do DOM.

| Diretiva      | Descrição                                                   |
| ------------- | ----------------------------------------------------------- |
| `cpf-mask`    | Aplica uma máscara de CPF a um campo de input.              |
| `highlight`   | Realça o texto de um elemento com base em uma busca.        |
| `skeleton`    | Exibe um placeholder de carregamento (esqueleto).           |

### `ngx-opalbytes-feature-pdf`

Biblioteca para conversão de conteúdo HTML para documentos PDF. Utiliza `jspdf` e `html2canvas` para capturar elementos do DOM e gerar arquivos PDF, com suporte para múltiplas páginas, marcas d'água e customização de saída.

| Serviço/Utilitário | Descrição |
| --- | --- |
| `PdfExportService` | Orquestra o processo de exportação com estado reativo. |
| `HtmlToPdfConverter` | Utilitário de baixo nível para a conversão de HTML para PDF. |
| `SinglePageExportStrategy` | Estratégia de exportação para conteúdo de página única. |
| `MultiPageExportStrategy` | Estratégia de exportação para conteúdo de múltiplas páginas. |

### `ngx-opalbytes-services`

Serviços reutilizáveis com lógica de negócio específica e isolada.

| Serviço             | Descrição                                                   |
| ------------------- | ----------------------------------------------------------- |
| `date-pipe.service` | Formata datas de acordo com a localidade.                   |
| `installer.service` | Gerencia a instalação de um PWA.                            |
| `websocket.service` | Facilita a comunicação em tempo real via WebSockets.        |

### `ngx-opalbytes-shared`

Biblioteca que agrupa módulos compartilhados, incluindo componentes de UI genéricos, diretivas, enums, interfaces, pipes, resolvers e validadores, para promover a reutilização e padronização em projetos Angular.

| Módulo | Descrição |
| --- | --- |
| `components` | Componentes de UI genéricos e reutilizáveis. |
| `constants` | Constantes globais da aplicação. |
| `directives` | Diretivas de atributo e estruturais (ex: máscaras, validações). |
| `enums` | Enumerações para tipos e status comuns. |
| `interfaces` | Interfaces de modelos de dados e configurações compartilhadas. |
| `layouts` | Estruturas de layout reutilizáveis. |
| `pipes` | Pipes para formatação de dados (ex: CEP, CPF/CNPJ, datas). |
| `resolvers` | Resolvers para pré-carregamento de dados de rotas. |
| `validators` | Funções de validação para formulários reativos. |

### `ngx-opalbytes-utils`

Funções utilitárias e helpers para tarefas comuns.

| Utilitário | Descrição |
| --- | --- |
| `NgxOpalbytesUtils` | Coleção de funções utilitárias (sem implementação no momento). |

### `ngx-opalbytes-performance`

Biblioteca para monitoramento de performance em runtime.

| Serviço/Recurso                | Descrição                                                   |
| ------------------------------ | ----------------------------------------------------------- |
| `PerformanceMetricsService`    | Serviço central para métricas de performance               |
| `WebVitalsService`             | Monitoramento de Web Vitals (LCP, FID, CLS, etc.)          |
| `PerformanceObserverService`   | Detecção de long tasks e eventos de performance            |
| `MemoryMetricsService`         | Monitoramento de uso de memória                            |

Veja a [documentação completa](./projects/ngx-opalbytes-performance/README.md).

---

##  Storybook (ngx-opalbytes-components)

Os componentes da lib `ngx-opalbytes-components` possuem stories
(`*.stories.ts`) co-localizados com seus arquivos de origem, mostrando
exemplos **com e sem ícones** (Lucide, imagens e Material Icons).

### Abrir o Storybook (desenvolvimento)

```bash
npm run storybook
```

Abre o Storybook na porta **6006** (config em
`projects/ngx-opalbytes-components/.storybook/`).

### Build estático do Storybook

```bash
npm run build-storybook
```

Gera o build estático em `dist/storybook/ngx-opalbytes-components`.

### Storybook em projetos externos (`cao-comp storybook`)

O CLI `cao-comp` possui o subcomando `storybook` que gera o **setup mínimo**
do Storybook (`.storybook/`, exemplo de story e guia `STORYBOOK-SETUP.md`)
em qualquer projeto, para visualizar os componentes copiados:

```bash
# 1. Copie um componente para o projeto externo
cao-comp base-button ./meu-projeto/src/app/components

# 2. Gere o setup do Storybook no projeto externo
cao-comp storybook ./meu-projeto
```

Siga o `STORYBOOK-SETUP.md` gerado para instalar as dependências
(`storybook`, `@storybook/angular-vite`, addons) e rodar com
`npx storybook dev -c .storybook -p 6006`.

---

##  Performance Monitoring

Este monorepo inclui ferramentas integradas de monitoramento de performance:

### Bundle Size Monitoring
- **size-limit**: Monitora o tamanho dos bundles de cada biblioteca
- **bundlesize**: Garante que os bundles não excedam limites definidos

```bash
# Verificar tamanho de todas as bibliotecas
npm run size

# Verificar com bundlesize
npm run bundlesize
```

### Test Coverage
- Configurado com Vitest e @vitest/coverage-v8
- Thresholds: 80% para statements, branches, functions e lines
- Modo: reportar (não bloqueia builds)

```bash
# Gerar relatório de coverage para todas as libs
npm run test:coverage

# Coverage de uma lib específica
npm run test:coverage:utils
npm run test:coverage:components
npm run test:coverage:performance
```

### Dependency Analysis
- **depcheck**: Identifica dependências não utilizadas
- **npm-check-updates**: Verifica atualizações disponíveis

```bash
# Verificar dependências não usadas
npm run deps:check

# Verificar atualizações disponíveis
npm run deps:update

# Atualizar interativamente
npm run deps:update:interactive
```

---

## 🌿 Estratégia de Branches

### Convenção de Nomenclatura
Usamos uma convenção simples e eficiente para nomear branches. **O escopo no nome da branch é obrigatório** e define qual biblioteca será publicada e qual changelog receberá os commits do PR:

```
<tipo>(<escopo>)/descricao-breve
```

**Tipos recomendados:**
- `feat/` ou `feature/` - Nova funcionalidade
- `fix/` - Correção de bug
- `docs/` - Documentação
- `refactor/` - Refatoração de código
- `test/` - Testes
- `chore/` - Tarefas de manutenção

**Exemplos corretos:**
```bash
#  Branches válidas
git checkout -b feature(directives)/add-input-mask-directive
git checkout -b fix(components)/correcao-validacao-formato
git checkout -b feature(chart)/add-lib-graficos
```

### Fluxo de Trabalho
1. Crie uma branch a partir da `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b tipo(escopo)/nome-da-feature
   ```
2. Desenvolva e faça commits seguindo as regras de Conventional Commits (o escopo **não** é obrigatório na mensagem do commit).
3. Abra um Pull Request para revisão. Ao ser mergeado, o workflow de release publica apenas a biblioteca cujo escopo está no nome da branch.

---

##  Como Contribuir

### Adicionando Funcionalidades a uma Biblioteca Existente

1.  **Crie os arquivos** da sua nova funcionalidade (componente, diretiva, serviço, etc.) dentro da pasta `src/lib/` da biblioteca correspondente.
2.  **Exponha sua funcionalidade** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `public-api.ts` da biblioteca.
3.  **Adicione ou atualize os testes unitários** para garantir a cobertura da sua nova funcionalidade.
4.  **Crie seu commit** seguindo as regras de Conventional Commits descritas na próxima seção (o escopo é livre na mensagem do commit).

### Adicionando uma Nova Biblioteca

Para adicionar uma nova biblioteca ao monorepo (ex: `ngx-opalbytes-nova-lib`), siga estes passos:

1.  **Gere a nova biblioteca** com o Angular CLI:
    ```bash
    ng generate library ngx-opalbytes-nova-lib
    ```

2.  **Atualize o `package.json`** na raiz do projeto. Adicione os scripts de `build` e `test` para a sua nova biblioteca, seguindo o padrão existente:
    ```json
    "scripts": {
      // ... outros scripts
      "build:nova-lib": "ng build ngx-opalbytes-nova-lib",
      "test:nova-lib": "ng test ngx-opalbytes-nova-lib --watch=false",
      // ...
    },
    ```

3.  **Atualize o Workflow de Release (`.github/workflows/release.yml`)**:
    *   Adicione o escopo da nova biblioteca à detecção de releases (o job `check-commits` usa regex sobre o nome das branches dos merge PRs).
    *   Adicione um item no `matrix` com as condições de build, teste e release (ex: `cd projects/ngx-opalbytes-nova-lib && npx semantic-release`).
    *   Crie o arquivo `projects/ngx-opalbytes-nova-lib/.releaserc.js` apontando para `scripts/release-branch-filter.cjs` com `libraryScope: "nova-lib"`.

4.  **Atualize este `README.md`**: Adicione o escopo da sua nova biblioteca (`nova-lib`) à lista de escopos válidos na seção de "Regras de Commit".

---

## 📝 Regras de Commit

Este projeto utiliza o padrão **Conventional Commits**, validado automaticamente pelo commitlint antes de cada commit (`@commitlint/config-conventional`). **O escopo na mensagem do commit não é obrigatório** — ele fica apenas no nome da branch, que é o que define a biblioteca a ser publicada.

O formato é:
```
<tipo>: <descrição>
```
(Ex.: `feat: add componente kpi`, `fix: correcao validacao img source`)

### De onde vem o Escopo

O escopo (que decide qual biblioteca é publicada) está no **nome da branch** do Pull Request:

| Prefixo da branch | Biblioteca publicada |
|---|---|
| `feature(components)/...` ou `fix(components)/...` | `ngx-opalbytes-components` |
| `feature(core)/...` | `ngx-opalbytes-core` |
| `feature(directives)/...` | `ngx-opalbytes-directives` |
| `feature(services)/...` | `ngx-opalbytes-services` |
| `feature(shared)/...` | `ngx-opalbytes-shared` |
| `feature(performance)/...` | `ngx-opalbytes-performance` |
| `feature(utils)/...` | `ngx-opalbytes-utils` |
| `feature(pdf)/...` | `ngx-opalbytes-feature-pdf` |
| `feature(video)/...` | `ngx-opalbytes-video` |
| `feature(chart)/...` | `ngx-opalbytes-chart` |
| `feature(libs)/...` | `root` (`libs`) |

**Escopos válidos no nome da branch:**

*   `components`
*   `core`
*   `directives`
*   `pdf`
*   `services`
*   `shared`
*   `performance`
*   `libs`
*   `utils`

**Exemplos de branches VÁLIDAS:**
```bash
#  Nova funcionalidade na biblioteca de diretivas
git checkout -b feature(directives)/add-currency-formatting-directive

#  Correção de um bug na biblioteca de componentes
git checkout -b fix(components)/correct-button-alignment-on-mobile

#  Alteração na documentação do projeto raiz
git checkout -b docs(libs)/update-main-readme
```

**O escopo na mensagem do commit não é exigido** — apenas o tipo é validado pelo commitlint.

---

## 📜 Regras de Desenvolvimento

Para garantir a qualidade e a estabilidade do código, seguimos um conjunto de regras estritas. A colaboração deve seguir o fluxo de Pull Request, e a automação com Husky garante que essas regras sejam cumpridas.

### 1. Commits Diretos na `main` São Proibidos

- **Fluxo de Pull Request (PR)**: Toda e qualquer alteração destinada à branch `main` **deve** ser feita através de um Pull Request. Commits diretos na `main` são bloqueados por regras de proteção da branch.
- **Revisão de Código**: Antes de ser mesclado, um PR deve ser revisado por pelo menos um outro membro da equipe.

### 2. Testes São Obrigatórios

- **Cobertura de Testes**: Novas funcionalidades (`feat`) e correções de bugs (`fix`) devem, obrigatoriamente, vir acompanhadas de testes unitários que validem o comportamento esperado.
- **Qualidade Assegurada**: O objetivo é manter uma alta cobertura de testes para garantir que futuras alterações não quebrem o que já existe.

### 3. Verificação Automática com Husky

Antes de cada commit, o Husky executa automaticamente os seguintes scripts:
- verificação de commit direto na main
- `npm run lint`: Para garantir que o código segue os padrões de estilo definidos.

Antes de cada push, o Husky executa automaticamente os seguintes scripts:
- verificação de push direto na main
- `npm run test`: Para rodar todos os testes unitários e garantir que nada foi quebrado.

**Um commit só será criado se os testes e o lint passarem.** Isso impede que código com problemas seja adicionado ao repositório.

---

##  Releases e Versionamento

O versionamento e a publicação de novas versões são totalmente automatizados com o **semantic-release**.

**Como funciona:**

1.  Quando um commit é enviado para a branch `main`.
2.  O `semantic-release` analisa as mensagens de commit desde o último release.
3.  Ele determina automaticamente a próxima versão (major, minor ou patch) com base nos tipos de commit (`feat` gera uma `minor`, `fix` gera uma `patch`, etc.).
4.  Ele atualiza a versão nos arquivos `package.json` (tanto na raiz quanto na biblioteca).
5.  Cria um `CHANGELOG.md` com as alterações.
6.  Cria um novo commit e uma tag de release no GitHub.

---

##  Scripts Disponíveis

*   `npm run build`: Compila a biblioteca para produção.
*   `npm run watch`: Compila a biblioteca em modo de desenvolvimento e observa as alterações.
*   `npm run test`: Executa os testes unitários com Vitest fechando o terminal ao finalizar.
*   `npm run test_watch`: Executa os testes unitários com Vitest.
*   `npm run lint`: Analisa o código em busca de erros de estilo e padrões.
*   `npm run storybook`: Abre o Storybook dos componentes (porta 6006).
*   `npm run build-storybook`: Gera o build estático do Storybook.
*   `npm run cao-comp -- <args>`: Invoca o CLI `cao-comp` localmente (ex: `npm run cao-comp -- base-button ./dest`, `npm run cao-comp -- storybook ./meu-projeto`).

