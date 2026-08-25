import { VideoMode, VideoStatus } from "../enums/video-enums";

export interface IVideoPlayerConfig {
    src: string;
    mode: VideoMode;
    muted?: boolean;
    autoplay?: boolean;
}

export interface IVideoPlayerEntry {
    mode: VideoMode;
    config: IVideoPlayerConfig;
    retryCount: number;
    retryTimer: ReturnType<typeof setTimeout> | null;
}

export interface IVideoPlayerControls {
    play(id: string): void;
    pause(id: string): void;
    mute(id: string): void;
    unmute(id: string): void;
    fullscreen(id: string): void;
    seek(id: string, seconds: number): void;
    setPlaybackRate(id: string, rate: number): void;
}

export type VideoStatusChangeHandler = (status: VideoStatus, retryInfo?: ICaoRetryInfo) => void;

export interface ICaoRetryInfo {
    attempt: number;
    maxAttempts: number;
}