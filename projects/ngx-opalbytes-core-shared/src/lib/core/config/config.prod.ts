import { IAppConfig } from './../../shared/interfaces/app-config.interface';

import { ApiUrl } from "./app-endpoints";
import { BASE_PATHS, BASE_HTTP_METHODS } from "../utils/app-config.base";

export const productionConfig: IAppConfig = {
  production: true,
  environment: "production",
  urls: {
    [ApiUrl.API]: "https://api-prd.renova.app.br",
    [ApiUrl.CROPPING]: "https://rcropping-api-prd.renova.app.br",
    [ApiUrl.IIPM_CROPPING]: "https://iipmapi-prd.renova.app.br",
    [ApiUrl.IIPM_DIGITALIZACAO]: "https://iipm-arquivos-api-prd.renova.app.br",
  },
  paths: BASE_PATHS,
  httpMethods: BASE_HTTP_METHODS,
};
