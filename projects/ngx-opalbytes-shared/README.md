#  ngx-opalbytes-shared

A biblioteca `ngx-opalbytes-shared` é um conjunto de módulos compartilhados que inclui componentes de UI genéricos, diretivas de atributo e estruturais, enums, interfaces, layouts, pipes para formatação de dados, resolvers e validadores. Ela foi projetada para promover a reutilização e a padronização em diferentes projetos Angular, centralizando elementos comuns de interface e lógica de apresentação.

---
## Estrutura da Biblioteca

A biblioteca `ngx-opalbytes-shared` é organizada de forma modular para facilitar a localização e o desenvolvimento de seus elementos:

### Organização de Pastas Detalhada

```
src/
└── lib/
    ├── components/        # Componentes de UI genéricos e reutilizáveis.
    ├── constants/         # Constantes globais da aplicação.
    ├── directives/        # Diretivas de atributo e estruturais (ex: máscaras, validações).
    ├── enums/             # Enumerações para tipos e status comuns.
    ├── interfaces/        # Interfaces de modelos de dados e configurações compartilhadas.
    ├── layouts/           # Estruturas de layout reutilizáveis.
    ├── pipes/             # Pipes para formatação de dados (ex: CEP, CPF/CNPJ, datas).
    ├── resolvers/         # Resolvers para pré-carregamento de dados de rotas.
    └── validators/        # Funções de validação para formulários reativos.
```

---
## Compatibilidade
|Tecnologia  |	Versão  |   Descrição  |
|------------|----------|-------------------------------------|
|   Angular	 |  ^21.0.0	|  Framework principal da biblioteca |

## Instalação

Para instalar a biblioteca, execute o seguinte comando:

```bash
npm install ngx-opalbytes-shared
```

---
## Dependências

Esta biblioteca possui as seguintes dependências:

### `peerDependencies`

| Pacote | Versão |
| :----- | :----- |
| `@angular/common` | `^21.0.0` |
| `@angular/core` | `^21.0.0` |
| `"ngx-webstorage"`| `"^21.0.1"` |
| `"ngx-mask"`| `"^20.0.3"` |

### `dependencies`

| Pacote | Versão |
| :----- | :----- |
| `tslib` | `^2.3.0` |




---

## Conteúdo da Biblioteca `ngx-opalbytes-shared`

A biblioteca `ngx-opalbytes-shared` contém utilitários e definições que são amplamente utilizados nos templates e componentes das aplicações Angular.

### Itens Disponíveis

-   **Components**: Componentes de UI genéricos e reutilizáveis.
-   **Directives**: Diretivas de atributo e estruturais (ex: máscaras, validações).
-   **Enums**: Enumerações para tipos e status comuns.
-   **Interfaces**: Definições de modelos de dados e configurações compartilhadas.
-   **Layouts**: Estruturas de layout reutilizáveis.
-   **Pipes**: Para formatar dados diretamente no HTML (ex: moedas, datas, CPF/CNPJ).
-   **Resolvers**: Resolvers para pré-carregamento de dados de rotas.
-   **Validators**: Funções de validação para formulários reativos.

#### Pipes Disponíveis

| Pipe | Descrição |
| :--- | :--- |
| `formatCep` | Formata um valor como um CEP (ex: `12345-678`). |
| `formatCpfCnpj` | Formata um valor como CPF ou CNPJ, dependendo do tamanho. |
| `formatCpf` | Formata um valor como um CPF (ex: `123.456.789-00`). |
| `formatDataNascimento` | Formata uma data de nascimento. |
| `formatDate` | Formata uma data (ex: `dd/MM/yyyy`). |
| `formatRg` | Formata um valor como um RG. |
| `formatTelefone` | Formata um número de telefone (ex: `(11) 99999-9999`). |

#### Diretivas e Validadores Disponíveis

Aqui está uma lista de diretivas e validadores disponíveis na biblioteca `ngx-opalbytes-shared`.

##### Diretivas de Máscara

Essas diretivas aplicam máscaras de formatação a campos de entrada (`<input>`).

-   **`CepMaskDirective`**
    -   **Seletor**: `[caoCepMask]`
    -   **Descrição**: Aplica uma máscara de CEP (XXXXX-XXX) a um campo de entrada.
    -   **Uso**: `<input type="text" caoCepMask>`

-   **`CnpjMaskDirective`**
    -   **Seletor**: `[caoCnpjMask]`
    -   **Descrição**: Aplica uma máscara de CNPJ (XX.XXX.XXX/XXXX-XX) a um campo de entrada.
    -   **Uso**: `<input type="text" caoCnpjMask>`

-   **`CpfCnpjMaskDirective`**
    -   **Seletor**: `[caoCpfCnpjMask]`
    -   **Descrição**: Aplica uma máscara de CPF ou CNPJ, dependendo do número de dígitos.
    -   **Uso**: `<input type="text" caoCpfCnpjMask>`

-   **`CpfEmailMaskDirective`**
    -   **Seletor**: `[caoCpfEmailMask]`
    -   **Descrição**: Aplica uma máscara de CPF se o valor inserido forem apenas números, ou permite um e-mail.
    -   **Uso**: `<input type="text" caoCpfEmailMask>`

-   **`CpfMaskDirective`**
    -   **Seletor**: `[caoCpfMask]`
    -   **Descrição**: Aplica uma máscara de CPF (XXX.XXX.XXX-XX) a um campo de entrada.
    -   **Uso**: `<input type="text" caoCpfMask>`

