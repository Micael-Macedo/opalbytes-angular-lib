import { Observable } from 'rxjs';

import { IPdfExportOptions } from './export-options.interface';
import { IExportResult } from './export-result.interface';

export interface IExportStrategy {
  export(element: HTMLElement, options: IPdfExportOptions): Observable<IExportResult>;
}
