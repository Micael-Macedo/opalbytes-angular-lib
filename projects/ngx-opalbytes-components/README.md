#  ngx-opalbytes-components

Uma biblioteca de componentes de UI reutilizáveis para aplicações Angular, projetada para acelerar o desenvolvimento e manter a consistência visual.

---
## Compatibilidade
|Tecnologia  |	Versão  |   Descrição  |
|------------|----------|-------------------------------------|
|   Angular	 |  ^21.0.0	|  Framework principal da biblioteca |

## Instalação

Para instalar a biblioteca, execute o seguinte comando:

```bash
npm install ngx-opalbytes-components
```


## Dependências

Esta biblioteca possui as seguintes dependências:

### `peerDependencies`

| Pacote | Versão |
| :----- | :----- |
| `@angular/common` | `^21.0.0` |
| `@angular/core` | `^21.0.0` |
| `@angular/material` | `^21.0.3` |

### `dependencies`

| Pacote | Versão |
| :----- | :----- |
| `tslib` | `^2.3.0` |

---
## Como Usar

Os componentes nesta biblioteca são `standalone`, o que significa que você pode importá-los diretamente nos seus componentes ou módulos.

**Exemplo de importação em um componente:**

```typescript
import { Component } from '@angular/core';
// Importe os componentes desejados
import { BaseButton, CaoAutocompleteComponent } from 'ngx-opalbytes-components';
import { FormControl, ReactiveFormsModule } from '@angular/forms'; // Adicione ReactiveFormsModule e FormControl

@Component({
  selector: 'app-exemplo',
  standalone: true,
  imports: [
    BaseButton, // Adicione o componente aos imports
    CaoAutocompleteComponent, // Adicione o componente aos imports
    ReactiveFormsModule // Importe ReactiveFormsModule
  ],
  template: `
    <cao-button buttonText="Clique Aqui"></cao-button>
    <cao-autocomplete label="Selecione um Item" [options]="opcoesExemplo" [control]="meuControl"></cao-autocomplete>
  `
})
export class ExemploComponent {
  meuControl = new FormControl();
  opcoesExemplo = [
    { id: 1, nome: 'Opção 1' },
    { id: 2, nome: 'Opção 2' }
  ];
}
```

---

## Comandos CLI

A biblioteca disponibiliza uma CLI (`cao-comp`) para copiar o código-fonte de um componente da `ngx-opalbytes-components` para qualquer projeto. Isso é útil quando você precisa customizar o código-fonte de um componente internamente, sem depender apenas da API pública.

### Instalação global

Para utilizar o comando `cao-comp` de qualquer lugar, instale a biblioteca globalmente:

```bash
npm install -g ngx-opalbytes-components
```

Para desenvolvimento local, a partir da pasta `projects/ngx-opalbytes-components`:

```bash
npm link
```

> Caso não queira instalar, também é possível executar o script diretamente:
> `node ./node_modules/ngx-opalbytes-components/cli/cao-comp.cjs ...`

### Uso

```bash
cao-comp <componente> <destino> [opcoes]
```

**Argumentos:**

| Argumento | Descrição |
| --- | --- |
| `<componente>` | Nome da pasta do componente em `shared/components` (ex: `base-button`). |
| `<destino>` | Pasta de destino onde os arquivos serão gerados (criada se não existir). |

**Opções:**

| Opção | Descrição |
| --- | --- |
| `-h, --help` | Exibe a ajuda. |
| `-l, --list` | Lista os componentes disponíveis para cópia. |
| `-f, --force` | Sobrescreve arquivos existentes no destino. |
| `-v, --version` | Exibe a versão. |

**Exemplos:**

```bash
cao-comp base-button ./src/app/components
cao-comp stepper ./src/app/components --force
cao-comp --list
```

---

## Quando usar `cao-comp` vs. a biblioteca (`npm install`)

A `ngx-opalbytes-components` pode ser consumida de duas formas distintas, e cada uma atende a necessidades diferentes:

- **Usar o pacote (`npm install ngx-opalbytes-components`)** — você consome a **API pública** dos componentes, como qualquer dependência externa. O código vive dentro do `node_modules`, é versionado e atualizado por você (ou pela própria biblioteca). A biblioteca funciona como uma "caixa preta": você usa os `@Input`s, `@Output`s e métodos que ela expõe, mas não altera o comportamento interno.
- **Copiar o código-fonte (`cao-comp`)** — você copia o fonte de um componente para dentro do **seu próprio projeto**. A partir daí o componente deixa de ser gerenciado pela biblioteca e se torna **seu código**, com total liberdade de edição (template, estilos, lógica e eventos). A biblioteca funciona como uma "caixa aberta": você passa a ter a posse daquele componente.

A escolha entre uma abordagem e outra não é sobre "qual é melhor", mas sobre **o quanto você precisa de controle sobre o componente**.

### Tabela comparativa

| Critério | `cao-comp` (copiar o código) | `npm install` (usar a lib) |
| --- | --- | --- |
| **Explorar/visualizar componentes e inputs** | Ideal — gera o setup de **Storybook** para navegar os componentes e seus `@Input`s/`@Output`s. | Não oferece isso diretamente — a visualização depende de documentação ou de você montar Storybook por conta própria. |
| **Grau de customização** | Total — você edita template, CSS e lógica internos. | Limitado à API pública (`@Input`/`@Output`/métodos expostos). |
| **Estratégia de extensão** | Modificar o comportamento interno do componente (fork). | Compor/envolver o componente com a estrutura da lib (ex.: estender `AlertService`/`DialogService` via `generateComponentPortal()`). |
| **Volume de inputs/eventos para repassar** | Baixo — você edita onde precisa, sem re-expor dezenas de `@Input`s de um wrapper. | Alto em wrappers — cada `@Input`/`@Output` que você quiser repassar precisa ser declarado e repassado manualmente no componente que envolve o da lib. |
| **Atualização / manutenção** | **Não** acompanha a lib — o código vira seu; correções e novas versões precisam ser reaplicadas à mão. | Acompanha a lib — `npm update`/`npm install` entrega fixes, features e novas versões automaticamente. |
| **Consistência entre projetos** | Divisão de risco — cada projeto pode divergir do padrão visual/lógico da lib. | Alta consistência — todos os projetos usam a mesma versão publicada. |
| **Testes, acessibilidade e qualidade** | Ficam sob responsabilidade do time local após o fork. | Já prontos e centralizados (testes, a11y e convenções da lib). |
| **Ownership do código** | Seu projeto assume a posse e a responsabilidade do componente. | A biblioteca mantém a responsabilidade da manutenção. |

### Use `cao-comp` quando:

- **Precisar visualizar** os componentes existentes e seus inputs **antes** de usá-los — o `cao-comp storybook` gera o setup mínimo para explorar tudo visualmente.
- A customização **escapa da API pública** — por exemplo, alterar estilização, atributos, funcionalidades ou eventos que só existem no código-fonte do componente (ex.: um **tooltip customizável** que o componente base não expõe como input).
- Você **não quer estender** um componente a partir do componente da lib (isso costuma gerar wrappers frágeis), mas sim **modificar o componente em si**.
- Quer **reduzir o trabalho de repassar todos os `@Input`s e `@Output`s** de um componente pai para um componente da lib — em vez de declarar e propagar dezenas de entradas/saídas, você edita o componente diretamente.
- O componente funcionará como um **fork**: você quer posse total do código e **não precisa** acompanhar as versões da biblioteca (seja por questão de isolamento, build offline ou regra de não instalar a dependência).
- Um componente da lib já expõe boa parte, **mas** atende a um caso tão específico do seu domínio que a manutenção local é mais simples do que manter um wrapper enorme.

### Use `npm install` (a lib) quando:

- Quiser ter **sempre a versão mais atualizada** da biblioteca, com fixes e melhorias centralizados.
- **Não precisar visualizar** os componentes existentes em detalhe — a API pública e a documentação já são suficientes.
- Pretender usar **somente os eventos e atributos** expostos, **criando componentes que estendem/compoem a estrutura da lib** — por exemplo `AlertService`/`DialogService` (veja a seção "Como estender o `AlertService`" e "Como estender o `DialogService`" abaixo), que permitem customizar a aparência mantendo o consumo via npm, sem precisar copiar fonte nenhum.
- O componente pronto (com a API atual) já atende ao caso, e você valoriza testes, acessibilidade e padrão visual já validados.
- Precisar de **consistência visual e de comportamento entre múltiplos projetos** — todos passam a usar a mesma versão publicada e atualizada.

### Prós e contras

**`cao-comp` (copiar o código)**

- ✅ Liberdade total de edição (template, estilos, lógica, eventos).
- ✅ Sem custo de repasse de dezenas de `@Input`s/`@Output`s.
- ✅ Visualização imediata via Storybook.
- ❌ O código vira seu: **não** recebe atualizações/fixes da lib automaticamente.
- ❌ Código duplicado: a cópia pode divergir da lib com o tempo.
- ❌ Testes, a11y e manutenção passam a ser responsabilidade do seu time.

**`npm install` (a lib)**

- ✅ Sempre atualizado (`npm update`/`npm install`).
- ✅ Testes, acessibilidade e convenções já prontas e centralizadas.
- ✅ Consistência entre projetos e equipas.
- ❌ Limitado à API pública (sem alterar comportamento interno).
- ❌ Wrappers para mais inputs/eventos podem crescer muito.
- ❌ Sem visualização direta dos componentes (depende de docs/Storybook próprio).

### Exemplo prático — quando vale usar `cao-comp`

Suponha que sua aplicação precise de um `<cao-input>` com um **tooltip mais elaborado** e um **layout interno específico** que a API pública do `BaseInput` não expõe. A API atual só oferece `tooltip` (texto simples), mas você precisa de tooltip customizada (com título, conteúdo rico e ícone) e de uma estrutura interna diferente.

**Abordagem ruim (com a lib):** você cria um wrapper `AppInputComponent` que envolve `<cao-input>` e tenta "empacotar" todos os `@Input`s/`@Output`s do `BaseInput`, além de tentar replicar uma tooltip customizada que o componente interno nem sequer aceita. Resultado: muito código de repasse, frágil, e ainda assim sem atingir o layout interno desejado.

**Abordagem boa (com `cao-comp`):**

1. Explore os componentes disponíveis:
   ```bash
   cao-comp --list
   ```
2. Copie o fonte do componente para o seu projeto:
   ```bash
   cao-comp base-input ./src/app/components/base-input-custom
   ```
3. Gere o Storybook para visualizar e validar:
   ```bash
   cao-comp base-input ./src/app/components/base-input-custom
   cao-comp storybook .
   ```
4. Edite diretamente o `template` e os estilos do componente copiado para incluir o novo layout e a tooltip customizada, e adicione os novos `@Input`s/`@Output`s que o seu caso precisa — sem repassar nada de um wrapper.

Agora o componente copiado é seu, atende exatamente ao domínio da aplicação, e você validou visualmente via Storybook.

### Checklist de decisão rápida

- Preciso explorar os componentes e seus inputs (Storybook)? → **`cao-comp`**
- A customização que preciso (estilo/comportamento/eventos) **não** está na API pública? → **`cao-comp`**
- Quero modificar o componente em si, não apenas compor/estender? → **`cao-comp`**
- Estou disposto a assumir a manutenção do código (sem updates automáticos)? → **`cao-comp`**
- Prefiro sempre a versão mais atualizada e manutenção centralizada? → **`npm install`**
- A API pública já atende (só uso eventos/atributos) e vou compor/extender a estrutura da lib? → **`npm install`**
- Preciso de consistência visual/qualidade (testes, a11y) entre projetos? → **`npm install`**

> **Importante quanto ao `cao-comp`:** ao copiar componentes, observe as **dependências internas**. Alguns componentes dependem de outros que precisam ser copiados juntos (ex.: `tab-group` depende de `tab-panel`, `stepper` depende de `step`; serviços que usam `ComponentPortal`, como `AlertService`/`DialogService`, precisam do componente correspondente). Além disso, o projeto de destino precisa ter as **peer dependencies** instaladas (`@angular/material`, `ngx-mask`, `@lucide/angular`, `@angular/cdk`) — o setup de Storybook gerado já orienta essa instalação.

---

## Organização de Pastas

Dentro da pasta `src/lib/`, os componentes são organizados em `shared/components/` e cada componente reside em sua própria pasta, contendo seus arquivos (`.ts`, `.html`, `.css`, `.spec.ts`).

