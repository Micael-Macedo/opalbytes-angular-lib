# 🔗 Tecnologias

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

# 📦 Opalbytes Angular Libs

Este é um monorepo que centraliza uma coleção de bibliotecas Angular reutilizáveis. O objetivo é fornecer um conjunto coeso e padronizado de componentes, diretivas, serviços e utilitários para acelerar o desenvolvimento de projetos.

O projeto está configurado com um fluxo de trabalho moderno, utilizando automação para testes, lint, versionamento e publicação, garantindo a qualidade e a consistência do código em todas as bibliotecas.

---

## 🚀 Começo Rápido

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
opalbytes-directive-components/
├── projects/
│   ├── ngx-opalbytes-components/    # Biblioteca de componentes
│   ├── ngx-opalbytes-directives/    # Biblioteca de diretivas
│   ├── ngx-opalbytes-services/      # Biblioteca de serviços
│   └── ngx-opalbytes-utils/         # Funções utilitárias
│
├── .github/                         # Workflows de CI/CD (Release)
├── .husky/                          # Hooks do Git para validações
├── commitlint.config.js             # Regras para o formato dos commits
└── .releaserc.js                    # Configuração do semantic-release
```

---

## 📚 Bibliotecas Disponíveis

### `ngx-opalbytes-components`
Biblioteca de componentes de UI reutilizáveis.

| Componente          | Descrição                                             |
| ------------------- | ----------------------------------------------------- |
| `autocomplete`      | Um campo de formulário com sugestões de preenchimento.  |
| `base-alert`        | Componente para exibir mensagens de alerta.           |
| `base-button`       | Botão padrão com estilos customizáveis.               |
| `base-dialog`       | Janela de diálogo modal.                              |
| `base-table`        | Tabela de dados com ordenação e paginação.            |
| `base-time-range`   | Seletor de intervalo de tempo.                        |
| `drop-down`         | Menu suspenso (dropdown).                             |
| `footer`            | Rodapé padrão para páginas.                           |
| `links-button`      | Botão que renderiza múltiplos links.                  |
| `paginator`         | Controle de paginação para tabelas ou listas.         |
| `time-picker`       | Seletor de horário.                                   |

### `ngx-opalbytes-directives`
Diretivas para adicionar comportamentos a elementos do DOM.

| Diretiva      | Descrição                                                   |
| ------------- | ----------------------------------------------------------- |
| `cpf-mask`    | Aplica uma máscara de CPF a um campo de input.              |
| `highlight`   | Realça o texto de um elemento.                              |
| `skeleton`    | Exibe um placeholder de carregamento (esqueleto).           |

### `ngx-opalbytes-services`
Serviços injetáveis com lógica de negócio ou comunicação com APIs.

| Serviço             | Descrição                                                   |
| ------------------- | ----------------------------------------------------------- |
| `date-pipe.service` | Formata datas de acordo com a localidade.                   |
| `installer.service` | Gerencia a instalação de PWAs.                              |
| `websocket.service` | Lida com a comunicação em tempo real via WebSockets.        |

### `ngx-opalbytes-utils`
Funções utilitárias e helpers.

| Utilitário | Descrição |
| --- | --- |
| `NgxOpalbytesUtils` | Componente placeholder (sem funções utilitárias no momento). |

### `ngx-opalbytes-core-shared`
Biblioteca central com a base para as demais, incluindo serviços, interceptors, guards e modelos essenciais.

**Nota:** Esta biblioteca é mais complexa e dividida em `core` e `shared`.
- **Core:** Contém a lógica central da aplicação (serviços, interceptors, guards).
- **Shared:** Contém elementos compartilhados entre diferentes partes da aplicação (componentes de UI, diretivas, pipes).

--- 

## 🌿 Estratégia de Branches

### Convenção de Nomenclatura
Usamos uma convenção simples e eficiente para nomear branches:

```
<tipo>/descricao-breve
```

**Tipos recomendados:**
- `feat/` - Nova funcionalidade
- `fix/` - Correção de bug
- `docs/` - Documentação
- `refactor/` - Refatoração de código
- `test/` - Testes
- `chore/` - Tarefas de manutenção

**Exemplos corretos:**
```bash
# ✅ Branches válidas
git checkout -b feat(directives)/add-input-mask-directive
git checkout -b fix(component)/correcao-validacao-formato
```

### Fluxo de Trabalho
1. Crie uma branch a partir da `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b tipo(escopo)/nome-da-feature
   ```
2. Desenvolva e faça commits seguindo as regras de Conventional Commits.
3. Abra um Pull Request para revisão.

---

## 📝 Como Contribuir

### Adicionando Funcionalidades a uma Biblioteca Existente

1.  **Crie os arquivos** da sua nova funcionalidade (componente, diretiva, serviço, etc.) dentro da pasta `src/lib/` da biblioteca correspondente.
2.  **Exponha sua funcionalidade** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `public-api.ts` da biblioteca.
3.  **Adicione ou atualize os testes unitários** para garantir a cobertura da sua nova funcionalidade.
4.  **Crie seu commit** seguindo as regras de escopo descritas na próxima seção.

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
    *   Copie um job existente (ex: `release-directives`).
    *   Renomeie o job para `release-nova-lib`.
    *   Atualize a condição `if` para usar o escopo da sua nova lib (ex: `contains(github.event.head_commit.message, 'feat(nova-lib)')`).
    *   Altere os comandos de teste e build (ex: `npm run test:nova-lib` e `npm run build:nova-lib`).
    *   Atualize o caminho no passo de Release (ex: `cd projects/ngx-opalbytes-nova-lib && npx semantic-release`).

4.  **Atualize este `README.md`**: Adicione o escopo da sua nova biblioteca (`nova-lib`) à lista de escopos válidos na seção de "Regras de Commit".

---

## 룰 Regras de Commit (com Escopo Obrigatório)

Este projeto utiliza o padrão **Conventional Commits**. Esse padrão é obrigatório e validado automaticamente antes de cada commit.

O formato é:
```
<tipo>(<escopo>): <descrição>
```

### A Importância do Escopo

O **escopo é obrigatório** e indica qual biblioteca do monorepo está sendo modificada. Isso é **crucial** para que o `semantic-release` possa versionar e publicar apenas os pacotes que foram alterados.

**O escopo DEVE ser um dos seguintes:**

*   `components`
*   `directives`
*   `services`
*   `utils`
*   `libs`

**Exemplos de mensagens de commit VÁLIDAS:**

```bash
# ✅ Nova funcionalidade na biblioteca de diretivas
feat(directives): add currency formatting directive

