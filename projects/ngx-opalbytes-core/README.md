# ngx-opalbytes-core

A biblioteca `ngx-opalbytes-core` é o coração das aplicações Angular da Opalbytes. Ela fornece um conjunto robusto de serviços, interceptors, guards, modelos e interfaces essenciais que formam a base para o desenvolvimento de projetos, garantindo padronização e reutilização de código.

---

### Organização de Pastas Detalhada

A organização interna da biblioteca segue uma estrutura modular clara para facilitar a navegação e o desenvolvimento:

```
src/
└── lib/
    ├── config/            # Configurações da aplicação (endpoints, ambiente, tokens)
    ├── constants/         # Constantes globais (estados, endpoints de CEP)
    ├── enums/             # Enumerações comuns
    ├── guards/            # Guards de rota (autenticação) e seus serviços
    ├── interceptors/      # Interceptors HTTP e serviços auxiliares
    ├── interfaces/        # Interfaces de dados do core
    ├── models/            # Modelos de dados do core
    ├── providers/         # Provider padrão para aplicações (caoProvideCore)
    ├── services/          # Serviços do core (API, cache, cookies, armazenamento)
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
| `@angular/material` | `^21.0.0` |
| `@angular/router` | `^21.0.0` |
| `"ngx-webstorage"` | `"^21.0.1"` |
| `"ngx-mask"` | `"^20.0.3"` |
| `"jwt-decode"` | `"^4.0.0"` |

### `dependencies`

| Pacote | Versão |
| :----- | :----- |
| `tslib` | `^2.3.0` |

---

## Setup Inicial da Aplicação

A forma recomendada de integrar o `core` ao projeto é através do provider `caoProvideCore`. Ele configura, em uma única chamada:

- O `Router` com as rotas da aplicação;
- O `HttpClient` e os interceptors (`CaoApiInterceptor` e `CaoLoadingInterceptor`);
- O `LOCALE_ID` (`pt-BR`) e o suporte a datas (`MAT_DATE_LOCALE`);
- As dependências de máscara (`ngx-mask`), storage (`ngx-webstorage`) e de detecção de mudanças;
- Os tokens `ENVIRONMENT` e o `APP_CONFIG` (configuração derivada do ambiente informado).

### Exemplo de uso no `app.config.ts`

```typescript
import { ApplicationConfig } from "@angular/core";
import { caoProvideCore, ICaoEnvironmentConfig } from "ngx-opalbytes-core";
import { Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", loadComponent: () => import("./pages/home.component").then((m) => m.HomeComponent) },
];

const environment: ICaoEnvironmentConfig = {
  production: false,
  name: "local",
  buildDate: "2026-01-01",
};

export const appConfig: ApplicationConfig = {
  providers: [
    caoProvideCore({ routes, environment }),
  ],
};
```

### Configurações de ambiente (tokens)

O `ENVIRONMENT` e o `APP_CONFIG` ficam disponíveis para injeção e podem ser obtidos com os tokens exportados pela biblioteca:

```typescript
import { inject } from "@angular/core";
import { ENVIRONMENT, APP_CONFIG, ICaoAppConfig } from "ngx-opalbytes-core";

