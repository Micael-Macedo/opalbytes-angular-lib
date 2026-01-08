#  ngx-opalbytes-core

A biblioteca `ngx-opalbytes-core` é o coração das aplicações Angular da Opalbytes. Ela fornece um conjunto robusto de serviços, interceptors e interfaces essenciais que formam a base para o desenvolvimento de projetos, garantindo padronização e reutilização de código.

---

### Organização de Pastas Detalhada

A organização interna da biblioteca segue uma estrutura modular clara para facilitar a navegação e o desenvolvimento:

```
src/
└── lib/
    ├── config/            # Configurações da aplicação (endpoints, ambiente)
    ├── constants/         # Constantes globais
    ├── enums/             # Enumerações comuns
    ├── guards/            # Guards de rota (ex: autenticação)
    ├── interceptors/      # Interceptors HTTP
    ├── interfaces/        # Interfaces de dados do core
    ├── models/            # Modelos de dados do core
    ├── providers/         # Modelos de Providers padrão do core
    ├── services/          # Serviços do core (API, cache, autenticação, instalacao)
    └── utils/             # Funções utilitárias e handlers de erro
 
```

---
## Compatibilidade
|Tecnologia  |	Versão  |   Descrição  |
|------------|----------|-------------------------------------|
|   Angular	 |  ^21.0.0	|  Framework principal da biblioteca |

## Instalação

Para instalar a biblioteca, execute o seguinte comando:

```bash
npm install ngx-opalbytes-core
```

---
## Dependências

Esta biblioteca possui as seguintes dependências:

### `peerDependencies`

| Pacote | Versão |
| :----- | :----- |
| `@angular/common` | `^21.0.0` |
| `@angular/core` | `^21.0.0` |
|    `"ngx-webstorage"`| `"^21.0.1"` |
|    `"ngx-mask"`| `"^20.0.3"` |
|    `"jwt-decode"`| `"^4.0.0"` |

### `dependencies`

| Pacote | Versão |
| :----- | :----- |
| `tslib` | `^2.3.0` |

---

## Módulo `core`

O `core` oferece as peças fundamentais para a arquitetura de uma aplicação.

### Itens Disponíveis no `core`
-   **Services**: Para comunicação com APIs, gerenciamento de cache, cookies, loading, etc.
-   **Interceptors**: Para manipular requisições e respostas HTTP (ex: adicionar tokens, tratar erros).
-   **Models**: Modelos de dados centrais, como `BaseResourceModel` e `HttpErrorModel`.
-   **Guards**: Para proteger rotas (ex: `AuthGuard`).
-   **Config**: Gerenciamento de configurações de ambiente (`development`, `production`).
-   **Utils**: Utilitários globais, como `GlobalErrorHandler`.
-   **Providers**: Provider padrão para aplicações

#### Principais Serviços

| Serviço | Descrição |
| :--- | :--- |
| `BaseService` | Serviço genérico para operações CRUD em um recurso de API. |
| `AlertService` | Para exibir mensagens de alerta dinâmicas. |
| `ToastService` | Para gerenciar notificações do tipo "toast". |
| `LoadingService` | Para controlar o estado de "carregando" em toda a aplicação. |
| `HttpCacheService`| Para armazenar em cache respostas de requisições HTTP GET. |
| `ConfigService` | Para carregar e fornecer configurações de ambiente. |
| `CaoInstallationService` | Serviço para verificar a instalação e realizar o download de executáveis. |

#### `CaoInstallationService`

Este serviço é projetado para interagir com o sistema do usuário para verificar se um determinado software está instalado e para facilitar o download e a instalação de executáveis.

**Métodos Principais**

| Método | Descrição |
| :--- | :--- |
| `checkInstallation(config: IConfigInstallation)` | Verifica se um software está instalado, com base na configuração fornecida. Retorna um `Observable<IStatusInstallation>`. |
| `downloadAndInstall(config: IConfigInstallation)` | Inicia o download de um executável a partir do caminho do asset fornecido. |
| `downloadAndOpenFile(config: IConfigInstallation, isTargetBlank = true)` | Inicia o download de um arquivo e o abre em uma nova aba. |
| `downloadBlobFile(configBlob: IBlobConfigInstallation)` | Realiza o download de um arquivo a partir de um `Blob`. |
| `reinstall(config: IConfigInstallation)` | Reinstala o software, que é um alias para `downloadAndInstall`. |

**Interfaces**

`IConfigInstallation`

| Propriedade | Tipo | Descrição |
| :--- | :--- | :--- |
| `executableName` | `string` | O nome do arquivo executável. |
| `assetPath` | `string` | O caminho para o asset (URL de download). |
| `registryPath` | `string` (opcional) | O caminho no registro do Windows para verificar a instalação. |
| `expectedVersion`| `string` (opcional) | A versão esperada do software. |

`IStatusInstallation`

