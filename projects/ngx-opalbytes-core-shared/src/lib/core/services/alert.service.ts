import { Injectable, inject } from "@angular/core";


import { ToastService } from "./toast.service";
import { IAlertConfig } from "../../shared/interfaces/alert.interface";

@Injectable({
  providedIn: "root",
})
export class AlertService {
  private toastService = inject(ToastService);

  show(config: IAlertConfig) {
    const message = config.title ? `${config.title}: ${config.message}` : config.message;

    switch (config.type) {
      case "success":
        this.toastService.success(message);
        break;
      case "error":
        this.toastService.error(message);
        break;
      case "info":
        this.toastService.info(message);
        break;
      case "warning":
        this.toastService.warning(message);
        break;
      default:
        this.toastService.info(message);
    }
  }
}
