import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TradeItem, TradeItemsService, TradeSearchRequest } from '@shared/module/poe/trade';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

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
  private _request: TradeSearchRequest;

  public entries$: Observable<MarektItemSearchEntry[]>;

  public records$ = new BehaviorSubject<TradeSearchRequest[]>([]);
  public recordsVisible$ = new BehaviorSubject<boolean>(false);

  public toggle$ = new BehaviorSubject<boolean>(false);
  public inputValue$ = new BehaviorSubject<string>('');
  public filterVisible$ = new BehaviorSubject<boolean>(false);

  @ViewChild('input', { static: true })
  public ref: ElementRef<HTMLInputElement>;

  public get request(): TradeSearchRequest {
    return this._request;
  }

  @Input()
  public set request(request: TradeSearchRequest) {
    this._request = request;
    this.update();
  }

  @Output()
  public requestChange = new EventEmitter<TradeSearchRequest>();

  @Output()
  public search = new EventEmitter<void>();

  @Output()
  public toggle = new EventEmitter<boolean>();

  constructor(private readonly items: TradeItemsService) { }

  public ngOnInit(): void {
    this.loadEntries();
  }

  public onSearch(): void {
    this.recordsVisible$.next(false);
    const { value } = this.records$;
    const hash = JSON.stringify(this.request);
    const records = value.filter(request => JSON.stringify(request) !== hash);
    records.unshift(JSON.parse(JSON.stringify(this.request)));
    if (records.length > 10) {
      records.pop();
    }
    this.records$.next(records);
    this.search.next();
  }

  public onToggleClick(): void {
    this.toggle$.next(!this.toggle$.value);
    this.toggle.next(this.toggle$.value);
  }

  public onResetClick(request?: TradeSearchRequest): void {
    this.recordsVisible$.next(false);
    if (request) {
      this.requestChange.next(JSON.parse(JSON.stringify(request)));
    } else {
      this.requestChange.next();
    }
  }

  public onItemClick(item: TradeItem): void {
    this.filterVisible$.next(false);
    this.updateRequest(item);
  }

  public onKeyup(): void {
    this.resetRequest();
    this.setViewValue(this.ref.nativeElement.value || '');
  }

  public onFocus(): void {
    this.filterVisible$.next(true);
  }

  public onBlur(event: FocusEvent): void {
    event.preventDefault();
    this.resetRequest();
    setTimeout(() => {
      this.filterVisible$.next(false);
      this.update();
    }, 200);
  }

  private resetRequest(): void {
    delete this.request.query.name;
    delete this.request.query.type;
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
    this.update();
  }

  private update(): void {
    const { type, name } = this.request.query;
    const hasType = type?.length;
    const hasName = name?.length;
    if (hasType || hasName) {
      this.items.get().subscribe(items => {
        let found = false;
        for (const group of items) {
          for (const item of group.items) {
            if (((hasType && item.type === type) || (!hasType && !item.type)) &&
              ((hasName && item.name === name) || (!hasName && !item.name))) {
              found = true;
              this.setViewValue(item.text);
              break;
            }
          }
          if (found) {
            break;
          }
        }
        if (!found) {
          this.updateRequest(null);
        }
      });
    } else {
      this.setViewValue('');
    }
  }

  private setViewValue(value: string): void {
    this.ref.nativeElement.value = value;
    this.inputValue$.next(this.ref.nativeElement.value);
  }

  private loadEntries(): void {
    this.entries$ = this.items.get().pipe(
      mergeMap(groups => this.inputValue$.pipe(
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
