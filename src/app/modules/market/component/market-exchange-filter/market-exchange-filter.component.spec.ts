import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MarketExchangeFilterComponent } from './market-exchange-filter.component';


describe('MarketExchangeFilterComponent', () => {
  let component: MarketExchangeFilterComponent;
  let fixture: ComponentFixture<MarketExchangeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketExchangeFilterComponent],
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => new TranslateFakeLoader()
          }
        })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketExchangeFilterComponent);
    component = fixture.componentInstance;
    component.request = {
      exchange: {
        have: [],
        want: []
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
