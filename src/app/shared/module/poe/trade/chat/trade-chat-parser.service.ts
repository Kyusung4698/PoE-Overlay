import { Injectable } from '@angular/core';
import { ParserResultType, TradeParserBase, TradeDirection, TradeItemMessage, TradeBulkMessage, TradeMapMessage, TradeMapList, PlayerJoinedArea } from './trade-chat';
import { Asset, AssetService } from '@app/assets';

@Injectable({
    providedIn: 'root'
})
export class TradeChatParserService {
    constructor(private readonly asset: AssetService){ }

    public parse(line: string): TradeParserBase {
        const tradeRegexAsset = this.asset.get(Asset.TradeRegex);
        
        let regexResult = new RegExp(tradeRegexAsset.Whisper.Universal, "gi").exec(line);
        if(regexResult)
        {
            let direction: TradeDirection = regexResult.groups.from ? TradeDirection.Incoming : TradeDirection.Outgoing;
            let player: string = regexResult.groups.player;
            regexResult = null;
            
            let regexArray = Object.values(tradeRegexAsset.TradeItemPrice);
            for (var i = 0; i < regexArray.length; i++) {
                regexResult = new RegExp(regexArray[i] as string, "gi").exec(line);
                if (regexResult) {
                    break;
                }
            }
            if(!regexResult)
            {
                regexArray = Object.values(tradeRegexAsset.TradeItemNoPrice);
                for (var i = 0; i < regexArray.length; i++) {
                    regexResult = new RegExp(regexArray[i] as string, "gi").exec(line);
                    if (regexResult) {
                        break;
                    }
                }
            }
            if(regexResult)
            {
                return <TradeItemMessage>{
                    parseType: ParserResultType.TradeItem,
                    name: player,
                    tradeDirection: direction,
                    timeReceived: new Date(),
                    extendedMessage: regexResult.groups.message ? [ "<--| " + regexResult.groups.message.trim() ] : [],
                    message: regexResult[0],
                    league: regexResult.groups.league,
                    joined: false,
                    itemName: regexResult.groups.name,
                    stash: regexResult.groups.stash,
                    left: +regexResult.groups.left,
                    top: +regexResult.groups.top,
                    price: 'price' in regexResult.groups ? +regexResult.groups.price : null,
                    currencyType: 'currency' in regexResult.groups ? regexResult.groups.currency : null                
                }
            }
            else
            {
                regexArray = Object.values(tradeRegexAsset.TradeBulk);
                for (var i = 0; i < regexArray.length; i++) {
                    regexResult = new RegExp(regexArray[i] as string, "gi").exec(line);
                    if (regexResult) {
                        return <TradeBulkMessage>{
                            parseType: ParserResultType.TradeBulk,
                            name: player,
                            tradeDirection: direction,
                            timeReceived: new Date(),
                            extendedMessage: regexResult.groups.message ? [ "<--| " + regexResult.groups.message.trim() ] : [],
                            message: regexResult[0],
                            league: regexResult.groups.league,
                            joined: false,
                            count1: +regexResult.groups.count,
                            type1: regexResult.groups.name,
                            count2: +regexResult.groups.price,
                            type2: regexResult.groups.currency
                        }
                    }
                }
                regexResult = new RegExp(tradeRegexAsset.TradeMap.Universal, "gi").exec(line);
                if(regexResult)
                {
                    return <TradeMapMessage>{
                        parseType: ParserResultType.TradeMap,
                        name: player,
                        tradeDirection: direction,
                        timeReceived: new Date(),
                        extendedMessage: regexResult.groups.message ? [ "<--| " + regexResult.groups.message.trim() ] : [],
                        message: regexResult[0],
                        league: regexResult.groups.league,
                        joined: false,
                        maps1: <TradeMapList>{
                            tier: regexResult.groups.tier1,
                            maps: regexResult.groups.maps1.split(",").map(function(item) {
                                return item.trim();
                              })
                        },
                        maps2: <TradeMapList>{
                            tier: regexResult.groups.tier2,
                            maps: regexResult.groups.maps2.split(",").map(function(item) {
                                return item.trim();
                              })
                        }
                    }
                }
            }
        }
        else
        {
            const regexArray = Object.values(tradeRegexAsset.JoinedArea);
            for (var i = 0; i < regexArray.length; i++) {
                regexResult = new RegExp(regexArray[i] as string, "gi").exec(line);
                if (regexResult) {
                    return <PlayerJoinedArea>{
                        parseType: ParserResultType.PlayerJoinedArea,
                        name: regexResult.groups.player
                    }
                }
            }
        }

        return { parseType: ParserResultType.Ignored };
    }
}