```
src/
└── lib/
    └── shared/
        └── components/
        |   ├── accordion/
        |   ├── accordion-item/
        |   ├── avatar/
        |   ├── base-button/
        |   ├── base-icon/
        |   ├── base-input/
        |   ├── base-time-range/
        |   ├── base-toggle/
        |   ├── breadcrumb/
        |   ├── checkbox/
        |   ├── drop-down/
        |   ├── footer/
        |   ├── kpi/
        |   ├── links-button/
        |   ├── paginator/
        |   ├── radio/
        |   ├── skeleton/
        |   ├── slide-toggle/
        |   ├── stepper/
        |   ├── tab-group/
        |   ├── tab-panel/
        |   └── time-picker/
        └── features/
            ├── base-modal/
            ├── base-table/
            ├── base-table-paginated/
            ├── base-dialog/
            ├── base-alert/
            └── base-widget/
            
```

---

## Detalhes dos Componentes

### `BaseButton`
Um botão customizável com suporte a ícones, estado de loading e tooltip.

**Seletor:** `<cao-button>`

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `buttonText` | `string` | `'Clique!'` | O texto exibido no botão. |
| `isDarkMode` | `boolean` | `false` | Aplica o tema escuro ao botão. |
| `isDisabled` | `boolean` | `false` | Desabilita o botão. |
| `isLoading` | `boolean` | `false` | Exibe um spinner de carregamento no botão. |
| `btnClass` | `string` | `''` | Classes CSS customizadas para o botão. |
| `tooltip` | `string` | `undefined` | Texto a ser exibido em uma tooltip. |
| `trailingIcon` | `string` | `undefined` | Ícone a ser exibido após o texto. |
| `leadingIcon` | `string` | `undefined` | Ícone a ser exibido antes do texto. |
| `isLucideIcon` | `boolean` | `true` | Define se o ícone é do pacote Lucide. |
| `iconColor` | `string` | `undefined` | Cor aplicada aos ícones SVG Lucide. |
| `dataCy` | `string` | `undefined` | Atributo para testes E2E com Cypress. |
| `strokeWidthIcon` | `number` | `1` | Define a espessura (stroke width) do ícone. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `buttonClick` | `EventEmitter<void>` | Emitido quando o botão é clicado. |

---

### `BaseIcon`
Um componente para exibir ícones, com suporte a ícones Lucide ou imagens customizadas.

**Seletor:** `<cao-base-icon>`

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `imgSource` | `string` | `''` | Caminho da imagem ou nome do ícone Lucide. |
| `isLucideIcon` | `boolean` | `true` | Define se o ícone é do pacote Lucide. |
| `strokeWidthIcon` | `number` | `1` | Define a espessura (stroke width) do ícone Lucide. |
| `iconColor` | `string` | `''` | Cor aplicada ao ícone Lucide. |
| `size` | `number` | `32` | Tamanho do ícone em pixels. |

**Exemplo de uso:**

```html
<!-- Ícone Lucide -->
<cao-base-icon imgSource="home" [isLucideIcon]="true" [iconColor]="'#4f46e5'" [size]="24"></cao-base-icon>

<!-- Imagem customizada -->
<cao-base-icon imgSource="assets/meu-icone.svg" [isLucideIcon]="false"></cao-base-icon>
```

---

### `Stepper`

Um componente de passo a passo que guia o usuário através de um processo.

**Seletor:** `<cao-stepper>`

**Atributos (Inputs)**

| Atributo | Tipo     | Padrão | Descrição                             |
| -------- | -------- | ------ | ------------------------------------- |
| `title`  | `string` | `''`   | O título exibido acima do stepper.    |

**Eventos (Outputs)**

| Evento            | Tipo                | Descrição                                         |
| ----------------- | ------------------- | ------------------------------------------------- |
| `maxReachedEvent` | `EventEmitter<null>` | Emitido quando o último passo do stepper é alcançado. |

**Métodos**

| Método         | Descrição                                                                              |
| -------------- | -------------------------------------------------------------------------------------- |
| `nextStep()`   | Avança para o próximo passo. Se estiver no último passo, emite o evento `maxReachedEvent`. |
| `prevStep()`   | Retorna ao passo anterior. Não faz nada se estiver no primeiro passo.                  |
| `resetStepper()`| Reinicia o stepper, voltando ao primeiro passo e desativando todos os outros.          |

**Uso com `Step`**

O `Stepper` deve ser usado em conjunto com o componente `Step`.

```html
<cao-stepper title="Meu Stepper">
  <cao-step title="1"></cao-step>
  <cao-step title="2"></cao-step>
  <cao-step title="3"></cao-step>
</cao-stepper>
```

---

### `Step`

Representa um único passo dentro do componente `Stepper`.

**Seletor:** `<cao-step>`

**Atributos (Inputs)**

| Atributo   | Tipo      | Padrão  | Descrição                                 |
| ---------- | --------- | ------- | ----------------------------------------- |
| `title`    | `string`  | `''`    | O texto exibido dentro do passo (ex: "1"). |
| `isActive` | `boolean` | `false` | Define se o passo está ativo.             |

---

### `BaseInput`
Um campo de entrada de texto customizável com suporte a ícones, máscaras e validação.

**Seletor:** `<cao-input>`

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `type` | `string` | `'text'` | O tipo de input (text, password, email, etc). |
| `placeholder` | `string` | `''` | O texto de placeholder. |
| `label` | `string` | `''` | O rótulo do campo. |
| `inputClass` | `string` | `''` | Classes CSS customizadas para o input. |
| `value` | `string` \| `number` \| `boolean` \| `Date` | `''` | O valor do input. |
| `errorMessage` | `string` | `''` | Mensagem de erro a ser exibida. |
| `isDisabled` | `boolean` | `false` | Desabilita o input. |
| `maxLength` | `number` | `undefined` | Número máximo de caracteres. |
| `searchMode` | `boolean` | `false` | Ativa o modo de busca, exibindo um ícone de busca. |
| `showBorder` | `boolean` | `false` | Exibe uma borda no input. |
| `isLucideIcon` | `boolean` | `false` | Define se o ícone é do pacote Lucide. |
| `mask` | `string` | `undefined` | Máscara a ser aplicada ao input (usando `ngx-mask`). |
| `control` | `AbstractControl` \| `null` | `null` | O `FormControl` associado. |
| `tooltip` | `string` | `''` | Texto a ser exibido em uma tooltip. |
| `dataCy` | `string` | `undefined` | Atributo para testes E2E com Cypress. |
| `textareaRows` | `string` | `undefined` | Número de linhas para um textarea. |
| `decimalMarker` | `'.' \| ',' \| ['.', ',']` | `','` | Marcador decimal para números. |
| `thousandSeparator` | `string` | `'.'` | Separador de milhares para números. |
| `allowNegativeNumbers`| `boolean`| `false`| Permite números negativos. |
| `separatorLimit` | `string` | `''` | Limite do separador. |
| `leadingIcon` | `string` | `undefined` | Ícone a ser exibido antes do texto. |
| `trailingIcon` | `string` | `undefined` | Ícone a ser exibido após o texto. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `valueChange` | `EventEmitter<string>` | Emitido quando o valor do input muda. |
| `searchClick` | `EventEmitter<void>` | Emitido quando o ícone de busca é clicado. |
| `inputChange` | `EventEmitter<string>` | Emitido a cada mudança no input. |

---

### `BaseAlert`
Um componente para exibir alertas de sucesso, erro, informação ou aviso. Geralmente utilizado com um serviço de diálogo.

**Seletor:** `<cao-alert>`

**Atributos (Inputs via `data`)**

| Atributo | Tipo | Descrição |
| --- | --- | --- |
| `type` | `'success' \| 'error' \| 'info' \| 'warning'` | O tipo de alerta a ser exibido. |
| `title` | `string` | O título do alerta. |
| `message` | `string` | A mensagem do alerta. |
| `alertIcon` | `string` | (Opcional) Caminho para um ícone customizado. |

---

### `AlertService`
O `AlertService` é responsável por exibir os alertas na tela. Por padrão, ele utiliza o componente `BaseAlert`.

**Como estender o `AlertService` para usar um componente de alerta customizado:**

Para personalizar a aparência ou o comportamento dos alertas, você pode estender o `AlertService` e sobrescrever o método `generateComponentPortal()`. Este método deve retornar o seu componente customizado, que **DEVE** estender o `BaseAlert`.

**Exemplo:**

1.  **Crie seu componente de alerta customizado** (ex: `CustomAlertComponent`):

    ```typescript
    // custom-alert.component.ts
    import { Component } from '@angular/core';
    import { BaseAlert } from 'ngx-opalbytes-components';

    @Component({
      selector: 'app-custom-alert',
      template: `
        <div class="custom-alert-container" [ngClass]="data.type">
          <img *ngIf="data.alertIcon" [src]="data.alertIcon" alt="Alert Icon" class="alert-icon">
          <div class="content">
            <h3 class="title">{{ data.title }}</h3>
            <p class="message">{{ data.message }}</p>
          </div>
        </div>
      `,
      styles: [`
        .custom-alert-container {
          /* seus estilos personalizados */
        }
      `]
    })
    export class CustomAlertComponent extends BaseAlert {
      // Você pode adicionar lógica específica aqui se precisar
    }
    ```

2.  **Crie um serviço que estende o `AlertService`**:

    ```typescript
    // custom-alert.service.ts
    import { Injectable } from '@angular/core';
    import { AlertService } from 'ngx-opalbytes-components';
    import { CustomAlertComponent } from './custom-alert.component'; // Importe seu componente customizado

    @Injectable({
      providedIn: 'root'
    })
    export class CustomAlertService extends AlertService {
      override generateComponentPortal(): typeof CustomAlertComponent {
        return CustomAlertComponent;
      }
    }
    ```

---

### `BaseDialog`
Exibe uma caixa de diálogo modal para interações que exigem confirmação do usuário.

**Seletor:** `<cao-dialog>`

**Atributos (Inputs via `config`)**

| Atributo | Tipo | Descrição |
| --- | --- | --- |
| `type` | `'success' \| 'error' \| 'info' \| 'warning'` | O tipo de diálogo. |
| `title` | `string` | O título do diálogo. |
| `logoIcon` | `string` | (Opcional) Caminho para o ícone do logo. |
| `message` | `string` | A mensagem principal do diálogo. |
| `confirmButtonText`| `string` | Texto para o botão de confirmação. |
| `cancelButtonText` | `string` | Texto para o botão de cancelamento. |
| `onConfirm` | `() => void` | Função a ser executada na confirmação. |
| `onCancel` | `() => void` | Função a ser executada no cancelamento. |


**Como estender o `DialogService` para usar um componente de dialoga customizado:**

Para personalizar a aparência ou o comportamento dos dialogos, você pode estender o `DialogService` e sobrescrever o método `generateComponentPortal()`. Este método deve retornar o seu componente customizado, que **DEVE** estender o `BaseDialog`.

**Exemplo:**

1.  **Crie seu componente de dialoga customizado** (ex: `CustomDialogComponent`):

    ```typescript
    // custom-dialog.component.ts
    import { Component } from '@angular/core';
    import { BaseDialog } from 'ngx-opalbytes-components';

    @Component({
      selector: 'app-custom-dialog',
      template: `
        <div class="custom-dialog-container" [ngClass]="data.type">
          <img *ngIf="data.dialogIcon" [src]="data.dialogIcon" alt="Dialog Icon" class="dialog-icon">
          <div class="content">
            <h3 class="title">{{ data.title }}</h3>
            <p class="message">{{ data.message }}</p>
             @if (config.cancelButtonText) {
              <button
                type="button"
                class="cancel-button"
                [attr.data-cy]="config.cancelButtonText"
                (keydown)="handleCancel()"
                (click)="handleCancel()">
                {{ config.cancelButtonText }}
              </button>
              } @if (config.confirmButtonText) {
              <button
                type="button"
                class="confirm-button"
                [ngClass]="config.type"
                [attr.data-cy]="config.confirmButtonText"
                (click)="handleConfirm()"
                (keydown)="handleConfirm()"
                >
                {{ config.confirmButtonText }}
              </button>
              }
          </div>
        </div>
      `,
      styles: [`
        .custom-dialog-container {
          /* seus estilos personalizados */
        }
      `]
    })
    export class CustomDialogComponent extends BaseDialog {
      // Você pode adicionar lógica específica aqui se precisar
    }
    ```

2.  **Crie um serviço que estende o `DialogService`**:

    ```typescript
    // custom-dialog.service.ts
    import { Injectable } from '@angular/core';
    import { DialogService } from 'ngx-opalbytes-components';
    import { CustomDialogComponent } from './custom-dialog.component'; // Importe seu componente customizado

    @Injectable({
      providedIn: 'root'
    })
    export class CustomDialogService extends DialogService {
      override generateComponentPortal(): typeof CustomDialogComponent {
        return CustomDialogComponent;
      }
    }
    ```
---

### `BaseWidget` e `CaoWidgetService`

Um painel lateral (drawer) para formulários e fluxos que precisam de mais espaço, aberto via `Overlay` do `@angular/cdk`. O componente fornece o backdrop, o header e a área de conteúdo com scroll; o `CaoWidgetService` é responsável por abrir o widget e integrá-lo ao histórico do navegador.

