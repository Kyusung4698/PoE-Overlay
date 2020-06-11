import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { League, TradeLeaguesService } from '@shared/module/poe/trade';
import { TradeSearchIndexed } from '@shared/module/poe/trade';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface EvaluateItemOptions {
  online: boolean;
  indexed: TradeSearchIndexed;
  leagueId: string;
  fetchCount: number;
}

interface LeagueMap {
  [id: string]: League;
}

@Component({
  selector: 'app-evaluate-item-options',
  templateUrl: './evaluate-item-options.component.html',
  styleUrls: ['./evaluate-item-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateItemOptionsComponent implements OnInit {
  @Input()
  public options: EvaluateItemOptions;

  @Output()
  public optionsChange = new EventEmitter<EvaluateItemOptions>();

  @Output()
  public resetTrigger = new EventEmitter<void>();

  public toggle$ = new BehaviorSubject<boolean>(false);
  public leagues$: Observable<LeagueMap>;

  constructor(private readonly leagues: TradeLeaguesService) { }

  public ngOnInit(): void {
    this.leagues$ = this.leagues.get().pipe(
      map(leagues => {
        const result = {};
        leagues.forEach(league => {
          result[league.id] = league.text;
        });
        return result;
      })
    );
  }

  public onToggleOnlineClick(): void {
    this.options.online = !this.options.online;
    this.optionsChange.emit(this.options);
  }

  public onLeaguesWheel(event: WheelEvent, leagues: LeagueMap): void {
    const factor = event.deltaY > 0 ? -1 : 1;
    const keys = Object.getOwnPropertyNames(leagues);

    let index = keys.findIndex(id => id === this.options.leagueId);
    index += factor;

    if (index >= keys.length) {
      index = 0;
    } else if (index < 0) {
      index = keys.length - 1;
    }

    const key = keys[index];
    this.options.leagueId = key;
    this.optionsChange.emit(this.options);
  }

  public onIndexedWheel(event: WheelEvent): void {
    const factor = event.deltaY > 0 ? -1 : 1;
    const keys = Object.getOwnPropertyNames(TradeSearchIndexed);

    let index = keys.findIndex(x => TradeSearchIndexed[x] === this.options.indexed);
    index += factor;

    if (index >= keys.length) {
      index = 0;
    } else if (index < 0) {
      index = keys.length - 1;
    }

    const key = keys[index];
    this.options.indexed = TradeSearchIndexed[key];
    this.optionsChange.emit(this.options);
  }

  public onFetchCountWheel(event: WheelEvent): void {
    const factor = event.deltaY > 0 ? -1 : 1;

    let fetchCount = this.options.fetchCount + factor * 10;
    if (fetchCount > 100) {
      fetchCount = 10;
    } else if (fetchCount < 10) {
      fetchCount = 100;
    }

    if (fetchCount !== this.options.fetchCount) {
      this.options.fetchCount = fetchCount;
      this.optionsChange.emit(this.options);
    }
  }

  public onResetClick(): void {
    this.resetTrigger.next();
  }
}
