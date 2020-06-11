import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketInputNumberComponent } from './market-input-number.component';

describe('MarketInputNumberComponent', () => {
  let component: MarketInputNumberComponent;
  let fixture: ComponentFixture<MarketInputNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketInputNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketInputNumberComponent);
    component = fixture.componentInstance;
    component.request = {
      query: {

      },
      sort: {

      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
