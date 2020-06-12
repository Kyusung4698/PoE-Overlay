export enum TradeMessageAction {
    Invite = 'invite',
    Wait = 'wait',
    ItemGone = 'item-gone',
    Resend = 'resend',
    Trade = 'trade',
    ItemHighlight = 'item-highlight',
    Whisper = 'whisper',
    Finished = 'finished',
    Dismiss = 'dismiss',
}

export interface TradeMessageActionState {
    [action: string]: boolean;
}
