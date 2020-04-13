import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { Subject } from 'rxjs';
import { EvaluatePricePredictionComponent } from './evaluate-price-prediction.component';


describe('EvaluatePricePredictionComponent', () => {
  let component: EvaluatePricePredictionComponent;
  let fixture: ComponentFixture<EvaluatePricePredictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => new TranslateFakeLoader()
          }
        })
      ],
      declarations: [EvaluatePricePredictionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluatePricePredictionComponent);
    component = fixture.componentInstance;
    component.optionsChange = new Subject();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
