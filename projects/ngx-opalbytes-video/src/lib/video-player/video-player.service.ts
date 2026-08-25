import { Injectable } from "@angular/core";

import videojs from "video.js";
import type Player from "video.js/dist/types/player";

import { VideoMode, VideoSourceType, VideoStatus } from "./enums/video-enums";
import { IVideoPlayerControls, IVideoPlayerEntry, IVideoPlayerConfig, VideoStatusChangeHandler, ICaoRetryInfo } from "./interfaces/video.interface";


const LIVE_RETRY_DELAYS_MS: readonly number[] = [3_000, 6_000, 12_000, 30_000] as const;
const RECORDED_MAX_RETRIES = 2 as const;
const RECORDED_RETRY_DELAY_MS = 3_000 as const;

@Injectable({ providedIn: "root" })
export class VideoPlayerService implements IVideoPlayerControls {
  private readonly players = new Map<string, Player>();
  private readonly entries = new Map<string, IVideoPlayerEntry>();
  private readonly playerToId = new Map<Player, string>();

  create(
    id: string,
    element: HTMLVideoElement,
    config: IVideoPlayerConfig,
    onStatus: VideoStatusChangeHandler
  ): Player {
    this.destroy(id);

    const sourceType = config.mode === VideoMode.LIVE ? VideoSourceType.HLS : VideoSourceType.MP4;

    const isLive = config.mode === VideoMode.LIVE;

    const player = videojs(element, {
      autoplay: config.autoplay ?? true,
      controls: false,
      muted: config.muted ?? true,
      preload: "auto",
      fill: true,
      liveui: isLive,
      inactivityTimeout: 0,
      sources: [{ src: config.src, type: sourceType }],
      children: ["MediaLoader"],
      ...(isLive && {
        html5: {
          vhs: { overrideNative: true, enableLowInitialPlaylist: true },
          nativeAudioTracks: false,
          nativeVideoTracks: false,
        },
      }),
    });

    const entry: IVideoPlayerEntry = {
      mode: config.mode,
      config: { ...config },
      retryCount: 0,
      retryTimer: null,
    };

    this.players.set(id, player);
    this.entries.set(id, entry);
    this.playerToId.set(player, id);
    this.bindEvents(id, onStatus);

    return player;
  }

  updateSource(id: string, src: string, mode: VideoMode): void {
    const player = this.players.get(id);
    const entry = this.entries.get(id);
    if (!player || !entry) { return; }

    const sourceType = mode === VideoMode.LIVE ? VideoSourceType.HLS : VideoSourceType.MP4;

    entry.config = { ...entry.config, src, mode };
    entry.mode = mode;
    entry.retryCount = 0;
    if (entry.retryTimer) {
      clearTimeout(entry.retryTimer);
      entry.retryTimer = null;
    }

    player.error(undefined);
    player.src({ src, type: sourceType });
    player.load();
    player.play()?.catch(() => null);
  }

  get(id: string): Player | null {
    return this.players.get(id) ?? null;
  }

  destroy(id: string): void {
    const entry = this.entries.get(id);
    if (entry?.retryTimer) { clearTimeout(entry.retryTimer); }

    const player = this.players.get(id);
    if (player && !player.isDisposed()) {
      this.playerToId.delete(player);
      player.dispose();
    }

    this.players.delete(id);
    this.entries.delete(id);
  }

  destroyAll(): void {
    for (const id of this.players.keys()) { this.destroy(id); }
  }

  reassignId(oldId: string, newId: string): void {
    if (oldId === newId) { return; }
    const player = this.players.get(oldId);
    const entry = this.entries.get(oldId);
    if (!player || !entry) { return; }

    this.players.delete(oldId);
    this.entries.delete(oldId);

    this.players.set(newId, player);
    this.entries.set(newId, entry);
    this.playerToId.set(player, newId);

    const onStatus = (entry as any)._statusHandler;

    player.off("waiting");
    player.off("playing");
    player.off("error");

    if (onStatus) {
      this.bindEvents(newId, onStatus);
    }
  }

