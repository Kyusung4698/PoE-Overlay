export enum TradeMessageAction {
    Invite = 'invite',
    Wait = 'wait',
    ItemGone = 'item-gone',
    OfferExpired = 'offer-expired',
    Resend = 'resend',
    Interested = 'interested',
    Trade = 'trade',
    ItemHighlight = 'item-highlight',
    Whisper = 'whisper',
    Finished = 'finished',
    Dismiss = 'dismiss',
}

export interface TradeMessageActionState {
    [action: string]: boolean;
}
