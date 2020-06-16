export enum TradeMessageAction {
    Invite = 'invite',
    Wait = 'wait',
    ItemGone = 'item-gone',
    Resend = 'resend',
    Interested = 'interested',
    Trade = 'trade',
    ItemHighlight = 'item-highlight',
    Whisper = 'whisper',
    Finished = 'finished'
}

export interface TradeMessageActionState {
    [action: string]: boolean;
}