  play(id: string): void {
    this.players
      .get(id)
      ?.play()
      ?.catch(() => null);
  }

  pause(id: string): void {
    this.players.get(id)?.pause();
  }

  mute(id: string): void {
    this.players.get(id)?.muted(true);
  }

  unmute(id: string): void {
    this.players.get(id)?.muted(false);
  }

  fullscreen(id: string): void {
    this.players.get(id)?.requestFullscreen();
  }

  seek(id: string, seconds: number): void {
    const entry = this.entries.get(id);
    if (entry?.mode !== VideoMode.RECORDED) { return; }
    this.players.get(id)?.currentTime(seconds);
  }

  setPlaybackRate(id: string, rate: number): void {
    const entry = this.entries.get(id);
    if (entry?.mode !== VideoMode.RECORDED) { return; }
    this.players.get(id)?.playbackRate(rate);
  }

  private bindEvents(id: string, onStatus: VideoStatusChangeHandler): void {
    const player = this.players.get(id);
    const entry = this.entries.get(id);
    if (!player || !entry) { return; }

    // Armazena o handler no entry para uso no reassignId
    (entry as any)._statusHandler = onStatus;

    player.on("waiting", () => onStatus(VideoStatus.LOADING));

    player.on("playing", () => {
      const current = this.entries.get(id);
      if (current) { current.retryCount = 0; }
      onStatus(VideoStatus.PLAYING);
    });

    player.on("error", () => {
      // Usa o mapa reverso para obter o id atual
      const currentId = this.playerToId.get(player);
      if (!currentId) { return; }

      const currentEntry = this.entries.get(currentId);
      if (!currentEntry) { return; }

      if (currentEntry.mode === VideoMode.LIVE) {
        this.handleLiveError(currentId, onStatus);
      } else {
        this.retryRecorded(currentId, onStatus);
      }
    });
  }

  private handleLiveError(id: string, onStatus: VideoStatusChangeHandler): void {
    const entry = this.entries.get(id);
    if (!entry) { return; }

    fetch(entry.config.src)
      .then((response) => {
        const current = this.entries.get(id);
        if (!current) { return; }
        if (response.status === 404) {
          onStatus(VideoStatus.NOT_FOUND);
          return;
        }
        this.retryLive(id, onStatus);
      })
      .catch(() => this.retryLive(id, onStatus));
  }

  private retryLive(id: string, onStatus: VideoStatusChangeHandler): void {
    const entry = this.entries.get(id);
    if (!entry) { return; }

    const delayMs =
      LIVE_RETRY_DELAYS_MS[Math.min(entry.retryCount, LIVE_RETRY_DELAYS_MS.length - 1)];
    entry.retryCount++;

    onStatus(VideoStatus.OFFLINE);

    entry.retryTimer = setTimeout(() => {
      const current = this.entries.get(id);
      const player = this.players.get(id);
      if (!current || !player || player.isDisposed()) { return; }

      onStatus(VideoStatus.LOADING);
      player.error(undefined);
      player.src({ src: current.config.src, type: VideoSourceType.HLS });
      player.load();
      player.play()?.catch(() => null);
    }, delayMs);
  }

  private retryRecorded(id: string, onStatus: VideoStatusChangeHandler): void {
    const entry = this.entries.get(id);
    if (!entry) { return; }

    if (entry.retryCount < RECORDED_MAX_RETRIES) {
      entry.retryCount++;

      const retryInfo: ICaoRetryInfo = {
        attempt: entry.retryCount,
        maxAttempts: RECORDED_MAX_RETRIES,
      };

      onStatus(VideoStatus.RETRYING, retryInfo);

      entry.retryTimer = setTimeout(() => {
        const current = this.entries.get(id);
        const player = this.players.get(id);
        if (!current || !player || player.isDisposed()) { return; }

        player.error(undefined);
        player.src({ src: current.config.src, type: VideoSourceType.MP4 });
        player.load();
        player.play()?.catch(() => null);
      }, RECORDED_RETRY_DELAY_MS);
    } else {
      onStatus(VideoStatus.ERROR);
    }
  }
}
