import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OWGamesEvents } from '@app/odk';
import { TradeMessageAction, TradeMessageActionState } from '@modules/trade/class';
import { ChatService } from '@shared/module/poe/chat';
import { EventInfo } from '@shared/module/poe/poe-event-info';
import { TradeExchangeMessage, TradeWhisperDirection } from '@shared/module/poe/trade/chat';
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

  @Input()
  public message: TradeExchangeMessage;

  @Output()
  public dismiss = new EventEmitter<void>();

  constructor(private readonly chat: ChatService) { }

  public ngOnInit(): void {
    this.visible[TradeMessageAction.Invite] = true;
    this.visible[TradeMessageAction.Trade] = true;
    this.visible[TradeMessageAction.Whisper] = true;
    this.visible[TradeMessageAction.Dismiss] = true;
    if (this.message.direction === TradeWhisperDirection.Incoming) {
      this.visible[TradeMessageAction.Wait] = true;
      this.visible[TradeMessageAction.ItemGone] = true;
      this.visible[TradeMessageAction.ItemHighlight] = true;
    } else {
      this.visible[TradeMessageAction.Resend] = true;
      this.visible[TradeMessageAction.Finished] = true;
      this.visible[TradeMessageAction.OfferExpired] = true;
    }
  }

  public onActionExecute(action: TradeMessageAction): void {
    this.activated[action] = true;

    switch (action) {
      case TradeMessageAction.Invite:
        this.chat.invite(this.message.name);
        break;
      case TradeMessageAction.Wait:
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
        this.visible[TradeMessageAction.Wait] = false;
        this.visible[TradeMessageAction.Interested] = true;
        break;
      case TradeMessageAction.Interested:
        this.chat.whisper(this.message.name, 'interested');
        break;
      case TradeMessageAction.ItemGone:
        this.chat.whisper(this.message.name, 'item gone');
        this.dismiss.next();
        break;
      case TradeMessageAction.OfferExpired:
        this.chat.whisper(this.message.name, 'offer expired');
        this.dismiss.next();
        break;
      case TradeMessageAction.Resend:
        this.chat.whisper(this.message.name, this.message.message);
        break;
      case TradeMessageAction.Trade:
        this.chat.trade(this.message.name);
        this.visible[TradeMessageAction.ItemHighlight] = false;
        this.visible[TradeMessageAction.Finished] = true;
        break;
      case TradeMessageAction.ItemHighlight:
        // TODO: Highlight item
        console.log('TODO: highlight item');
        break;
      case TradeMessageAction.Whisper:
        this.chat.whisper(this.message.name);
        break;
      case TradeMessageAction.Finished:
        this.chat.whisper(this.message.name, 'thanks');
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
            // TODO: error handling
          });
        } else {
          this.chat.kick(this.message.name);
        }
        this.dismiss.next();
        break;
      case TradeMessageAction.Dismiss:
        this.dismiss.next();
        break;
    }
  }
}
