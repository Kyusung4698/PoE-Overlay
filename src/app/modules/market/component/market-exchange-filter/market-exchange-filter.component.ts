import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TradeStaticGroup, TradeStaticsService } from '@shared/module/poe/trade';
import { TradeExchangeRequest } from '@shared/module/poe/trade/exchange';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-market-exchange-filter',
  templateUrl: './market-exchange-filter.component.html',
  styleUrls: ['./market-exchange-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketExchangeFilterComponent implements OnInit {
  private _request: TradeExchangeRequest;

  public groups$: Observable<TradeStaticGroup[]>;

  public haveCount$ = new BehaviorSubject<number>(0);
  public wantCount$ = new BehaviorSubject<number>(0);

  @Input()
  public highlightTerm: string;

  public get request(): TradeExchangeRequest {
    return this._request;
  }

  @Input()
  public set request(request: TradeExchangeRequest) {
    this._request = request;
    this.haveCount$.next(request.exchange.have.length);
    this.wantCount$.next(request.exchange.want.length);
  }

  constructor(private readonly statics: TradeStaticsService) { }

  public ngOnInit(): void {
    this.groups$ = this.statics.get();
  }
}