**Seletor:** `<cao-base-widget>`

**Classe genérica:** `CaoBaseWidgetComponent<TData>` — a forma recomendada de uso é **estender** o componente para criar widgets concretos e tipar o `widgetData`.

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `title` | `string` | `'Titulo'` | Título exibido no header do widget. |
| `subtitle` | `string` | `''` | Subtítulo exibido abaixo do título. |
| `widgetIcon` | `string` | `''` | Ícone do widget (disponível para classes derivadas). |
| `widgetData` | `TData \| undefined` | `undefined` | Dados genéricos passados ao conteúdo do widget. |
| `cancelTextButton` | `string` | `'Cancelar'` | Texto do botão de cancelamento (disponível para classes derivadas). |
| `saveTextButton` | `string` | `'Gerar'` | Texto do botão de ação principal (disponível para classes derivadas). |
| `displayActionButton` | `boolean` | `true` | Exibe o botão principal (disponível para classes derivadas). |
| `displaySaveButton` | `boolean` | `true` | Exibe o botão de salvar (disponível para classes derivadas). |
| `displayCancelButton` | `boolean` | `true` | Exibe o botão de cancelar (disponível para classes derivadas). |
| `shouldCloseWhenCancel` | `boolean` | `true` | Define se o cancelamento deve fechar o widget (disponível para classes derivadas). |
| `widgetDirection` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Direção de entrada/saída do widget. `left`/`right` abrem como drawer lateral; `top`/`bottom` abrem como sheet.  |
| `typeCancel` | `'cancel' \| 'back'` | `'cancel'` | Tipo do botão de cancelamento (disponível para classes derivadas). |
| `saveDisabled` | `boolean` | `false` | Desabilita a ação de salvar (disponível para classes derivadas). |
| `saveIcon` | `string` | `'arrow-right'` | Ícone do botão de salvar (disponível para classes derivadas). |
| `saveIconPosition` | `'leading' \| 'trailing'` | `'trailing'` | Posição do ícone do botão de salvar (disponível para classes derivadas). |
| `closeOnClickOutside` | `boolean` | `true` | Fecha o widget ao clicar no backdrop. |
| `confirmOnClose` | `boolean` | `false` | Exige confirmação antes de fechar (disponível para classes derivadas). |

> **Nota:** o template base atual renderiza o header (`title`/`subtitle` + projeção `widget-title`) e a área de conteúdo com scroll. `widgetIcon`, os textos e os controles de ação (`display*`, `saveIcon`, `saveIconPosition`, `saveDisabled`, `typeCancel`, `shouldCloseWhenCancel`, `confirmOnClose`) ficam disponíveis na classe para que componentes derivados montem sua própria barra de ações.

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `save` | `output<void>` | Emitido quando a ação de salvar é acionada. |
| `deleted` | `output<void>` | Emitido quando a ação de exclusão é acionada. |
| `cancelEvent` | `output<void>` | Emitido quando o usuário cancela. |
| `closeRequest` | `output<void>` | Emitido ao final da animação de fechamento. |

**Métodos**

| Método | Descrição |
| --- | --- |
| `closeWidget()` | Inicia o fechamento com animação e emite `closeRequest` ao final. Chamadas repetidas são ignoradas. |
| `saveWidget()` | Emite o evento `save`. |
| `cancelWidget()` | Emite o evento `cancelEvent`. |
| `deletedWidget()` | Emite o evento `deleted`. |
| `onEscapeKey()` | Fecha o widget ao pressionar `ESC`. |
| `onBackdropMouseDown(event)` / `onBackdropMouseUp(event)` | Controlam o fechamento por clique no backdrop, ignorando arrastes que começam no backdrop e terminam no painel. |
| `forwardCloseRequest()` | Repassa o evento `closeRequest` (útil em classes derivadas). |

**Projeção de conteúdo**

- Slot padrão (`<ng-content />`): conteúdo do widget, renderizado dentro da área com scroll.
- Slot nomeado `<widget-title>`: conteúdo adicional no header, ao lado do título.

**Interface `ICaoWidgetOptions<TData>`**

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `inputs` | `Partial<Record<string, unknown>>` | Inputs aplicados ao componente no momento da abertura. |
| `data` | `TData` | Atalho para o input `widgetData`. |
| `onSave` | `() => void` | Callback executado quando o widget emite `save`. |
| `onDelete` | `() => void` | Callback executado quando o widget emite `deleted`. |
| `onClose` | `() => void` | Callback executado ao fechar o widget. |

**`CaoWidgetService`**

| Método | Descrição |
| --- | --- |
| `open<TComponent>(component, options?)` | Abre o componente informado em um overlay. Apenas um widget fica aberto por vez: se já houver um, ele é descartado antes de abrir o novo. |
| `close()` | Fecha o widget aberto programaticamente. |

**Comportamentos importantes**

- O overlay é criado **sem backdrop próprio** e com scroll bloqueado; o backdrop visual e as animações vêm do `BaseWidget`.
- Ao abrir, o serviço registra um estado no histórico do navegador. O botão **voltar** fecha o widget, e o fechamento pelo componente também retorna o histórico.
- Os eventos `save`, `deleted` e `closeRequest` são conectados automaticamente aos callbacks `onSave`, `onDelete` e `onClose`.
- O serviço depende de `window`/`history`, portanto requer ambiente de browser (atenção em SSR).

**CSS Custom Properties**

| Propriedade | Padrão | Descrição |
| --- | --- | --- |
| `--widget-animation-duration` | `250ms` | Duração das animações de entrada e saída do widget. |

**Exemplo de uso — criando um widget**

```typescript
// gerar-exames.widget.ts
import { Component } from '@angular/core';
import { CaoBaseWidgetComponent } from 'ngx-opalbytes-components';

@Component({
  selector: 'app-gerar-exames-widget',
  imports: [CaoBaseWidgetComponent],
  template: `
    <cao-base-widget
      title="Gerar exames"
      subtitle="Selecione as sessões"
      [widgetData]="widgetData()"
      (save)="saveWidget()"
      (closeRequest)="forwardCloseRequest()">
      <p>Total de sessões: {{ widgetData()?.total }}</p>
    </cao-base-widget>
  `,
})
export class GerarExamesWidget extends CaoBaseWidgetComponent<{ total: number }> {}
```

**Exemplo de uso — abrindo via serviço**

```typescript
import { Component, inject } from '@angular/core';
import { CaoWidgetService } from 'ngx-opalbytes-components';
import { GerarExamesWidget } from './gerar-exames.widget';

@Component({ /* ... */ })
export class MinhaPaginaComponent {
  private readonly widgetService = inject(CaoWidgetService);

  abrirWidget(): void {
    this.widgetService.open(GerarExamesWidget, {
      inputs: { subtitle: 'Sessões de hoje' },
      data: { total: 42 },
      onSave: () => console.log('salvar'),
      onDelete: () => console.log('excluir'),
      onClose: () => console.log('fechado'),
    });
  }
}
```

> Os três símbolos (`CaoBaseWidgetComponent`, `CaoWidgetService` e `ICaoWidgetOptions`) são exportados pela API pública da biblioteca.

---

### `FeatureBaseModal`
Um componente de modal genérico que pode ser customizado.

**Seletor:** `<cao-feature-base-modal>`

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `showModal` | `boolean` | `false` | Controla a visibilidade do modal. |
| `title` | `string` | `''` | O título do modal. |
| `data` | `T` | `undefined` | Dados a serem passados para o conteúdo do modal. |
| `modalTypeClass` | `'default' \| 'custom'` | `'default'` | Classe de tipo de modal. |
| `modalClass` | `string` | `'modal-default'` | Classe CSS customizada para o modal. |
| `modalSize` | `'w-100' \| 'w-90' \| ...` | `'w-70'` | Largura do modal. |
| `closeOnOverlayClick`| `boolean`| `false`| Fecha o modal ao clicar no overlay. |

---

### CaoAutocompleteComponent
Um campo de preenchimento automático que funciona com `ngModel` ou `formControlName`.

**Seletor:** `<cao-autocomplete>`

**Interface `ICaoAutoCompleteOption`**

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string \| number` | (Opcional) Identificador único da opção. |
| `nome` | `string` | Texto exibido (usado para filtro e exibição). |
| `icon` | `string` | (Opcional) Caminho ou nome do ícone. |
| `iconPosition` | `string` | (Opcional) Posição do ícone na opção. |

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` | `string` | `''` | O rótulo do campo. |
| `placeholder` | `string` | `''` | O texto de placeholder. |
| `options` | `ICaoAutoCompleteOption[]` | `[]` | A lista de opções para o autocomplete. |
| `control` | `AbstractControl` | `new FormControl()` | O `FormControl` associado. |
| `controlName` | `string` | `''` | O nome do controle de formulário. |
| `dataCy` | `string` | `''` | Atributo para testes E2E. |
| `isLucideIcon` | `boolean` | `false` | Define se `leadingIcon`/`trailingIcon` são ícones Lucide. |
| `iconColor` | `string` | `''` | Cor aplicada aos ícones SVG Lucide. |
| `leadingIcon` | `string` | `undefined` | Ícone exibido antes do texto. |
| `trailingIcon` | `string` | `undefined` | Ícone exibido após o texto. |
| `optionIcon` | `string` | `undefined` | Ícone exibido dentro de cada opção do dropdown. |
| `optionIConColor` | `string` | `undefined` | Cor do ícone das opções. |
| `isLucideOptionIcon` | `boolean` | `undefined` | Define se `optionIcon` é um ícone Lucide. |
| `autocompleteBgColor` | `string` | `'white'` | Cor de fundo do painel de autocomplete. |
| `strokeWidthIcon` | `number` | `1` | Define a espessura (stroke width) do ícone. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `OnItemSelected` | `EventEmitter<ICaoAutoCompleteOption>` | Emitido quando uma opção é selecionada. |
| `OnBlur` | `EventEmitter<void>` | Emitido quando o campo perde o foco. |
| `OnFocus` | `EventEmitter<void>` | Emitido quando o campo recebe o foco. |

**Métodos**

| Método | Descrição |
| --- | --- |
| `setInputHeight(height: string)` | Define a altura do campo via CSS custom property `--form-field-height`. |

**Getter**

| Getter | Tipo | Descrição |
| --- | --- | --- |
| `errorText` | `string \| null` | Retorna mensagens de erro de validação (requerido, CPF, CNPJ, email, etc). |

---

### `BaseTable`
Uma tabela de dados com ordenação, paginação e seleção de linhas. A configuração é feita através do `TableService`.

**Seletor:** `<cao-table>`

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `customClass` | `string` | `''` | Classe CSS customizada para a tabela. |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50]` | Opções para o número de itens por página. |
| `showFirstLastButtons`| `boolean`| `true` | Exibe os botões de primeira/última página. |
| `isPaginatedByServer`| `boolean`| `false` | Define se a paginação é controlada pelo servidor. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `pageChanged` | `EventEmitter<number>` | Emitido quando a página muda. |
| `pageSizeChanged` | `EventEmitter<number>` | Emitido quando o tamanho da página muda. |
| `firstPageClicked` | `EventEmitter<void>` | Emitido ao clicar no botão de primeira página. |
| `lastPageClicked` | `EventEmitter<void>` | Emitido ao clicar no botão de última página. |
| `selectionChanged` | `EventEmitter<any[]>` | Emitido quando a seleção de linhas muda. |
| `pageEvent` | `EventEmitter<PageEvent>`| Emitido em qualquer evento de paginação. |

---

### BaseTablePaginated
Uma tabela de dados leve com paginação no lado do cliente. Herda a maioria de suas funcionalidades do `BaseTable`.

**Seletor:** `<cao-table-light-paginated>`

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `getColumnCssClass`| `(columnKey: string, value: any) => string` | `null` | Função para obter classes CSS customizadas para células. |
| `customClass` | `string` | `''` | Classe CSS customizada para a tabela. |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 50]` | Opções para o número de itens por página. |
| `showFirstLastButtons`| `boolean`| `true` | Exibe os botões de primeira/última página. |
| `isPaginatedByServer`| `boolean`| `true` | Define se a paginação é controlada pelo servidor (sempre `true` neste componente). |


**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `rowClicked` | `EventEmitter<any>` | Emitido quando uma linha da tabela é clicada. |
| `pageChanged` | `EventEmitter<number>` | Emitido quando a página muda. |
| `pageSizeChanged` | `EventEmitter<number>` | Emitido quando o tamanho da página muda. |
| `firstPageClicked` | `EventEmitter<void>` | Emitido ao clicar no botão de primeira página. |
| `lastPageClicked` | `EventEmitter<void>` | Emitido ao clicar no botão de última página. |
| `selectionChanged` | `EventEmitter<any[]>` | Emitido quando a seleção de linhas muda. |
| `pageEvent` | `EventEmitter<PageEvent>`| Emitido em qualquer evento de paginação. |

