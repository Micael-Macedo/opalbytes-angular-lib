# 📦 ngx-opalbytes-core-shared

A biblioteca `ngx-opalbytes-core-shared` é o coração das aplicações Angular da Opalbytes. Ela fornece um conjunto robusto de serviços, interceptors, pipes e interfaces essenciais que formam a base para o desenvolvimento de projetos, garantindo padronização e reutilização de código.

---
## Estrutura da Biblioteca

A biblioteca é dividida em duas áreas principais:

-   `core`: Contém a lógica de negócio fundamental, serviços de infraestrutura e gerenciamento de estado.
-   `shared`: Inclui elementos reutilizáveis focados em UI, como pipes para formatação de dados e interfaces comuns.

### Organização de Pastas Detalhada

A organização interna da biblioteca segue uma estrutura modular clara para facilitar a navegação e o desenvolvimento:

```
src/
└── lib/
    ├── core/                  # Módulo principal com lógica de negócio e infraestrutura
    │   ├── config/            # Configurações da aplicação (endpoints, ambiente)
    │   ├── constants/         # Constantes globais
    │   ├── enums/             # Enumerações comuns
    │   ├── guards/            # Guards de rota (ex: autenticação)
    │   ├── interceptors/      # Interceptors HTTP
    │   ├── interfaces/        # Interfaces de dados do core
    │   ├── models/            # Modelos de dados do core
    │   ├── providers/         # Modelos de Providers padrão do core
    │   ├── services/          # Serviços do core (API, cache, autenticação)
    │   └── utils/             # Funções utilitárias e handlers de erro
    └── shared/                # Módulo com elementos reutilizáveis de UI e dados
        ├── components/        # Componentes compartilhados
        ├── constants/         # Constantes compartilhadas (permissões, rotas)
        ├── directives/        # Diretivas compartilhadas
        ├── enums/             # Enumerações compartilhadas
        ├── interfaces/        # Interfaces de dados compartilhadas
        ├── layouts/           # Layouts comuns
        ├── pipes/             # Pipes para formatação de dados
        ├── resolvers/         # Resolvers de rota
        └── validators/        # Validadores de formulário
```

---
## Compatibilidade
|Tecnologia  |	Versão  |   Descrição  |
|------------|----------|-------------------------------------|
|   Angular	 |  ^21.0.0	|  Framework principal da biblioteca |

## Instalação

Para instalar a biblioteca, execute o seguinte comando:

```bash
npm install ngx-opalbytes-core-shared
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

---

## Módulo `shared`

O `shared` contém utilitários e definições que são amplamente utilizados nos templates e componentes da aplicação.

### Itens Disponíveis no `shared`

-   **Pipes**: Para formatar dados diretamente no HTML (ex: moedas, datas, CPF/CNPJ).
-   **Interfaces**: Definições de tipos para objetos comuns, como `SidebarItem`, `TableColumn`, etc.
-   **Constants**: Constantes globais, como definições de rotas e permissões.

#### Pipes Disponíveis

| Pipe | Descrição |
| :--- | :--- |
| `formatCep` | Formata um valor como um CEP (ex: `12345-678`). |
| `formatCpfCnpj` | Formata um valor como CPF ou CNPJ, dependendo do tamanho. |
| `formatCpf` | Formata um valor como um CPF (ex: `123.456.789-00`). |
| `formatDataNascimento` | Formata uma data de nascimento. |
| `formatDate` | Formata uma data (ex: `dd/MM/yyyy`). |
| `formatRg` | Formata um valor como um RG. |
| `formatTelefone` | Formata um número de telefone (ex: `(11) 99999-9999`). |

---

## Como Usar

### Injetando um Serviço

```typescript
import { Component, inject } from '@angular/core';
import { AlertService } from 'ngx-opalbytes-core-shared';

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

### Usando um Pipe

```typescript
import { Component } from '@angular/core';
import { FormatCpfPipe } from 'ngx-opalbytes-core-shared';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [FormatCpfPipe],
  template: `<p>CPF: {{ user.cpf | formatCpf }}</p>`
})
export class UserInfoComponent {
  user = { cpf: '12345678900' };
}
```

---

## 📜 Como Contribuir

Para adicionar uma nova funcionalidade a esta biblioteca, siga os passos abaixo:

1.  **Crie os arquivos** da sua funcionalidade (serviço, pipe, etc.) dentro da pasta `src/lib/core` ou `src/lib/shared`, seguindo a estrutura de pastas existente.
2.  **Exponha sua funcionalidade** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `src/public-api.ts`.
3.  **Adicione ou atualize os testes unitários** para garantir a cobertura e o funcionamento esperado.
4.  **Faça o commit** seguindo as [regras de commit do projeto](/README.md#룰-regras-de-commit-com-escopo-obrigatório), usando o escopo `core` (que abrange tanto `core` quanto `shared`).

    ```bash
    git commit -m "feat(core): add novas rotas padrão"
    ```

---

## 📜 Regras e Convenções

### Prefixo

O prefixo para componentes e diretivas nesta biblioteca é `cao`.