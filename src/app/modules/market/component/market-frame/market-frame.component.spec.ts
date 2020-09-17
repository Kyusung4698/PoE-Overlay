import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Language } from '@data/poe/schema';
import { ContextService } from '@shared/module/poe/context';
import { MarketFrameComponent } from './market-frame.component';


describe('MarketFrameComponent', () => {
  let component: MarketFrameComponent;
  let fixture: ComponentFixture<MarketFrameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ],
      declarations: [MarketFrameComponent]
    })
      .compileComponents();

    const context = TestBed.inject<ContextService>(ContextService);
    context.update({
      language: Language.English,
      leagueId: 'Standard'
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
