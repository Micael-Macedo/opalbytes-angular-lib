# ngx-opalbytes-websocket

Uma biblioteca genérica de WebSocket para aplicações Angular, construída sobre o Template Method Pattern. Fornece uma classe abstrata base (`CaoWebSocketService`) com reconexão automática, gerenciamento de estado e transformação de mensagens — basta estendê-la e implementar quatro métodos abstratos para criar um serviço WebSocket personalizado.

---

## Compatibilidade

| Tecnologia | Versão | Descrição |
| :--------- | :----- | :-------- |
| Angular    | `^21.0.0` | Framework principal da biblioteca |

---

## Instalação

```bash
npm install ngx-opalbytes-websocket
```

---

## Dependências

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

A biblioteca não fornece um serviço WebSocket pronto. Em vez disso, ela fornece uma **classe abstrata** (`CaoWebSocketService`) que você estende para criar seu próprio serviço, implementando quatro métodos que definem o comportamento específico do seu domínio.

### Passo 1 — Estender `CaoWebSocketService`

Crie um serviço que herda de `CaoWebSocketService<TRequest, TResponse>`, onde:

- `TRequest` — o tipo do dado enviado ao servidor
- `TResponse` — o tipo do dado recebido do servidor

```typescript
import { Injectable } from '@angular/core';
import {
  CaoWebSocketService,
  CaoWebSocketState,
  ICaoWebSocketConfig,
  ICaoWebSocketResponse,
} from 'ngx-opalbytes-websocket';

interface MyRequest {
  action: string;
  payload: unknown;
}

interface MyResponse {
  result: string;
  data: unknown;
}

@Injectable({ providedIn: 'root' })
export class MyWebSocketService extends CaoWebSocketService<MyRequest, MyResponse> {

  // 1. Configuração padrão da conexão
  protected getDefaultConfig(): ICaoWebSocketConfig {
    return {
      url: 'ws://localhost:5001/ws/meu-canal',
      reconnect: true,
      reconnectInterval: 3000,
      reconnectAttempts: 5,
      heartbeat: false,
    };
  }

  // 2. Transformar a requisição antes de enviar
  protected transformRequest(data: MyRequest): unknown {
    return {
      Action: data.action,
      Payload: data.payload,
      CorrelationId: this.generateCorrelationId(),
      Timestamp: new Date().toISOString(),
    };
  }

  // 3. Transformar a resposta recebida em TResponse
  protected transformResponse(data: unknown): MyResponse {
    const raw = data as Record<string, unknown>;
    return {
      result: raw['Result'] as string,
      data: raw['Data'],
    };
  }

  // 4. Tratar erros específicos do protocolo
  protected handleError(error: unknown): void {
    this.messages$.next({
      success: false,
      error: {
        code: -1,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        details: error,
      },
    });
    this.state$.next(CaoWebSocketState.Error);
  }
}
```

### Passo 2 — Conectar, enviar e ouvir

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CaoWebSocketState } from 'ngx-opalbytes-websocket';
import { MyWebSocketService } from './my-websocket.service';

@Component({
  selector: 'app-exemplo',
  template: '<p>Estado: {{ estado }}</p>',
})
export class ExemploComponent implements OnInit, OnDestroy {
  estado = '';
  private destroy$ = new Subject<void>();

  constructor(private wsService: MyWebSocketService) {}

