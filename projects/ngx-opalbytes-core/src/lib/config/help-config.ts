import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { ApiPath, ApiUrl } from "./app-endpoints";
import { ConfigService } from "../services/config.service";

@Injectable({
  providedIn: "root",
})
export class HelpConfig {
  constructor(
    private configService: ConfigService,
    private httpClient: HttpClient
  ) {}

  get BASE_API(): string {
    return this.configService.getApiUrl();
  }

  getCroppingUrl(): string {
    return this.configService.buildUrl(ApiPath.CROPPING, ApiUrl.IIPM_CROPPING);
  }

  getPersonUrl(): string {
    return this.configService.buildUrl(ApiPath.PERSON);
  }

  getUserUrl(): string {
    return this.configService.buildUrl(ApiPath.USER);
  }

  getUploadFileUrl(): string {
    return this.configService.buildUrl(ApiPath.UPLOAD_FILE);
  }

  public get BOX_ENDPOINT(): string {
    return this.configService.getPath("BOX");
  }

  public get CHANGERECORDSTATUS_ENDPOINT(): string {
    return this.configService.getPath("CHANGERECORDSTATUS");
  }

  public get CROPPING_ENDPOINT(): string {
    return this.configService.getPath("CROPPING");
  }

  public get DOWNLOADFILE_ENDPOINT(): string {
    return this.configService.getPath("DOWNLOADFILE");
  }

  public get FILECONFIGURATION_ENDPOINT(): string {
    return this.configService.getPath("FILECONFIGURATION");
  }

  public get GETDOCUMENTS_ENDPOINT(): string {
    return this.configService.getPath("GETDOCUMENTS");
  }

  public get GETDOCUMENTSZIP_ENDPOINT(): string {
    return this.configService.getPath("GETDOCUMENTSZIP");
  }

  public get GETRECORDSBYFRAMEROLL_ENDPOINT(): string {
    return this.configService.getPath("GETRECORDSBYFRAMEROLL");
  }

  public get LAYOUT_ENDPOINT(): string {
    return this.configService.getPath("LAYOUT");
  }

  public get PERSON_ENDPOINT(): string {
    return this.configService.getPath("PERSON");
  }

  public get RECORD_ENDPOINT(): string {
    return this.configService.getPath("RECORD");
  }

  public get RECORDCONSUMER_ENDPOINT(): string {
    return this.configService.getPath("RECORDCONSUMER");
  }

  public get SKIPRECORD_ENDPOINT(): string {
    return this.configService.getPath("SKIPRECORD");
  }

  public get TRANSACTIONS_ENDPOINT(): string {
    return this.configService.getPath("TRANSACTIONS");
  }

  public get UPLOADFILE_ENDPOINT(): string {
    return this.configService.getPath("UPLOADFILE");
  }

  public get PROCESSOSDIGITALIZACAO_ENDPOINT(): string {
    return this.configService.getPath("PROCESSOSDIGITALIZACAO");
  }

  public get STATUS_ENDPOINT(): string {
    return this.configService.getPath("STATUS");
  }

  public get FILES_ENDPOINT(): string {
    return this.configService.getPath("FILES");
  }

  public get USER_ENDPOINT(): string {
    return this.configService.getPath("USER");
  }

  public get USER_ROLES_ENDPOINT(): string {
    return this.configService.getPath("USER_ROLES");
  }

  public get ORGANIZATION_ENDPOINT(): string {
    return this.configService.getPath("ORGANIZATION");
  }

  public get DASHBOARD_ENDPOINT(): string {
    return this.configService.getPath("DASHBOARD");
  }

  // ========================================
  // Métodos HTTP - Chamadas
  // ========================================

  httpGet<T>(url: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.httpClient.get<T>(url, { params });
  }

  httpPost<T>(url: string, body: unknown): Observable<T> {
    return this.httpClient.post<T>(url, body);
  }

  httpPut<T>(url: string, body: unknown): Observable<T> {
    return this.httpClient.put<T>(url, body);
  }

  httpPatch<T>(url: string, body: unknown): Observable<T> {
    return this.httpClient.patch<T>(url, body);
  }

  httpDelete<T>(url: string): Observable<T> {
    return this.httpClient.delete<T>(url);
  }
}