# ✅ Correção de um bug na biblioteca de componentes
fix(components): correct button alignment on mobile

# ✅ Alteração na documentação do projeto raiz
docs(libs): update main README with contribution guide
```

**Um commit sem um escopo válido será rejeitado.**

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

## 🚀 Releases e Versionamento

O versionamento e a publicação de novas versões são totalmente automatizados com o **semantic-release**.

**Como funciona:**

1.  Quando um commit é enviado para a branch `main`.
2.  O `semantic-release` analisa as mensagens de commit desde o último release.
3.  Ele determina automaticamente a próxima versão (major, minor ou patch) com base nos tipos de commit (`feat` gera uma `minor`, `fix` gera uma `patch`, etc.).
4.  Ele atualiza a versão nos arquivos `package.json` (tanto na raiz quanto na biblioteca).
5.  Cria um `CHANGELOG.md` com as alterações.
6.  Cria um novo commit e uma tag de release no GitHub.

---

## 🛠️ Scripts Disponíveis

*   `npm run build`: Compila a biblioteca para produção.
*   `npm run watch`: Compila a biblioteca em modo de desenvolvimento e observa as alterações.
*   `npm run test`: Executa os testes unitários com Vitest fechando o terminal ao finalizar.
*   `npm run test_watch`: Executa os testes unitários com Vitest.
*   `npm run lint`: Analisa o código em busca de erros de estilo e padrões.