---

### `BaseTimeRange`
Um seletor de intervalo de datas.

**Seletor:** `<cao-base-time-range>`

**Atributos (Inputs)**

| Atributo | Tipo | Descrição |
| --- | --- | --- |
| `label` | `string` | O rótulo do campo. |
| `max` | `Date` | A data máxima permitida. |
| `minDate` | `Date` | A data mínima permitida. |
| `maxDate` | `Date` | A data máxima permitida para o segundo campo. |
| `startDate` | `Date` | A data de início pré-selecionada. |
| `finalDate` | `Date` | A data final pré-selecionada. |
| `dataCy` | `string` | Atributo para testes E2E. |
| `controlName` | `string` | O nome do controle de formulário. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `rangeSelected`| `EventEmitter<Date[]>` | Emitido quando um intervalo de datas é selecionado. |

---

### `BaseToggle`
Um componente de alternância (toggle switch) que funciona com `ngModel` ou `formControlName`, com suporte a ícones, máscaras e validação.

**Seletor:** `<cao-base-toggle>`

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `type` | `string` | `'text'` | O tipo de input. |
| `placeholder` | `string` | `''` | O texto de placeholder. |
| `inputClass` | `string` | `''` | Classes CSS customizadas para o input. |
| `value` | `string \| number \| boolean \| Date` | `''` | O valor do componente. |
| `errorMessage` | `string` | `''` | Mensagem de erro a ser exibida. |
| `isDisabled` | `boolean` | `false` | Desabilita o toggle. |
| `maxLength` | `number` | `undefined` | Número máximo de caracteres. |
| `searchMode` | `boolean` | `false` | Ativa o modo de busca. |
| `showBorder` | `boolean` | `false` | Exibe uma borda no input. |
| `isLucideIcon` | `boolean` | `false` | Define se o ícone é do pacote Lucide. |
| `iconColor` | `string` | `''` | Cor do ícone. |
| `mask` | `string` | `undefined` | Máscara a ser aplicada ao input. |
| `control` | `AbstractControl \| null` | `undefined` | O `FormControl` associado. |
| `tooltip` | `string` | `''` | Texto a ser exibido em uma tooltip. |
| `dataCy` | `string` | `''` | Atributo para testes E2E com Cypress. |
| `textareaRows` | `string` | `''` | Número de linhas para um textarea. |
| `decimalMarker` | `'.' \| ',' \| ['.', ',']` | `','` | Marcador decimal para números. |
| `thousandSeparator` | `string` | `'.'` | Separador de milhares para números. |
| `allowNegativeNumbers` | `boolean` | `false` | Permite números negativos. |
| `separatorLimit` | `string` | `''` | Limite do separador. |
| `controlName` | `string` | `''` | O nome do controle de formulário. |
| `isChecked` | `boolean` | `false` | Define se o toggle está ativado. |
| `checkedTextPlaceholder` | `string` | `''` | Texto exibido quando o toggle está ativado. |
| `uncheckedTextPlaceholder` | `string` | `''` | Texto exibido quando o toggle está desativado. |
| `leadingIcon` | `string` | `undefined` | Ícone exibido antes do texto. |
| `trailingIcon` | `string` | `undefined` | Ícone exibido após o texto. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `valueChange` | `EventEmitter<string>` | Emitido quando o valor do input muda. |
| `searchClick` | `EventEmitter<void>` | Emitido quando o ícone de busca é clicado. |
| `inputChange` | `EventEmitter<string>` | Emitido a cada mudança no input. |
| `statusChanged` | `EventEmitter<CaoBaseToggleComponent>` | Emitido quando o toggle é alternado. |

---

### `CaoBreadcrumbComponent`
 
Trilha de navegação (breadcrumb) com ícones Lucide ou imagem, link de navegação, badge e divisor customizável.
 
**Seletor:** `<cao-breadcrumb>`
 
**Interface `ICaoBreadcrumbItem`**
 
| Propriedade | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` | `string` | — | Texto do item. |
| `icon` | `string` | — | Nome do ícone Lucide ou URL/caminho/data URI de imagem. |
| `isLucideIcon` | `boolean` | `true` | Define se `icon` é Lucide. |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Direção do ícone em relação ao texto. |
| `iconColor` / `iconSize` / `iconStrokeWidth` | `string` / `number` / `number` | — / `16` / `1.5` | Aparência do ícone. |
| `link` | `string \| unknown[]` | — | Navegação interna (`routerLink`). |
| `queryParams` | `Params` | — | Query params do `link`. |
| `href` / `target` | `string` / `'_self' \| '_blank' ...` | — | Navegação externa. |
| `command` | `(e: ICaoBreadcrumbItemClickEvent) => void` | — | Callback de clique (sem `link`/`href` vira `<button>`). |
| `badge` / `badgeColor` / `badgeBgColor` | `string \| number` / `string` / `string` | — | Badge do item. |
| `disabled` | `boolean` | `false` | Desabilita o item. |
| `ariaLabel` / `dataCy` | `string` | — | Acessibilidade e testes E2E. |
 
**Atributos (Inputs)**
 
| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `items` | `ICaoBreadcrumbItem[]` | `[]` | Itens; o último é a página atual (`aria-current="page"`). |
| `home` | `ICaoBreadcrumbItem` | `undefined` | Item inicial opcional. |
| `separator` | `string` | `'/'` | Texto do divisor. |
| `separatorIcon` | `string` | `''` | Ícone do divisor (sobrepõe `separator`). |
| `isLucideSeparatorIcon` | `boolean` | `true` | Define se `separatorIcon` é Lucide. |
| `separatorIconSize` / `separatorIconStrokeWidth` | `number` | `14` / `1.5` | Aparência do ícone divisor. |
| `linkColor`, `linkHoverColor`, `currentColor`, `separatorColor`, `fontSize`, `gap` | `string` | `''` | Atalhos para as CSS custom properties. |
| `ariaLabel` | `string` | `'Breadcrumb'` | `aria-label` do `<nav>`. |
| `dataCy` | `string` | `''` | Atributo para testes E2E. |
 
**Eventos (Outputs):** `itemClick` → `ICaoBreadcrumbItemClickEvent` (`item`, `index`, `originalEvent`).
 
**CSS Custom Properties:** `--cao-breadcrumb-link-color` (`#6b7280`), `--cao-breadcrumb-link-hover-color` (`#4f46e5`), `--cao-breadcrumb-current-color` (`#111827`), `--cao-breadcrumb-separator-color` (`#9ca3af`), `--cao-breadcrumb-disabled-color`, `--cao-breadcrumb-focus-ring`, `--cao-breadcrumb-badge-bg`, `--cao-breadcrumb-badge-text`, `--cao-breadcrumb-gap` (`8px`), `--cao-breadcrumb-font-size` (`0.875rem`).
 
```html
<cao-breadcrumb
  [home]="{ icon: 'house', ariaLabel: 'Início', link: '/' }"
  [items]="[
    { label: 'Pedidos', icon: 'package', iconPosition: 'right', link: '/pedidos', badge: 12 },
    { label: 'Pedido #42' }
  ]"
  separatorIcon="chevron-right" />
```
 
> Depende de `BaseIcon` (copie junto ao usar `cao-comp`) e de `@angular/router`.

---
### `CaoAccordionComponent` e `CaoAccordionItemComponent`

Um accordion (painéis expansíveis) acessível e totalmente customizável, inspirado na API do `CdkAccordion`, mas **sem depender do `@angular/cdk`, do Angular Material ou de qualquer outra biblioteca externa** — usa apenas `@angular/core` e `@angular/common`. Cores, posições, textos e visibilidade são configuráveis por inputs ou por CSS custom properties. A animação de abrir/fechar é feita só com CSS e respeita `prefers-reduced-motion`.

**Seletores:**
- `<cao-accordion>` — container (controla modo único/múltiplo e o tema herdado pelos itens)
- `<cao-accordion-item>` — painel individual (também pode ser usado isolado, como um cartão expansível)

#### Atributos do `CaoAccordionComponent` (Inputs)

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `multi` | `boolean` | `false` | Permite vários itens expandidos ao mesmo tempo. No modo único, expandir um item recolhe os demais. |
| `displayMode` | `'default' \| 'flat' \| 'separated'` | `'default'` | `default`: painéis unidos em um único contorno arredondado; `flat`: unidos, sem bordas laterais/cantos; `separated`: cada painel é um cartão separado por `gap`. |
| `hideToggle` | `boolean` | `false` | Oculta o ícone de expandir/recolher em todos os itens. |
| `isVisible` | `boolean` | `true` | Exibe ou oculta o accordion inteiro. |
| `togglePosition` | `'before' \| 'after'` | `'after'` | Posição do ícone em relação ao texto do cabeçalho. |
| `headerAlign` | `'start' \| 'center' \| 'end'` | `'start'` | Alinhamento do texto do cabeçalho. |
| `contentAlign` | `'start' \| 'center' \| 'end'` | `'start'` | Alinhamento do texto do conteúdo. |
| `headerBgColor` | `string` | `#ffffff` | Cor de fundo do cabeçalho. |
| `headerTextColor` | `string` | `#111827` | Cor do texto do cabeçalho. |
| `headerHoverBgColor` | `string` | `#f3f4f6` | Cor de fundo do cabeçalho ao passar o mouse. |
| `headerActiveBgColor` | `string` | cor do cabeçalho | Cor de fundo do cabeçalho do item expandido. |
| `activeColor` | `string` | `#4f46e5` | Cor do texto/ícone do cabeçalho do item expandido. |
| `contentBgColor` | `string` | `#ffffff` | Cor de fundo do conteúdo. |
| `contentTextColor` | `string` | `#374151` | Cor do texto do conteúdo. |
| `borderColor` | `string` | `#e5e7eb` | Cor das bordas e divisórias. |
| `disabledColor` | `string` | `#9ca3af` | Cor do texto de itens desabilitados. |
| `focusRingColor` | `string` | `rgba(79, 70, 229, 0.35)` | Cor do anel de foco do teclado. |
| `iconColor` | `string` | `currentColor` | Cor do ícone de expandir/recolher. |
| `borderRadius` | `string` | `8px` | Raio da borda. |
| `gap` | `string` | `8px` | Espaçamento entre os itens (modo `separated`). |
| `headerPadding` | `string` | `12px 16px` | Padding do cabeçalho. |
| `contentPadding` | `string` | `16px` | Padding do conteúdo. |
| `animationDuration` | `string` | `250ms` | Duração da animação. |
| `dataCy` | `string` | `''` | Atributo `data-cy` para testes E2E. |

#### Métodos do `CaoAccordionComponent`

| Método | Descrição |
| --- | --- |
| `openAll()` | Expande todos os itens. Só tem efeito quando `multi` está ativo. |
| `closeAll()` | Recolhe todos os itens. |

