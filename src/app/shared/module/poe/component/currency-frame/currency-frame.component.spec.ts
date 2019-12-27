import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyFrameComponent } from './currency-frame.component';

describe('CurrencyFrameComponent', () => {
  let component: CurrencyFrameComponent;
  let fixture: ComponentFixture<CurrencyFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
