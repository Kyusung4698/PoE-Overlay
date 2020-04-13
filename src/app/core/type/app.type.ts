export enum VisibleFlag {
    None = 0,
    Game = 1 << 0,
    Dialog = 1 << 1,
    Browser = 1 << 2
}

export enum AppUpdateState {
    None = 1,
    Available = 2,
    Downloaded = 3
}
