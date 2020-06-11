import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { EvaluateItemPriceRateValuesComponent } from './evaluate-item-price-rate-values.component';


describe('EvaluateItemPriceRateValuesComponent', () => {
  let component: EvaluateItemPriceRateValuesComponent;
  let fixture: ComponentFixture<EvaluateItemPriceRateValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluateItemPriceRateValuesComponent],
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
    fixture = TestBed.createComponent(EvaluateItemPriceRateValuesComponent);
    component = fixture.componentInstance;
    component.rate = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
