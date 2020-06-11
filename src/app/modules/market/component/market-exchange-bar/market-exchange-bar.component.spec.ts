import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MarketExchangeBarComponent } from './market-exchange-bar.component';


describe('MarketExchangeBarComponent', () => {
  let component: MarketExchangeBarComponent;
  let fixture: ComponentFixture<MarketExchangeBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketExchangeBarComponent],
      imports: [
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
    fixture = TestBed.createComponent(MarketExchangeBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
