import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from '@app/notification';
import { OWGamesEvents } from '@app/odk';
import { TradeMessageAction, TradeMessageActionState } from '@modules/trade/class';
import { TradeHighlightWindowService } from '@modules/trade/service';
import { ChatService } from '@shared/module/poe/chat';
import { EventInfo } from '@shared/module/poe/poe-event-info';
import { TradeExchangeMessage, TradeItemMessage, TradeMapMessage, TradeParserType, TradeWhisperDirection } from '@shared/module/poe/trade/chat';
import { of, throwError } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-trade-message',
  templateUrl: './trade-message.component.html',
  styleUrls: ['./trade-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TradeMessageComponent implements OnInit {
  public visible: TradeMessageActionState = {};
  public activated: TradeMessageActionState = {};
  public toggle = false;

  @Input()
  public message: TradeExchangeMessage;

  @Output()
  public dismiss = new EventEmitter<void>();

  constructor(
    private readonly chat: ChatService,
    private readonly notification: NotificationService,
    private readonly highlight: TradeHighlightWindowService) { }

  public ngOnInit(): void {
    const type = this.message.type;
    this.visible[TradeMessageAction.Invite] = true;
    this.visible[TradeMessageAction.Trade] = true;
    this.visible[TradeMessageAction.Whisper] = true;
    if (this.message.direction === TradeWhisperDirection.Incoming) {
      this.visible[TradeMessageAction.Wait] = type === TradeParserType.TradeItem;
      this.visible[TradeMessageAction.ItemGone] = true;
      this.visible[TradeMessageAction.ItemHighlight] = type === TradeParserType.TradeItem || type === TradeParserType.TradeMap;
    } else {
      this.visible[TradeMessageAction.Resend] = true;
      this.visible[TradeMessageAction.Finished] = true;
      this.visible[TradeMessageAction.ItemHighlight] = type === TradeParserType.TradeMap;
    }
  }

  public onDismiss(): void {
    this.close();
  }

  public onActionExecute(action: TradeMessageAction): void {
    this.activated[action] = true;

    switch (action) {
      case TradeMessageAction.Invite:
        this.chat.invite(this.message.name);
        break;
      case TradeMessageAction.Wait:
        this.wait();
        this.visible[TradeMessageAction.Wait] = false;
        this.visible[TradeMessageAction.Interested] = true;
        break;
      case TradeMessageAction.Interested:
        this.chat.whisper(this.message.name, 'interested');
        break;
      case TradeMessageAction.ItemGone:
        this.chat.whisper(this.message.name, 'item gone');
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
        this.chat.whisper(this.message.name, 'thanks');
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
          this.highlight.toggle({
            left: message.left,
            top: message.top,
            stash: message.stash,
            items: [message.itemName]
          }).subscribe();
        }
        break;
      case TradeParserType.TradeMap:
        {
          const message = this.message as TradeMapMessage;
          this.highlight.toggle({
            items: message.direction === TradeWhisperDirection.Incoming
              ? message.maps1.maps
              : message.maps2.maps
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

  private wait(): void {
    OWGamesEvents.getInfo<EventInfo>().pipe(
      catchError(() => of(null)),
      map((info: EventInfo) => {
        const context = { location: 'unknown' };
        if (info?.match_info?.current_zone?.length > 2) {
          const zone = info.match_info.current_zone;
          context.location = zone.slice(1, zone.length - 1);
        }
        return context;
      })
    ).subscribe(context => {
      this.chat.whisper(this.message.name, 'wait @location', context);
    });
  }
}
