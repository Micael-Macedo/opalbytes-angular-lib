export interface IAppUrls {
  [key: string]: string;
}

export type AppPaths = Record<string, string>;

export type HttpMethods = Record<string, string>;

export type AppAuth = Record<string, string>;

export interface IAppConfig {
  production: boolean;
  environment: "production" | "homologation" | "development" | "local";
  urls: IAppUrls;
  paths: AppPaths;
  httpMethods?: HttpMethods;
  auth?: AppAuth;
}
