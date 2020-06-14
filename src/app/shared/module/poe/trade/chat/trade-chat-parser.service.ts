import { Injectable } from '@angular/core';
import { Asset, AssetService } from '@app/assets';
import { TradeBulkMessage, TradeItemMessage, TradeMapMessage, TradeParserBase, TradeParserType, TradePlayerJoinedArea, TradeWhisperDirection, TradeMessage } from './trade-chat';
import { BehaviorSubject } from 'rxjs';

interface TradeRegexs {
    JoinedArea: {
        [language: string]: string
    };
    Whisper: {
        Universal: string;
    };
    TradeItemPrice: {
        [language: string]: string
    };
    TradeItemNoPrice: {
        [language: string]: string
    };
    TradeBulk: {
        [language: string]: string
    };
    TradeMap: {
        Universal: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class TradeChatParserService {
    private get regexs(): TradeRegexs {
        return this.asset.get(Asset.TradeRegex);
    }

    constructor(private readonly asset: AssetService) { }

    public parse(line: string): TradeParserBase {
        let regexResult = new RegExp(this.regexs.Whisper.Universal, 'gi').exec(line);
        if (regexResult) {
            const direction = regexResult.groups.from ? TradeWhisperDirection.Incoming : TradeWhisperDirection.Outgoing;
            const player = regexResult.groups.player;
            const message = regexResult.groups.message;
            regexResult = null;

            let regexArray = Object.values(this.regexs.TradeItemPrice);
            for (const regex of regexArray) {
                regexResult = new RegExp(regex, 'gi').exec(line);
                if (regexResult) {
                    break;
                }
            }
            if (!regexResult) {
                regexArray = Object.values(this.regexs.TradeItemNoPrice);
                for (const regex of regexArray) {
                    regexResult = new RegExp(regex, 'gi').exec(line);
                    if (regexResult) {
                        break;
                    }
                }
            }
            if (regexResult) {
                return this.mapItemMessage(player, direction, regexResult);
            } else {
                regexArray = Object.values(this.regexs.TradeBulk);
                for (const regex of regexArray) {
                    regexResult = new RegExp(regex, 'gi').exec(line);
                    if (regexResult) {
                        return this.mapBulkMessage(player, direction, regexResult);
                    }
                }
                regexResult = new RegExp(this.regexs.TradeMap.Universal, 'gi').exec(line);
                if (regexResult) {
                    return this.mapMapMessage(player, direction, regexResult);
                } else {
                    return this.mapWhisperMessage(player, direction, message);
                }
            }
        } else {
            const playerJoinedArea = this.parseJoinedArea(line);
            if (playerJoinedArea) {
                return playerJoinedArea;
            }
        }

        return { type: TradeParserType.Ignored };
    }

    private mapWhisperMessage(player: string, direction: TradeWhisperDirection, message: string): TradeMessage {
        return {
            type: TradeParserType.Whisper,
            name: player,
            direction,
            timeReceived: new Date(),
            message
        };
    }

    private mapMapMessage(player: string, direction: TradeWhisperDirection, result: RegExpExecArray): TradeMapMessage {
        const { groups } = result;
        return {
            type: TradeParserType.TradeMap,
            name: player,
            direction,
            timeReceived: new Date(),
            whispers$: new BehaviorSubject(groups.message ? [
                {
                    direction,
                    timeReceived: new Date(),
                    message: groups.message.trim()
                }
            ] : []),
            message: result[0],
            league: groups.league,
            joined$: new BehaviorSubject(false),
            maps1: {
                tier: groups.tier1,
                maps: groups.maps1.split(',').map(x => x.trim())
            },
            maps2: {
                tier: groups.tier2,
                maps: groups.maps2.split(',').map(x => x.trim())
            }
        };
    }

    private mapItemMessage(player: string, direction: TradeWhisperDirection, result: RegExpExecArray): TradeItemMessage {
        const { groups } = result;
        return {
            type: TradeParserType.TradeItem,
            name: player,
            direction,
            timeReceived: new Date(),
            whispers$: new BehaviorSubject(groups.message ? [
                {
                    direction,
                    timeReceived: new Date(),
                    message: groups.message.trim()
                }
            ] : []),
            message: result[0],
            league: groups.league,
            joined$: new BehaviorSubject(false),
            itemName: groups.name,
            stash: groups.stash,
            left: +groups.left,
            top: +groups.top,
            price: 'price' in groups ? +groups.price : null,
            currencyType: 'currency' in groups ? groups.currency : null
        };
    }

    private mapBulkMessage(player: string, direction: TradeWhisperDirection, result: RegExpExecArray): TradeBulkMessage {
        const { groups } = result;
        return {
            type: TradeParserType.TradeBulk,
            name: player,
            direction,
            timeReceived: new Date(),
            whispers$: new BehaviorSubject(groups.message ? [
                {
                    direction,
                    timeReceived: new Date(),
                    message: groups.message.trim()
                }
            ] : []),
            message: result[0],
            league: groups.league,
            joined$: new BehaviorSubject(false),
            count1: +groups.count,
            type1: groups.name,
            count2: +groups.price,
            type2: groups.currency
        };
    }

    private parseJoinedArea(line: string): TradePlayerJoinedArea {
        const regexArray = Object.values(this.regexs.JoinedArea);
        for (const regex of regexArray) {
            const result = new RegExp(regex, 'gi').exec(line);
            if (result) {
                return {
                    type: TradeParserType.PlayerJoinedArea,
                    name: result.groups.player
                };
            }
        }
        return undefined;
    }
}
