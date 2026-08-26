# ngx-opalbytes-chart

Uma biblioteca de gráficos **standalone** para aplicações Angular, construída com SVG nativo e sem dependências externas de charting. Ideal para dashboards e relatórios que precisam de visualizações leves, responsivas e com tema customizável.

---

## Compatibilidade

| Tecnologia      | Versão      | Descrição                                  |
| --------------- | ----------- | ------------------------------------------ |
| `Angular`       | `^21.2.0`   | Framework principal da biblioteca          |
| `@angular/material` | `^21.0.5` | Usado para o módulo de tooltip (`MatTooltipModule`) |

> Observação: apenas o `@angular/material/tooltip` é necessário. Você não precisa instalar o tema completo do Material caso já não o utilize.

## Instalação

```bash
npm install ngx-opalbytes-chart
```

Caso ainda não tenha o `@angular/material` no seu projeto, instale-o (a biblioteca utiliza apenas o `MatTooltipModule`):

```bash
npm install @angular/material@^21.0.5
```

## Dependências

### `peerDependencies`

| Pacote               | Versão      |
| :------------------- | :---------- |
| `@angular/common`    | `^21.2.0`   |
| `@angular/core`      | `^21.2.0`   |
| `@angular/material`  | `^21.0.5`   |

### `dependencies`

| Pacote  | Versão      |
| :------ | :---------- |
| `tslib` | `^2.3.0`    |

---

## Como Usar

Todos os gráficos são componentes `standalone` e exportam seus seletores com o prefixo `cao`. Basta importá-los diretamente no seu componente.

**Exemplo de importação:**

```typescript
import { Component } from '@angular/core';
import {
  CaoLineChartComponent,
  CaoPieChartComponent,
  CaoLateralBarChartComponent,
  CaoHeatmapComponent,
} from 'ngx-opalbytes-chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CaoLineChartComponent,
    CaoPieChartComponent,
    CaoLateralBarChartComponent,
    CaoHeatmapComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
```

---

## Organização de Pastas

Dentro de `src/lib/`, cada gráfico reside em sua própria pasta contendo os arquivos `.ts`, `.html`, `.css` e `.spec.ts`:

```
src/lib/
├── base-chart/              # Componente base interno (não exportado)
│   ├── base-chart.ts
│   ├── base-chart.html
│   └── base-chart.css
├── heatmap-chart/           # CaoHeatmapComponent
├── line-chart/              # CaoLineChartComponent
├── pie-chart/               # CaoPieChartComponent
└── vertical-bar-chart/      # CaoLateralBarChartComponent
```

> **Nota:** `BaseChart` (`lib-base-chart`) é um componente interno de apoio e **não** faz parte da API pública (`public-api.ts`). Use apenas os quatro componentes exportados em `index.ts`.

---

## Detalhes dos Componentes

### `CaoHeatmapComponent`

Um mapa de calor (heatmap) para visualização de intensidade por período (horas do dia × dias), com suporte a modos *Hoje / 7 dias / 14 dias* e tooltip por célula.

**Seletor:** `<cao-heatmap-chart>`

**Interface `ICaoHeatmapConfig`**

| Propriedade        | Tipo                                          | Descrição                                              |
| ------------------ | --------------------------------------------- | ------------------------------------------------------ |
| `rowLabels`        | `string[]`                                    | Rótulos das linhas (ex.: horas "7:00", "8:00"...).     |
| `columns`          | `CaoHeatmapColumn[]`                          | Colunas do heatmap (ex.: dias).                        |
| `legendMinLabel`   | `string`                                      | (Opcional) Rótulo do menor valor da legenda.           |
| `legendMaxLabel`   | `string`                                      | (Opcional) Rótulo do maior valor da legenda.           |
| `colors`           | `[string, string, string, string]`            | (Opcional) Paleta de 4 cores (escala de calor).        |
| `mode`             | `CaoHeatmapMode`                              | (Opcional) Modo inicial de visualização.               |

**Interface `CaoHeatmapColumn`**

| Propriedade | Tipo               | Descrição                |
| ----------- | ------------------ | ------------------------ |
| `label`     | `string`           | Rótulo da coluna.        |
| `cells`     | `CaoHeatmapCell[]` | Células da coluna.       |

**Interface `CaoHeatmapCell`**

| Propriedade | Tipo     | Descrição                                     |
| ----------- | -------- | --------------------------------------------- |
| `value`     | `number` | Valor de `0` a `3` (índice na escala de calor). |

**Tipo `CaoHeatmapMode`**

```typescript
type CaoHeatmapMode = 'today' | '7days' | '14days';
```

**Atributos (Inputs)**

| Atributo  | Tipo                | Descrição                                                                 |
| --------- | ------------------- | ------------------------------------------------------------------------- |
| `config`  | `ICaoHeatmapConfig` | Configuração do heatmap. Ao definir `mode` no config, atualiza o modo ativo. |

**Métodos**

