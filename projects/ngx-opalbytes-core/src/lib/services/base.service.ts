import { Inject, Injectable, Injector } from "@angular/core";

import { Observable } from "rxjs";

import { HelpConfig } from "../config/help-config";
import { IApiResponse } from "../interfaces/api.interface";
import { BaseResourceModel } from "../models/base-resource.model";

@Injectable({
  providedIn: "root",
})
export class BaseResourceService<T extends BaseResourceModel> {
  protected helpConfig: HelpConfig;

  constructor(
    @Inject(String) protected _url: string,
    protected injector: Injector
  ) {
    this.helpConfig = injector.get(HelpConfig);
  }

  getById(id: string | number): Observable<IApiResponse<T>> {
    return this.helpConfig.httpGet<IApiResponse<T>>(`${this._url}/${id}`);
  }

  getAll(params?: Record<string, string | number | boolean>): Observable<IApiResponse<T>> {
    return this.helpConfig.httpGet<IApiResponse<T>>(this._url, params);
  }

  pageCount(params?: Record<string, string | number | boolean>): Observable<{ count: number }> {
    const END_POINT = "/pagecount";
    return this.helpConfig.httpGet<{ count: number }>(`${this._url}${END_POINT}`, params);
  }

  create(resource: T): Observable<IApiResponse<T>> {
    return this.helpConfig.httpPost<IApiResponse<T>>(this._url, resource);
  }

  update(resource: Partial<T>, id?: string): Observable<IApiResponse<T>> {
    if (id !== undefined) {
      return this.helpConfig.httpPut<IApiResponse<T>>(`${this._url}/${id}`, resource);
    }
    return this.helpConfig.httpPut<IApiResponse<T>>(this._url, resource);
  }

  activate(id: string): Observable<IApiResponse<T>> {
    return this.helpConfig.httpPatch<IApiResponse<T>>(`${this._url}/${id}/Activate`, {});
  }

  deactivate(id: string): Observable<IApiResponse<T>> {
    return this.helpConfig.httpPatch<IApiResponse<T>>(`${this._url}/${id}/Deactivate`, {});
  }

  delete(id: number): Observable<null> {
    const END_POINT = `${this._url}/${id}`;
    return this.helpConfig.httpDelete<null>(END_POINT);
  }

  lock(id: number, justification: string): Observable<IApiResponse<T>> {
    return this.helpConfig.httpPost<IApiResponse<T>>(
      `${this._url}/bloquear?id=${id}&justificativa=${justification}`,
      null
    );
  }

  unlock(id: number, justification: string): Observable<IApiResponse<T>> {
    return this.helpConfig.httpPost<IApiResponse<T>>(
      `${this._url}/desbloquear?id=${id}&justificativa=${justification}`,
      null
    );
  }
}
