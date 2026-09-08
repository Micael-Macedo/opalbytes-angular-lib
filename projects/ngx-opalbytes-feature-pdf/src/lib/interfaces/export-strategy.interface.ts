import { Observable } from 'rxjs';

import { ICaoPdfExportOptions } from './export-options.interface';
import { ICaoExportResult } from './export-result.interface';

export interface ICaoExportStrategy {
  export(element: HTMLElement, options: ICaoPdfExportOptions): Observable<ICaoExportResult>;
}