/*
 * Public API Surface of @opalbytes/core
 */

// Config
export * from "./lib/core/config";
export { APP_CONFIG, ENVIRONMENT, getConfigByEnvironment } from "./lib/core/config/app-config";
export * from "./lib/core/config/app-endpoints";
export * from "./lib/core/config/help-config";

// Services
export * from "./lib/core/services/alert.service";
export * from "./lib/core/services/base.service";
export * from "./lib/core/services/cadastro.service";
export * from "./lib/core/services/cep.service";
export * from "./lib/core/services/config.service";
export * from "./lib/core/services/cookie.service";
export * from "./lib/core/services/http-cache.service";
export * from "./lib/core/services/http-error-handler.service";
export * from "./lib/core/services/loading.service";
export * from "./lib/core/services/response-transformer.service";
export * from "./lib/core/services/table.service";
export * from "./lib/core/services/toast.service";

// Interceptors
export * from "./lib/core/interceptors/api.interceptor";
export * from "./lib/core/interceptors/loading.interceptor";

// Handlers
export * from "./lib/core/utils/global-error.handler";

// Utils
export * from "./lib/core/utils/app-config.base";
export * from "./lib/core/utils/loading-type";
export * from "./lib/core/utils/navigation.util";

// Interfaces
export * from "./lib/core/interfaces/api.interface";
export * from "./lib/core/interfaces/cep.interface";
export * from "./lib/core/interfaces/login-response.model";

// Constants
export * from "./lib/core/constants/cep-endpoints.constants";
export * from "./lib/core/constants/states.constants";

// Repositories
export * from "./lib/core/models/base-resource.model";

// Enums
export * from "./lib/core/enums/http-status.enum";

// Models
export * from "./lib/core/models/http-error.model";

// Utils
export * from "./lib/core/utils/alert-message.builder";

// Providers
export * from "./lib/core/providers/core.providers"

/*
 * Public API Surface of shared
 */

// Constants
export * from "./lib/shared/constants/permissions.constants";
export * from "./lib/shared/constants/routes.constants";

// Enums
export * from "./lib/shared/enums/variaveis.enum";

// Interfaces
export * from "./lib/shared/interfaces/alert.interface";
export * from "./lib/shared/interfaces/app-config.interface";
export * from "./lib/shared/interfaces/filter-config.interface";
export * from "./lib/shared/interfaces/sidebar-item.interface";
export * from "./lib/shared/interfaces/tab";
export * from "./lib/shared/interfaces/table-colum";
export * from "./lib/shared/interfaces/toast-item";
export * from "./lib/shared/interfaces/toggle-item";

// Pipes
export * from "./lib/shared/pipes/format-cep.pipe";
export * from "./lib/shared/pipes/format-cpf-cnpj.pipe";
export * from "./lib/shared/pipes/format-cpf.pipe";
export * from "./lib/shared/pipes/format-data-nascimento.pipe";
export * from "./lib/shared/pipes/format-date.pipe";
export * from "./lib/shared/pipes/format-rg.pipe";
export * from "./lib/shared/pipes/format-telefone.pipe";