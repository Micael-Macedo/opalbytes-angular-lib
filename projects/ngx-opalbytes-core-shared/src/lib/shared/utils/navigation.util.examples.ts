/* eslint-disable no-console */
/**
 * EXEMPLOS DE USO - NavigationUtil
 * Este arquivo contém exemplos práticos de como usar o NavigationUtil
 * Pode ser removido em produção - serve apenas como documentação
*/

import { ChangeDetectionStrategy, Component } from "@angular/core";

import { ROUTES } from "../constants/routes.constants";
import { NavigationUtil } from './../../core/utils/navigation.util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "cao-example",
  template: "",
})
export class ExampleComponent {
  constructor(private navigationUtil: NavigationUtil) {}

  // ============================================
  // EXEMPLO 1: Navegação Simples
  // ============================================
  exemploNavegacaoSimples() {
    // Antes (com magic string):
    // this.router.navigate(['/home']);

    // Depois (com NavigationUtil):
    this.navigationUtil.navigateTo(ROUTES.HOME);
  }

  // ============================================
  // EXEMPLO 2: Navegação com Tratamento de Erro
  // ============================================
  exemploComTratamentoErro() {
    this.navigationUtil.navigateTo(ROUTES.CATALOGO, {
      onError: (err) => {
        console.error("Erro ao redirecionar:", err);
        // Exibir toast/snackbar de erro
      },
      onSuccess: () => {
        console.log("Navegação bem-sucedida!");
      },
    });
  }

  // ============================================
  // EXEMPLO 3: Navegação com Query Params
  // ============================================
  exemploComQueryParams() {
    this.navigationUtil.navigateTo(ROUTES.CATALOGO, {
      queryParams: {
        categoria: "cnh",
        ordenar: "data",
      },
    });
    // Resultado: /catalogo?categoria=cnh&ordenar=data
  }

  // ============================================
  // EXEMPLO 4: Navegação com Parâmetros Dinâmicos
  // ============================================
  exemploComParametrosDinamicos() {
    const slug = "curso-detran-2024";

    // Para rota 'homologacao/:slug'
    this.navigationUtil.navigateToWithParams(ROUTES.HOMOLOGACAO, { slug: slug });
    // Resultado: /homologacao/curso-detran-2024
  }

  // ============================================
  // EXEMPLO 5: Navegação com Estado
  // ============================================
  exemploComEstado() {
    this.navigationUtil.navigateTo(ROUTES.PRE_INSCRICAO_CONFIRMADA, {
      state: {
        inscricaoId: 12345,
        nomeAluno: "João Silva",
      },
    });

    // No componente de destino, recuperar o estado:
    // const state = this.router.getCurrentNavigation()?.extras.state;
  }

  // ============================================
  // EXEMPLO 6: Navegação Async/Await
  // ============================================
  async exemploAsyncAwait() {
    const sucesso = await this.navigationUtil.navigateTo(ROUTES.LOGIN);

    if (sucesso) {
      console.log("Navegou com sucesso!");
    } else {
      console.log("Falha na navegação");
    }
  }

  // ============================================
  // EXEMPLO 7: Voltar para Página Anterior
  // ============================================
  exemploVoltar() {
    this.navigationUtil.goBack();
  }

  // ============================================
  // EXEMPLO 8: Recarregar Página Atual
  // ============================================
  exemploRecarregar() {
    this.navigationUtil.reload({
      onSuccess: () => {
        console.log("Página recarregada!");
      },
    });
  }

  // ============================================
  // EXEMPLO 9: Verificar Rota Atual
  // ============================================
  exemploVerificarRotaAtual() {
    if (this.navigationUtil.isCurrentRoute(ROUTES.HOME)) {
      console.log("Estamos na HOME!");
    }

    const urlAtual = this.navigationUtil.getCurrentUrl();
    console.log("URL atual:", urlAtual);
  }

  // ============================================
  // EXEMPLO 10: Abrir em Nova Aba
  // ============================================
  exemploNovaAba() {
    this.navigationUtil.openInNewTab(ROUTES.AJUDA);
  }

  // ============================================
  // EXEMPLO 11: Navegação com Replace
  // ============================================
  exemploComReplace() {
    // Substitui a entrada atual no histórico
    this.navigationUtil.navigateTo(ROUTES.LOGIN, {
      replaceUrl: true,
    });
  }

  // ============================================
  // EXEMPLO 12: Navegação Relativa
  // ============================================
  exemploNavegacaoRelativa() {
    // Na rota '/curso', navegar para '/curso/detalhes'
    this.navigationUtil.navigateRelative(["detalhes"]);

    // Navegar para cima: de '/curso/detalhes' para '/curso'
    this.navigationUtil.navigateRelative([".."]);
  }

  // ============================================
  // EXEMPLO 13: Navegação por URL Absoluta
  // ============================================
  exemploNavegacaoPorUrl() {
    this.navigationUtil.navigateByUrl("/catalogo/cursos/123", {
      onError: (err) => console.error("Erro:", err),
    });
  }

  // ============================================
  // EXEMPLO 14: Navegação com Fragment (Âncora)
  // ============================================
  exemploComFragment() {
    this.navigationUtil.navigateTo(ROUTES.AJUDA, {
      fragment: "faq", // Vai para #faq na página
    });
    // Resultado: /ajuda#faq
  }

  // ============================================
  // EXEMPLO 15: Navegação Condicional
  // ============================================
  async exemploNavegacaoCondicional() {
    const usuarioLogado = true; // Verificar autenticação

    if (usuarioLogado) {
      await this.navigationUtil.navigateTo(ROUTES.PRE_INSCRICAO);
    } else {
      await this.navigationUtil.navigateTo(ROUTES.LOGIN, {
        queryParams: {
          returnUrl: ROUTES.PRE_INSCRICAO.path,
        },
      });
    }
  }
}
