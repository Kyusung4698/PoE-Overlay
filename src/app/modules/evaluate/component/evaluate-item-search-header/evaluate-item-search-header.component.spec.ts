import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateItemSearchHeaderComponent } from './evaluate-item-search-header.component';

describe('EvaluateItemSearchHeaderComponent', () => {
  let component: EvaluateItemSearchHeaderComponent;
  let fixture: ComponentFixture<EvaluateItemSearchHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateItemSearchHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateItemSearchHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
