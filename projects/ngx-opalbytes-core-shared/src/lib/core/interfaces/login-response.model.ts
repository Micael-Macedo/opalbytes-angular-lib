export interface ILoginResponse {
  token: string;
  name: string;
}

/* eslint-disable @typescript-eslint/naming-convention */
// API response properties use snake_case to match backend contract
export class UserLoginModel {
  access_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  id_token?: string;
  not_before_policy?: number;
  session_state?: string;
  scope?: string;

  constructor(options: UserLoginModel = {}) {
    this.access_token = options.access_token;
    this.expires_in = options.expires_in;
    this.refresh_expires_in = options.refresh_expires_in;
    this.refresh_token = options.refresh_token;
    this.token_type = options.token_type;
    this.id_token = options.id_token;
    this.not_before_policy = options.not_before_policy;
    this.session_state = options.session_state;
    this.scope = options.scope;
  }
}
/* eslint-enable @typescript-eslint/naming-convention */
