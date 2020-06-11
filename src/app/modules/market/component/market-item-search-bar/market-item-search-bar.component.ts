import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TradeItem, TradeItemsService, TradeSearchRequest } from '@shared/module/poe/trade';
import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

interface MarektItemSearchEntry {
  text: string;
  value: TradeItem;
  group?: boolean;
}

@Component({
  selector: 'app-market-item-search-bar',
  templateUrl: './market-item-search-bar.component.html',
  styleUrls: ['./market-item-search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketItemSearchBarComponent implements OnInit {
  public entries$: Observable<MarektItemSearchEntry[]>;

  public toggle$ = new BehaviorSubject<boolean>(false);
  public inputValue$ = new BehaviorSubject<string>('');
  public filterVisible$ = new BehaviorSubject<boolean>(false);

  @ViewChild('input', { static: true })
  public ref: ElementRef<HTMLInputElement>;

  @Input()
  public request: TradeSearchRequest;

  @Output()
  public search = new EventEmitter<void>();

  @Output()
  public toggle = new EventEmitter<boolean>();

  @Output()
  public clear = new EventEmitter<void>();

  constructor(private readonly items: TradeItemsService) { }

  public ngOnInit(): void {
    this.loadEntries();
  }

  public onSearch(): void {
    this.search.next();
  }

  public onToggleClick(): void {
    this.toggle$.next(!this.toggle$.value);
    this.toggle.next(this.toggle$.value);
  }

  public onClearClick(): void {
    // TODO: fill value based on request
    this.ref.nativeElement.value = '';
    this.clear.next();
  }

  public onItemClick(item: TradeItem): void {
    if (item) {
      this.updateRequest(item);
      this.ref.nativeElement.value = item.text;
    }
  }

  public onKeyup(): void {
    this.updateRequest(null);
    this.inputValue$.next(this.ref.nativeElement.value || '');
  }

  public onFocus(): void {
    this.filterVisible$.next(true);
  }

  public onBlur(event: FocusEvent): void {
    event.preventDefault();
    this.updateRequest(null);
    this.ref.nativeElement.value = '';

    setTimeout(() => {
      this.inputValue$.next(this.ref.nativeElement.value);
      this.filterVisible$.next(false);
      this.ref.nativeElement.blur();
    }, 200);
  }

  private updateRequest(item: TradeItem): void {
    if (item?.type?.length) {
      this.request.query.type = item.type;
    } else {
      delete this.request.query.type;
    }
    if (item?.name?.length) {
      this.request.query.name = item.name;
    } else {
      delete this.request.query.name;
    }
  }

  private loadEntries(): void {
    this.entries$ = this.items.get().pipe(
      flatMap(groups => this.inputValue$.pipe(
        map(value => {
          const lower = value.toLowerCase();
          const exp = new RegExp(value, 'gi');
          return groups.reduce((entries, group) => {
            const items = group.items.filter(item => {
              return item.text.toLowerCase().includes(lower);
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
