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

### `CaoSkeletonDirective`
Exibe placeholders de carregamento com animação shimmer sobre os elementos do container.

**Seletor:** `[caoSkeleton]`

**Inputs**

| Atributo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `caoSkeleton` | `boolean` | `true` | Ativa/desativa o efeito skeleton |
| `caoSkeletonStrategy` | `'computed' \| 'bounding'` | `'computed'` | Estratégia de medição: `computed` usa `getComputedStyle`, `bounding` usa `getBoundingClientRect` |
| `caoSkeletonRadius` | `string` | `''` (herdado) | Raio de borda dos placeholders (ex: `'6px'`, `'50%'`) |
| `caoSkeletonColor` | `string` | `'#e2e8f0'` | Cor base do skeleton |
| `caoSkeletonShine` | `string` | `'#f8fafc'` | Cor do brilho animado (shimmer) |
| `caoSkeletonDeep` | `boolean` | `false` | `true` percorre todos os filhos criando skeletons individuais; `false` aplica apenas no elemento hospedeiro |
| `caoSkeletonClass` | `string` | `''` | Classe CSS customizada adicionada aos placeholders |
| `caoSkeletonStyle` | `Record<string, string>` | `{}` | Estilos inline customizados aplicados aos placeholders |

**Exemplos de Uso**

```html
<!-- 1. Uso básico: ativa skeleton no container -->
<div [caoSkeleton]="isLoading">
  <h2>Título</h2>
  <p>Conteúdo carregado.</p>
</div>

<!-- 2. Skeleton profundo: cria placeholders individuais para cada filho -->
<div [caoSkeleton]="isLoading" [caoSkeletonDeep]="true">
  <header>
    <h1>Perfil</h1>
  </header>
  <section>
    <p>Descrição do usuário</p>
  </section>
</div>

<!-- 3. Cores personalizadas -->
<div
  [caoSkeleton]="loading"
  caoSkeletonColor="#e0f2fe"
  caoSkeletonShine="#bae6fd"
>
  <span>Notificações</span>
</div>

<!-- 4. Raio e classe customizados -->
<div
  [caoSkeleton]="loading"
  caoSkeletonRadius="12px"
  caoSkeletonClass="my-skeleton"
  [caoSkeletonStyle]="{ margin: '4px 0' }"
>
  <div class="card">Conteúdo do card</div>
</div>

<!-- 5. Estratégia de bounding para medição mais precisa em animações -->
<div [caoSkeleton]="loading" caoSkeletonStrategy="bounding">
  <img src="avatar.jpg" alt="Avatar" />
</div>

<!-- 6. Alternar skeleton dinamicamente -->
<button (click)="toggleLoading()">Alternar Loading</button>
<div [caoSkeleton]="isLoading">
  <p>Este conteúdo aparece/desaparece com skeleton.</p>
</div>
```

**Comportamento**
- A diretiva cria placeholders `span` posicionados absolutamente sobre os elementos originais
- O conteúdo original é ocultado (cor transparente, sem interação) mas mantém o layout
- Componentes Angular (tags com hífen) são detectados automaticamente e a diretiva busca o elemento interno renderizável para aplicar o skeleton
- Elementos com `display:none`, `visibility:hidden` ou dimensões zero são ignorados
- A animação shimmer respeita a preferência `prefers-reduced-motion`
- Placeholders órfãos são removidos automaticamente antes de reconstruir o skeleton

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