@Component({ ... })
export class AppComponent {
  private env = inject(ENVIRONMENT);
  private config: ICaoAppConfig = inject(APP_CONFIG);
}
```

---

## Módulo `core`

O `core` oferece as peças fundamentais para a arquitetura de uma aplicação.

### Itens Disponíveis no `core`
-   **Services**: Comunicação com APIs, cache, cookies, storage, CEP, alertas, toast, loading e CRUD genérico.
-   **Interceptors**: Manipulação de requisições e respostas HTTP (loading, transformação e tratamento de erros).
-   **Models**: Modelos de dados centrais, como `BaseResourceModel` e `HttpErrorModel`.
-   **Guards**: Proteção de rotas com `authGuard` e `CaoTokenGuardService`.
-   **Config**: Gerenciamento de configurações de ambiente (`development`, `production`) e helpers de URLs/endpoints.
-   **Utils**: Utilitários globais, como `GlobalErrorHandler` e `NavigationUtil`.
-   **Providers**: Provider padrão para aplicações (`caoProvideCore`).

#### Principais Serviços

| Serviço | Descrição |
| :--- | :--- |
| `BaseResourceService` | Serviço genérico para operações CRUD em um recurso de API. |
| `AlertService` | Para exibir mensagens de alerta dinâmicas. |
| `ToastService` | Para gerenciar notificações do tipo "toast". |
| `LoadingService` | Para controlar o estado de "carregando" em toda a aplicação. |
| `HttpCacheService` | Para armazenar em cache respostas de requisições HTTP GET. |
| `CookieService` | Leitura, escrita e remoção de cookies de forma tipada. |
| `StorageService` | Abstração sobre `localStorage`/`sessionStorage`. |
| `CEPService` | Busca de endereços por CEP (BrasilAPI com fallback para ViaCEP) e municípios por UF. |
| `CaoConfigService` | Carrega e fornece as configurações de ambiente (`getApiUrl`, `getPath`, `buildUrl`, etc.). |
| `HelpConfig` | Helpers de endpoints e métodos HTTP prontos para uso. |
| `CaoTokenGuardService` | Gerencia o token de autenticação usado pelos guards. |
| `HttpErrorHandlerService` | Processa erros HTTP de forma centralizada (alertas, redirects). |
| `ResponseTransformerService` | Normaliza respostas HTTP para o formato `ICaoApiResponse`. |
| `NavigationUtil` | Navegação centralizada (rotas, params, reload, nova aba). |
| `GlobalErrorHandler` | Última linha de defesa para erros não tratados da aplicação. |

#### Guards de Rota

Para proteger rotas que exigem autenticação, utilize o `authGuard`:

```typescript
import { Routes } from "@angular/router";
import { authGuard } from "ngx-opalbytes-core";

export const routes: Routes = [
  { path: "home", component: HomeComponent, canActivate: [authGuard] },
];
```

Quando não autenticado, o guard redireciona para `/login`.

---

## Como Usar

### Injetando um Serviço

```typescript
import { Component, inject } from "@angular/core";
import { AlertService } from "ngx-opalbytes-core";

@Component({
  selector: "app-meu-componente",
})
export class MeuComponente {
  private alertService = inject(AlertService);

  showAlert() {
    this.alertService.success("Sucesso!", "Operação realizada com sucesso.");
  }
}
```

### Usando o `BaseResourceService`

```typescript
import { Injectable, Inject, Injector } from "@angular/core";
import { BaseResourceService, BaseResourceModel } from "ngx-opalbytes-core";

export interface IAluno extends BaseResourceModel {
  nome: string;
}

@Injectable({ providedIn: "root" })
export class AlunoService extends BaseResourceService<IAluno> {
  constructor(@Inject(String) url: string, injector: Injector) {
    super(url, injector);
  }
}
```

### Buscando um CEP

```typescript
import { Component, inject } from "@angular/core";
import { CEPService } from "ngx-opalbytes-core";

@Component({ ... })
export class EnderecoComponent {
  private cepService = inject(CEPService);

  buscar() {
    this.cepService.searchCEP("01001000").subscribe((endereco) => {
      console.log(endereco?.logradouro);
    });
  }
}
```

---

## Testes

A biblioteca possui suítes de testes unitários (Vitest via `@angular/build:unit-test`) cobrindo serviços, guards, interceptors, models, utils e providers:

```bash
npm run test:core
```

---

## Como Contribuir

Para adicionar uma nova funcionalidade a esta biblioteca, siga os passos abaixo:

1.  **Crie os arquivos** da sua funcionalidade (serviço, pipe, etc.) dentro da pasta `src/lib/`, seguindo a estrutura de pastas existente.
2.  **Exponha sua funcionalidade** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `src/public-api.ts`.
3.  **Adicione ou atualize os testes unitários** para garantir a cobertura e o funcionamento esperado (ex.: `src/lib/services/meu-servico.service.spec.ts`).
4.  **Faça o commit** seguindo as [regras de commit do projeto](/README.md), preferencialmente usando o escopo `core`:

    ```bash
    git commit -m "feat(core): adiciona novo serviço"
    ```

---

## Regras e Convenções

### Prefixo

O prefixo para componentes e diretivas nesta biblioteca é `cao`.