import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketTabGroupComponent } from './market-tab-group.component';

describe('MarketTabGroupComponent', () => {
  let component: MarketTabGroupComponent;
  let fixture: ComponentFixture<MarketTabGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketTabGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketTabGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
