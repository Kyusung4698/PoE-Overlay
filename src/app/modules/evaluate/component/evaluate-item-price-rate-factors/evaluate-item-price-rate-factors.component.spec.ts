import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { EvaluateItemPriceRateFactorsComponent } from './evaluate-item-price-rate-factors.component';


describe('EvaluateItemPriceRateFactorsComponent', () => {
  let component: EvaluateItemPriceRateFactorsComponent;
  let fixture: ComponentFixture<EvaluateItemPriceRateFactorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluateItemPriceRateFactorsComponent],
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
    fixture = TestBed.createComponent(EvaluateItemPriceRateFactorsComponent);
    component = fixture.componentInstance;
    component.rate = {

    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
