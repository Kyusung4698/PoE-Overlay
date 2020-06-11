import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateItemSearchTableComponent } from './evaluate-item-search-table.component';

describe('EvaluateItemSearchTableComponent', () => {
  let component: EvaluateItemSearchTableComponent;
  let fixture: ComponentFixture<EvaluateItemSearchTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateItemSearchTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateItemSearchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
