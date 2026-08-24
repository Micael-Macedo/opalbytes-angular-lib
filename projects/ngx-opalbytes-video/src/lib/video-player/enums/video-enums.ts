export enum VideoMode {
    LIVE = "live",
    RECORDED = "recorded",
}


export enum VideoSourceType {
    HLS = "application/x-mpegURL",
    MP4 = "video/mp4",
}


export enum VideoStatus {
    IDLE = "idle",
    LOADING = "loading",
    PLAYING = "playing",
    RETRYING = "retrying",
    OFFLINE = "offline",
    ERROR = "error",
    NOT_FOUND = "not_found",
}
