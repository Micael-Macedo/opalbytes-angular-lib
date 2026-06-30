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

## Organização de Pastas

Dentro da pasta `src/lib/`, os componentes são organizados em `shared/components/` e cada componente reside em sua própria pasta, contendo seus arquivos (`.ts`, `.html`, `.css`, `.spec.ts`).

```
src/
└── lib/
    └── shared/
        └── components/
        |   ├── autocomplete/
        |   ├── base-button/
        |   ├── base-input/
        |   ├── base-time-range/
        |   ├── base-toggle/
        |   ├── drop-down/
        |   ├── footer/
        |   ├── links-button/
        |   ├── paginator/
        |   ├── stepper/
        |   ├── tab-group/
        |   ├── tab-panel/
        |   └── time-picker/
        └── features/
            ├── base-modal/
            ├── base-table/
            ├── base-table-paginated/
            ├── base-dialog/
            └── base-alert/
            
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