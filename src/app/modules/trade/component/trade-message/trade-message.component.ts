import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AudioService } from '@app/audio';
import { Roman } from '@app/helper';
import { NotificationService } from '@app/notification';
import { TradeMessageAction, TradeMessageActionState } from '@modules/trade/class';
import { TradeHighlightWindowData, TradeHighlightWindowService } from '@modules/trade/service';
import { TradeFeatureSettings } from '@modules/trade/trade-feature-settings';
import { ChatService } from '@shared/module/poe/chat';
import { EventService } from '@shared/module/poe/event';
import { TradeBulkMessage, TradeExchangeMessage, TradeItemMessage, TradeMapMessage, TradeParserType, TradeWhisperDirection } from '@shared/module/poe/trade/chat';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

interface MessageContext {
  zone: string;
  itemname: string;
  price: string;
}

@Component({
  selector: 'app-trade-message',
  templateUrl: './trade-message.component.html',
  styleUrls: ['./trade-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeMessageComponent implements OnInit {
  public visible: TradeMessageActionState = {};
  public activated: TradeMessageActionState = {};
  public toggle$ = new BehaviorSubject(false);

  @Input()
  public message: TradeExchangeMessage;

  @Input()
  public settings: TradeFeatureSettings;

  @Input()
  public even: boolean;

  @Output()
  public dismiss = new EventEmitter<void>();

  constructor(
    private readonly chat: ChatService,
    private readonly event: EventService,
    private readonly audio: AudioService,
    private readonly notification: NotificationService,
    private readonly highlightWindow: TradeHighlightWindowService) { }

  public ngOnInit(): void {
    this.visible[TradeMessageAction.Invite] = true;
    this.visible[TradeMessageAction.Trade] = true;
    this.visible[TradeMessageAction.Whisper] = true;
    this.visible[TradeMessageAction.Whois] = true;
    if (this.message.direction === TradeWhisperDirection.Incoming) {
      this.visible[TradeMessageAction.Wait] = true;
      this.visible[TradeMessageAction.Interested] = true;
      this.visible[TradeMessageAction.ItemGone] = true;
      this.visible[TradeMessageAction.ItemHighlight] = true;
      this.visible[TradeMessageAction.Finished] = true;
      if (this.settings.tradeSoundEnabled) {
        this.audio.play(this.settings.tradeSound, this.settings.tradeSoundVolume / 100);
      }
      this.event.isHideout().subscribe(value => this.toggle$.next(value));
    } else {
      this.toggle$.next(true);
      this.visible[TradeMessageAction.Resend] = true;
      this.visible[TradeMessageAction.Hideout] = true;
      this.visible[TradeMessageAction.Finished] = true;
      this.visible[TradeMessageAction.ItemHighlight] = this.message.type === TradeParserType.TradeMap;
    }
  }

  public onDismiss(): void {
    this.close();
  }

  public onWait(event: MouseEvent): void {
    event.stopPropagation();
    this.onActionExecute(TradeMessageAction.Wait);
  }

  public onActionExecute(action: TradeMessageAction): void {
    this.activated[action] = true;

    switch (action) {
      case TradeMessageAction.Invite:
        this.chat.invite(this.message.name);
        break;
      case TradeMessageAction.Wait:
        this.createMessageContext().subscribe(context => {
          this.chat.whisper(this.message.name, this.settings.tradeMessageWait, context);
        });
        this.visible[TradeMessageAction.Wait] = false;
        break;
      case TradeMessageAction.Interested:
        this.createMessageContext().subscribe(context => {
          this.chat.whisper(this.message.name, this.settings.tradeMessageStillInterested, context);
        });
        break;
      case TradeMessageAction.ItemGone:
        this.createMessageContext().subscribe(context => {
          this.chat.whisper(this.message.name, this.settings.tradeMessageItemGone, context);
        });
        this.close();
        break;
      case TradeMessageAction.Resend:
        this.chat.whisper(this.message.name, this.message.message);
        break;
      case TradeMessageAction.Trade:
        this.hideHighlight();
        this.chat.trade(this.message.name);
        break;
      case TradeMessageAction.ItemHighlight:
        this.toggleHighlight();
        break;
      case TradeMessageAction.Whisper:
        this.chat.whisper(this.message.name);
        break;
      case TradeMessageAction.Finished:
        this.createMessageContext().subscribe(context => {
          this.chat.whisper(this.message.name, this.settings.tradeMessageThanks, context);
        });
        if (this.settings.tradeLeaveParty) {
          this.leaveParty();
        }
        this.close();
        break;
      case TradeMessageAction.Hideout:
        this.chat.hideout(this.message.name);
        break;
      case TradeMessageAction.Whois:
        this.chat.whois(this.message.name);
        break;
    }
  }

  private close(): void {
    this.hideHighlight();
    this.dismiss.next();
  }

  private toggleHighlight(): void {
    let data: TradeHighlightWindowData;
    switch (this.message.type) {
      case TradeParserType.TradeItem:
        {
          const message = this.message as TradeItemMessage;
          data = {
            left: message.left,
            top: message.top,
            stash: message.stash,
            items: [{ name: message.itemName }]
          };
        }
        break;
      case TradeParserType.TradeBulk:
        {
          const message = this.message as TradeBulkMessage;
          data = { items: [{ name: message.type1 }] };
        }
        break;
      case TradeParserType.TradeMap:
        {
          const message = this.message as TradeMapMessage;
          const maps = message.direction === TradeWhisperDirection.Incoming
            ? message.maps2
            : message.maps1;
          data = {
            items: maps.maps.map(x => {
              return {
                name: `${maps.tier}: ${x}`,
                value: `${x} tier:${Roman.toArabic(maps.tier)}`
              };
            })
          };
        }
        break;
      default:
        return;
    }

    this.highlightWindow.toggle(data).subscribe();
  }

  private hideHighlight(): void {
    this.highlightWindow.close().subscribe();
  }

  private leaveParty(): void {
    if (this.message.direction === TradeWhisperDirection.Outgoing) {
      this.event.getCharacter().pipe(
        mergeMap(character => {
          if (character?.name?.length) {
            return of(character.name);
          }
          if (this.settings.characterName?.length) {
            return of(this.settings.characterName);
          }
          return throwError('character name was not set.');
        })
      ).subscribe(name => this.chat.kick(name), error => {
        console.warn(`Could not kick character. ${error?.message ?? JSON.stringify(error)}`, error);
        this.notification.show('trade.kick-error');
      });
    } else {
      this.chat.kick(this.message.name);
    }
  }

  private createMessageContext(): Observable<MessageContext> {
    const context: MessageContext = {
      zone: 'unknown',
      itemname: 'unknown',
      price: 'unknown'
    };

    switch (this.message.type) {
      case TradeParserType.TradeItem:
        {
          const message = this.message as TradeItemMessage;
          context.itemname = message.itemName;
          if (message.price && message.currencyType) {
            context.price = `${message.price} ${message.currencyType}`;
          }
        }
        break;
      case TradeParserType.TradeBulk:
        {
          const message = this.message as TradeBulkMessage;
          context.itemname = `${message.count1} × ${message.type1}`;
          context.price = `${message.count2} × ${message.type2}`;
        }
        break;
      case TradeParserType.TradeMap:
        {
          const message = this.message as TradeMapMessage;
          context.itemname = `${message.maps2.tier}: (${message.maps2.maps.join(', ')})`;
          context.price = `${message.maps1.tier}: (${message.maps1.maps.join(', ')})`;
        }
        break;
    }

    return this.event.getMatch().pipe(
      catchError(() => of(null)),
      map(match => {
        if (match?.zone?.length) {
          context.zone = match.zone;
        }
        return context;
      })
    );
  }
}
