import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MarketListingStatusComponent } from './market-listing-status.component';


describe('MarketListingStatusComponent', () => {
  let component: MarketListingStatusComponent;
  let fixture: ComponentFixture<MarketListingStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketListingStatusComponent],
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
    fixture = TestBed.createComponent(MarketListingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