| Propriedade | Tipo | Descrição |
| :--- | :--- | :--- |
| `isInstalled` | `boolean` | `true` se o software estiver instalado. |
| `version` | `string` (opcional) | A versão do software instalado. |
| `lastChecked` | `Date` | A data da última verificação. |
| `installationPath`| `string` (opcional) | O caminho da instalação. |

`IBlobConfigInstallation`

| Propriedade | Tipo | Descrição |
| :--- | :--- | :--- |
| `executableName` | `string` | O nome do arquivo executável. |
| `assetPath` | `Blob` | O `Blob` do arquivo a ser baixado. |


---

### Arquitetura WebSocket

A `ngx-opalbytes-core` inclui uma arquitetura robusta e extensível para trabalhar com WebSockets, projetada para ser flexível e fácil de usar. A arquitetura é baseada em três componentes principais:

-   `BaseWebSocketService`: Uma classe base abstrata que implementa o **Template Method Pattern**. Ela fornece toda a lógica de gerenciamento de conexão, reconexão automática com *exponential backoff*, e envio/recebimento de mensagens.
-   `WebSocketManagerService`: Um serviço singleton para gerenciar múltiplas instâncias de serviços WebSocket, permitindo um controle centralizado sobre todas as conexões ativas na aplicação.
-   `WebSocketConnection`: Um wrapper em torno da API nativa de WebSocket do navegador, que expõe os eventos como Observables RxJS para uma integração mais fácil com o Angular.

#### `BaseWebSocketService<TRequest, TResponse>`

Esta é a classe que você deve estender para criar seu próprio serviço WebSocket. Ela cuida de toda a complexidade do gerenciamento da conexão.

**Métodos Principais para o Usuário**

| Método | Descrição |
| :--- | :--- |
| `connect(configOverride?: Partial<IWebSocketConfig>)` | Inicia a conexão com o servidor WebSocket. Permite sobrescrever a configuração padrão. |
| `disconnect()` | Encerra a conexão WebSocket. |
| `send(message: TRequest)` | Envia uma mensagem para o servidor. A mensagem será transformada pelo `transformRequest` antes de ser enviada. |

**Propriedades (Observables)**

| Propriedade | Tipo | Descrição |
| :--- | :--- |
| `messages` | `Observable<IWebSocketResponse<TResponse>>` | Stream de mensagens recebidas do servidor. |
| `connectionState` | `Observable<WebSocketState>` | Stream que emite o estado atual da conexão (`Connecting`, `Connected`, etc.). |

**Métodos Abstratos (a serem implementados)**

Ao estender `BaseWebSocketService`, você **deve** implementar os seguintes métodos:

| Método | Descrição |
| :--- | :--- |
| `getDefaultConfig(): IWebSocketConfig` | Deve retornar a configuração padrão para a conexão, como a URL do WebSocket. |
| `transformRequest(data: TRequest): unknown` | Transforma o objeto de requisição antes de ser serializado e enviado. Útil para adicionar metadados como `correlationId` e `timestamp`. |
| `transformResponse(data: unknown): TResponse` | Transforma a resposta crua recebida do servidor no tipo `TResponse` esperado. |
| `handleError(error: unknown): void` | Lida com erros específicos do protocolo ou da conexão. |

#### `WebSocketManagerService`

Este serviço atua como um registro central para todas as conexões WebSocket da sua aplicação. É um singleton (`providedIn: 'root'`) que facilita o gerenciamento de múltiplos WebSockets (ex: um para notificações, outro para chat, etc.).

**Métodos Principais**

| Método | Descrição |
| :--- | :--- |
| `register<T>(key: string, service: T)` | Registra uma instância de um serviço WebSocket com uma chave única. |
| `unregister(key: string)` | Remove e desconecta um serviço registrado. |
| `get<T>(key: string): T | undefined` | Obtém uma referência a um serviço registrado pela sua chave. |
| `disconnectAll()` | Desconecta todos os serviços registrados. Útil para um *cleanup* global (ex: no logout do usuário). |
| `getStats()` | Retorna estatísticas sobre as conexões gerenciadas (total, conectadas, desconectadas, etc.). |

#### Modelos de Dados WebSocket

A arquitetura utiliza um conjunto de interfaces para padronizar a comunicação e a configuração.

**`IWebSocketConfig`**

| Propriedade | Tipo | Descrição | Default |
| :--- | :--- | :--- | :--- |
| `url` | `string` | URL do endpoint WebSocket (ex: `ws://localhost:8080/ws`). | - |
| `reconnect` | `boolean` | Habilita a reconexão automática. | `false` |
| `reconnectInterval` | `number` | Tempo (ms) base para a tentativa de reconexão. | `3000` |
| `reconnectAttempts` | `number` | Número máximo de tentativas de reconexão. | `5` |
| `heartbeat` | `boolean` | Habilita o envio de pings para manter a conexão ativa. | `false` |
| `heartbeatInterval` | `number` | Intervalo (ms) do heartbeat. | `30000` |

**`WebSocketState`** (Enum)
Representa os estados possíveis da conexão: `Disconnected`, `Connecting`, `Connected`, `Reconnecting`, `Error`.

