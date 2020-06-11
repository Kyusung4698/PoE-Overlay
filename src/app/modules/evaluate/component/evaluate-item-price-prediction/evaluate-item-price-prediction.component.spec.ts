import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { EvaluateItemPricePredictionComponent } from './evaluate-item-price-prediction.component';


describe('EvaluateItemPricePredictionComponent', () => {
  let component: EvaluateItemPricePredictionComponent;
  let fixture: ComponentFixture<EvaluateItemPricePredictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluateItemPricePredictionComponent],
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateItemPricePredictionComponent);
    component = fixture.componentInstance;
    component.optionsChange = new Subject();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
