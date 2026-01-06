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

O `ProcessoDetalhesExportService` demonstra um caso de uso avançado onde um componente dinâmico (`ProtocoloPdfTemplateComponent`) é criado, preenchido com dados, e então exportado para PDF.

```typescript
import (
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
} from '@angular/core';

import { Observable } from 'rxjs';

import { IPdfExportOptions } from '@core.interfaces/export-options.interface';
import { IExportResult } from '@core.interfaces/export-result.interface';
import { PdfExportService } from '@core.services/pdf-export.service';

import { IProtocoloData } from '@domain.models/processo/protocolo-data.interface';

import { ProtocoloPdfTemplateComponent } from '@shared.components/protocolo-pdf-template/protocolo-pdf-template';

@Injectable({
  providedIn: 'root',
})
export class ProcessoDetalhesExportService {
  private pdfExportService = inject(PdfExportService);
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  /**
   * Exporta protocolo para PDF usando template customizado
   */
  exportProtocoloPdf(protocoloData: IProtocoloData): Observable<IExportResult> {
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `protocolo-${protocoloData.numeroProtocolo}-${timestamp}.pdf`;

    const options: IPdfExportOptions = {
      filename,
      format: 'a4',
      orientation: 'portrait',
      quality: 0.95,
      compress: true,
      includeDate: false, // Já tem data no template
      margin: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      },
      scale: 2,
      backgroundColor: '#ffffff',
    };

    // Criar componente dinamicamente
    const componentRef = createComponent(ProtocoloPdfTemplateComponent, {
      environmentInjector: this.injector,
    });

    // Definir os dados do protocolo
    componentRef.setInput('data', protocoloData);

    // Anexar ao DOM
    this.appRef.attachView(componentRef.hostView);
    const domElement = componentRef.location.nativeElement as HTMLElement;
    document.body.appendChild(domElement);

    // Aguardar um tick para garantir renderização
    return new Observable((observer) => {
      setTimeout(() => {
        // Exportar para PDF
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
            // Limpar o componente do DOM em caso de erro
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

### `IPdfExportOptions`
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
| `watermark` | `{ text, opacity }` | Não | Adiciona uma marca d'água de texto ao PDF. |

### `IHtmlElementOptions`
Opções para elementos HTML, permitindo especificar seletores CSS para incluir ou excluir certos elementos da captura para PDF.

| Atributo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `element` | `HTMLElement` | Sim | O elemento HTML a ser exportado. |
| `excludeSelectors`| `string[]` | Não | Array de seletores CSS para excluir da captura. |
| `includeSelectors`| `string[]` | Não | Array de seletores CSS para incluir na captura. |

### `IExportResult`
Representa o resultado de uma operação de exportação.

| Atributo | Tipo | Descrição |
| :--- | :--- | :--- |
| `status` | `ExportStatus` | O status final da exportação (`Success`, `Error`). |
| `filename` | `string` | O nome do arquivo gerado (em caso de sucesso). |
| `error` | `string` | Mensagem de erro (em caso de falha). |
| `timestamp` | `Date` | Data e hora da conclusão da exportação. |
| `size` | `number` | Tamanho estimado do arquivo em bytes. |

### `IExportProgress`
Descreve o progresso da exportação em tempo real.

| Atributo | Tipo | Descrição |
| :--- | :--- | :--- |
| `stage` | `'capturing' \| 'converting' \| 'saving'`| O estágio atual do processo de exportação. |
| `progress` | `number` | Percentual de progresso (0 a 100). |
| `message` | `string` | Mensagem descritiva do estágio atual. |

### `IExportStrategy`
Interface para definir estratégias de exportação.

| Método | Retorno | Descrição |
| :--- | :--- | :--- |
| `export(element, options)` | `Observable<IExportResult>`| Executa a lógica de exportação para um dado elemento HTML e opções. |

---

## Detalhes dos Serviços e Utilitários

### `PdfExportService`
Serviço principal que orquestra o processo de exportação e gerencia o estado.

**Funcionalidades:**
*   **`exportToPdf(element, options, type)`**: Inicia o processo de exportação.
    *   `element`: O `HTMLElement` a ser exportado.
    *   `options`: `IPdfExportOptions` para configurar a saída.
    *   `type`: `'single-page'` ou `'multi-page'` para selecionar a estratégia.
*   **`reset()`**: Reseta o estado do serviço para o estado inicial (`Idle`).

**Estado Reativo (Signals):**
*   **`isExporting()`**: `computed<boolean>` - Retorna `true` se uma exportação estiver em andamento.
*   **`hasError()`**: `computed<boolean>` - Retorna `true` se a última exportação resultou em erro.
*   **`lastResult()`**: `Signal<IExportResult | null>` - Contém o resultado da última exportação.
*   **`errorMessage()`**: `Signal<string | null>` - Contém a mensagem de erro da última exportação.

### Estratégias de Exportação (`IExportStrategy`)
O serviço utiliza um padrão de estratégia para lidar com diferentes tipos de exportação.

*   **`SinglePageExportStrategy`**: Estratégia para exportar conteúdo que cabe em uma única página. Ajusta as opções para otimizar para uma página.
*   **`MultiPageExportStrategy`**: Estratégia padrão para conteúdo longo que pode se estender por várias páginas.

### `HtmlToPdfConverter`
Utilitário injetável que lida com a conversão de baixo nível.

**Funcionalidades:**
*   **`captureHtmlToCanvas(element, options)`**: Captura um `HTMLElement` e o renderiza em um `<canvas>` usando `html2canvas`. Ignora elementos com a classe `.no-print` ou o atributo `data-no-export`.
*   **`convertCanvasToPdf(canvas, options)`**: Converte o `<canvas>` gerado em um objeto `jsPDF`, lidando com paginação, margens e orientação.
*   **`savePdf(pdf, filename)`**: Inicia o download do arquivo PDF gerado no navegador.
*   **`addWatermark(pdf, watermark)`** (privado): Adiciona uma marca d'água em todas as páginas do PDF.
*   **`addDateFooter(pdf)`** (privado): Adiciona um rodapé com a data e hora de geração em todas as páginas.

## Construindo a Biblioteca

Para construir a biblioteca `ngx-opalbytes-feature-pdf`, execute:

```bash
ng build ngx-opalbytes-feature-pdf
```

Os artefatos de construção serão armazenados no diretório `dist/ngx-opalbytes-feature-pdf`.

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
