import { IAppConfig } from './../../shared/interfaces/app-config.interface';

import { ApiUrl } from "./app-endpoints";
import { BASE_PATHS, BASE_HTTP_METHODS } from "../utils/app-config.base";

export const homologationConfig: IAppConfig = {
  production: false,
  environment: "homologation",
  urls: {
    [ApiUrl.API]: "https://api-hmg.renova.app.br",
    [ApiUrl.CROPPING]: "https://rcropping-api-hmg.renova.app.br",
    [ApiUrl.IIPM_CROPPING]: "https://iipmapi-hmg.renova.app.br",
    [ApiUrl.IIPM_DIGITALIZACAO]: "https://iipm-arquivos-api-hmg.renova.app.br",
  },
  paths: BASE_PATHS,
  httpMethods: BASE_HTTP_METHODS,
};