#### Atributos do `CaoAccordionItemComponent` (Inputs)

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` | `string` | `''` | Texto do cabeçalho. |
| `description` | `string` | `''` | Texto secundário exibido abaixo do `label`. |
| `expanded` | `boolean` | `false` | Estado de expansão. Suporta two-way binding: `[(expanded)]`. |
| `isDisabled` | `boolean` | `false` | Desabilita a interação do usuário com o item. |
| `isVisible` | `boolean` | `true` | Exibe ou oculta o item. |
| `headingLevel` | `number` | `3` | Nível do heading (`aria-level`) do cabeçalho. |
| `hideToggle` | `boolean` | herda do accordion | Oculta o ícone neste item. |
| `togglePosition` | `'before' \| 'after'` | herda do accordion | Posição do ícone neste item. |
| `headerAlign` | `'start' \| 'center' \| 'end'` | herda do accordion | Alinhamento do cabeçalho neste item. |
| `headerBgColor` | `string` | herda do accordion | Cor de fundo do cabeçalho deste item. |
| `headerTextColor` | `string` | herda do accordion | Cor do texto do cabeçalho deste item. |
| `headerActiveBgColor` | `string` | herda do accordion | Cor de fundo do cabeçalho quando expandido. |
| `activeColor` | `string` | herda do accordion | Cor do texto/ícone quando expandido. |
| `contentBgColor` | `string` | herda do accordion | Cor de fundo do conteúdo. |
| `contentTextColor` | `string` | herda do accordion | Cor do texto do conteúdo. |
| `borderColor` | `string` | herda do accordion | Cor das bordas. |
| `iconColor` | `string` | herda do accordion | Cor do ícone. |
| `dataCy` | `string` | `''` | Atributo `data-cy` para testes E2E (veja abaixo). |

#### Eventos do `CaoAccordionItemComponent` (Outputs)

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `opened` | `output<void>` | Emitido quando o item é expandido. |
| `closed` | `output<void>` | Emitido quando o item é recolhido. |
| `expandedChange` | `output<boolean>` | Emitido a cada mudança de estado (usado pelo `[(expanded)]`). |

#### Métodos do `CaoAccordionItemComponent`

| Método | Descrição |
| --- | --- |
| `toggle()` | Alterna o estado (ignorado se o item estiver desabilitado). |
| `open()` | Expande o item. |
| `close()` | Recolhe o item. |

#### Projeção de conteúdo

| Recurso | Descrição |
| --- | --- |
| Slot padrão (`<ng-content />`) | Conteúdo do painel. |
| `[caoAccordionHeader]` | Conteúdo extra projetado no cabeçalho, abaixo do `label`/`description` (ex.: badges, status). |

#### `data-cy` para testes E2E

Ao informar `dataCy="faq"` em um item, são gerados automaticamente os seletores:

| Elemento | Atributo |
| --- | --- |
| Item (host) | `data-cy="faq"` |
| Botão do cabeçalho | `data-cy="faq-header"` |
| Painel de conteúdo | `data-cy="faq-content"` |

```typescript
cy.get('[data-cy="faq-header"]').click();
cy.get('[data-cy="faq-content"]').should('be.visible');
```

#### CSS Custom Properties

Podem ser definidas globalmente, por accordion ou por item (têm precedência sobre os valores padrão, e os inputs equivalentes as definem automaticamente).

| Propriedade | Padrão | Descrição |
| --- | --- | --- |
| `--cao-accordion-header-bg` | `#ffffff` | Fundo do cabeçalho. |
| `--cao-accordion-header-text` | `#111827` | Texto do cabeçalho. |
| `--cao-accordion-header-hover-bg` | `#f3f4f6` | Fundo do cabeçalho no hover. |
| `--cao-accordion-header-active-bg` | `var(--cao-accordion-header-bg)` | Fundo do cabeçalho expandido. |
| `--cao-accordion-active-color` | `#4f46e5` | Texto/ícone do cabeçalho expandido. |
| `--cao-accordion-content-bg` | `#ffffff` | Fundo do conteúdo. |
| `--cao-accordion-content-text` | `#374151` | Texto do conteúdo. |
| `--cao-accordion-border-color` | `#e5e7eb` | Bordas e divisórias. |
| `--cao-accordion-disabled-color` | `#9ca3af` | Texto desabilitado. |
| `--cao-accordion-focus-ring` | `rgba(79, 70, 229, 0.35)` | Anel de foco. |
| `--cao-accordion-icon-color` | `currentColor` | Cor do ícone. |
| `--cao-accordion-radius` | `8px` | Raio da borda. |
| `--cao-accordion-gap` | `8px` | Espaço entre itens (`separated`). |
| `--cao-accordion-header-padding` | `12px 16px` | Padding do cabeçalho. |
| `--cao-accordion-content-padding` | `16px` | Padding do conteúdo. |
| `--cao-accordion-header-align` | `start` | Alinhamento do texto do cabeçalho. |
| `--cao-accordion-content-align` | `start` | Alinhamento do texto do conteúdo. |
| `--cao-accordion-duration` | `250ms` | Duração da animação. |

**Exemplo básico:**

```typescript
import { Component } from '@angular/core';
import { CaoAccordionComponent, CaoAccordionItemComponent } from 'ngx-opalbytes-components';

@Component({
  selector: 'app-faq',
  imports: [CaoAccordionComponent, CaoAccordionItemComponent],
  template: `
    <cao-accordion dataCy="faq-accordion">
      <cao-accordion-item label="Como funciona?" dataCy="faq-1" [expanded]="true">
        Conteúdo da primeira pergunta.
      </cao-accordion-item>
      <cao-accordion-item label="Posso cancelar?" description="Sem multa" dataCy="faq-2">
        Conteúdo da segunda pergunta.
      </cao-accordion-item>
    </cao-accordion>
  `,
})
export class FaqComponent {}
```

**Exemplo com múltiplos itens abertos, cores, ícone antes do texto e controle externo:**

```html
<cao-accordion
  #acc
  [multi]="true"
  displayMode="separated"
  togglePosition="before"
  headerAlign="center"
  headerBgColor="#eef2ff"
  headerTextColor="#312e81"
  activeColor="#16a34a"
  contentBgColor="#ffffff"
  borderColor="#c7d2fe"
  borderRadius="12px"
  animationDuration="400ms"
  dataCy="meu-accordion">

  <cao-accordion-item label="Dados pessoais" [(expanded)]="dadosAbertos" (opened)="onAbriu()" (closed)="onFechou()">
    ...
  </cao-accordion-item>

  <cao-accordion-item label="Pagamento" [isDisabled]="semPermissao" headerBgColor="#fef3c7">
    <span caoAccordionHeader>Pendente</span>
    ...
  </cao-accordion-item>

  <cao-accordion-item label="Somente admin" [isVisible]="ehAdmin" [hideToggle]="true">
    ...
  </cao-accordion-item>
</cao-accordion>

<cao-button buttonText="Abrir todos" (buttonClick)="acc.openAll()"></cao-button>
<cao-button buttonText="Fechar todos" (buttonClick)="acc.closeAll()"></cao-button>
```

**Observações:**

- Sem dependências externas: não usa `@angular/cdk`, `@angular/material`, `@lucide/angular` nem `ngx-mask`; o ícone é um SVG inline.
- Acessibilidade: o cabeçalho é um `<button>` dentro de um `role="heading"`, com `aria-expanded`, `aria-controls` e painel `role="region"` com `aria-labelledby`. Painéis recolhidos ficam fora da ordem de tabulação e do leitor de tela.
- Teclado: `Enter`/`Espaço` alternam o item; `↑`/`↓` movem o foco entre cabeçalhos; `Home`/`End` vão ao primeiro/último.
- Itens definidos como `isDisabled` bloqueiam apenas a interação do usuário; `open()`, `close()` e `[expanded]` continuam funcionando programaticamente.
- Os inputs do `<cao-accordion-item>` sobrescrevem os do `<cao-accordion>` apenas naquele item.
- Fora de um `<cao-accordion>`, o item se comporta como um cartão expansível independente.

---
### `CaoAvatarComponent`

Avatar para representar usuários ou entidades, com imagem, ícone (Lucide ou imagem) ou texto (iniciais). Possui imagem padrão embutida, usada enquanto nenhuma fonte for informada ou quando a imagem falha ao carregar. Tamanho, formato e contorno (stroke) são configuráveis.

**Seletor:** `<cao-avatar>`

**Tipos**

| Tipo | Valores |
| --- | --- |
| `CaoAvatarPresetSize` | `'small'` (24px) \| `'normal'` (32px) \| `'large'` (48px) \| `'xlarge'` (64px) |
| `CaoAvatarShape` | `'circle'` \| `'rounded'` \| `'square'` |
| `CaoAvatarStrokeStyle` | `'solid'` \| `'dashed'` \| `'dotted'` \| `'double'` |

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `src` | `string \| null \| undefined` | `''` | URL da imagem. Se vazia ou se falhar ao carregar, o avatar usa `icon`, `label` ou a imagem padrão (nessa ordem). |
| `defaultSrc` | `string` | `''` | Imagem padrão customizada. Se vazia, usa a silhueta embutida (`CAO_AVATAR_DEFAULT_SRC`). |
| `label` | `string` | `''` | Texto exibido (ex.: iniciais) quando não há imagem nem ícone. |
| `icon` | `string` | `''` | Nome do ícone Lucide ou caminho/URL de imagem usada como ícone. |
| `isLucideIcon` | `boolean` | `true` | Define se `icon` é um ícone Lucide. |
| `iconColor` | `string` | `''` | Cor do ícone Lucide. Se vazia, usa `textColor`. |
| `size` | `CaoAvatarPresetSize \| number \| string` | `'normal'` | Tamanho predefinido, número em px ou texto (`'72px'`, `'4.5rem'`). Valores inválidos voltam para `'normal'`. |
| `shape` | `CaoAvatarShape` | `'circle'` | Formato do avatar. |
| `strokeWidth` | `number \| string` | `0` | Espessura do contorno. Número é convertido para `px`; `0` remove o contorno. |
| `strokeColor` | `string` | `'#ffffff'` | Cor do contorno. |
| `strokeStyle` | `CaoAvatarStrokeStyle` | `'solid'` | Estilo do contorno. |
| `bgColor` | `string` | `''` | Cor de fundo (sobrescreve `--cao-avatar-bg`). |
| `textColor` | `string` | `''` | Cor do texto/ícone (sobrescreve `--cao-avatar-text`). |
| `alt` | `string` | `''` | Texto alternativo do avatar. |
| `ariaLabel` | `string` | `''` | `aria-label` do avatar. Prioridade: `ariaLabel` → `alt` → `label` → `'Avatar'`. |
| `dataCy` | `string` | `''` | Atributo para testes E2E com Cypress. |

**Ordem de exibição**

1. `src` (se informado e carregado com sucesso);
2. `icon`;
3. `label`;
4. imagem padrão (`defaultSrc` ou a silhueta embutida).

Se o `src` falhar ao carregar (erro 404, URL inválida etc.), o componente passa automaticamente para o próximo item da lista.

**Constantes exportadas**

| Constante | Descrição |
| --- | --- |
| `CAO_AVATAR_DEFAULT_SRC` | Data URI da imagem padrão (silhueta em SVG, funciona offline). |
| `CAO_AVATAR_SIZES` | Mapa dos tamanhos predefinidos em px (`small`, `normal`, `large`, `xlarge`). |

**CSS Custom Properties**

| Propriedade | Padrão | Descrição |
| --- | --- | --- |
| `--cao-avatar-bg` | `#e5e7eb` | Cor de fundo. |
| `--cao-avatar-text` | `#374151` | Cor do texto/ícone. |
| `--cao-avatar-radius` | `25%` | Raio da borda no formato `rounded`. |

**Exemplo básico:**

```html
<!-- Sem src: exibe a imagem padrão -->
<cao-avatar></cao-avatar>

<!-- Com imagem -->
<cao-avatar src="https://exemplo.com/foto.png" alt="Foto de Maria" size="large"></cao-avatar>

<!-- Com iniciais -->
<cao-avatar label="MB" bgColor="#eef2ff" textColor="#4338ca"></cao-avatar>

<!-- Com ícone Lucide -->
<cao-avatar icon="user" bgColor="#dcfce7" iconColor="#166534"></cao-avatar>
```

**Exemplo com tamanho, formato e contorno:**

```html
<cao-avatar src="assets/foto.png" size="xlarge" shape="rounded"></cao-avatar>
<cao-avatar src="assets/foto.png" [size]="96" shape="square"></cao-avatar>
<cao-avatar src="assets/foto.png" size="7rem"></cao-avatar>

<cao-avatar
  src="assets/foto.png"
  size="xlarge"
  [strokeWidth]="3"
  strokeColor="#4f46e5"
  strokeStyle="dashed">
</cao-avatar>
```

**Exemplo com imagem padrão customizada:**

```html
<cao-avatar [src]="usuario.foto" defaultSrc="assets/avatar-padrao.png"></cao-avatar>
```

**Observações:**

- Possui `role="img"` com `aria-label`; a imagem interna é decorativa (`alt=""`), evitando leitura duplicada.
- A imagem padrão é um SVG em data URI e passa por `DomSanitizer.bypassSecurityTrustUrl` (conteúdo controlado pela lib). Data URIs em SVG informadas em `src` **não** recebem esse tratamento e podem ser bloqueadas pelo sanitizador do Angular — use URL, caminho de arquivo ou PNG/JPEG em base64.
- Para ícones Lucide, registre os ícones usados com `provideLucideIcons` (de `@lucide/angular`).
- Depende de `BaseIcon` (copie junto ao usar `cao-comp`).
---
### `CaoSlideToggleComponent`

Um switch (slide toggle) acessível e customizável, com suporte a `ngModel` e formulários reativos via `ControlValueAccessor`. O visual é construído com trilho e thumb animados, sem depender do Material em runtime.

**Seletor:** `<cao-slide-toggle>`

