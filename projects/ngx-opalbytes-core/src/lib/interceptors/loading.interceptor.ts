import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { tap, catchError, debounceTime } from "rxjs/operators";

import { LoadingService } from "../services/loading.service";

@Injectable({ providedIn: "root" })
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<unknown>
    | HttpUserEvent<unknown>
  > {
    // Pular interceptor para requisições específicas
    if (req.params.has("noLoading") || req.url.includes("/health")) {
      return next.handle(req);
    }

    this.loadingService.start();

    return next.handle(req).pipe(
      debounceTime(100), // Evita flickering do loading em requisições rápidas
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.loadingService.stop();
        }
      }),
      catchError((err) => {
        this.loadingService.stop();
        throw err;
      })
    );
  }
}