##### Diretivas de Comportamento

-   **`FormControlStateDirective`**
    -   **Seletor**: `[caoControlState]`
    -   **Descrição**: Adiciona classes e atributos ARIA a um campo de formulário para refletir seu estado (válido, inválido, obrigatório).
    -   **Uso**: `<input formControlName="meuCampo" caoControlState>`

-   **`FormHasErrorsDirective`**
    -   **Seletor**: `[caoHasErrors]`
    -   **Descrição**: Adiciona a classe `has-errors` a um elemento `form` ou `fieldset` se algum dos controles internos for inválido.
    -   **Input**: `requireTouched` (boolean, padrão: `true`) - Se `true`, a classe só é aplicada se o campo foi tocado.
    -   **Uso**: `<form [formGroup]="meuForm" caoHasErrors>`

-   **`CaoSkeletonDirective`**
    -   **Seletor**: `[caoSkeleton]`
    -   **Descrição**: Exibe um efeito de "skeleton loading" nos elementos filhos, ideal para indicar que o conteúdo está carregando.
    -   **Uso**: `<div caoSkeleton> ... </div>`

##### Validadores de Formulário

Essas são funções que retornam um `ValidatorFn` para uso em formulários reativos do Angular.

-   **`cepValidator()`**
    -   **Descrição**: Valida se o valor do controle é um CEP válido (8 dígitos).
    -   **Uso**: `meuCampo: ['', [cepValidator()]]`

-   **`cnpjValidator()`**
    -   **Descrição**: Valida se o valor do controle é um CNPJ válido.
    -   **Uso**: `meuCampo: ['', [cnpjValidator()]]`

-   **`confirmarEmailValidator(emailField: string)`**
    -   **Descrição**: Valida se o valor do controle é igual ao valor do campo de e-mail especificado.
    -   **Parâmetro**: `emailField` - O nome do `FormControl` do campo de e-mail.
    -   **Uso**: `confirmarEmail: ['', [confirmarEmailValidator('email')]]`

-   **`cpfOrEmailValidator()`**
    -   **Descrição**: Valida se o valor é um CPF válido ou um e-mail válido.
    -   **Uso**: `login: ['', [cpfOrEmailValidator()]]`

-   **`cpfValidator()`**
    -   **Descrição**: Valida se o valor do controle é um CPF válido.
    -   **Uso**: `meuCampo: ['', [cpfValidator()]]`

-   **`dataNascimentoValidator()`**
    -   **Descrição**: Valida se o valor do controle é uma data de nascimento válida (não futura e formato correto).
    -   **Uso**: `dataNascimento: ['', [dataNascimentoValidator()]]`

-   **`emailOrUsernameValidator()`**
    -   **Descrição**: Valida se o valor é um e-mail válido ou um nome de usuário (3-50 caracteres, letras, números, `.`, `_`, `-`).
    -   **Uso**: `login: ['', [emailOrUsernameValidator()]]`

-   **`emailValidator()`**
    -   **Descrição**: Valida se o valor do controle é um e-mail válido.
    -   **Uso**: `email: ['', [emailValidator()]]`

-   **`passwordValidator(options?: IPasswordValidatorOptions)`**
    -   **Descrição**: Realiza uma validação de força de senha complexa.
    -   **Opções**: `nomeField`, `sobrenomeField`, `emailField` para evitar que a senha contenha esses dados.
    -   **Uso**: `senha: ['', [passwordValidator({ nomeField: 'nome' })]]`

-   **`rgValidator()`**
    -   **Descrição**: Valida se o valor do controle é um RG válido.
    -   **Uso**: `rg: ['', [rgValidator()]]`

-   **`telefoneValidator()`**
    -   **Descrição**: Valida se o valor do controle é um número de telefone válido (10 ou 11 dígitos).
    -   **Uso**: `telefone: ['', [telefoneValidator()]]`

---

## Como Usar



### Usando um Pipe

```typescript
import { Component } from '@angular/core';
import { FormatCpfPipe } from 'ngx-opalbytes-shared';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [FormatCpfPipe],
  template: `<p>CPF: {{ user.cpf | formatCpf }}</p>`
})
export class UserInfoComponent {
  user = { cpf: '12345678900' };
}
```

### Usando uma Diretiva

```typescript
import { Component } from '@angular/core';
import { CpfMaskDirective } from 'ngx-opalbytes-shared';

@Component({
  selector: 'app-input-cpf',
  standalone: true,
  imports: [CpfMaskDirective],
  template: `<input type="text" caoCpfMask placeholder="000.000.000-00">`
})
export class InputCpfComponent {}
```

---

##  Como Contribuir

Para adicionar uma nova funcionalidade a esta biblioteca, siga os passos abaixo:

1.  **Crie os arquivos** da sua funcionalidade (componente, diretiva, pipe, etc.) dentro da pasta `src/lib/`, seguindo a estrutura de pastas existente.
2.  **Exponha sua funcionalidade** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `src/public-api.ts`.
3.  **Adicione ou atualize os testes unitários** para garantir a cobertura e o funcionamento esperado.
4.  **Faça o commit** seguindo as [regras de commit do projeto](/README.md#%F0%9F%93%B2-regras-de-commit-com-escopo-obrigatório), usando o escopo `shared`.

    ```bash
    git commit -m "feat(shared): add novo componente de UI"
    ```

---

##  Regras e Convenções

### Prefixo

O prefixo para componentes e diretivas nesta biblioteca é `cao`.