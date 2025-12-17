# 📦 ngx-opalbytes-services

Esta biblioteca destina-se a abrigar serviços (`services`) Angular reutilizáveis que encapsulam lógica de negócios, chamadas de API e outras funcionalidades compartilhadas.

**Nota:** Atualmente, esta biblioteca contém apenas um componente de placeholder e ainda não possui serviços implementados.

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

Quando serviços forem adicionados, eles poderão ser injetados nos seus componentes ou outros serviços via injeção de dependência do Angular.

**Exemplo de como um serviço seria utilizado:**

```typescript
import { Component, OnInit } from '@angular/core';
// Supondo a existência de um 'UserService'
import { UserService } from 'ngx-opalbytes-services';

@Component({
  selector: 'app-user-profile',
})
export class UserProfileComponent implements OnInit {
  
  constructor(private userService: UserService) {}

  ngOnInit() {
    // this.userService.getUsers().subscribe(...);
  }
}
```

---

## Organização de Pastas

Dentro da pasta `src/lib/`, os serviços devem ser organizados em subpastas, se necessário, ou diretamente sob `lib/`. Por exemplo:

```
src/
└── lib/
    ├── services/
    │   └── user.service.ts
    └── auth.service.ts
```

---

## Serviços Disponíveis

Atualmente, não há serviços disponíveis nesta biblioteca.

---

## 📜 Como Contribuir

Para adicionar um novo serviço a esta biblioteca, siga os passos abaixo:

1.  **Crie o arquivo** do seu serviço dentro da pasta `src/lib/`. Por exemplo: `src/lib/user.service.ts`.
2.  **Implemente seu serviço**, lembrando de marcá-lo com `@Injectable({ providedIn: 'root' })` para que ele seja "tree-shakable".
3.  **Exponha o serviço** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `src/public-api.ts`.

    ```typescript
    // projects/ngx-opalbytes-services/src/public-api.ts
    export * from './lib/user.service'; 
    ```
4.  **Adicione testes unitários** para garantir a qualidade e o funcionamento esperado do seu serviço.
5.  **Faça o commit** seguindo as [regras de commit do projeto](/README.md#룰-regras-de-commit-com-escopo-obrigatório), usando o escopo `services`.

    ```bash
    git commit -m "feat(services): add user service para validacao"
    ```