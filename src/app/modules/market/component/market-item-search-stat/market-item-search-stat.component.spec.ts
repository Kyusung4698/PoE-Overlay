import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { TradeStatsTypePipe } from '@shared/module/poe/trade';
import { MarketItemSearchStatComponent } from './market-item-search-stat.component';


describe('MarketItemSearchStatComponent', () => {
  let component: MarketItemSearchStatComponent;
  let fixture: ComponentFixture<MarketItemSearchStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketItemSearchStatComponent, TradeStatsTypePipe],
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketItemSearchStatComponent);
    component = fixture.componentInstance;
    component.stat = {
      id: '',
      text: '',
      type: ''
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
