import { ApiPath, HttpMethod } from "../config/app-endpoints";
import { AppPaths, HttpMethods } from './../../shared/interfaces/app-config.interface';

/**
 * Paths base compartilhados entre TODOS os ambientes
 * Configure uma vez, use em todos os environments
 */
export const BASE_PATHS: AppPaths = {
  // Box
  [ApiPath.BOX]: "/api/Box",
  [ApiPath.GET_RECORDS_BY_FRAME_ROLL]: "/api/Box/GetRecordsByFrameRoll/",

  // Record
  [ApiPath.RECORD]: "/api/Record",
  [ApiPath.RECORD_CONSUMER]: "/api/Record/Consumer",
  [ApiPath.CHANGE_RECORD_STATUS]: "/api/Record/ChangeStatus",
  [ApiPath.SKIP_RECORD]: "/api/Record/Skip",
  [ApiPath.GET_DOCUMENTS]: "/api/Record/GetDocuments/",
  [ApiPath.GET_DOCUMENTS_ZIP]: "/api/Record/GetDocumentsZip/",

  // Cropping
  [ApiPath.CROPPING]: "/api/Cropping",

  // Layout
  [ApiPath.LAYOUT]: "/api/Layout",

  // Person
  [ApiPath.PERSON]: "/api/Person",

  // Transactions
  [ApiPath.TRANSACTIONS]: "/api/Transactions",

  // File
  [ApiPath.UPLOAD_FILE]: "/api/File/Upload",
  [ApiPath.DOWNLOAD_FILE]: "/api/File/Download",
  [ApiPath.FILE_CONFIGURATION]: "/configuration",

  // Digitalização
  [ApiPath.PROCESSOS_DIGITALIZACAO]: "/api/ProcessosDigitalizacao",
  [ApiPath.STATUS]: "/api/Status",
  [ApiPath.FILES]: "/api/Arquivos",

  // User
  [ApiPath.USER]: "/api/Usuario",
  [ApiPath.USER_ROLES]: "/api/UsuarioRoles",

  // Organization
  [ApiPath.ORGANIZATION]: "/api/Organizacao",

  // Dashboard
  [ApiPath.DASHBOARD]: "/api/Dashboard",
};

export const BASE_HTTP_METHODS: HttpMethods = {
  [HttpMethod.GET]: "get",
  [HttpMethod.POST]: "post",
  [HttpMethod.PUT]: "put",
  [HttpMethod.PATCH]: "patch",
  [HttpMethod.DELETE]: "delete",
};
