import { EventEmitter, Injectable } from "@angular/core";

import { Observable, Subject } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Injectable({
  providedIn: "root",
})
export class CaoWebSocketService {
  protected socket$: WebSocketSubject<unknown> | null = null;
  protected reconnectAttempts = 0;
  protected maxReconnectAttempts = 5;

  private isConnectionSuccess = false;
  private isSocketClosed = false;

  isConnectionEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  onErrorConnection: EventEmitter<string> = new EventEmitter<string>()
  onSuccessConnection: EventEmitter<boolean> = new EventEmitter<boolean>()

  public startConnection(webSocketServer: string) {
    this.reconnectAttempts = 0;
    this.isSocketClosed = false;
    this.connect(webSocketServer);
  }
  
  public connect(webSocketServer: string) {
    this.socket$ = webSocket({
      url: webSocketServer,
      deserializer: (e) => {
        try {
          return JSON.parse(e.data);
        } catch {
          return e.data;
        }
      },
    });

    this.socket$
      .pipe(
        catchError((error) => {
          if (this.isSocketClosed) {
            return new Subject();
          }
          this.onErrorConnection.emit(error);
          this.reconnectAttempts++;
          if (this.reconnectAttempts <= this.maxReconnectAttempts) {
            this.onErrorConnection.emit(`Tentando reconectar (${this.reconnectAttempts})...`);
            this.isConnectionSuccess = false;
            this.emitStatusConnection();
            setTimeout(() => {
              this.connect(webSocketServer);
            }, 3000);
            return new Subject();
          } else {
            this.onErrorConnection.emit("Máximo de tentativas de reconexão atingido.");
            this.isConnectionSuccess = false;
            this.emitStatusConnection();
            return new Subject();
          }
        }),
        retry(this.maxReconnectAttempts)
      )
      .subscribe();
    this.register();
  }

  emitStatusConnection() {
    this.isConnectionEvent.emit(this.isConnectionSuccess);
  }

  register() {
    if (this.socket$ && !this.socket$.closed) {
      this.isConnectionSuccess = true;
      this.emitStatusConnection();
      this.onSuccessConnection.emit(true)
      this.socket$.next("register:web_client");
    }
  }

  /**
   *
   * @returns {void}
   * Este método permite enviar mensagem para o servidor websocket.
   */
  sendMessage(msg: any) {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next(msg);
    }
  }

  /**
   *
   * @returns {Observable<any>} Observável que emite mensagens da conexão WebSocket..
   * Este método permite que outros componentes assinem as mensagens recebidas do servidor WebSocket.
   */
  getMessages(): Observable<any> {
    return this.socket$!.asObservable();
  }

  /**
   *
   * @returns {void}
   * Este método fecha a conexão WebSocket.
   * É importante chamar este método quando a aplicação não precisar mais da conexão WebSocket,
   */
  close() {
    if (this.socket$) {
      this.isSocketClosed = true;
      this.socket$.complete();
      this.socket$ = null;
    }
  }
}
