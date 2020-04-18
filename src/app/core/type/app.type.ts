export enum VisibleFlag {
    None = 0,
    Game = 1 << 0,
    Overlay = 1 << 1,
    Dialog = 1 << 2,
    Browser = 1 << 3
}

export enum AppUpdateState {
    None = 1,
    Available = 2,
    Downloaded = 3
}
