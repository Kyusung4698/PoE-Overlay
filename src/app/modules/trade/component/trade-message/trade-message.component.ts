import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Roman } from '@app/helper';
import { NotificationService } from '@app/notification';
import { OWGamesEvents } from '@app/odk';
import { TradeMessageAction, TradeMessageActionState } from '@modules/trade/class';
import { TradeHighlightWindowService } from '@modules/trade/service';
import { TradeFeatureSettings } from '@modules/trade/trade-feature-settings';
import { ChatService } from '@shared/module/poe/chat';
import { EventInfo } from '@shared/module/poe/poe-event-info';
import { TradeBulkMessage, TradeExchangeMessage, TradeItemMessage, TradeMapMessage, TradeParserType, TradeWhisperDirection } from '@shared/module/poe/trade/chat';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';

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

  @Output()
  public dismiss = new EventEmitter<void>();

  constructor(
    private readonly chat: ChatService,
    private readonly notification: NotificationService,
    private readonly highlight: TradeHighlightWindowService) { }

  public ngOnInit(): void {
    this.visible[TradeMessageAction.Invite] = true;
    this.visible[TradeMessageAction.Trade] = true;
    this.visible[TradeMessageAction.Whisper] = true;
    if (this.message.direction === TradeWhisperDirection.Incoming) {
      this.visible[TradeMessageAction.Wait] = true;
      this.visible[TradeMessageAction.ItemGone] = true;
      this.visible[TradeMessageAction.ItemHighlight] = true;
      // TODO: Cleanup
      this.createMessageContext().subscribe(context => {
        this.toggle$.next([
          'Hideout',
          'Refúgio',
          'убежище',
          'Hideout',
          'Versteck',
          'Repaire',
          'Guarida',
          '은신처에',
        ].some(x => context.zone.includes(x)));
      });
    } else {
      this.toggle$.next(true);
      this.visible[TradeMessageAction.Resend] = true;
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
        this.visible[TradeMessageAction.Interested] = true;
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
        this.visible[TradeMessageAction.ItemHighlight] = false;
        this.visible[TradeMessageAction.Finished] = true;
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
        this.kick();
        this.close();
        break;
    }
  }

  private close(): void {
    this.hideHighlight();
    this.dismiss.next();
  }

  private toggleHighlight(): void {
    switch (this.message.type) {
      case TradeParserType.TradeItem:
        {
          const message = this.message as TradeItemMessage;
          this.highlight.restore({
            left: message.left,
            top: message.top,
            stash: message.stash,
            items: [{ name: message.itemName }]
          }).subscribe();
        }
        break;
      case TradeParserType.TradeBulk:
        {
          const message = this.message as TradeBulkMessage;
          this.highlight.restore({ items: [{ name: message.type1 }] }).subscribe();
        }
        break;
      case TradeParserType.TradeMap:
        {
          const message = this.message as TradeMapMessage;
          const maps = message.direction === TradeWhisperDirection.Incoming
            ? message.maps2
            : message.maps1;
          this.highlight.restore({
            items: maps.maps.map(x => {
              return {
                name: `${maps.tier}: ${x}`,
                value: `${x} tier:${Roman.toArabic(maps.tier)}`
              };
            })
          }).subscribe();
        }
        break;
      default:
        break;
    }
  }

  private hideHighlight(): void {
    this.highlight.close().subscribe();
  }

  private kick(): void {
    if (this.message.direction === TradeWhisperDirection.Outgoing) {
      OWGamesEvents.getInfo<EventInfo>().pipe(
        flatMap((info: EventInfo) => {
          if (info?.me?.character_name?.length > 2) {
            const name = info.me.character_name;
            return of(name.slice(1, name.length - 1));
          }
          return throwError('character name was not set.');
        })
      ).subscribe(name => {
        this.chat.kick(name);
      }, error => {
        console.warn(`Could not kick character.`, error);
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

    return OWGamesEvents.getInfo<EventInfo>().pipe(
      catchError(() => of(null)),
      map((info: EventInfo) => {
        if (info?.match_info?.current_zone?.length > 2) {
          const zone = info.match_info.current_zone;
          context.zone = zone.slice(1, zone.length - 1);
        }
        return context;
      })
    );
  }
}
