#  ngx-opalbytes-directives

Uma biblioteca de diretivas reutilizáveis para aplicações Angular, focada em adicionar comportamentos e estilos dinâmicos aos elementos do DOM.

---
## Compatibilidade
|Tecnologia  |	Versão  |   Descrição  |
|------------|----------|-------------------------------------|
|   Angular	 |  ^21.0.0	|  Framework principal da biblioteca |

## Instalação

Para instalar a biblioteca, execute o seguinte comando:

```bash
npm install ngx-opalbytes-directives
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

As diretivas nesta biblioteca são `standalone`, o que significa que você pode importá-las diretamente nos seus componentes ou módulos.

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
    <h1 [caoHighlight]="'#e6e6e6'">Passe o mouse aqui</h1>
  `
})
export class ExemploComponent { }
```

---

## Organização de Pastas

Dentro da pasta `src/lib/`, as diretivas são organizadas em `directives/` e cada diretiva reside em sua própria pasta, contendo seus arquivos (`.ts`, `.spec.ts`).

```
src/
└── lib/
    └── directives/
        ├── cpf-mask/
        ├── highlight/
        └── skeleton/
```

---

---

## Detalhes das Diretivas

### `HighlightDirective`
Realça a cor de fundo de um elemento quando o usuário passa o mouse sobre ele.

**Seletor:** `[caoHighlight]`

**Atributos (Inputs)**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `caoHighlight` | `string` | `'yellow'` | A cor a ser usada para o realce. |

**Exemplo de Uso**
```html
<!-- 1. Usando a cor padrão (amarelo) -->
<p [caoHighlight]>
  Passe o mouse sobre mim para ver o realce padrão.
</p>

<!-- 2. Fornecendo uma cor customizada -->
<div [caoHighlight]="'lightblue'">
  Passe o mouse aqui para um realce azul claro.
</div>
```

---

### `CpfMaskDirective`
Aplica uma máscara de CPF (`000.000.000-00`) a um campo de input.

**Seletor:** `[caoCpfMask]`

**Nota:** Esta diretiva está presente na estrutura de pastas, mas sua implementação ainda não foi concluída.

**Exemplo de Uso**
```html
<input type="text" caoCpfMask>
```

---

### `SkeletonDirective`
Exibe um efeito de "esqueleto" de carregamento nos elementos filhos do container onde a diretiva é aplicada.

**Seletor:** `[caoSkeleton]`

Esta diretiva não possui inputs ou outputs. Ela aplica o efeito automaticamente por uma duração de 2 segundos.

**Exemplo de Uso**
```html
<!-- Aplica o efeito de esqueleto a todos os elementos internos -->
<div caoSkeleton>
  <h2>Título</h2>
  <p>Este é um parágrafo de exemplo.</p>
  <button>Botão</button>
</div>
```

---

##  Como Contribuir

Para adicionar uma nova diretiva a esta biblioteca, siga os passos abaixo:

1.  **Crie os arquivos** da sua diretiva dentro da pasta `src/lib/directives/`, seguindo a estrutura de pastas existente.
2.  **Exponha a diretiva** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `src/public-api.ts`.
3.  **Adicione ou atualize os testes unitários** para garantir a cobertura e o funcionamento esperado.
4.  **Faça o commit** seguindo as [regras de commit do projeto](/README.md#룰-regras-de-commit-com-escopo-obrigatório), usando o escopo `directives`.

    ```bash
    git commit -m "feat(directives): add diretiva email"
    ```

---

##  Métricas de Qualidade

Esta biblioteca passa por verificações automáticas de qualidade a cada release:

- **Bundle Size**: Verificado para garantir otimização
- **Testes Unitários**: Cobertura e execução automática
- **Lint**: Verificação de qualidade de código
- **Size Limit**: Controle de tamanho do pacote

Os relatórios completos de métricas estão disponíveis no repositório.

---

##  Regras e Convenções

### Prefixo

O prefixo para diretivas nesta biblioteca é `cao`.

- **Diretivas**: Utilize o prefixo `cao...` em camelCase para os seletores de atributo.

