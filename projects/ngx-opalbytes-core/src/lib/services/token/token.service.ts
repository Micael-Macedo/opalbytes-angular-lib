import { Injectable } from "@angular/core";

import { CaoVariables } from "../../enums/variaveis.enum";
import { StorageService } from "../storage/storage.service";


@Injectable({
  providedIn: "root",
})
export class CaoTokenGuardService {
  constructor(private storageService: StorageService) { }

  hasToken(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    const token = this.storageService.getItem<string>(CaoVariables.STORAGE_AUTH);
    if (!token) {
      return null;
    }
    return token;
  }

}
