import { Injectable } from "@angular/core";

import { StorageService } from "src/public-api";

import { Variables } from "../enums/variaveis.enum";


@Injectable({
  providedIn: "root",
})
export class CaoTokenGuardService {
  constructor(private storageService: StorageService) { }

  hasToken(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    const token = this.storageService.getItem<string>(Variables.STORAGE_AUTH);
    if (!token) {
      return null;
    }
    return token;
  }

}