| Método                  | Descrição                                                          |
| ----------------------- | ------------------------------------------------------------------ |
| `setMode(mode)`         | Define o modo ativo (`today` / `7days` / `14days`).                 |
| `colorFor(value)`       | Retorna a cor correspondente ao valor (0–3) usando a paleta resolvida. |

**Cores padrão**

```typescript
['#FFE2C5', '#FFC183', '#FF9021', '#F65802']
```

---

### `CaoLineChartComponent`

Gráfico de linhas (SVG) com múltiplas séries, eixos automáticos, tooltip por coluna e responsividade via `ResizeObserver`.

**Seletor:** `<cao-line-chart>`

**Interface `IChartSeriesPoint`**

| Propriedade | Tipo             | Descrição                       |
| ----------- | ---------------- | ------------------------------- |
| `name`      | `string \| Date` | Rótulo/Data do ponto.           |
| `value`     | `number`         | Valor do ponto.                 |

**Interface `IChartSeries`**

| Propriedade | Tipo                   | Descrição                |
| ----------- | ---------------------- | ------------------------ |
| `name`      | `string`               | Nome da série (legenda). |
| `color`     | `string`               | Cor da linha.            |
| `series`    | `IChartSeriesPoint[]`  | Pontos da série.         |

**Atributos (Inputs)**

| Atributo  | Tipo              | Padrão  | Descrição                                                  |
| --------- | ----------------- | ------- | ---------------------------------------------------------- |
| `data`    | `IChartSeries[]`  | `[]`    | Séries a serem desenhadas.                                 |
| `height`  | `number`          | `320`   | Altura do gráfico em pixels.                               |
| `yTicks`  | `number`          | `6`     | Quantidade de ticks no eixo Y.                             |

**Comportamento**

- Tooltip automático ao passar o mouse sobre cada coluna (agrupa todas as séries do mesmo `x`).
- Detecta dados binários (0/1) e ajusta os ticks do eixo Y automaticamente.
- Largura responsiva: recalcula ao redimensionar o container (`ResizeObserver`).

---

### `CaoPieChartComponent`

Gráfico de pizza (donut) em SVG com legenda, percentuais e total centralizado.

**Seletor:** `<cao-pie-chart>`

**Interface `ICaoPieChartItem`**

| Propriedade | Tipo     | Descrição                |
| ----------- | -------- | ------------------------ |
| `name`      | `string` | Nome da fatia (legenda). |
| `value`     | `number` | Valor da fatia.          |
| `color`     | `string` | Cor da fatia.            |

**Atributos (Inputs — `input()` signals)**

| Atributo     | Tipo                | Padrão | Descrição                                         |
| ------------ | ------------------- | ------ | ------------------------------------------------- |
| `data`       | `ICaoPieChartItem[]`| `[]`   | Itens do gráfico.                                 |
| `thickness`  | `number`            | `40`   | Espessura do anel (donut). `0` = pizza cheia.     |

**Métodos auxiliares**

| Método                  | Descrição                                              |
| ----------------------- | ------------------------------------------------------ |
| `formatTotal(value)`    | Formata o total (ex.: `1.2M`, `3.4K`, `1.234`).        |
| `formatValue(value)`    | Formata valores com locale `pt-BR`.                    |
| `normalizeColor(color)` | Garante prefixo `#` na cor.                            |
| `trackByName(_, item)`  | Função `trackBy` para as fatias.                       |

**Comportamento**

- Tamanho responsivo: ajusta-se ao menor lado do container (`ResizeObserver`).
- Exibe "Nenhum dado encontrado" quando `data` está vazio.

---

### `CaoLateralBarChartComponent`

Gráfico de barras verticais (SVG/CSS) com eixo Y, grid lines, tooltip e cores customizáveis.

**Seletor:** `<cao-lateral-bar-chart>`

**Interface `ICaoBarItem`**

| Propriedade | Tipo     | Descrição                |
| ----------- | -------- | ------------------------ |
| `label`     | `string` | Rótulo da barra.         |
| `value`     | `number` | Valor da barra.          |

**Atributos (Inputs)**

| Atributo        | Tipo            | Padrão      | Descrição                                  |
| --------------- | --------------- | ----------- | ------------------------------------------ |
| `data`          | `ICaoBarItem[]` | `[]`        | Itens do gráfico.                          |
| `barColor`      | `string`        | `'#FFE5CA'` | Cor da barra.                              |
| `barHoverColor` | `string`        | `'#FFB871'` | Cor da barra no hover (via `bar-column`).  |
| `barTipColor`   | `string`        | `'#FAB46F'` | Cor da ponta (tip) da barra.               |
| `tickCount`     | `number`        | `6`         | Quantidade de ticks no eixo Y.             |

**Eventos (Outputs)**

