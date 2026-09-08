# ngx-opalbytes-feature-pdf

`ngx-opalbytes-feature-pdf` é uma biblioteca Angular projetada para facilitar a conversão de conteúdo HTML para documentos PDF em suas aplicações Angular. Ela fornece serviços e utilitários para exportar facilmente conteúdo dinâmico como PDFs.

## Instalação

Para instalar esta biblioteca, execute o seguinte comando:

```bash
npm install ngx-opalbytes-feature-pdf
```

## Dependências

Esta biblioteca possui as seguintes dependências de pacotes, que devem ser instaladas em seu projeto:

**Peer Dependencies:**

*   `@angular/common`: ^21.0.0
*   `@angular/core`: ^21.0.0
*   `html2canvas`: ^1.4.1 (Utilizado para renderizar HTML em um canvas)
*   `jspdf`: ^4.0.0 (Utilizado para gerar o documento PDF)

**Dependencies:**

*   `tslib`: ^2.3.0 (Biblioteca de tempo de execução para TypeScript)

## Utilização

### Exemplo de Utilização

O exemplo abaixo cria um container simples, aguarda a renderização e exporta seu conteúdo para PDF em uma única página.

```typescript
import { ApplicationRef, Component, createComponent, EnvironmentInjector, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CaoPdfExportService, ICaoExportResult, ICaoPdfExportOptions } from 'ngx-opalbytes-feature-pdf';

@Component({
  selector: 'cao-pdf-template',
  template: `<h1>Relatório</h1><p>Conteúdo exportado para PDF.</p>`,
})
class CaoPdfTemplateComponent {}

@Injectable({ providedIn: 'root' })
export class ExemploExportService {
  private pdfExportService = inject(CaoPdfExportService);
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  exportarRelatorio(): Observable<ICaoExportResult> {
    const options: ICaoPdfExportOptions = {
      filename: 'relatorio.pdf',
      format: 'a4',
      orientation: 'portrait',
      quality: 0.95,
      compress: true,
      includeDate: false,
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      scale: 2,
      backgroundColor: '#ffffff',
      watermark: {
        text: 'Confidencial',
        opacity: 0.3,
        color: '#c8c8c8',
        fontSize: 60,
        angle: 45,
        position: 'center',
        pages: 'all',
      },
    };

    // Criar componente dinamicamente
    const componentRef = createComponent(CaoPdfTemplateComponent, {
      environmentInjector: this.injector,
    });

    // Anexar ao DOM
    this.appRef.attachView(componentRef.hostView);
    const domElement = componentRef.location.nativeElement as HTMLElement;
    document.body.appendChild(domElement);

    // Aguardar um tick para garantir renderização
    return new Observable((observer) => {
      setTimeout(() => {
        this.pdfExportService.exportToPdf(domElement, options, 'single-page').subscribe({
          next: (result) => {
            // Limpar o componente do DOM
            document.body.removeChild(domElement);
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();

            observer.next(result);
            observer.complete();
          },
          error: (error) => {
            document.body.removeChild(domElement);
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();

            observer.error(error);
          },
        });
      }, 100); // 100ms para garantir renderização
    });
  }
}
```

## Detalhes das Interfaces

### `ICaoPdfExportOptions`
Define as opções detalhadas para a exportação de PDF.

| Atributo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `filename` | `string` | Sim | Nome do arquivo PDF a ser gerado. |
| `format` | `'a4' \| 'letter' \| 'legal'`| Não | Formato da página. Padrão: `'a4'`. |
| `orientation` | `'portrait' \| 'landscape'`| Não | Orientação da página. Padrão: `'portrait'`. |
| `quality` | `number` | Não | Qualidade da imagem (0 a 1) usada pelo `html2canvas`. Padrão: `0.95`. |
| `compress` | `boolean` | Não | Se o PDF deve ser comprimido. Padrão: `true`. |
| `includeDate`| `boolean` | Não | Adiciona um rodapé com a data de geração. |
| `margin` | `{ top, right, bottom, left }` | Não | Margens da página em `mm`. |
| `scale` | `number` | Não | Fator de escala para o `html2canvas`. Padrão: `2`. |
| `backgroundColor` | `string` | Não | Cor de fundo do canvas. Padrão: `'#ffffff'`. |
| `watermark` | `ICaoWatermark` | Não | Adiciona uma marca d'água de texto customizável ao PDF. |

### `ICaoWatermark`
Configuração da marca d'água aplicada no PDF.

| Atributo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `text` | `string` | Sim | Texto a ser exibido na marca d'água. |
| `opacity` | `number` | Não | Opacidade do texto (0 a 1). Padrão: `0.3`. |
| `color` | `string` | Não | Cor do texto em formato hex (`'#c8c8c8'`) ou RGB (`'200, 200, 200'`). Padrão: cor cinza claro. |
| `fontSize` | `number` | Não | Tamanho da fonte do texto. Padrão: `60`. |
| `angle` | `number` | Não | Ângulo de rotação do texto em graus. Padrão: `45`. |
| `position` | `'center' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' \| 'tile'` | Não | Posição/ancoragem da marca d'água. `'tile'` repete o texto em mosaico pela página. Padrão: `'center'`. |
| `pages` | `'first' \| 'first-last' \| 'all'` | Não | Páginas que recebem a marca d'água: apenas a primeira, primeira e última, ou todas. Padrão: `'all'`. |

