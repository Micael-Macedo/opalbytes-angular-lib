import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

import { Observable, BehaviorSubject, throwError } from "rxjs";

export interface IStatusInstallation {
  isInstalled: boolean;
  version?: string;
  lastChecked: Date;
  installationPath?: string;
}

export interface IConfigInstallation {
  executableName: string;
  assetPath: string;
  registryPath?: string;
  expectedVersion?: string;
}

export interface IBlobConfigInstallation {
  executableName: string;
  assetPath: Blob;
}


@Injectable({
  providedIn: "root",
})
export class CaoInstallationService {
  private readonly http = inject(HttpClient);
  private readonly installationStatus$ = new BehaviorSubject<IStatusInstallation>({
    isInstalled: false,
    lastChecked: new Date(),
  });

  readonly status$ = this.installationStatus$.asObservable();

  checkInstallation(config: IConfigInstallation): Observable<IStatusInstallation> {
    return new Observable((observer) => {
      if ("navigator" in window && "userAgent" in navigator) {
        const isWindows = navigator.userAgent.includes("Windows");

        if (isWindows && config.registryPath) {
          this.checkWindowsRegistry(config)
            .then((status) => {
              this.installationStatus$.next(status);
              observer.next(status);
              observer.complete();
            })
            .catch((error) => {
              const status: IStatusInstallation = {
                isInstalled: false,
                lastChecked: new Date(),
              };
              this.installationStatus$.next(status);
              observer.next(status);
              observer.complete();
              return throwError(() => error);
            });
        } else {
          const status: IStatusInstallation = {
            isInstalled: false,
            lastChecked: new Date(),
          };
          this.installationStatus$.next(status);
          observer.next(status);
          observer.complete();
        }
      } else {
        observer.error("Browser environment not supported");
      }
    });
  }

  downloadAndInstall(config: IConfigInstallation): Observable<boolean> {
    return new Observable((observer) => {
      try {
        const url = config.assetPath;
        const link = document.createElement("a");

        link.target = "_blank";
        link.href = url;
        link.download = config.executableName || "download";

        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          observer.next(true);
          observer.complete();
        }, 100);
      } catch (error) {
        console.error("Erro no download:", error);
        observer.error(error);
      }
    });
  }

  downloadAndOpenFile(
    config: IConfigInstallation,
    isTargetBlank = true
  ): Observable<boolean> {
    return new Observable((observer) => {
      try {
        const link = document.createElement("a");
        link.href = config.assetPath;
        link.target = isTargetBlank ? "_blank" : "";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        observer.next(true);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  downloadBlobFile(configBlob: IBlobConfigInstallation) {
    const url = window.URL.createObjectURL(configBlob.assetPath);
    const a = document.createElement("a");
    a.href = url;
    a.download = configBlob.executableName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  reinstall(config: IConfigInstallation): Observable<boolean> {
    return this.downloadAndInstall(config);
  }
}
