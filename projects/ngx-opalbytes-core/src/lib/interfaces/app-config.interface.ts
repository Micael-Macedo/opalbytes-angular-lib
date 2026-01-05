export interface IAppUrls {
    [key: string]: string;
}

export type AppPaths = Record<string, string>;
export type HttpMethods = Record<string, string>;
export type AppAuth = Record<string, string>;

export enum EnvironmentEnum {
    production = "production",
    homologation = "homologation",
    development = "development",
    local = "local"
}

export interface IAppConfig {
    production: boolean;
    environment: EnvironmentEnum;
    urls: IAppUrls;
    paths: AppPaths;
    httpMethods?: HttpMethods;
    auth?: AppAuth;
}
