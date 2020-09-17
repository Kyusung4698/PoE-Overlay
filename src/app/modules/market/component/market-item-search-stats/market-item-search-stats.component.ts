import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TradeSearchHttpStatsFilter } from '@data/poe/schema';
import { TradeStat, TradeStatsService } from '@shared/module/poe/trade';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

interface MarektItemSearchOption {
  text: string;
  value: TradeStat;
  group?: boolean;
}

@Component({
  selector: 'app-market-item-search-stats',
  templateUrl: './market-item-search-stats.component.html',
  styleUrls: ['./market-item-search-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketItemSearchStatsComponent implements OnInit {
  private inputValue$ = new BehaviorSubject<string>('');

  public options$: Observable<MarektItemSearchOption[]>;
  public optionsVisible$ = new BehaviorSubject<boolean>(false);

  @ViewChild('input', { static: true })
  public ref: ElementRef<HTMLInputElement>;

  @Output()
  public add = new EventEmitter<TradeSearchHttpStatsFilter>();

  constructor(private readonly stats: TradeStatsService) { }

  public ngOnInit(): void {
    this.loadOptions();
  }

  public onOptionClick(option: MarektItemSearchOption): void {
    if (option?.value) {
      this.add.next({ id: option.value.id });
      this.ref.nativeElement.value = '';
    }
  }

  public onKeyup(): void {
    this.inputValue$.next(this.ref.nativeElement.value || '');
  }

  public onFocus(): void {
    this.optionsVisible$.next(true);
  }

  public onBlur(event: FocusEvent): void {
    event.preventDefault();
    this.ref.nativeElement.value = '';

    setTimeout(() => {
      this.inputValue$.next(this.ref.nativeElement.value);
      this.optionsVisible$.next(false);
      this.ref.nativeElement.blur();
    }, 200);
  }

  private loadOptions(): void {
    this.options$ = this.stats.get().pipe(
      mergeMap(groups => this.inputValue$.pipe(
        map(value => {
          const lower = value.toLowerCase();
          const exp = new RegExp(value, 'gi');
          return groups.reduce((entries, group) => {
            const items = group.items.filter(item => {
              return item.text.toLowerCase().includes(lower)
                || item.type.toLowerCase().includes(lower);
            });
            if (items.length) {
              entries.push({
                text: group.name,
                group: true
              });
              return entries.concat(items.map(item => ({
                value: item,
                text: item.text.replace(exp, match => match?.length ? `<span class="highlight">${match}</span>` : '')
              })));
            }
            return entries;
          }, []);
        })
      ))
    );
  }
}
