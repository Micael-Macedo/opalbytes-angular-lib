import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '@core.services/loading.service';
import { LoadingType } from '@core.utils/loading-type';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  private loadingService = inject(LoadingService);

  loadingState = signal<LoadingType>(LoadingType.STOPPED);

  constructor() {
    this.loadingService.getLoading().subscribe((state) => {
      this.loadingState.set(state);
    });
  }

  isVisible() {
    return this.loadingState() === LoadingType.LOADING;
  }
}
