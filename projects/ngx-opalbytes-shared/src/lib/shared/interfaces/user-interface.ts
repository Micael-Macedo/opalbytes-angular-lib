export interface IUser {
  id: string;
  name: string;
  cpf: string;
  birthday?: string;
  nickname?: string;
  surname?: string;
  email?: string;
  gender?: string;
  image?: string;
  organization?: string;
  UF?: string;
  phone_1?: string;
  phone_2?: string;
  crm?: string;
  roles?: string[];
}

export interface IMeUser {
  Sub: string;
  EmailVerified: boolean;
  Name: string;
  PreferredUsername: string;
  GivenName: string;
  FamilyName: string;
  Email: string;
  Documento: string;
  CodigoBairro: number;
  CodigoCiretran: number;
  CodigoMunicipio: number;
  CodigoRegiao: number;
}

// Tipo genérico para roles - aceita qualquer string
export type UserRole = string;

// Mantido para compatibilidade com código legado (deprecated)
/** @deprecated Use UserRole instead. Este tipo será removido em versões futuras. */
