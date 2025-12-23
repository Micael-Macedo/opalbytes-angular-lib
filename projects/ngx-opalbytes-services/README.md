# 📦 ngx-opalbytes-services

Esta biblioteca destina-se a abrigar serviços (`services`) Angular reutilizáveis que encapsulam lógica de negócios, chamadas de API e outras funcionalidades compartilhadas.

---
## Compatibilidade
|Tecnologia  |	Versão  |   Descrição  |
|------------|----------|-------------------------------------|
|   Angular	 |  ^21.0.0	|  Framework principal da biblioteca |

## Instalação

Para instalar a biblioteca, execute o seguinte comando:

```bash
npm install ngx-opalbytes-services
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

Os serviços podem ser injetados nos seus componentes ou outros serviços via injeção de dependência do Angular.

**Exemplo de como um serviço seria utilizado:**

```typescript
import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'ngx-opalbytes-services';

@Component({
  selector: 'app-user-profile',
})
export class UserProfileComponent implements OnInit {
  
  private websocketService = inject(WebsocketService)
  constructor() {}

  ngOnInit() {
    // this.websocketService.connect('ws://localhost:8080');
  }
}
```

---

## Organização de Pastas

Dentro da pasta `src/lib/`, os serviços são organizados na pasta `services/`.

```
src/
└── lib/
    └── services/
        ├── date-pipe.service.ts
        ├── installer.service.ts
        └── websocket.service.ts
```

---

---

## Detalhes dos Serviços

### `CaoDatePipeService`
Um serviço simples que atua como um wrapper para o `DatePipe` do Angular, facilitando a formatação de datas.

**Métodos**

| Método | Parâmetros | Retorno | Descrição |
| --- | --- | --- | --- |
| `getConvertedDatePipe` | `value: Date`, `transform: string` | `string` | Formata uma data de acordo com a string de formato fornecida. |

**Exemplo de Uso**
```typescript
import { CaoDatePipeService } from 'ngx-opalbytes-services';

// ...

constructor(private datePipeService: CaoDatePipeService) {}

formatarData() {
  const dataFormatada = this.datePipeService.getConvertedDatePipe(new Date(), 'dd/MM/yyyy');
  console.log(dataFormatada); // Ex: 22/12/2025
}
```

---

### `CaoInstallationService`
Este serviço gerencia o download e a instalação de executáveis ou a abertura de arquivos, comumente usado em cenários de instalação de aplicações desktop a partir de uma aplicação web.

**Propriedades**

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `status$` | `Observable<IStatusInstallation>` | Emite o status atual da instalação. |

**Interfaces**
```typescript
interface IStatusInstallation {
  isInstalled: boolean;
  version?: string;
  lastChecked: Date;
  installationPath?: string;
}

interface IConfigInstallation {
  executableName: string;
  assetPath: string; // URL para o arquivo
}

interface IBlobConfigInstallation {
  executableName: string;
  assetPath: Blob; // Arquivo em formato Blob
}
```

**Métodos**

| Método | Parâmetros | Retorno | Descrição |
| --- | --- | --- | --- |
| `downloadAndInstall` | `config: IConfigInstallation` | `Observable<boolean>` | Inicia o download e a instalação de um executável. |
| `downloadAndOpenFile` | `config: IConfigInstallation`, `isTargetBlank?: boolean` | `Observable<boolean>` | Faz o download e abre um arquivo em uma nova aba. |
| `downloadBlobFile` | `configBlob: IBlobConfigInstallation` | `void` | Inicia o download de um arquivo a partir de um objeto Blob. |
| `reinstall` | `config: IConfigInstallation` | `Observable<boolean>` | Atalho para o método `downloadAndInstall`. |

---

### `CaoWebSocketService`
Gerencia uma conexão WebSocket com um servidor, incluindo lógica de reconexão automática.

**Propriedades (Emitters)**

| Propriedade | Tipo | Descrição |
| --- | --- | --- |
| `isConnectionEvent` | `EventEmitter<boolean>` | Emite `true` em sucesso e `false` em falha de conexão. |
| `onErrorConnection` | `EventEmitter<string>` | Emite mensagens de erro durante as tentativas de conexão. |
| `onSuccessConnection`| `EventEmitter<boolean>`| Emite `true` quando a conexão é estabelecida com sucesso. |

**Métodos**

| Método | Parâmetros | Retorno | Descrição |
| --- | --- | --- | --- |
| `startConnection` | `webSocketServer: string` | `void` | Inicia o processo de conexão com o servidor WebSocket. |
| `connect` | `webSocketServer: string` | `void` | Lógica principal de conexão, com tentativas de reconexão. |
| `sendMessage` | `msg: any` | `void` | Envia uma mensagem para o servidor. |
| `getMessages` | - | `Observable<any>` | Retorna um Observable que emite as mensagens recebidas do servidor. |
| `close` | - | `void` | Fecha a conexão com o WebSocket. |

**Exemplo de Uso**
```typescript
import { CaoWebSocketService } from 'ngx-opalbytes-services';

// ...
private wsService = inject(CaoWebSocketService)

constructor() {}

ngOnInit() {
  this.wsService.startConnection('wss://meu-servidor.com');

  this.wsService.isConnectionEvent.subscribe(isSuccess => {
    console.log('Status da conexão:', isSuccess);
  });

  this.wsService.getMessages().subscribe(message => {
    console.log('Nova mensagem:', message);
  });
}

enviar() {
  this.wsService.sendMessage({ data: 'Olá, servidor!' });
}

ngOnDestroy() {
  this.wsService.close();
}
```

---

## 📜 Como Contribuir

Para adicionar um novo serviço a esta biblioteca, siga os passos abaixo:

1.  **Crie o arquivo** do seu serviço dentro da pasta `src/lib/services/`. Por exemplo: `src/lib/services/user.service.ts`.
2.  **Implemente seu serviço**, lembrando de marcá-lo com `@Injectable({ providedIn: 'root' })` para que ele seja "tree-shakable".
3.  **Exponha o serviço** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `src/public-api.ts`.

    ```typescript
    // projects/ngx-opalbytes-services/src/public-api.ts
    export * from './lib/services/user.service'; 
    ```
4.  **Adicione testes unitários** para garantir a qualidade e o funcionamento esperado do seu serviço.
5.  **Faça o commit** seguindo as [regras de commit do projeto](/README.md#룰-regras-de-commit-com-escopo-obrigatório), usando o escopo `services`.

    ```bash
    git commit -m "feat(services): add user service para validacao"
    ```