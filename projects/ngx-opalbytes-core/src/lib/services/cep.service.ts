import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";

import { Observable, of, catchError, finalize, map } from "rxjs";

import { CEP_ENDPOINTS } from "../constants/cep-endpoints.constants";
import { BRAZILIAN_STATES } from "../constants/states.constants";
import {
  ICEPData,
  IMunicipality,
  IState,
  IBrasilAPICEPResponse,
  IViaCEPResponse,
  IBrasilAPIMunicipalityResponse,
} from "../interfaces/cep.interface";

@Injectable({ providedIn: "root" })
export class CEPService {
  private loadingSignal = signal(false);
  loading$ = this.loadingSignal.asReadonly();

  readonly states: readonly IState[] = BRAZILIAN_STATES;

  constructor(private http: HttpClient) {}

  searchCEP(cep: string): Observable<ICEPData | null> {
    if (!cep || cep.length !== 8) {
      return of(null);
    }

    this.loadingSignal.set(true);

    const brasilApiUrl = `${CEP_ENDPOINTS.BRASIL_API_CEP}/${cep}`;
    const viaCepUrl = `${CEP_ENDPOINTS.VIA_CEP}/${cep}/json/`;

    return this.http.get<IBrasilAPICEPResponse>(brasilApiUrl).pipe(
      map((data) => ({
        cep: data.cep,
        logradouro: data.street,
        bairro: data.neighborhood,
        localidade: data.city,
        uf: data.state,
      })),
      catchError(() =>
        // fallback para ViaCEP
        this.http.get<IViaCEPResponse>(viaCepUrl).pipe(
          map((data) =>
            data.erro
              ? null
              : {
                  cep: data.cep,
                  logradouro: data.logradouro,
                  bairro: data.bairro,
                  localidade: data.localidade,
                  uf: data.uf,
                }
          ),
          catchError(() => of(null))
        )
      ),
      finalize(() => this.loadingSignal.set(false))
    );
  }

  fetchMunicipalities(uf: string): Observable<IMunicipality[]> {
    const url = `${CEP_ENDPOINTS.BRASIL_API_MUNICIPALITIES}/${uf}`;

    return this.http.get<IBrasilAPIMunicipalityResponse[]>(url).pipe(
      map((data) =>
        data.map((item) => ({
          code: item.CODIGO_IBGE,
          name: item.nome,
        }))
      ),
      catchError((error) => {
        console.error("Erro ao buscar municípios:", error);
        return of([]);
      })
    );
  }
}
