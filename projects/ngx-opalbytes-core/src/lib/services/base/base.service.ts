import { Inject, Injectable, Injector } from "@angular/core";

import { Observable } from "rxjs";

import { HelpConfig } from "../../config";
import { ICaoApiResponse } from "../../interfaces";
import { BaseResourceModel } from "../../models";

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

  getById(id: string | number): Observable<ICaoApiResponse<T>> {
    return this.helpConfig.httpGet<ICaoApiResponse<T>>(`${this._url}/${id}`);
  }

  getAll(params?: Record<string, string | number | boolean>): Observable<ICaoApiResponse<T>> {
    return this.helpConfig.httpGet<ICaoApiResponse<T>>(this._url, params);
  }

  pageCount(params?: Record<string, string | number | boolean>): Observable<{ count: number }> {
    const END_POINT = "/pagecount";
    return this.helpConfig.httpGet<{ count: number }>(`${this._url}${END_POINT}`, params);
  }

  create(resource: T): Observable<ICaoApiResponse<T>> {
    return this.helpConfig.httpPost<ICaoApiResponse<T>>(this._url, resource);
  }

  update(resource: Partial<T>, id?: string): Observable<ICaoApiResponse<T>> {
    if (id !== undefined) {
      return this.helpConfig.httpPut<ICaoApiResponse<T>>(`${this._url}/${id}`, resource);
    }
    return this.helpConfig.httpPut<ICaoApiResponse<T>>(this._url, resource);
  }

  activate(id: string): Observable<ICaoApiResponse<T>> {
    return this.helpConfig.httpPatch<ICaoApiResponse<T>>(`${this._url}/${id}/Activate`, {});
  }

  deactivate(id: string): Observable<ICaoApiResponse<T>> {
    return this.helpConfig.httpPatch<ICaoApiResponse<T>>(`${this._url}/${id}/Deactivate`, {});
  }

  delete(id: number): Observable<null> {
    const END_POINT = `${this._url}/${id}`;
    return this.helpConfig.httpDelete<null>(END_POINT);
  }

  lock(id: number, justification: string): Observable<ICaoApiResponse<T>> {
    return this.helpConfig.httpPost<ICaoApiResponse<T>>(
      `${this._url}/bloquear?id=${id}&justificativa=${justification}`,
      null
    );
  }

  unlock(id: number, justification: string): Observable<ICaoApiResponse<T>> {
    return this.helpConfig.httpPost<ICaoApiResponse<T>>(
      `${this._url}/desbloquear?id=${id}&justificativa=${justification}`,
      null
    );
  }
}