  ngOnInit(): void {
    // Acompanhar o estado da conexão
    this.wsService.connectionState
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.estado = state;
      });

    // Conectar ao servidor
    this.wsService.connect().subscribe((connected) => {
      if (connected) {
        console.log('Conectado!');
      }
    });

    // Ouvir mensagens recebidas
    this.wsService.messages
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.success) {
          console.log('Dados recebidos:', response.data);
        } else {
          console.error('Erro:', response.error);
        }
      });
  }

  enviarMensagem(): void {
    this.wsService.send({
      action: 'capturar',
      payload: { deviceType: 'biometric' },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsService.destroy();
  }
}
```

### Passo 3 (Opcional) — Usar o `CaoWebSocketManagerService`

Se sua aplicação possui múltiplos WebSockets ativos, registre-os no manager para gerenciamento centralizado:

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CaoWebSocketManagerService } from 'ngx-opalbytes-websocket';
import { MyWebSocketService } from './my-websocket.service';

@Component({
  selector: 'app-exemplo-manager',
  template: '',
})
export class ExemploManagerComponent implements OnInit, OnDestroy {
  constructor(
    private wsManager: CaoWebSocketManagerService,
    private myWsService: MyWebSocketService,
  ) {}

  ngOnInit(): void {
    // Registrar o serviço no manager
    this.wsManager.register('meu-canal', this.myWsService);

    // Conectar
    this.myWsService.connect().subscribe();

    // Verificar estatísticas
    console.log(this.wsManager.getStats());
    // { total: 1, connected: 1, disconnected: 0, error: 0, keys: ['meu-canal'] }
  }

  ngOnDestroy(): void {
    this.wsManager.disconnectAll();
  }
}
```

---

## Exemplo de Integração Real — `CaptureWebSocketService`

O `CaptureWebSocketService` é um serviço concreto que demonstra o uso completo da biblioteca para comunicação WebSocket com um dispositivo biométrico.

```typescript
import { Injectable } from '@angular/core';
import { CaoWebSocketService, CaoWebSocketState, ICaoWebSocketConfig }
  from 'ngx-opalbytes-websocket';
import { ConfigService } from '@infrastructure.config/config.service';

@Injectable({ providedIn: 'root' })
export class CaptureWebSocketService extends CaoWebSocketService<
  ICaptureRequest | IConfigureRequest | IHealthCheckRequest,
  ICaptureResponseBase | ITenPrintResponse
> {
  constructor(private configService: ConfigService) {
    super();
  }

  protected getDefaultConfig(): ICaoWebSocketConfig {
    const captureConfig = this.configService.getWebSocketConfig('capture');
    return {
      url: captureConfig.url ?? '',
      reconnect: true,
      reconnectInterval: 3000,
      reconnectAttempts: 5,
      heartbeat: false,
      ...captureConfig,
    };
  }

  protected transformRequest(
    request: ICaptureRequest | IConfigureRequest | IHealthCheckRequest,
  ): unknown {
    const metadata = request.metadata || {};
    const base = {
      OperationType: 'Capture',
      Metadata: {
        ...metadata,
        CorrelationId: metadata['CorrelationId'] || this.generateCorrelationId(),
      },
    };

    if ('deviceType' in request && typeof request.timeout === 'number') {
      // CaptureRequest
      return {
        ...base,
        DeviceType: request.deviceType,
        RequestOperationType: request.requestOperationType,
        Timeout: request.timeout,
      };
    }

    if ('configurations' in request) {
      // ConfigureRequest
      return {
        ...base,
        RequestOperationType: 'Configure',
        Configurations: this.transformConfigurations(request.configurations),
      };
    }

    // HealthCheckRequest
    return {
      ...base,
      RequestOperationType: 'HealthCheck',
      Timeout: request.timeout,
    };
  }

  protected transformResponse(data: unknown): ICaptureResponseBase | ITenPrintResponse {
    const raw = data as Record<string, unknown>;
    const response: ICaptureResponseBase = {
      success: raw['Success'] as boolean,
      qualityStatus: raw['QualityStatus'] as number | undefined,
      errorCode: raw['ErrorCode'] as number,
      errorMessage: raw['ErrorMessage'] as string | null,
      rawData: raw['RawData'] as string | undefined,
      templateData: raw['TemplateData'] as string | null | undefined,
      metadata: this.transformMetadata(raw['Metadata']),
    };

    if ('Fingers' in raw && Array.isArray(raw['Fingers'])) {
      return {
        ...response,
        captureMode: 'TenPrint',
        totalFingersExpected: raw['TotalFingersExpected'] as number,
        totalFingersCaptured: raw['TotalFingersCaptured'] as number,
        fingers: this.transformFingers(raw['Fingers'] as Record<string, unknown>[]),
      };
    }

    return response;
  }

  protected handleError(error: unknown): void {
    this.messages$.next({
      success: false,
      error: {
        code: -1,
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      },
    });
    this.state$.next(CaoWebSocketState.Error);
  }

  private transformConfigurations(config: Record<string, unknown>): Record<string, unknown> {
    // ... transformação de configurações específicas do domínio
    return config;
  }

  private transformMetadata(metadata: unknown): Record<string, unknown> | undefined {
    // ... transformação de metadados
    return undefined;
  }

  private transformFingers(fingers: Record<string, unknown>[]): Record<string, unknown>[] {
    // ... transformação de dados de dedos
    return fingers;
  }
}
```

---

## Organização de Pastas

```
src/
└── lib/
    ├── index.ts
    ├── class/
    │   ├── index.ts
    │   └── websocket-connection.ts
    ├── enum/
    │   ├── index.ts
    │   └── websocket-state.enum.ts
    ├── interface/
    │   ├── index.ts
    │   ├── websocket-config.model.ts
    │   ├── websocket-error.model.ts
    │   ├── websocket-message.model.ts
    │   └── websocket-response.model.ts
    └── service/
        ├── index.ts
        ├── base-websocket.service.ts
        └── websocket-manager.service.ts
```

---

## Detalhes dos Serviços

### `CaoWebSocketService<TRequest, TResponse>`

Classe abstrata base que implementa o gerenciamento completo de uma conexão WebSocket. Utiliza Template Method Pattern — o consumidor estende esta classe e implementa quatro métodos abstratos.

**Parâmetros de tipo:**

| Parâmetro | Descrição |
| :-------- | :-------- |
| `TRequest` | Tipo dos dados enviados ao servidor |
| `TResponse` | Tipo dos dados recebidos do servidor |

**Métodos públicos:**

| Método | Tipo de retorno | Descrição |
| :----- | :-------------- | :-------- |
| `connect(configOverride?)` | `Observable<boolean>` | Conecta ao WebSocket. Aceita um override parcial da configuração padrão. Emite `true` ao conectar. |
| `disconnect()` | `void` | Desconecta do WebSocket, cancela reconexões pendentes e limpa timers. |
| `send(message)` | `void` | Serializa e envia uma mensagem ao servidor. Requer conexão ativa. |
| `destroy()` | `void` | Limpa todos os Observables e desconecta. Deve ser chamado no `ngOnDestroy`. |

**Getters públicos:**

| Getter | Tipo | Descrição |
| :----- | :--- | :-------- |
| `messages` | `Observable<ICaoWebSocketResponse<TResponse>>` | Stream de mensagens recebidas, já transformadas em `TResponse`. |
| `connectionState` | `Observable<CaoWebSocketState>` | Stream de estados da conexão (para `async pipe` no template). |
| `currentState` | `CaoWebSocketState` | Estado atual da conexão (snapshot). |
| `isConnected` | `boolean` | `true` se a conexão estiver ativa. |

**Métodos protegidos (disponíveis para subclasses):**

| Método | Descrição |
| :----- | :-------- |
| `generateCorrelationId()` | Gera um UUID v4 único para correlacionar request/response. |
| `setupTimeoutHandler(timeout)` | Cria um Observable de timeout (emite `'timeout'` após N ms). |
| `scheduleReconnect()` | Agenda reconexão com exponential backoff (`base × 2^attempt`, máx 60s). |
| `clearReconnectTimer()` | Cancela o timer de reconexão pendente e reseta o contador. |

**Métodos abstratos (obrigatórios para subclasses):**

| Método | Assinatura | Descrição |
| :----- | :-------- | :-------- |
| `getDefaultConfig()` | `(): ICaoWebSocketConfig` | Retorna a configuração padrão da conexão (URL, heartbeat, reconexão, etc). |
| `transformRequest(data)` | `(data: TRequest): unknown` | Transforma os dados antes de enviar ao servidor (ex: serialização, adição de CorrelationId). |
| `transformResponse(data)` | `(data: unknown): TResponse` | Transforma os dados brutos recebidos no tipo `TResponse`. |
| `handleError(error)` | `(error: unknown): void` | Trata erros específicos do protocolo e atualiza `messages$` e `state$`. |

---

### `CaoWebSocketManagerService`

Singleton injetável (`providedIn: 'root'`) para gerenciar múltiplas conexões WebSocket. Permite registro, consulta e cleanup centralizado.

**Métodos:**

| Método | Parâmetros | Descrição |
| :----- | :--------- | :-------- |
| `register(key, service)` | `key: string`, `service: CaoWebSocketService` | Registra um serviço. Se já existir uma chave igual, desconecta o anterior e substitui. |
| `unregister(key)` | `key: string` | Desconecta e remove o serviço registrado. |
| `get<T>(key)` | `key: string → T \| undefined` | Retorna a referência tipada de um serviço registrado. |
| `has(key)` | `key: string → boolean` | Verifica se um serviço está registrado. |
| `getRegisteredKeys()` | `(): string[]` | Retorna todas as chaves registradas. |
| `disconnectAll()` | `(): void` | Desconecta todos os serviços e limpa o mapa. |
| `getStats()` | `(): IWebSocketManagerStats` | Retorna estatísticas: `total`, `connected`, `disconnected`, `error`, `keys`. |

**Getter:**

| Getter | Tipo | Descrição |
| :----- | :--- | :-------- |
| `count` | `number` | Quantidade de serviços registrados. |

---

### `CaoWebSocketConnection`

Wrapper orientado a objetos para a API nativa `WebSocket` do browser. Encapsula eventos do WebSocket como Observables RxJS.

**Construtor:**

```typescript
constructor(config: ICaoWebSocketConfig)
```

**Métodos:**

| Método | Parâmetros | Descrição |
| :----- | :--------- | :-------- |
| `connect()` | `(): Observable<Event>` | Abre a conexão. Emite quando a conexão é estabelecida. |
| `send(data)` | `(data: string \| ArrayBufferLike \| Blob \| ArrayBufferView): void` | Envia dados ao servidor. Verifica se a conexão está aberta antes de enviar. |
| `close(code?, reason?)` | `(code = 1000, reason?: string): void` | Fecha a conexão. Código `1000` = fechamento normal. |
| `destroy()` | `(): void` | Fecha a conexão e completa todos os Subjects internos. |

**Getters:**

| Getter | Tipo | Descrição |
| :----- | :--- | :-------- |
| `isOpen` | `boolean` | `true` se a conexão estiver aberta (`readyState === OPEN`). |
| `readyState` | `number` | Estado nativo do WebSocket (`0`–`3`). |
| `messages$` | `Observable<MessageEvent>` | Stream de mensagens recebidas. |
| `open$` | `Observable<Event>` | Evento de conexão estabelecida. |
| `close$` | `Observable<CloseEvent>` | Evento de desconexão (inclui código e motivo). |
| `error$` | `Observable<Event>` | Stream de erros. |

---

## Enumerações

### `CaoWebSocketState`

| Valor | Descrição |
| :---- | :-------- |
| `Disconnected` | Desconectado, sem tentativas de reconexão. |
| `Connecting` | Tentando estabelecer conexão inicial. |
| `Connected` | Conectado, pronto para enviar/receber mensagens. |
| `Reconnecting` | Tentando reconectar após perda de conexão. |
| `Error` | Erro fatal ou máximo de tentativas atingido. |

---

## Interfaces

### `ICaoWebSocketConfig`

| Propriedade | Tipo | Padrão | Descrição |
| :---------- | :--- | :----- | :-------- |
| `url` | `string` | — (obrigatório) | URL do endpoint WebSocket. |
| `protocols` | `string[]` | `undefined` | Protocolos suportados pela conexão. |
| `reconnect` | `boolean` | `false` | Habilita reconexão automática. |
| `reconnectInterval` | `number` | `3000` | Intervalo base da reconexão (ms). Usado com exponential backoff: `base × 2^attempt`. |
| `reconnectAttempts` | `number` | `5` | Número máximo de tentativas de reconexão. |
| `heartbeat` | `boolean` | `false` | Habilita heartbeat (ping/pong). |
| `heartbeatInterval` | `number` | `30000` | Intervalo do heartbeat (ms). |

### `ICaoWebSocketResponse<TData>`

| Propriedade | Tipo | Descrição |
| :---------- | :--- | :-------- |
| `success` | `boolean` | Indica se a operação foi bem-sucedida. |
| `data` | `TData \| undefined` | Dados retornados (presente quando `success = true`). |
| `error` | `ICaoWebSocketError \| undefined` | Informações do erro (presente quando `success = false`). |
| `metadata` | `Record<string, unknown> \| undefined` | Metadados adicionais da resposta. |

### `ICaoWebSocketMessage<TPayload>`

| Propriedade | Tipo | Descrição |
| :---------- | :--- | :-------- |
| `type` | `string \| undefined` | Tipo da mensagem (útil para roteamento). |
| `correlationId` | `string` | ID único para correlacionar request/response. |
| `timestamp` | `Date` | Timestamp da criação da mensagem. |
| `payload` | `TPayload` | Dados da mensagem. |

### `ICaoWebSocketError`

| Propriedade | Tipo | Descrição |
| :---------- | :--- | :-------- |
| `code` | `number` | Código numérico do erro. |
| `message` | `string` | Mensagem descritiva do erro. |
| `details` | `unknown \| undefined` | Detalhes adicionais (stack trace, contexto, etc). |

---

## Como Contribuir

1. **Crie os arquivos** do seu serviço dentro da pasta `src/lib/service/`, seguindo a estrutura de pastas existente.
2. **Importe o serviço via arquivo index** no arquivo `src/lib/service/index.ts`
2. **Exponha na API pública** adicionando uma linha de exportação no arquivo `src/lib/index.ts`.
3. **Adicione ou atualize os testes unitários** para garantir cobertura.
4. **Faça o commit** seguindo as regras do projeto, usando o escopo `websocket`:

    ```bash
    git commit -m "feat(websocket): add new service"
    ```

---

## Regras e Convenções

### Prefixo

O prefixo para serviços e classes nesta biblioteca é `cao`.

- **Serviços:** `CaoWebSocketService`, `CaoWebSocketManagerService`
- **Classes:** `CaoWebSocketConnection`
- **Enum:** `CaoWebSocketState`
- **Interfaces:** `ICaoWebSocketConfig`, `ICaoWebSocketResponse`, `ICaoWebSocketMessage`, `ICaoWebSocketError`
