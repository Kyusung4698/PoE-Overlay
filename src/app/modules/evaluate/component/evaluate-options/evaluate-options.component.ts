import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LeaguesService } from '@shared/module/poe/service';
import { League } from '@shared/module/poe/type';
import { ItemSearchIndexed } from '@shared/module/poe/type/search.type';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface EvaluateOptions {
  online: boolean;
  indexed: ItemSearchIndexed;
  leagueId: string;
}

type LeagueMap = {
  [id: string]: League;
}

@Component({
  selector: 'app-evaluate-options',
  templateUrl: './evaluate-options.component.html',
  styleUrls: ['./evaluate-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateOptionsComponent implements OnInit {
  @Input()
  public options: EvaluateOptions;

  @Output()
  public optionsChange = new EventEmitter<EvaluateOptions>();

  @Output()
  public resetTrigger = new EventEmitter<void>();

  public toggle$ = new BehaviorSubject<boolean>(false);
  public leagues$: Observable<LeagueMap>;

  constructor(private readonly leagues: LeaguesService) { }

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

  public onIndexedWheel(event: WheelEvent): void {
    const factor = event.deltaY > 0 ? -1 : 1;
    const keys = Object.getOwnPropertyNames(ItemSearchIndexed);

    let index = keys.findIndex(x => ItemSearchIndexed[x] === this.options.indexed);
    index += factor;

    if (index >= keys.length) {
      index = 0;
    } else if (index < 0) {
      index = keys.length - 1;
    }

    const key = keys[index];
    this.options.indexed = ItemSearchIndexed[key];
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

  public onResetClick(): void {
    this.resetTrigger.next();
  }
}