| Evento       | Tipo                     | Descrição                              |
| ------------ | ------------------------ | -------------------------------------- |
| `mouseEnter` | `EventEmitter<MouseEvent>` | Emitido ao passar o mouse sobre uma barra. |
| `mouseLeave` | `EventEmitter<MouseEvent>` | Emitido ao remover o mouse de uma barra.  |

---

## Exemplos de Integração

### 1. Componente standalone básico

```typescript
import { Component } from '@angular/core';
import { CaoPieChartComponent, ICaoPieChartItem } from 'ngx-opalbytes-chart';

@Component({
  selector: 'app-exemplo',
  standalone: true,
  imports: [CaoPieChartComponent],
  template: `
    <cao-pie-chart [data]="pizza" [thickness]="50"></cao-pie-chart>
  `,
})
export class ExemploComponent {
  pizza: ICaoPieChartItem[] = [
    { name: 'Chrome', value: 1200, color: '#4285F4' },
    { name: 'Firefox', value: 400, color: '#FF7139' },
    { name: 'Edge', value: 300, color: '#0078D7' },
  ];
}
```

### 2. Dados reativos via `signal`

```typescript
import { Component, signal } from '@angular/core';
import { CaoLineChartComponent, IChartSeries } from 'ngx-opalbytes-chart';

@Component({
  selector: 'app-realtime',
  standalone: true,
  imports: [CaoLineChartComponent],
  template: `<cao-line-chart [data]="series()" [height]="280"></cao-line-chart>`,
})
export class RealtimeComponent {
  series = signal<IChartSeries[]>([
    {
      name: 'Acessos',
      color: '#4f46e5',
      series: [
        { name: '2026-08-01', value: 10 },
        { name: '2026-08-02', value: 25 },
        { name: '2026-08-03', value: 18 },
      ],
    },
  ]);

  // Atualize o signal a partir de um serviço/polling:
  atualizar(novos: IChartSeries[]) {
    this.series.set(novos);
  }
}
```

### 3. Integração com `@angular/forms`

Use um `FormControl` para controlar qual período é exibido no gráfico de barras:

```typescript
import { Component } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CaoLateralBarChartComponent, ICaoBarItem } from 'ngx-opalbytes-chart';

@Component({
  selector: 'app-periodo',
  standalone: true,
  imports: [CaoLateralBarChartComponent, ReactiveFormsModule],
  template: `
    <select [formControl]="periodo">
      <option value="dia">Dia</option>
      <option value="semana">Semana</option>
    </select>

    <cao-lateral-bar-chart [data]="dadosPara(periodo.value)"></cao-lateral-bar-chart>
  `,
})
export class PeriodoComponent {
  periodo = new FormControl<'dia' | 'semana'>('dia');

  dadosPara(p: string): ICaoBarItem[] {
    return p === 'dia'
      ? [{ label: 'Manhã', value: 30 }, { label: 'Tarde', value: 55 }]
      : [{ label: 'Seg', value: 120 }, { label: 'Ter', value: 90 }];
  }
}
```

### 4. Carregamento assíncrono (Observable → `signal`)

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { CaoHeatmapComponent, ICaoHeatmapConfig } from 'ngx-opalbytes-chart';
import { map } from 'rxjs';

@Component({
  selector: 'app-heatmap-async',
  standalone: true,
  imports: [CaoHeatmapComponent],
  template: `<cao-heatmap-chart [config]="cfg()"></cao-heatmap-chart>`,
})
export class HeatmapAsyncComponent {
  private http = inject(HttpClient);

  cfg = toSignal(
    this.http.get<any>('/api/heatmap').pipe(
      map((res) => ({
        rowLabels: res.horas,
        columns: res.dias,
        mode: '7days' as const,
      }) as ICaoHeatmapConfig)
    ),
    { initialValue: null as ICaoHeatmapConfig | null }
  );
}
```

### 5. Grid de múltiplos gráficos (dashboard)

```html
<div class="grid">
  <cao-line-chart [data]="acessos"></cao-line-chart>
  <cao-pie-chart [data]="origem"></cao-pie-chart>
  <cao-lateral-bar-chart [data]="porHora"></cao-lateral-bar-chart>
  <cao-heatmap-chart [config]="calor"></cao-heatmap-chart>
</div>
```

---

## Como Contribuir

Para adicionar um novo gráfico a esta biblioteca:

1. Crie os arquivos do componente dentro de `src/lib/<seu-grafico>/`, seguindo a estrutura existente.
2. Exponha o componente na API pública adicionando-o em `src/lib/index.ts`.
3. Adicione/atualize os testes unitários (`.spec.ts`).
4. Faça o commit seguindo as regras de commit do projeto, usando o escopo `chart`:

   ```bash
   git commit -m "feat(chart): add new chart component"
   ```

---

## Regras e Convenções

### Prefixo

O prefixo para componentes nesta biblioteca é `cao`.

- **Componentes**: Utilize o prefixo `<cao-...>` nos seletores (ex.: `cao-line-chart`, `cao-pie-chart`).
- **Tipo de componente**: Todos são `standalone: true`.
