import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
  signal,
} from "@angular/core";

import type Player from "video.js/dist/types/player";

import { VideoMode, VideoStatus } from "./enums/video-enums";
import { ICaoRetryInfo, IVideoPlayerConfig } from "./interfaces/video.interface";
import { VideoPlayerService } from "./video-player.service";


@Component({
  selector: "cao-video-player",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./video-player.component.html",
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class CaoVideoPlayerComponent implements AfterViewInit, OnDestroy, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.videoElRef) { return; }

    if (changes['cameraId'] && !changes['cameraId'].firstChange) {
      const oldCameraId = changes['cameraId'].previousValue;
      this.videoPlayerService.reassignId(oldCameraId, this.cameraId);
    }

    if (this.videoPlayerService.get(this.cameraId)) {
      this.videoPlayerService.updateSource(this.cameraId, this.src, this.mode);
    } else {
      this.configVideoPlayer();
    }
  }
  @Input({ required: true }) src!: string;
  @Input({ required: true }) mode!: VideoMode;
  @Input({ required: true }) cameraId!: string;
  @Input() isMonitoringMode = false
  @Input() cameraName = "";
  @Input() compact = false;
  @Input() muted = true;
  @Input() autoplay = true;
  @Input() loadingImage: string | null = null;
  @Input() logoSrc: string | null = null;

  @Output() readonly statusChange = new EventEmitter<VideoStatus>();
  @Output() readonly playerReady = new EventEmitter<Player>();

  @ViewChild("videoEl") private readonly videoElRef!: ElementRef<HTMLVideoElement>;
  @ViewChild("playerContainer") private readonly containerRef!: ElementRef<HTMLDivElement>;

  protected readonly videoStatus = VideoStatus;
  protected readonly videoMode = VideoMode;

  protected status = signal<VideoStatus>(VideoStatus.IDLE);
  protected retryInfo = signal<ICaoRetryInfo | null>(null);
  protected isPlaying = signal(false);
  protected isFullscreen = signal(false);
  protected currentTime = signal(0);
  protected duration = signal(0);
  private readonly videoPlayerService = inject(VideoPlayerService);
  private readonly onFullscreenChange = (): void => {
    this.isFullscreen.set(document.fullscreenElement === this.containerRef.nativeElement);
  };

  get isLive(): boolean {
    return this.mode === VideoMode.LIVE;
  }

  get progressPercent(): number {
    const d = this.duration();
    return d > 0 ? (this.currentTime() / d) * 100 : 0;
  }

  private configVideoPlayer() {
    const config: IVideoPlayerConfig = {
      src: this.src,
      mode: this.mode,
      muted: this.muted,
      autoplay: this.autoplay,
    };

    const player = this.videoPlayerService.create(
      this.cameraId,
      this.videoElRef.nativeElement,
      config,
      (status, retry) => {
        this.status.set(status);
        this.retryInfo.set(retry ?? null);
        this.isPlaying.set(status === VideoStatus.PLAYING);
        this.statusChange.emit(status);
      }
    );

    player.on("timeupdate", () => {
      this.currentTime.set(player.currentTime() ?? 0);
    });

    player.on("durationchange", () => {
      this.duration.set(player.duration() ?? 0);
    });

    player.ready(() => {
      this.playerReady.emit(player);
    });
  }

  ngAfterViewInit(): void {
    this.configVideoPlayer()
    document.addEventListener("fullscreenchange", this.onFullscreenChange);
  }

  ngOnDestroy(): void {
    this.videoPlayerService.destroy(this.cameraId);
    document.removeEventListener("fullscreenchange", this.onFullscreenChange);
  }

  togglePlay(): void {
    if (this.isPlaying()) {
      this.videoPlayerService.pause(this.cameraId);
      this.isPlaying.set(false);
    } else {
      this.videoPlayerService.play(this.cameraId);
      this.isPlaying.set(true);
    }
  }

  toggleFullscreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => null);
    } else {
      this.containerRef.nativeElement.requestFullscreen().catch(() => null);
    }
  }

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.videoPlayerService.seek(this.cameraId, Number(input.value));
  }

  setRate(rate: number): void {
    this.videoPlayerService.setPlaybackRate(this.cameraId, rate);
  }
}
