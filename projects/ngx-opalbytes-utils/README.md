#  ngx-opalbytes-utils

Esta biblioteca é designada para funções utilitárias puras, pipes e outras lógicas que podem ser compartilhadas entre diferentes projetos Angular.

**Nota:** Atualmente, esta biblioteca contém apenas um componente de placeholder e ainda não possui utilitários ou pipes implementados.

---
## Compatibilidade
|Tecnologia  |	Versão  |   Descrição  |
|------------|----------|-------------------------------------|
|   Angular	 |  ^21.0.0	|  Framework principal da biblioteca |

## Instalação

Para instalar a biblioteca, execute o seguinte comando:

```bash
npm install ngx-opalbytes-utils
```

---
## Dependências

Esta biblioteca possui as seguintes dependências:

### `peerDependencies`

| Pacote | Versão |
| :----- | :----- |
| `@angular/common` | `^21.0.0` |
| `@angular/core` | `^21.0.0` |

### `dependencies`

| Pacote | Versão |
| :----- | :----- |
| `tslib` | `^2.3.0` |

---
## Como Usar

Quando utilitários ou pipes forem adicionados, eles poderão ser importados diretamente.

**Exemplo de como um pipe seria utilizado:**

```typescript
import { Component } from '@angular/core';
// Supondo a existência de um 'FormatCpfPipe'
import { caoFormatCpfPipe } from 'ngx-opalbytes-utils';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [FormatCpfPipe],
  template: `
    <p>CPF: {{ user.cpf | formatCpf }}</p>
  `
})
export class UserDetailsComponent {
  user = { cpf: '12345678900' };
}
```

---

## Organização de Pastas

Dentro da pasta `src/lib/`, utilitários e pipes devem ser organizados em subpastas apropriadas, como `utils/` para funções e `pipes/` para pipes.

```
src/
└── lib/
    └── pipes/
```

---

## Itens Disponíveis

Atualmente, não há utilitários ou pipes disponíveis nesta biblioteca.

---

##  Como Contribuir

Para adicionar um novo utilitario a esta biblioteca, siga os passos abaixo:

1.  **Crie o arquivo** do seu utilitario dentro da pasta `src/lib/`. Por exemplo: `src/lib/user.utils.ts`.
2.  **Implemente seu utilitario**, lembrando de marcá-lo com `@Injectable({ providedIn: 'root' })` para que ele seja "tree-shakable".
3.  **Exponha o utilitario** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `src/public-api.ts`.

    ```typescript
    // projects/ngx-opalbytes-utils/src/public-api.ts
    export * from './lib/user.utils'; 
    ```
5.  **Faça o commit** seguindo as [regras de commit do projeto](/README.md#룰-regras-de-commit-com-escopo-obrigatório), usando o escopo `utils`.

    ```bash
    git commit -m "feat(utils): add conversao date em string"
    ```