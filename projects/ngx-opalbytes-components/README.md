# 📦 ngx-opalbytes-components

Uma biblioteca de componentes de UI reutilizáveis para aplicações Angular, projetada para acelerar o desenvolvimento e manter a consistência visual.

---
## Compatibilidade
|Tecnologia  |	Versão  |   Descrição  |
|------------|----------|-------------------------------------|
|   Angular	 |  ^21.0.0	|  Framework principal da biblioteca |

## Instalação

Para instalar a biblioteca, execute o seguinte comando:

```bash
npm install ngx-opalbytes-components
```


## Dependências

Esta biblioteca possui as seguintes dependências:

### `peerDependencies`

| Pacote | Versão |
| :----- | :----- |
| `@angular/common` | `^21.0.0` |
| `@angular/core` | `^21.0.0` |
| `@angular/material` | `^21.0.3` |

### `dependencies`

| Pacote | Versão |
| :----- | :----- |
| `tslib` | `^2.3.0` |

---
## Como Usar

Os componentes nesta biblioteca são `standalone`, o que significa que você pode importá-los diretamente nos seus componentes ou módulos.

**Exemplo de importação em um componente:**

```typescript
import { Component } from '@angular/core';
// Importe o componente desejado
import { BaseButton } from 'ngx-opalbytes-components';

@Component({
  selector: 'app-exemplo',
  standalone: true,
  imports: [
    BaseButton // Adicione o componente aos imports
  ],
  template: `
    <cao-base-button buttonText="Clique Aqui"></cao-base-button>
  `
})
export class ExemploComponent { }
```

---

## Organização de Pastas

Dentro da pasta `src/lib/`, os componentes são organizados em `shared/components/` e cada componente reside em sua própria pasta, contendo seus arquivos (`.ts`, `.html`, `.css`, `.spec.ts`).

```
src/
└── lib/
    └── shared/
        └── components/
            ├── base-alert/
            └── base-button/
```

---

## Componentes Disponíveis

| Componente | Seletor | Descrição |
| :--- | :--- | :--- |
| `BaseButton` | `<cao-base-button>` | Um botão customizável com suporte a ícones, estado de loading e tooltip. |
| `BaseAlert` | `<cao-base-alert>` | Um componente para exibir alertas de sucesso, erro, informação ou aviso. |
| `BaseDialog` | `<cao-base-dialog>` | Exibe uma caixa de diálogo modal para interações que exigem confirmação do usuário. |

---

## 📜 Como Contribuir

Para adicionar um novo componente a esta biblioteca, siga os passos abaixo:

1.  **Crie os arquivos** do seu componente dentro da pasta `src/lib/shared/components/`, seguindo a estrutura de pastas existente.
2.  **Exponha o componente** na API pública da biblioteca, adicionando uma linha de exportação no arquivo `src/public-api.ts`.
3.  **Adicione ou atualize os testes unitários** para garantir a cobertura e o funcionamento esperado.
4.  **Faça o commit** seguindo as [regras de commit do projeto](/README.md#룰-regras-de-commit-com-escopo-obrigatório), usando o escopo `components`.

    ```bash
    git commit -m "feat(components): add new component"
    ```

---

## 📜 Regras e Convenções

### Prefixo

O prefixo para componentes nesta biblioteca é `cao`.

- **Componentes**: Utilize o prefixo `<cao-...>` nos seletores dos elementos.