**Interface `ICaoSlideToggleChangeEvent`**

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `checked` | `boolean` | Novo estado do switch. |
| `source` | `CaoSlideToggleComponent` | Instância que originou o evento. |

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` | Estado inicial/atual do switch. |
| `isDisabled` | `boolean` | `false` | Desabilita o componente. |
| `disabled` | `boolean` | `false` | Alias de `isDisabled` (mesmo comportamento). |
| `label` | `string` | `''` | Texto do label. Também aceita conteúdo projetado (`<ng-content>`). |
| `labelPosition` | `'before' \| 'after'` | `'after'` | Posição do label em relação ao switch. |
| `name` | `string` | `''` | Atributo `name` do input nativo. |
| `id` | `string` | `''` | Atributo `id` do input nativo. |
| `ariaLabel` | `string` | `''` | Atributo `aria-label` do switch. |
| `required` | `boolean` | `false` | Marca o input como obrigatório. |
| `dataCy` | `string` | `''` | Atributo para testes E2E com Cypress. |
| `trackColor` | `string` | `#d1d5db` | Cor do trilho desligado. |
| `trackCheckedColor` | `string` | `#4f46e5` | Cor do trilho ligado. |
| `thumbColor` | `string` | `#ffffff` | Cor do thumb desligado. |
| `thumbCheckedColor` | `string` | `#ffffff` | Cor do thumb ligado. |
| `disabledTrackColor` | `string` | `#e5e7eb` | Cor do trilho desabilitado. |
| `disabledThumbColor` | `string` | `#f3f4f6` | Cor do thumb desabilitado. |
| `labelColor` | `string` | `#111827` | Cor do label. |
| `disabledLabelColor` | `string` | `#9ca3af` | Cor do label desabilitado. |
| `focusRingColor` | `string` | `rgba(79, 70, 229, 0.35)` | Cor do anel de foco. |
| `trackWidth` | `string` | `36px` | Largura do trilho. |
| `trackHeight` | `string` | `20px` | Altura do trilho. |
| `thumbSize` | `string` | `16px` | Tamanho do thumb. |
| `animationDuration` | `string` | `200ms` | Duração da animação. |
| `thumbIcon` | `string` | `''` | Ícone exibido no thumb desligado. Pode ser um nome Lucide ou uma URL de imagem. |
| `thumbCheckedIcon` | `string` | `''` | Ícone exibido no thumb ligado. Se vazio, usa `thumbIcon`. |
| `isLucideThumbIcon` | `boolean` | `false` | Interpreta os ícones do thumb como nomes Lucide. Quando `false`, usa `<img>`. |
| `thumbIconColor` | `string` | `''` | Cor do ícone Lucide no estado desligado. |
| `thumbCheckedIconColor` | `string` | `''` | Cor do ícone Lucide no estado ligado. Se vazio, usa `thumbIconColor`. |
| `thumbIconSize` | `string \| number` | `12` | Tamanho do ícone do thumb. |
| `thumbIconStrokeWidth` | `string \| number` | `2` | Espessura do traço do ícone Lucide. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `checkedChange` | `EventEmitter<boolean>` | Emitido quando o estado muda. |
| `toggleChange` | `EventEmitter<ICaoSlideToggleChangeEvent>` | Emitido com o novo estado e a origem. |

**Métodos**

| Método | Descrição |
| --- | --- |
| `toggle()` | Alterna o estado, se não estiver desabilitado. |
| `setChecked(value: boolean)` | Define o estado programaticamente, se não estiver desabilitado. |
| `enable()` | Habilita o componente. |
| `disable()` | Desabilita o componente. |
| `writeValue(value)` | Implementação de `ControlValueAccessor`. |
| `setDisabledState(isDisabled)` | Implementação de `ControlValueAccessor`. |

**CSS Custom Properties**

| Propriedade | Padrão | Descrição |
| --- | --- | --- |
| `--cao-slide-toggle-track` | `#d1d5db` | Cor do trilho desligado. |
| `--cao-slide-toggle-track-checked` | `#4f46e5` | Cor do trilho ligado. |
| `--cao-slide-toggle-thumb` | `#ffffff` | Cor do thumb desligado. |
| `--cao-slide-toggle-thumb-checked` | `#ffffff` | Cor do thumb ligado. |
| `--cao-slide-toggle-track-disabled` | `#e5e7eb` | Cor do trilho desabilitado. |
| `--cao-slide-toggle-thumb-disabled` | `#f3f4f6` | Cor do thumb desabilitado. |
| `--cao-slide-toggle-label` | `#111827` | Cor do label. |
| `--cao-slide-toggle-label-disabled` | `#9ca3af` | Cor do label desabilitado. |
| `--cao-slide-toggle-focus-ring` | `rgba(79, 70, 229, 0.35)` | Cor do anel de foco. |
| `--cao-slide-toggle-track-width` | `36px` | Largura do trilho. |
| `--cao-slide-toggle-track-height` | `20px` | Altura do trilho. |
| `--cao-slide-toggle-thumb-size` | `16px` | Tamanho do thumb. |
| `--cao-slide-toggle-duration` | `200ms` | Duração da animação. |

**Exemplo com `ngModel`:**

```html
<cao-slide-toggle
  label="Ativar notificações"
  [(ngModel)]="notificacoesAtivas"
  (checkedChange)="onCheckedChange($event)">
</cao-slide-toggle>
```

**Exemplo com formulário reativo e cores customizadas:**

```html
<cao-slide-toggle
  label="Modo escuro"
  [formControl]="modoEscuro"
  trackCheckedColor="#16a34a"
  thumbCheckedColor="#ffffff"
  trackColor="#fca5a5"
  labelColor="#166534"
  labelPosition="before">
</cao-slide-toggle>
```

**Exemplo com ícones Lucide no thumb:**

```html
<cao-slide-toggle
  label="Notificações"
  [(ngModel)]="notificacoesAtivas"
  thumbIcon="x"
  thumbCheckedIcon="check"
  [isLucideThumbIcon]="true"
  thumbIconColor="#6b7280"
  thumbCheckedIconColor="#16a34a"
  [thumbIconSize]="12"
  [thumbIconStrokeWidth]="2.5">
</cao-slide-toggle>
```

**Exemplo com imagem no thumb:**

```html
<cao-slide-toggle
  label="Ícone customizado"
  [(ngModel)]="ativo"
  thumbIcon="assets/icone-desligado.svg"
  thumbCheckedIcon="assets/icone-ligado.svg"
  [isLucideThumbIcon]="false"
  [thumbIconSize]="10">
</cao-slide-toggle>
```

Se `thumbCheckedIcon` não for informado, o componente reutiliza `thumbIcon` no estado ligado.

**Exemplo desabilitado programaticamente:**

```typescript
@ViewChild(CaoSlideToggleComponent)
slideToggle!: CaoSlideToggleComponent;

bloquear(): void {
  this.slideToggle.disable();
}

liberar(): void {
  this.slideToggle.enable();
}
```

**Observações:**

- Usa um `input type="checkbox"` com `role="switch"`, com suporte a `Espaço`, `Enter`, foco visível e leitores de tela.
- Funciona com `ngModel`, `formControlName` e `FormControl.disable()`.
- As cores podem ser definidas por inputs ou por CSS custom properties.

---

### `CaoRadioGroupComponent` e `CaoRadioButtonComponent`

Sistema de radio buttons no estilo do Material, com navegação por teclado, suporte a formulários e customização de cores. O grupo é o dono do valor selecionado; os botões apenas declaram seu `value` e o label.

**Seletores:**
- `<cao-radio-group>` — container do grupo
- `<cao-radio-button>` — opção individual (deve ficar dentro do grupo)

**Interface `ICaoRadioChangeEvent`**

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `value` | `unknown` | Valor recém-selecionado. |
| `source` | `CaoRadioButtonComponent` | Botão que originou o evento. |

#### Atributos do `CaoRadioGroupComponent` (Inputs)

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `value` | `any` | `undefined` | Valor selecionado. Também funciona via `ngModel`/`formControlName`. |
| `name` | `string` | gerado automaticamente | Nome compartilhado pelos inputs nativos do grupo. |
| `isDisabled` | `boolean` | `false` | Desabilita todas as opções. |
| `disabled` | `boolean` | `false` | Alias de `isDisabled`. |
| `required` | `boolean` | `false` | Marca o grupo como obrigatório. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Direção do layout. |
| `labelPosition` | `'before' \| 'after'` | `'after'` | Posição padrão dos labels. |
| `color` | `string` | `#4f46e5` | Cor da opção selecionada (borda e ponto). |
| `unselectedColor` | `string` | `#6b7280` | Cor da borda da opção não selecionada. |
| `disabledColor` | `string` | `#d1d5db` | Cor da opção desabilitada. |
| `labelColor` | `string` | `#111827` | Cor dos labels. |
| `disabledLabelColor` | `string` | `#9ca3af` | Cor dos labels desabilitados. |
| `focusRingColor` | `string` | `rgba(79, 70, 229, 0.35)` | Cor do anel de foco. |
| `size` | `string` | `20px` | Tamanho do círculo. |
| `animationDuration` | `string` | `200ms` | Duração das animações. |
| `gap` | `string` | `8px` | Espaçamento entre as opções. |
| `compareWith` | `(option, value) => boolean` | `===` | Comparador customizado de valores. |
| `ariaLabel` | `string` | `''` | Atributo `aria-label` do grupo. |
| `ariaLabelledBy` | `string` | `''` | Atributo `aria-labelledby` do grupo. |
| `dataCy` | `string` | `''` | Atributo para testes E2E. |

#### Eventos do `CaoRadioGroupComponent` (Outputs)

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `valueChange` | `EventEmitter<any>` | Emitido quando o valor selecionado muda. |
| `selectionChange` | `EventEmitter<ICaoRadioChangeEvent>` | Emitido com o valor e o botão de origem. |

#### Métodos do `CaoRadioGroupComponent`

| Método | Descrição |
| --- | --- |
| `enable()` | Habilita o grupo e todas as opções. |
| `disable()` | Desabilita o grupo e todas as opções. |
| `isValueSelected(value)` | Verifica se um valor está selecionado usando `compareWith`. |
| `markAsTouched()` | Marca o controle como tocado. |
| `writeValue(value)` | Implementação de `ControlValueAccessor`. |
| `setDisabledState(isDisabled)` | Implementação de `ControlValueAccessor`. |

#### Atributos do `CaoRadioButtonComponent` (Inputs)

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `value` | `any` | `undefined` | **Obrigatório.** Valor único da opção dentro do grupo. |
| `label` | `string` | `''` | Texto do label. Também aceita conteúdo projetado. |
| `isDisabled` | `boolean` | `false` | Desabilita apenas esta opção. |
| `disabled` | `boolean` | `false` | Alias de `isDisabled`. |
| `labelPosition` | `'before' \| 'after'` | herda do grupo | Posição do label desta opção. |
| `name` | `string` | herda do grupo | Sobrescreve o nome do grupo para esta opção. |
| `id` | `string` | gerado automaticamente | Atributo `id` do input. |
| `ariaLabel` | `string` | `''` | Atributo `aria-label` da opção. |
| `ariaLabelledBy` | `string` | `''` | Atributo `aria-labelledby` da opção. |
| `dataCy` | `string` | `''` | Atributo para testes E2E. |
| `color` | `string` | herda do grupo | Cor da opção selecionada. |
| `unselectedColor` | `string` | herda do grupo | Cor da borda não selecionada. |
| `disabledColor` | `string` | herda do grupo | Cor da opção desabilitada. |
| `labelColor` | `string` | herda do grupo | Cor do label. |
| `disabledLabelColor` | `string` | herda do grupo | Cor do label desabilitado. |
| `focusRingColor` | `string` | herda do grupo | Cor do anel de foco. |
| `size` | `string` | herda do grupo | Tamanho do círculo. |
| `animationDuration` | `string` | herda do grupo | Duração das animações. |

#### Métodos do `CaoRadioButtonComponent`

| Método | Descrição |
| --- | --- |
| `select()` | Seleciona a opção no grupo, se estiver habilitada. |
| `enable()` | Habilita apenas esta opção. |
| `disable()` | Desabilita apenas esta opção. |

**CSS Custom Properties**

| Propriedade | Padrão | Descrição |
| --- | --- | --- |
| `--cao-radio-color` | `#4f46e5` | Cor da opção selecionada. |
| `--cao-radio-unselected` | `#6b7280` | Cor da borda não selecionada. |
| `--cao-radio-disabled` | `#d1d5db` | Cor da opção desabilitada. |
| `--cao-radio-label` | `#111827` | Cor do label. |
| `--cao-radio-label-disabled` | `#9ca3af` | Cor do label desabilitado. |
| `--cao-radio-focus-ring` | `rgba(79, 70, 229, 0.35)` | Cor do anel de foco. |
| `--cao-radio-size` | `20px` | Tamanho do círculo. |
| `--cao-radio-duration` | `200ms` | Duração das animações. |
| `--cao-radio-gap` | `8px` | Espaçamento entre opções. |

**Exemplo com `ngModel`:**

```html
<cao-radio-group [(ngModel)]="planoSelecionado" ariaLabel="Escolha um plano">
  <cao-radio-button value="basico" label="Básico"></cao-radio-button>
  <cao-radio-button value="profissional" label="Profissional"></cao-radio-button>
  <cao-radio-button value="empresarial" label="Empresarial"></cao-radio-button>
</cao-radio-group>
```

**Exemplo com formulário reativo, layout horizontal e cores customizadas:**

