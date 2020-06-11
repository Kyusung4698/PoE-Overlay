import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketInputComponent } from './market-input.component';

describe('MarketInputComponent', () => {
  let component: MarketInputComponent;
  let fixture: ComponentFixture<MarketInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
