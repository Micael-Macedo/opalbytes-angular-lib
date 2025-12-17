
import { ApiUrl } from "./app-endpoints";
import { BASE_PATHS, BASE_HTTP_METHODS } from "../utils/app-config.base";
import { IAppConfig } from './../../shared/interfaces/app-config.interface';

export const developmentConfig: IAppConfig = {
  production: false,
  environment: "development",
  urls: {
    [ApiUrl.API]: "https://api-dev.renova.app.br",
    [ApiUrl.CROPPING]: "https://rcropping-api-prd.renova.app.br",
    [ApiUrl.IIPM_CROPPING]: "https://iipmapi-dev.renova.app.br",
    [ApiUrl.IIPM_DIGITALIZACAO]: "https://iipm-arquivos-api-dev.renova.app.br",
  },
  paths: BASE_PATHS,
  httpMethods: BASE_HTTP_METHODS,
};
