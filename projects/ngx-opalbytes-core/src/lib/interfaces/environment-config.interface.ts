
export type CaoEnviromentType = "production" | "homologation" | "development" | "local" | "dev" | "hmg" | "prod" | "stage"

export interface ICaoEnvironmentConfig {
    production: boolean;
    name: CaoEnviromentType,
    buildDate: string
}
/**
* Detecção automática de ambiente baseado na URL
*/
function detectEnvironment(): CaoEnviromentType {
    if (typeof window === "undefined") {
        return "development";
    }

    const hostname = window.location.hostname;

    if (
        hostname.includes("renova.app.br") &&
        !hostname.includes("-dev") &&
        !hostname.includes("-hmg")
    ) {
        return "production";
    }

    if (hostname.includes("-hmg") || hostname.includes("hmg.")) {
        return "homologation";
    }

    if (hostname.includes("-dev") || hostname.includes("dev.")) {
        return "development";
    }

    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
        return "local";
    }

    return "development";
}

export const environment: ICaoEnvironmentConfig = {
    name: detectEnvironment(),
    production: false,
    buildDate: ""
};