```html
<cao-radio-group
  [formControl]="periodo"
  orientation="horizontal"
  gap="16px"
  color="#16a34a"
  unselectedColor="#94a3b8"
  labelColor="#166534">
  <cao-radio-button value="manha" label="Manhã"></cao-radio-button>
  <cao-radio-button value="tarde" label="Tarde"></cao-radio-button>
  <cao-radio-button value="noite" label="Noite"></cao-radio-button>
</cao-radio-group>
```

**Exemplo com disabled geral e por opção:**

```html
<cao-radio-group [(ngModel)]="opcao" [isDisabled]="formularioBloqueado">
  <cao-radio-button value="a" label="Disponível"></cao-radio-button>
  <cao-radio-button value="b" label="Indisponível" [isDisabled]="true"></cao-radio-button>
</cao-radio-group>
```

**Exemplo com `compareWith` para valores objetos:**

```html
<cao-radio-group [(ngModel)]="usuarioSelecionado" [compareWith]="compararUsuarios">
  @for (usuario of usuarios; track usuario.id) {
    <cao-radio-button [value]="usuario" [label]="usuario.nome"></cao-radio-button>
  }
</cao-radio-group>
```

```typescript
compararUsuarios(a: Usuario | null, b: Usuario | null): boolean {
  return a?.id === b?.id;
}
```

**Observações:**

- Cada `<cao-radio-button>` deve estar dentro de um `<cao-radio-group>`.
- O grupo usa `role="radiogroup"` e inputs nativos `type="radio"` com o mesmo `name`, garantindo navegação por setas, foco e leitores de tela.
- `FormControl.disable()` desabilita o grupo inteiro, assim como `isDisabled`/`disabled`.
- Cores e tamanhos podem ser definidos no grupo (herdados por todas as opções) ou individualmente em cada botão.
- Métodos `enable()`/`disable()` permitem controlar o estado programaticamente.

---

### `CaoCheckboxComponent`

Um checkbox acessível e customizável no estilo do Material, com suporte a `ngModel` e formulários reativos via `ControlValueAccessor`. Possui os estados marcado, desmarcado e indeterminado, ícones customizáveis e cores configuráveis por inputs ou CSS custom properties. O visual é construído sobre um `input type="checkbox"` nativo oculto, sem depender do Angular Material em runtime.

**Seletor:** `<cao-checkbox>`

**Interface `ICaoCheckboxChangeEvent`**

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `checked` | `boolean` | Novo estado do checkbox. |
| `source` | `CaoCheckboxComponent` | Instância que originou o evento. |

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` | Estado inicial/atual do checkbox. |
| `indeterminate` | `boolean` | `false` | Exibe o estado indeterminado (traço). Tem prioridade sobre `checked`. |
| `isDisabled` | `boolean` | `false` | Desabilita o componente. |
| `disabled` | `boolean` | `false` | Alias de `isDisabled` (mesmo comportamento). |
| `required` | `boolean` | `false` | Marca o input nativo como obrigatório. |
| `label` | `string` | `''` | Texto do label. Também aceita conteúdo projetado (`<ng-content>`). |
| `labelPosition` | `'before' \| 'after'` | `'after'` | Posição do label em relação ao checkbox. |
| `name` | `string` | `''` | Atributo `name` do input nativo. |
| `id` | `string` | gerado automaticamente | Atributo `id` do input nativo. |
| `ariaLabel` | `string` | `''` | Atributo `aria-label` do input. |
| `ariaLabelledBy` | `string` | `''` | Atributo `aria-labelledby` do input. |
| `dataCy` | `string` | `''` | Atributo para testes E2E com Cypress. |
| `control` | `AbstractControl \| null` | `undefined` | O `FormControl` associado. Usado para exibir os estados de validação. |
| `errorMessage` | `string` | `''` | Mensagem de erro. Quando preenchida, aplica o estilo inválido. |
| `color` | `string` | `#4f46e5` | Cor de fundo/borda do checkbox marcado ou indeterminado. |
| `uncheckedColor` | `string` | `#6b7280` | Cor da borda quando desmarcado. |
| `disabledColor` | `string` | `#d1d5db` | Cor do checkbox desabilitado. |
| `labelColor` | `string` | `#111827` | Cor do label. |
| `disabledLabelColor` | `string` | `#9ca3af` | Cor do label desabilitado. |
| `focusRingColor` | `string` | `rgba(79, 70, 229, 0.35)` | Cor do anel de foco. |
| `size` | `string` | `20px` | Tamanho do checkbox. |
| `borderRadius` | `string` | `4px` | Raio da borda do checkbox. |
| `animationDuration` | `string` | `200ms` | Duração das animações. |
| `checkedIcon` | `string` | `''` | Ícone exibido quando marcado. Se vazio, usa um check SVG padrão. |
| `uncheckedIcon` | `string` | `''` | Ícone exibido quando desmarcado. Se vazio, nenhum ícone é exibido. |
| `indeterminateIcon` | `string` | `''` | Ícone exibido no estado indeterminado. Se vazio, usa um traço SVG padrão. |
| `isLucideIcon` | `boolean` | `false` | Interpreta os ícones como nomes Lucide. Quando `false`, usa `<img>` (URL ou data URI). |
| `iconColor` | `string` | `''` | Cor dos ícones Lucide (fallback para todos os estados). |
| `checkedIconColor` | `string` | `''` | Cor do ícone quando marcado. Se vazio, usa `iconColor`. |
| `uncheckedIconColor` | `string` | `''` | Cor do ícone quando desmarcado. Se vazio, usa `iconColor`. |
| `iconSize` | `string \| number` | `14` | Tamanho do ícone. Números são convertidos para `px`. |
| `iconStrokeWidth` | `string \| number` | `2.5` | Espessura do traço dos ícones Lucide. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `checkedChange` | `EventEmitter<boolean>` | Emitido quando o estado marcado muda. |
| `indeterminateChange` | `EventEmitter<boolean>` | Emitido quando o estado indeterminado muda. |
| `checkboxChange` | `EventEmitter<ICaoCheckboxChangeEvent>` | Emitido com o novo estado e a origem. |

**Métodos**

| Método | Descrição |
| --- | --- |
| `toggle()` | Alterna o estado, se não estiver desabilitado. |
| `setChecked(value: boolean, emit = true)` | Define o estado programaticamente e limpa `indeterminate`. Passe `false` em `emit` para não disparar os eventos. |
| `setIndeterminate(value: boolean)` | Define o estado indeterminado. |
| `enable()` | Habilita o componente. |
| `disable()` | Desabilita o componente. |
| `writeValue(value)` | Implementação de `ControlValueAccessor`. |
| `setDisabledState(isDisabled)` | Implementação de `ControlValueAccessor`. |

**CSS Custom Properties**

| Propriedade | Padrão | Descrição |
| --- | --- | --- |
| `--cao-checkbox-color` | `#4f46e5` | Cor do checkbox marcado/indeterminado. |
| `--cao-checkbox-unselected` | `#6b7280` | Cor da borda desmarcada. |
| `--cao-checkbox-disabled` | `#d1d5db` | Cor do checkbox desabilitado. |
| `--cao-checkbox-label` | `#111827` | Cor do label. |
| `--cao-checkbox-label-disabled` | `#9ca3af` | Cor do label desabilitado. |
| `--cao-checkbox-focus-ring` | `rgba(79, 70, 229, 0.35)` | Cor do anel de foco. |
| `--cao-checkbox-size` | `20px` | Tamanho do checkbox. |
| `--cao-checkbox-radius` | `4px` | Raio da borda. |
| `--cao-checkbox-duration` | `200ms` | Duração das animações. |
| `--cao-checkbox-icon-size` | `14px` | Tamanho do ícone. |
| `--cao-checkbox-icon-color` | `#ffffff` | Cor do ícone. |

**Exemplo com `ngModel`:**

```html
<cao-checkbox
  label="Aceito os termos"
  [(ngModel)]="aceitoTermos"
  (checkedChange)="onCheckedChange($event)">
</cao-checkbox>
```

**Exemplo com formulário reativo, validação e estado indeterminado:**

```html
<cao-checkbox
  label="Selecionar todos"
  [formControl]="selecionarTodos"
  [indeterminate]="algunsSelecionados"
  [control]="selecionarTodos"
  errorMessage="Selecione ao menos uma opção">
</cao-checkbox>
```

```typescript
selecionarTodos = new FormControl(false, { validators: Validators.requiredTrue });
algunsSelecionados = false;
```

**Exemplo com cores customizadas e label antes:**

```html
<cao-checkbox
  label="Modo escuro"
  labelPosition="before"
  color="#16a34a"
  uncheckedColor="#94a3b8"
  labelColor="#166534"
  size="24px"
  borderRadius="6px">
</cao-checkbox>
```

**Exemplo com ícones Lucide:**

```html
<cao-checkbox
  label="Notificações"
  [(ngModel)]="notificacoesAtivas"
  checkedIcon="check"
  indeterminateIcon="minus"
  uncheckedIcon="x"
  [isLucideIcon]="true"
  iconColor="#6b7280"
  checkedIconColor="#16a34a"
  [iconSize]="16"
  [iconStrokeWidth]="2.5">
</cao-checkbox>
```

**Exemplo com imagem/data URI nos ícones:**

```html
<cao-checkbox
  label="Ícone customizado"
  [(ngModel)]="customizado"
  checkedIcon="assets/icone-marcado.svg"
  indeterminateIcon="assets/icone-indeterminado.svg"
  [isLucideIcon]="false"
  [iconSize]="12">
</cao-checkbox>
```

**Observações:**

- Usa um `input type="checkbox"` nativo oculto, mantendo clique no label, foco, navegação por teclado e suporte a leitores de tela.
- O estado `indeterminate` tem prioridade visual sobre `checked`; ao alternar o checkbox, `indeterminate` é limpo e `indeterminateChange(false)` é emitido.
- Funciona com `ngModel`, `formControlName` e `FormControl.disable()`.
- Os estados `--invalid` e `--valid` são aplicados quando `control.touched` e o controle está inválido/válido; `errorMessage` também força o estilo inválido.
- Para ícones Lucide, registre os ícones usados com `provideLucideIcons` (de `@lucide/angular`). Para imagens, informe uma URL ou data URI e mantenha `isLucideIcon` como `false`.
- As cores e dimensões podem ser definidas por inputs ou sobrescritas via CSS custom properties.

---

### `DropDown`
Um menu suspenso (dropdown) com busca, que funciona com `ngModel` ou `formControlName`.

**Seletor:** `<cao-drop-down>`

**Interface `ICaoDropDownOption`**

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `id` | `string \| number` | (Opcional) Identificador único da opção. |
| `nome` | `string` | Texto exibido da opção. |
| `icon` | `string` | (Opcional) Caminho ou nome do ícone. |
| `iconPosition` | `string` | (Opcional) Posição do ícone (`left` ou `right`). |
| `dataCy` | `string` | (Opcional) Atributo para testes E2E. |

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `textHeader` | `string` | `'SELECIONE UM ITEM'` | Texto do cabeçalho do dropdown. |
| `options` | `ICaoDropDownOption[]` | `[]` | Lista de opções. |
| `dropDownClass` | `string` | `''` | Classe CSS para o container do dropdown. |
| `styleDropDown` | `{ [klass: string]: unknown }` | `{}` | Estilos inline para o container. |
| `control` | `AbstractControl \| null` | `undefined` | O `FormControl` associado. |
| `controlName` | `string` | `''` | O nome do controle de formulário. |
| `isDisabled` | `boolean` | `false` | Desabilita o componente. |
| `tooltip` | `string` | `''` | Texto para a tooltip. |
| `dropDirectionInput`| `'up' \| 'down'` | `'down'` | Direção em que o dropdown abrirá. |
| `dataCy` | `string` | `''` | Atributo para testes E2E. |
| `trackByFn` | `(index: number, item: ICaoDropDownOption) => unknown` | `undefined` | Função personalizada de `trackBy`. |
| `compareWith` | `(option: unknown, value: unknown) => boolean` | `undefined` | Função comparadora personalizada. |
| `ariaLabel` | `string` | `undefined` | Atributo `aria-label` do combobox. |
| `ariaLabelledBy` | `string` | `undefined` | Atributo `aria-labelledby` do combobox. |
| `listAriaLabel` | `string` | `undefined` | Atributo `aria-label` da lista de opções. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `itemSelected`| `EventEmitter<ICaoDropDownOption>` | Emitido quando um item é selecionado. |

---

### `CaoTabGroup` e `CaoTabPanel`

Um sistema de abas (tabs) que permite navegar entre diferentes conteúdos organizados em painéis.

**Seletores:**
- `<cao-tab-group>` — Container de abas
- `<cao-tab-panel>` — Painel individual de conteúdo

#### Interface `ICaoTabChangeEvent`

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `previousIndex` | `number` | Índice da aba anteriormente ativa |
| `index` | `number` | Índice da aba recém-selecionada |
| `tab` | `CaoTabPanel` | Instância do painel selecionado |

