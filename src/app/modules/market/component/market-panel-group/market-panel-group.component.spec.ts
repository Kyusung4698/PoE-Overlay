import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPanelGroupComponent } from './market-panel-group.component';

describe('MarketPanelGroupComponent', () => {
  let component: MarketPanelGroupComponent;
  let fixture: ComponentFixture<MarketPanelGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPanelGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPanelGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
