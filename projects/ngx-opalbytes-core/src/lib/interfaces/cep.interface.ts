export interface ICaoCEPData {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export interface ICaoMunicipality {
  code: string;
  name: string;
}

export interface ICaoState {
  id: number;
  sigla: string;
  nome: string;
}

// API Response types from BrasilAPI
export interface ICaoBrasilAPICEPResponse {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

// API Response types from ViaCEP
export interface ICaoViaCEPResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

// API Response types from BrasilAPI Municipalities
export interface ICaoBrasilAPIMunicipalityResponse {
  CODIGO_IBGE: string;
  nome: string;
}
