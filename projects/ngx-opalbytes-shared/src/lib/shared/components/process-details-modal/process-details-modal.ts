import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Process } from '@domain/models/process.model';
import { File } from '@domain/models/file.model';
import { FileService } from '@domain/services/file.service';
import { FileStreamService } from '@core/services/file-stream.service';
import { PermissionDirective } from '@shared/directives/permission.directive';
import { downloadBlob } from '@core/utils/file-download.util';

@Component({
  selector: 'app-process-details-modal',
  imports: [CommonModule, PermissionDirective],
  templateUrl: './process-details-modal.html',
})
export class ProcessDetailsModal {
  isOpen = input.required<boolean>();
  processo = input<Process | null>(null);
  closed = output<void>();

  private fileService = inject(FileService);
  private fileStreamService = inject(FileStreamService);
  private sanitizer = inject(DomSanitizer);
  private currentObjectUrl: string | null = null;

  arquivoSelecionado = signal<File | null>(null);
  carregandoArquivo = signal(false);
  erroCarregamento = signal<string | null>(null);
  urlVisualizacao = signal<SafeResourceUrl | null>(null);
  progressoCarregamento = signal<number>(0);

  formatarData(data: string): string {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatarDataHora(data: string): string {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatarNomeArquivo(arquivo: any): string {
    if (!arquivo || !this.processo()) return '';
    const identificador = this.processo()?.identificador || '';
    const tipoId = arquivo.tipoArquivoId
      ? arquivo.tipoArquivoId.substring(arquivo.tipoArquivoId.length - 1)
      : '';
    const hash = arquivo.hash || '';
    return `${identificador}_${tipoId}_${hash}.pdf`;
  }

  obterTipoArquivo(arquivo: any): string {
    if (!arquivo || !arquivo.tipoArquivoId) return '-';
    return arquivo.tipoArquivoId.substring(arquivo.tipoArquivoId.length - 1);
  }

  abrirArquivo(arquivo: File): void {
    this.carregandoArquivo.set(true);
    this.erroCarregamento.set(null);
    this.progressoCarregamento.set(0);
    this.arquivoSelecionado.set(arquivo);

    this.fileService
      .getFileStream(arquivo.id)
      .then((response) => {
        this.fileStreamService.processStream(response, arquivo).subscribe({
          next: (result) => {
            if (result.progress) {
              this.progressoCarregamento.set(result.progress.progressMB);
            }

            if (result.file.fileBytes) {
              this.gerarUrlVisualizacao(result.file);
              this.arquivoSelecionado.set(result.file);
              this.carregandoArquivo.set(false);
              this.progressoCarregamento.set(0);
            }
          },
          error: (error) => {
            this.erroCarregamento.set(
              error instanceof Error
                ? error.message
                : 'Erro ao processar o arquivo. Tente novamente.',
            );
            this.carregandoArquivo.set(false);
            this.progressoCarregamento.set(0);
          },
        });
      })
      .catch((error) => {
        this.erroCarregamento.set(
          error instanceof Error ? error.message : 'Erro ao carregar o arquivo. Tente novamente.',
        );
        this.carregandoArquivo.set(false);
        this.progressoCarregamento.set(0);
      });
  }

  baixarArquivo(): void {
    const arquivo = this.arquivoSelecionado();
    if (!arquivo?.fileBytes) return;

    const blob = this.converterParaBlob(arquivo.fileBytes, arquivo.extensao);
    const filename = this.formatarNomeArquivo(arquivo);

    // Usa a função protegida que previne downloads duplicados
    downloadBlob(blob, filename);
  }

  fecharVisualizador(): void {
    this.limparObjectUrl();
    this.arquivoSelecionado.set(null);
    this.urlVisualizacao.set(null);
    this.erroCarregamento.set(null);
    this.progressoCarregamento.set(0);
  }

  fecharModal(): void {
    this.limparObjectUrl();
    this.arquivoSelecionado.set(null);
    this.urlVisualizacao.set(null);
    this.progressoCarregamento.set(0);
    this.closed.emit();
  }

  private gerarUrlVisualizacao(arquivo: File): void {
    this.limparObjectUrl();

    if (!arquivo?.fileBytes) {
      this.urlVisualizacao.set(null);
      return;
    }

    try {
      const blob = this.converterParaBlob(arquivo.fileBytes, arquivo.extensao);
      const url = window.URL.createObjectURL(blob);

      this.currentObjectUrl = url;
      this.urlVisualizacao.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    } catch {
      this.erroCarregamento.set(
        'Arquivo muito grande ou formato inválido. Tente fazer o download.',
      );
      this.urlVisualizacao.set(null);
    }
  }

  private converterParaBlob(fileBytes: string | number[], extensao: string): Blob {
    const base64Data = Array.isArray(fileBytes)
      ? this.byteArrayToBase64(fileBytes)
      : fileBytes.trim();

    const base64Content = base64Data.startsWith('data:') ? base64Data.split(',')[1] : base64Data;

    const chunkSize = 1024 * 512;
    const byteCharacters = atob(base64Content);

    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += chunkSize) {
      const slice = byteCharacters.slice(offset, offset + chunkSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const mimeType = this.obterMimeType(extensao);
    return new Blob(byteArrays as BlobPart[], { type: mimeType });
  }

  private byteArrayToBase64(byteArray: number[]): string {
    const uint8Array = new Uint8Array(byteArray);
    const chunkSize = 8192;
    let binary = '';

    for (let i = 0; i < uint8Array.byteLength; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.byteLength));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }

    return btoa(binary);
  }

  private obterMimeType(extensao: string): string {
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.txt': 'text/plain',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    return mimeTypes[extensao?.toLowerCase()] || 'application/octet-stream';
  }

  private limparObjectUrl(): void {
    if (this.currentObjectUrl) {
      window.URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }
}
