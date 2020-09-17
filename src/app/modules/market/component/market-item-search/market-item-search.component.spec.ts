import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Language } from '@data/poe/schema';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ContextService } from '@shared/module/poe/context';
import { MarketItemSearchComponent } from './market-item-search.component';


describe('MarketItemSearchComponent', () => {
  let component: MarketItemSearchComponent;
  let fixture: ComponentFixture<MarketItemSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MarketItemSearchComponent],
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

    const context = TestBed.inject<ContextService>(ContextService);
    context.update({
      language: Language.English,
      leagueId: 'Standard'
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketItemSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
