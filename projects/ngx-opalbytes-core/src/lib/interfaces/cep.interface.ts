export interface ICEPData {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export interface IMunicipality {
  code: string;
  name: string;
}

export interface IState {
  id: number;
  sigla: string;
  nome: string;
}

// API Response types from BrasilAPI
export interface IBrasilAPICEPResponse {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

// API Response types from ViaCEP
export interface IViaCEPResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

// API Response types from BrasilAPI Municipalities
export interface IBrasilAPIMunicipalityResponse {
  CODIGO_IBGE: string;
  nome: string;
}
