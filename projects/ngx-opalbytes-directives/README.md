# ngx-opalbytes-directives

Uma biblioteca de diretivas reutilizáveis para aplicações Angular.

---

## Instalação

Para instalar a biblioteca, execute o seguinte comando:

```bash
npm install ngx-opalbytes-directives
```

## Como Usar

As diretivas nesta biblioteca são `standalone`, o que significa que você pode importá-las diretamente nos seus componentes ou módulos sem a necessidade de um `NgModule` intermediário.

**Exemplo de importação em um componente:**

```typescript
import { Component } from '@angular/core';
// Importe a diretiva desejada
import { HighlightDirective } from 'ngx-opalbytes-directives';

@Component({
  selector: 'app-exemplo',
  standalone: true,
  imports: [
    HighlightDirective // Adicione a diretiva aos imports do componente
  ],
  template: `
    <h1 [libHighlight]="'#e6e6e6'">Passe o mouse aqui</h1>
  `
})
export class ExemploComponent { }
```

---

## Diretivas Disponíveis

| Diretiva / Seletor | Descrição | Inputs |
| :--- | :--- | :--- |
| **[libHighlight]** | Realça a cor de fundo de um elemento quando o usuário passa o mouse sobre ele. | `libHighlight: string`<br>A cor a ser usada no realce. Valor padrão: `'yellow'`. |

### Exemplo de Uso - `[libHighlight]`

Você pode usar a diretiva com a cor padrão ou fornecer uma cor customizada.

```html
<!-- 1. Usando a cor padrão (amarelo) -->
<p [libHighlight]>
  Passe o mouse sobre mim para ver o realce padrão.
</p>

<!-- 2. Fornecendo uma cor customizada -->
<div [libHighlight]="'lightblue'">
  Passe o mouse aqui para um realce azul claro.
</div>

<!-- 3. Usando cores hexadecimais -->
<span [libHighlight]="'#f0f0f0'">
  E aqui para um realce cinza claro.
</span>
```