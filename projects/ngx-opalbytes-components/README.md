# 📦 ngx-opalbytes-components

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
// Importe o componente desejado
import { BaseButton } from 'ngx-opalbytes-components';

@Component({
  selector: 'app-exemplo',
  standalone: true,
  imports: [
    BaseButton // Adicione o componente aos imports
  ],
  template: `
    <cao-base-button buttonText="Clique Aqui"></cao-base-button>
  `
})
export class ExemploComponent { }
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
        |   ├── drop-down/
        |   ├── footer/
        |   ├── links-button/
        |   ├── paginator/
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

**Seletor:** `<cao-base-button>`

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
| `dataCy` | `string` | `undefined` | Atributo para testes E2E com Cypress. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `buttonClick` | `EventEmitter<void>` | Emitido quando o botão é clicado. |

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

**Seletor:** `<cao-base-alert>`

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

3.  **No seu `app.module.ts` ou onde seu serviço é provido, use o `CustomAlertService`**:

    ```typescript
    // app.module.ts ou o módulo onde você quer usar o serviço customizado
    import { NgModule } from '@angular/core';
    import { AlertService } from 'ngx-opalbytes-components'; // Importe o serviço original
    import { CustomAlertService } from './custom-alert.service'; // Importe seu serviço customizado

    @NgModule({
      providers: [
        { provide: AlertService, useClass: CustomAlertService } // Prover seu serviço customizado no lugar do original
      ]
    })
    export class AppModule { }
    ```
    Dessa forma, toda vez que você injetar e usar o `AlertService` em sua aplicação, na verdade estará utilizando o `CustomAlertService` que exibirá seu `CustomAlertComponent` personalizado.

---

### `BaseDialog`
Exibe uma caixa de diálogo modal para interações que exigem confirmação do usuário.

**Seletor:** `<cao-base-dialog>`

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

### `Autocomplete`
Um campo de preenchimento automático que funciona com `ngModel` ou `formControlName`.

**Seletor:** `<cao-autocomplete>`

**Atributos (Inputs)**

| Atributo | Tipo | Descrição |
| --- | --- | --- |
| `label` | `string` | O rótulo do campo. |
| `placeholder` | `string` | O texto de placeholder. |
| `options` | `IAutoCompleteOption[]` | A lista de opções para o autocomplete. |
| `control` | `AbstractControl` | O `FormControl` associado. |
| `dataCy` | `string` | Atributo para testes E2E. |
| `controlName` | `string` | O nome do controle de formulário. |

---

### `BaseTable`
Uma tabela de dados com ordenação, paginação e seleção de linhas. A configuração é feita através do `TableService`.

**Seletor:** `<cao-base-table>`

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

### `TableLightPaginated`
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

### `DropDown`
Um menu suspenso (dropdown) com busca, que funciona com `ngModel` ou `formControlName`.

**Seletor:** `<cao-drop-down>`

**Atributos (Inputs)**

| Atributo | Tipo | Descrição |
| --- | --- | --- |
| `textHeader` | `string` | Texto do cabeçalho do dropdown. |
| `options` | `IDropDownOption[]` | Lista de opções. |
| `isDisabled` | `boolean` | Desabilita o componente. |
| `tooltip` | `string` | Texto para a tooltip. |
| `dropDirectionInput`| `'up' \| 'down'` | Direção em que o dropdown abrirá. |
| `control` | `AbstractControl` | O `FormControl` associado. |

**Eventos (Outputs)**

| Evento | Tipo | Descrição |
| --- | --- | --- |
| `itemSelected`| `EventEmitter<IDropDownOption>` | Emitido quando um item é selecionado. |

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

## 📜 Como Contribuir

Para adicionar um novo componente a esta biblioteca, siga os passos abaixo:

1.  **Crie os arquivos** do seu componente dentro da pasta `src/lib/shared/components/`, seguindo a estrutura de pastas existente.
2.  **Exponha o componente** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `src/public-api.ts`.
3.  **Adicione ou atualize os testes unitários** para garantir a cobertura e o funcionamento esperado.
4.  **Faça o commit** seguindo as [regras de commit do projeto](/README.md#룰-regras-de-commit-com-escopo-obrigatório), usando o escopo `components`.

    ```bash
    git commit -m "feat(components): add new component"
    ```

---

## 📜 Regras e Convenções

### Prefixo

O prefixo para componentes nesta biblioteca é `cao`.

- **Componentes**: Utilize o prefixo `<cao-...>` nos seletores dos elementos.