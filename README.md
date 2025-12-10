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

# 📦 Opalbytes Directive Components

Este repositório contém uma biblioteca Angular (`ngx-opalbytes-directives`) com um conjunto de diretivas reutilizáveis. O projeto está configurado com um fluxo de trabalho moderno para garantir a qualidade e a consistência do código.

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
git checkout -b feat/add-input-mask-directive
git checkout -b fix/correcao-validacao-formato
git checkout -b docs/atualizacao-guia-instalacao
git checkout -b test/add-testes-unitarios-diretivas
```

**Regras importantes:**
- Use apenas letras minúsculas
- Separe palavras com hífen (`-`)
- Evite caracteres especiais
- Seja descritivo mas conciso

### Fluxo de Trabalho
1. Crie uma branch a partir da `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b tipo/nome-da-feature
   ```

2. Desenvolva e faça commits seguindo as regras de Conventional Commits

3. Abra um Pull Request para revisão

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