**`IWebSocketMessage<TPayload>`**
Envelope padrão para mensagens enviadas.
| Propriedade | Tipo | Descrição |
| :--- | :--- | :--- |
| `type` | `string` | (Opcional) Tipo da mensagem para roteamento no servidor. |
| `correlationId` | `string` | ID único para rastrear requisições e respostas. |
| `timestamp` | `Date` | Data de criação da mensagem. |
| `payload` | `TPayload` | Os dados da mensagem. |

---

### Exemplo: Criando um Serviço de Captura Biométrica

Vamos criar um serviço `CaptureWebSocketService` que se comunica com um hardware de captura biométrica.

**1. Definir os Modelos de Request e Response**
```typescript
// capture.models.ts
export interface ICaptureRequest {
  action: 'start' | 'stop';
  device: string;
}

export interface ICaptureResponse {
  status: 'capturing' | 'success' | 'failed';
  fingerprintData?: string; // base64
  reason?: string;
}
```

**2. Implementar o Serviço WebSocket**

```typescript
// capture-websocket.service.ts
import { Injectable, inject } from '@angular/core';
import { 
  BaseWebSocketService, 
  ConfigService, 
  IWebSocketConfig,
  IWebSocketMessage
} from 'ngx-opalbytes-core';
import { ICaptureRequest, ICaptureResponse } from './capture.models';

@Injectable({ providedIn: 'root' })
export class CaptureWebSocketService extends BaseWebSocketService<ICaptureRequest, ICaptureResponse> {
  
  constructor(configService: ConfigService) {
    super(configService);
  }

  protected getDefaultConfig(): IWebSocketConfig {
    const wsUrl = this.configService.getEndpoint('biometry'); // Ex: 'ws://localhost:5001/ws/capture'
    return {
      url: wsUrl,
      reconnect: true,
      reconnectAttempts: 10,
    };
  }

  protected transformRequest(data: ICaptureRequest): IWebSocketMessage<ICaptureRequest> {
    // Adiciona metadados à requisição
    return {
      correlationId: this.generateCorrelationId(),
      timestamp: new Date(),
      payload: data,
    };
  }

  protected transformResponse(data: any): ICaptureResponse {
    // Valida e transforma a resposta do servidor
    if (!data.payload || typeof data.payload.status !== 'string') {
      throw new Error('Invalid response format from WebSocket');
    }
    return data.payload as ICaptureResponse;
  }

  protected handleError(error: unknown): void {
    console.error('[CaptureWebSocketService] An error occurred:', error);
    // Poderia enviar para um serviço de logging
  }
}

```

**3. Usar o Serviço em um Componente**

```typescript
// capture.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { WebSocketManagerService } from 'ngx-opalbytes-core';
import { CaptureWebSocketService } from './capture-websocket.service';

@Component({
  selector: 'app-capture',
  template: `
    <p>Status da Conexão: {{ captureService.currentState | async }}</p>
    <button (click)="startCapture()">Iniciar Captura</button>
  `,
})
export class CaptureComponent implements OnInit, OnDestroy {
  private wsManager = inject(WebSocketManagerService);
  public captureService = inject(CaptureWebSocketService);

  ngOnInit() {
    // Registra o serviço no manager e conecta
    this.wsManager.register('capture', this.captureService);
    this.captureService.connect().subscribe();

    // Escuta as mensagens
    this.captureService.messages.subscribe(response => {
      if (response.success && response.data?.status === 'success') {
        console.log('Fingerprint captured!', response.data.fingerprintData);
      }
    });
  }

  startCapture() {
    this.captureService.send({ action: 'start', device: 'fingerprint_reader_01' });
  }

  ngOnDestroy() {
    // Desregistra e desconecta o serviço
    this.wsManager.unregister('capture');
  }
}
```

## Como Usar

### Injetando um Serviço

```typescript
import { Component, inject } from '@angular/core';
import { AlertService } from 'ngx-opalbytes-core';

@Component({
  selector: 'app-meu-componente',
})
export class MeuComponente {
  private alertService = inject(AlertService);

  showAlert() {
    this.alertService.success('Sucesso!', 'Operação realizada com sucesso.');
  }
}
```



---

##  Como Contribuir

Para adicionar uma nova funcionalidade a esta biblioteca, siga os passos abaixo:

1.  **Crie os arquivos** da sua funcionalidade (serviço, pipe, etc.) dentro da pasta `src/lib/`, seguindo a estrutura de pastas existente.
2.  **Exponha sua funcionalidade** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `src/public-api.ts`.
3.  **Adicione ou atualize os testes unitários** para garantir a cobertura e o funcionamento esperado.
4.  **Faça o commit** seguindo as [regras de commit do projeto](/README.md#%F0%9F%93%B2-regras-de-commit-com-escopo-obrigatório), usando o escopo `core`.

    ```bash
    git commit -m "feat(core): add novas rotas padrão"
    ```

---

##  Regras e Convenções

### Prefixo

O prefixo para componentes e diretivas nesta biblioteca é `cao`.