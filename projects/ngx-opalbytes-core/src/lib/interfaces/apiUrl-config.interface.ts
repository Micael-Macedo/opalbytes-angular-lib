export interface IApiUrls {
    dev?: string;
    hmg?: string;
    prd?: string;
    local?: string;
  }
  export interface IApiConfig {
    /**
     * URLs base por ambiente (opcional - usa defaults da lib se não fornecido)
     *
     * Permite sobrescrever as URLs padrão da lib para cada serviço
     */
    urls?: {
      /**
       * URL da API principal
       */
      API?: IApiUrls;
   
      /**
       * URL do serviço de cropping
       */
      CROPPING?: IApiUrls;
   
      /**
       * URL do serviço de cropping do IIPM
       */
      IIPM_CROPPING?: IApiUrls;
   
      /**
       * URL do serviço de digitalização do IIPM
       */
      IIPM_DIGITALIZACAO?: IApiUrls;
   
      /**
       * Permite adicionar URLs customizadas
       */
      [key: string]: IApiUrls | undefined;
    };
   
    /**
     * Paths customizados (merged com BASE_PATHS da lib)
     *
     * Paths definidos aqui sobrescrevem os da lib caso tenham a mesma chave
     */
    paths?: Record<string, string>;
  }
   
  /**
  * Configuração de API do Aluno PWA
  *
  * Este arquivo centraliza todos os endpoints e URLs customizadas
  * específicas do aluno PWA.
  */
  export const alunoPwaApiConfig: IApiConfig = {
    /**
     * URLs customizadas por ambiente (opcional)
     */
    // urls: {
    //   API: {
    //     dev: "https://aluno-api-dev.renova.app.br",
    //     hmg: "https://aluno-api-hmg.renova.app.br",
    //     prd: "https://aluno-api-prd.renova.app.br",
    //     local: "http://localhost:4000"
    //   }
    // },
   
    /**
     * Paths customizados específicos do aluno PWA
     */
    paths: {
      // Adicione aqui os endpoints específicos do aluno PWA
    },
  };