# 📦 ngx-opalbytes-core

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

## 📜 Como Contribuir

Para adicionar uma nova funcionalidade a esta biblioteca, siga os passos abaixo:

1.  **Crie os arquivos** da sua funcionalidade (serviço, pipe, etc.) dentro da pasta `src/lib/`, seguindo a estrutura de pastas existente.
2.  **Exponha sua funcionalidade** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `src/public-api.ts`.
3.  **Adicione ou atualize os testes unitários** para garantir a cobertura e o funcionamento esperado.
4.  **Faça o commit** seguindo as [regras de commit do projeto](/README.md#%F0%9F%93%B2-regras-de-commit-com-escopo-obrigatório), usando o escopo `core`.

    ```bash
    git commit -m "feat(core): add novas rotas padrão"
    ```

---

## 📜 Regras e Convenções

### Prefixo

O prefixo para componentes e diretivas nesta biblioteca é `cao`.