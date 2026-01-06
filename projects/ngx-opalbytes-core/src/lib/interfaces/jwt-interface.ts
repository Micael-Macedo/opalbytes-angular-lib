/* eslint-disable @typescript-eslint/naming-convention */
export interface IResourceAccess {
  roles: string[];
}

export interface IJwtPayload {
  "exp": number;
  "iat"?: number;
  "jti"?: string;
  "iss"?: string;
  "aud"?: string[];
  "sub"?: string;
  "typ"?: string;
  "azp"?: string;
  "sid"?: string;
  "acr"?: string;
  "allowed-origins"?: string[];
  "realm_access": {
    roles: string[];
  };
  "resource_access": Record<string, IResourceAccess | undefined>;
  "scope"?: string;
  "email_verified"?: boolean;
  "name"?: string;
  "preferred_username"?: string;
  "given_name"?: string;
  "email"?: string;
}
