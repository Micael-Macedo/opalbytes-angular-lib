
import { ApiUrl } from "./app-endpoints";
import { BASE_PATHS, BASE_HTTP_METHODS } from "../utils/app-config.base";
import { IAppConfig } from './../../shared/interfaces/app-config.interface';

export const localConfig: IAppConfig = {
  production: false,
  environment: "local",
  urls: {
    [ApiUrl.API]: "http://localhost:3000",
    [ApiUrl.CROPPING]: "http://localhost:3001",
    [ApiUrl.IIPM_CROPPING]: "http://localhost:3002",
    [ApiUrl.IIPM_DIGITALIZACAO]: "http://localhost:3003",
  },
  paths: BASE_PATHS,
  httpMethods: BASE_HTTP_METHODS,
};