**Exemplo de marca d'água customizável:**

```typescript
const options: ICaoPdfExportOptions = {
  filename: 'documento.pdf',
  watermark: {
    text: 'Rascunho',
    opacity: 0.4,
    color: '#ff0000',
    fontSize: 40,
    angle: 30,
    position: 'top-right',
    pages: 'first-last',
  },
};
```

### `ICaoExportResult`
Representa o resultado de uma operação de exportação.

| Atributo | Tipo | Descrição |
| :--- | :--- | :--- |
| `status` | `CaoExportStatus` | O status final da exportação (`Success`, `Error`, etc.). |
| `filename` | `string` | O nome do arquivo gerado (em caso de sucesso). |
| `error` | `string` | Mensagem de erro (em caso de falha). |
| `timestamp` | `Date` | Data e hora da conclusão da exportação. |
| `size` | `number` | Tamanho estimado do arquivo em bytes. |

### `ICaoExportStrategy`
Interface para definir estratégias de exportação.

| Método | Retorno | Descrição |
| :--- | :--- | :--- |
| `export(element, options)` | `Observable<ICaoExportResult>`| Executa a lógica de exportação para um dado elemento HTML e opções. |

---

## Detalhes dos Serviços e Utilitários

### `CaoPdfExportService`
Serviço principal que orquestra o processo de exportação e gerencia o estado.

**Funcionalidades:**
*   **`exportToPdf(element, options, type)`**: Inicia o processo de exportação.
    *   `element`: O `HTMLElement` a ser exportado.
    *   `options`: `ICaoPdfExportOptions` para configurar a saída.
    *   `type`: `'single-page'` ou `'multi-page'` para selecionar a estratégia.
*   **`reset()`**: Reseta o estado do serviço para o estado inicial (`Idle`).

**Estado Reativo (Signals):**
*   **`isExporting()`**: `computed<boolean>` - Retorna `true` se uma exportação estiver em andamento.
*   **`hasError()`**: `computed<boolean>` - Retorna `true` se a última exportação resultou em erro.
*   **`lastResult()`**: `Signal<ICaoExportResult | null>` - Contém o resultado da última exportação.
*   **`errorMessage()`**: `Signal<string | null>` - Contém a mensagem de erro da última exportação.

### Estratégias de Exportação (`ICaoExportStrategy`)
O serviço utiliza um padrão de estratégia para lidar com diferentes tipos de exportação.

*   **`CaoSinglePageExportStrategy`**: Estratégia para exportar todo o conteúdo em **uma única página**. A imagem é redimensionada (preservando proporção) para caber no box definido pelas margens, centralizada na página. O `margin.bottom` é considerado para o cálculo. Usa orientação `portrait` por padrão.
*   **`CaoMultiPageExportStrategy`**: Estratégia padrão para conteúdo longo que pode se estender por várias páginas, adicionando páginas automaticamente conforme o conteúdo excede a altura da página.

### `CaoHtmlToPdfConverter`
Utilitário injetável que lida com a conversão de baixo nível.

**Funcionalidades:**
*   **`captureHtmlToCanvas(element, options)`**: Captura um `HTMLElement` e o renderiza em um `<canvas>` usando `html2canvas`. Ignora elementos com a classe `.no-print`, o atributo `data-no-export` e botões (`<button>`).
*   **`convertCanvasToPdf(canvas, options)`**: Converte o `<canvas>` gerado em um objeto `jsPDF`, lidando com paginação (multi-page), margens e orientação.
*   **`convertCanvasToSinglePagePdf(canvas, options)`**: Converte o `<canvas>` gerado em um objeto `jsPDF` de página única, ajustando a imagem (contain-fit) para caber no box das margens.
*   **`savePdf(pdf, filename)`**: Inicia o download do arquivo PDF gerado no navegador.
*   **`addWatermark(pdf, watermark)`** (privado): Adiciona uma marca d'água customizável (cor, fonte, ângulo, posição e escopo de páginas) ao PDF.
*   **`addDateFooter(pdf)`** (privado): Adiciona um rodapé com a data e hora de geração em todas as páginas.

## Construindo a Biblioteca

Para construir a biblioteca `ngx-opalbytes-feature-pdf`, execute:

```bash
ng build ngx-opalbytes-feature-pdf
```

Os artefatos de construção serão armazenados no diretório `dist/ngx-opalbytes-feature-pdf`.

## Testes

Para executar os testes unitários:

```bash
npm run test:pdf
```

## Publicando a Biblioteca

Após a construção, você pode publicar sua biblioteca no registro npm:

1.  Navegue até o diretório de saída da compilação:
    ```bash
    cd dist/ngx-opalbytes-feature-pdf
    ```

2.  Publique usando o npm:
    ```bash
    npm publish
    ```