#### Atributos do `CaoTabGroup` (Inputs)

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `selectedIndex` | `number` | `0` | Índice da aba ativa |
| `labelHeight` | `string` | `'48px'` | Altura do label de cada aba |
| `labelPaddingX` | `string` | `'16px'` | Padding horizontal do label |
| `labelGap` | `string` | `'6px'` | Espaçamento entre abas |
| `colorText` | `string` | `'#6b7280'` | Cor do texto das abas inativas |
| `colorActive` | `string` | `'#4f46e5'` | Cor do texto da aba ativa |
| `colorHoverBg` | `string` | `'#f3f4f6'` | Cor de fundo ao passar o mouse |
| `colorDisabled` | `string` | `'#d1d5db'` | Cor de texto de aba desabilitada |
| `colorInkBar` | `string` | `'#4f46e5'` | Cor da barra indicadora (ink bar) |
| `colorHeaderBorder` | `string` | `'#e5e7eb'` | Cor da borda inferior do cabeçalho |
| `inkBarHeight` | `string` | `'2px'` | Altura da barra indicadora |
| `contentPaddingTop` | `string` | `'20px'` | Padding superior do conteúdo |
| `labelRadius` | `string` | `'4px'` | Border-radius do label |
| `animationDuration` | `string` | `'300ms'` | Duração da animação da ink bar |
| `dynamicHeight` | `boolean` | `false` | Altura dinâmica do conteúdo |
| `labelAlign` | `'start' \| 'center' \| 'end'` | `'start'` | Alinhamento das abas no cabeçalho |
| `iconColorActive` | `string` | `''` | Cor dos ícones na aba ativa |
| `iconColorInactive` | `string` | `''` | Cor dos ícones nas abas inativas |
| `strokeWidthIcon` | `number` | `1` | Espessura do stroke de ícones Lucide |

#### Eventos do `CaoTabGroup` (Outputs)

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `selectedTabChange` | `EventEmitter<ICaoTabChangeEvent>` | Emitido quando a aba ativa muda |
| `focusChange` | `EventEmitter<number>` | Emitido quando uma aba recebe foco |

#### Atributos do `CaoTabPanel` (Inputs)

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `label` | `string` | `''` | Texto exibido no label da aba |
| `isLucideIcon` | `boolean` | `true` | Define se os ícones são do Lucide |
| `leadingIcon` | `string \| null` | `null` | Ícone exibido antes do label |
| `trailingIcon` | `string \| null` | `null` | Ícone exibido após o label |
| `isDisabled` | `boolean` | `false` | Desabilita a aba |

#### Diretivas customizadas

| Diretiva | Seletor | Descrição |
| --- | --- | --- |
| `CaoTabLabelDirective` | `[caoTabLabel]` | Template customizado para o label da aba |
| `CaoTabContentDirective` | `[caoTabContent]` | Template para conteúdo lazy (renderizado apenas quando a aba é ativada) |

#### Exemplo de uso

```html
<cao-tab-group
  [selectedIndex]="1"
  (selectedTabChange)="onTabChange($event)"
  labelAlign="center"
  colorActive="#dc2626"
>
  <cao-tab-panel label="Primeira">
    <p>Conteúdo da primeira aba.</p>
  </cao-tab-panel>

  <cao-tab-panel label="Segunda" isDisabled>
    <p>Esta aba está desabilitada.</p>
  </cao-tab-panel>

  <cao-tab-panel label="Com ícone" leadingIcon="home" [isLucideIcon]="true">
    <p>Aba com ícone Lucide.</p>
  </cao-tab-panel>

  <cao-tab-panel label="Customizada">
    <ng-template caoTabLabel>
      <span style="font-weight: bold;">🌟 Custom</span>
    </ng-template>

    <ng-template caoTabContent>
      <p>Conteúdo carregado sob demanda via diretiva <code>caoTabContent</code>.</p>
    </ng-template>
  </cao-tab-panel>
</cao-tab-group>
```

#### CSS Custom Properties

O componente `CaoTabGroup` expõe todas as suas propriedades visuais via CSS custom properties, que podem ser sobrescritas globalmente ou por instância:

| Propriedade | Padrão | Descrição |
| --- | --- | --- |
| `--cao-tab-font-family` | `inherit` | Família da fonte dos labels |
| `--cao-tab-font-size` | `0.875rem` | Tamanho da fonte dos labels |
| `--cao-tab-font-weight` | `500` | Peso da fonte dos labels |
| `--caoTabLabelHeight` | `48px` | Altura do label |
| `--caoTabLabelPx` | `16px` | Padding horizontal do label |
| `--caoTabLabelGap` | `6px` | Espaçamento entre abas |
| `--caoTabColorText` | `#6b7280` | Cor do texto inativo |
| `--caoTabColorActive` | `#4f46e5` | Cor do texto ativo |
| `--caoTabColorHoverBg` | `#f3f4f6` | Fundo no hover |
| `--caoTabColorDisabled` | `#d1d5db` | Cor do texto desabilitado |
| `--caoTabColorInkBar` | `#4f46e5` | Cor da ink bar |
| `--caoTabColorHeaderBorder` | `#e5e7eb` | Cor da borda do header |
| `--caoTabInkBarHeight` | `2px` | Altura da ink bar |
| `--caoTabContentPt` | `20px` | Padding superior do conteúdo |
| `--caoTabRadius` | `4px` | Border-radius do label |

> **Nota:** As propriedades com prefixo `--cao-` (hífen) podem ser definidas via CSS. As propriedades com prefixo `--cao` (sem hífen) são definidas via `@Input()` no componente, mas também podem ser sobrescritas via CSS.

---

### `Footer`
Um rodapé simples para a aplicação.

**Seletor:** `<cao-footer>`

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `currentRoute` | `string` | `undefined` | A rota atual (usado para lógica interna). |
| `footerText` | `string` | `undefined` | Texto customizado para o rodapé. |
| `isFixed` | `boolean` | `true` | Fixa o rodapé na parte inferior da página. |

---

### `CaoKpi`

Um componente de KPI (Key Performance Indicator) que exibe um cartão com ícone, valor, título, cor de texto e cor de borda configuráveis.

**Seletor:** `<cao-kpi>`

**Interface `ICaoKPI`**

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `title` | `string` | O título do KPI. |
| `value` | `string` | O valor exibido (ex: `"R$ 12.345"`). |
| `textColor` | `string` | Cor do texto (valor e título). |
| `borderColor` | `string` | Cor da borda do cartão. |
| `icon` | `ICaoImage` | O ícone exibido no canto superior direito. |

**Interface `ICaoImage`**

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `src` | `string` | Caminho ou URL da imagem do ícone. |
| `alt` | `string` | Texto alternativo (acessibilidade) da imagem. |

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `kpiData` | `ICaoKPI` | — (obrigatório) | Dados do KPI, recebidos via `input.required`. |

**Exemplo de uso:**

```html
<cao-kpi [kpiData]="meuKpi"></cao-kpi>
```

```typescript
import { CaoKpi, ICaoKPI } from 'ngx-opalbytes-components';

meuKpi: ICaoKPI = {
  title: 'Total de Vendas',
  value: 'R$ 12.345',
  textColor: '#16a34a',
  borderColor: '#16a34a',
  icon: { src: 'assets/icon-vendas.svg', alt: 'Vendas' }
};
```

---

### `LinksButton`
Exibe uma lista de links de navegação como botões.

**Seletor:** `<cao-links-button>`

**Atributos (Inputs)**

| Atributo | Tipo | Descrição |
| --- | --- | --- |
| `navContent` | `Signal<INavContent>` | **Obrigatório.** Objeto com o título e a lista de links. |

---

### `Paginator`
Controle de paginação para tabelas ou listas.

**Seletor:** `<cao-paginator>`

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `totalItems` | `number` | `0` | O número total de itens. |
| `pageSize` | `number` | `10` | O número de itens por página. |
| `currentPage`| `number` | `1` | A página atual. |
| `pageSizeOptions`| `number[]` | `[5, 10, 20, 50]` | Opções para o tamanho da página. |
| `showFirstLastButtons`| `boolean`| `true` | Exibe os botões de primeira/última página. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `pageEvent` | `EventEmitter<PageEvent>` | Emitido em qualquer evento de paginação. |

---

### `CaoSkeleton`
Um componente de esqueleto de carregamento (skeleton/placeholder) com variantes de retângulo, círculo e texto, animação shimmer customizável e cor configurável.

**Seletor:** `<cao-skeleton>`

**Tipo `CaoSkeletonVariant`**

| Valor | Descrição |
| --- | --- |
| `'rect'` | Retângulo (padrão). |
| `'circle'` | Círculo (largura/altura devem ser iguais, mas é garantido via `aspect-ratio`). |
| `'text'` | Linha de texto (altura `1em`, raio `4px`). |

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `borderRadius` | `string` | `'14px'` | Raio da borda do retângulo (ignorado nas variantes `circle` e `text`). |
| `width` | `string` | `'100%'` | Largura do esqueleto (usada quando `size` não é informado). |
| `height` | `string` | `'100%'` | Altura do esqueleto (usada quando `size` não é informado). |
| `bgColor` | `string` | `'#e2e8f0'` | Cor de fundo do esqueleto. |
| `shine` | `string` | `'#f8fafc'` | Cor do reflexo (shimmer). |
| `variant` | `CaoSkeletonVariant` | `'rect'` | Formato do esqueleto (`'rect'`, `'circle'` ou `'text'`). |
| `speed` | `string` | `'2s'` | Duração da animação shimmer. |
| `size` | `string` | `undefined` | Quando definido, sobrescreve `width` e `height` simultaneamente (ex.: `'48px'`). |
| `animationDeg` | `string` | `'90deg'` | Ângulo do gradiente da animação shimmer. |

**CSS Custom Properties**

O componente expõe todas as suas propriedades visuais via CSS custom properties, que cascateiam naturalmente e podem ser sobrescritas por um elemento pai ou globalmente:

| Propriedade | Padrão | Descrição |
| --- | --- | --- |
| `--skeleton-width` | `100%` | Largura do esqueleto. |
| `--skeleton-height` | `100%` | Altura do esqueleto. |
| `--skeleton-bg` | `#e2e8f0` | Cor de fundo do esqueleto. |
| `--skeleton-shine` | `#f8fafc` | Cor do reflexo (shimmer). |
| `--skeleton-radius` | `14px` | Raio da borda. |
| `--skeleton-speed` | `2s` | Duração da animação shimmer. |
| `--skeleton-animation-deg` | `90deg` | Ângulo do gradiente do shimmer. |

```css
.my-card {
  --skeleton-bg: #d1d5db;
  --skeleton-shine: #f3f4f6;
  --skeleton-radius: 8px;
  --skeleton-speed: 2s;
}
```

**Exemplo de uso:**

```html
<!-- Retângulo -->
<cao-skeleton width="200px" height="40px"></cao-skeleton>

<!-- Círculo -->
<cao-skeleton variant="circle" size="48px"></cao-skeleton>

<!-- Linha de texto -->
<cao-skeleton variant="text" width="120px"></cao-skeleton>

<!-- Cores customizadas e duração da animação -->
<cao-skeleton
  width="100%"
  height="24px"
  bgColor="#e0e7ff"
  shine="#ffffff"
  speed="1.5s"
></cao-skeleton>
```

---

### `TimePicker`
Um seletor de horário.

**Seletor:** `<cao-time-picker>`

**Atributos (Inputs)**

| Atributo | Tipo | Descrição |
| --- | --- | --- |
| `control` | `FormControl<Date \| null>` | O `FormControl` associado. |
| `isDisabled` | `boolean` | Desabilita o seletor. |
| `dataCy` | `string` | Atributo para testes E2E. |
| `min` | `string` | (setter) Horário mínimo no formato 'HH:mm'. |
| `max` | `string` | (setter) Horário máximo no formato 'HH:mm'. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `timeChange` | `EventEmitter<Date>` | Emitido quando o horário é alterado. |

---

##  Como Contribuir

Para adicionar um novo componente a esta biblioteca, siga os passos abaixo:

1.  **Crie os arquivos** do seu componente dentro da pasta `src/lib/shared/components/`, seguindo a estrutura de pastas existente.
2.  **Exponha o componente** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `src/public-api.ts`.
3.  **Adicione ou atualize os testes unitários** para garantir a cobertura e o funcionamento esperado.
4.  **Faça o commit** seguindo as [regras de commit do projeto](/README.md#룰-regras-de-commit-com-escopo-obrigatório), usando o escopo `components`.

    ```bash
    git commit -m "feat(components): add new component"
    ```

---

##  Regras e Convenções

### Prefixo

O prefixo para componentes nesta biblioteca é `cao`.

- **Componentes**: Utilize o prefixo `<cao-...>` nos seletores dos elementos.