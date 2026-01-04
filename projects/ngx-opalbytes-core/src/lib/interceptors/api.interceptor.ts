import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { map, catchError, finalize } from "rxjs/operators";

import { HttpErrorHandlerService } from "../services/http-error-handler.service";
import { LoadingService } from "../services/loading.service";
import { ResponseTransformerService } from "../services/response-transformer.service";

/**
 * Interceptor HTTP refatorado seguindo princípios SOLID
 *
 * Responsabilidades:
 * - Gerenciar loading (LoadingService)
 * - Transformar respostas (ResponseTransformerService)
 * - Processar erros (HttpErrorHandlerService)
 *
 * Princípios SOLID aplicados:
 * - Single Responsibility: Cada service tem uma responsabilidade única
 * - Open/Closed: Extensível através dos services
 * - Liskov Substitution: Services podem ser substituídos
 * - Interface Segregation: Interfaces específicas para cada service
 * - Dependency Inversion: Depende de abstrações (services injetados)
 *
 * Headers e Params customizados:
 * - X-Skip-Loading / skipLoading: Desabilita loading
 * - X-Skip-Alert / skipAlert: Desabilita alertas automáticos
 * - X-Transform-Response / transform: Força transformação de resposta
 */
@Injectable({ providedIn: "root" })
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
    private httpErrorHandler: HttpErrorHandlerService,
    private responseTransformer: ResponseTransformerService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const skipLoading = this.shouldSkipLoading(req);
    const skipAlert = this.shouldSkipAlert(req);
    const shouldTransform = this.shouldTransformResponse(req);

    // Iniciar loading se necessário
    if (!skipLoading) {
      this.loadingService.start();
    }

    return next.handle(req).pipe(
      // Processar resposta
      map((event) => this.responseTransformer.processHttpEvent(event, shouldTransform, skipAlert)),

      // Processar erro
      catchError((error: HttpErrorResponse) => {
        return this.httpErrorHandler.handleError(error, skipAlert);
      }),

      // Finalizar loading
      finalize(() => {
        if (!skipLoading) {
          this.loadingService.stop();
        }
      })
    );
  }

  /**
   * Verifica se deve pular loading
   */
  private shouldSkipLoading(req: HttpRequest<unknown>): boolean {
    return req.headers.has("X-Skip-Loading") || req.params.has("skipLoading");
  }

  /**
   * Verifica se deve pular alertas
   */
  private shouldSkipAlert(req: HttpRequest<unknown>): boolean {
    return req.headers.has("X-Skip-Alert") || req.params.has("skipAlert");
  }

  /**
   * Verifica se deve transformar resposta
   */
  private shouldTransformResponse(req: HttpRequest<unknown>): boolean {
    return req.headers.has("X-Transform-Response") || req.params.has("transform");
  }
}
