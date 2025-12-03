# 📦 Opalbytes Directive Components

Este repositório contém uma biblioteca Angular (`ngx-opalbytes-directives`) com um conjunto de diretivas reutilizáveis. O projeto está configurado com um fluxo de trabalho moderno para garantir a qualidade e a consistência do código.

---

## 🚀 Começo Rápido

1.  **Instalar Dependências**
    ```bash
    npm install
    ```

2.  **Desenvolver a Biblioteca**
    Para compilar a biblioteca e re-compilar a cada alteração, use o modo "watch":
    ```bash
    ng build ngx-opalbytes-directives --watch
    ```
    Para usar esta biblioteca em um projeto local durante o desenvolvimento, você pode usar o `npm link`.

---

## 📂 Estrutura do Projeto

A estrutura do projeto é organizada para o desenvolvimento de bibliotecas Angular.

```
opalbytes-directive-components/
├── projects/
│   └── ngx-opalbytes-directives/    ✅ A nossa biblioteca de diretivas
│       ├── src/
│       │   ├── lib/
│       │   │   └── directives/      📚 Onde as diretivas são criadas
│       │   └── public-api.ts        📦 Arquivo que expõe as diretivas para o público
│       └── ng-package.json          ⚙️ Configuração de empacotamento da biblioteca
│
├── .github/                         ⚙️ Workflows de CI/CD (ex: Release com semantic-release)
├── .husky/                          훅 Git para validação de commits
├── commitlint.config.js             룰 Regras para o formato das mensagens de commit
└── .releaserc.js                    🚀 Configuração do semantic-release
```

---

## 룰 Regras de Commit

Este projeto utiliza o padrão **Conventional Commits** para as mensagens de commit. Esse padrão é obrigatório e validado automaticamente antes de cada commit usando `commitlint` e `husky`.

O formato geral é:

```
<tipo>(<escopo>): <descrição>
```

**Principais `tipos` permitidos:**

*   **feat**: Para novas funcionalidades.
*   **fix**: Para correções de bugs.
*   **docs**: Para alterações na documentação.
*   **style**: Para formatação de código (espaços, ponto e vírgula, etc.).
*   **refactor**: Para refatorações que não alteram a funcionalidade.
*   **test**: Para adição ou modificação de testes.
*   **chore**: Para tarefas de build, configuração, etc.

**Exemplo de mensagem de commit válida:**

```bash
feat(input): adicionar diretiva para formatar moeda em tempo real
```

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
*   `npm run test`: Executa os testes unitários com Vitest.
*   `npm run lint`: Analisa o código em busca de erros de estilo e padrões.

---

## 🔗 Tecnologias

*   **Angular**: Framework principal para a criação da biblioteca.
*   **TypeScript**: Linguagem base do projeto.
*   **Conventional Commits**: Padrão para mensagens de commit.
*   **Husky**: Ferramenta para executar scripts em hooks do Git.
*   **Commitlint**: Validador de mensagens de commit.
*   **Semantic Release**: Ferramenta para automação de versionamento e releases.