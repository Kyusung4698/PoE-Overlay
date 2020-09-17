import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Language } from '@data/poe/schema';
import { ContextService } from '@shared/module/poe/context';
import { Subject } from 'rxjs';
import { EvaluateItemPriceRateComponent } from './evaluate-item-price-rate.component';


describe('EvaluateItemPriceRateComponent', () => {
  let component: EvaluateItemPriceRateComponent;
  let fixture: ComponentFixture<EvaluateItemPriceRateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluateItemPriceRateComponent],
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ],
    }).compileComponents();

    const context = TestBed.inject<ContextService>(ContextService);
    context.update({
      language: Language.English,
      leagueId: 'Standard'
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateItemPriceRateComponent);
    component = fixture.componentInstance;
    component.optionsChange = new Subject();
    component.currencies = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
