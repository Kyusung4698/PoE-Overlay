import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateItemSearchGraphComponent } from './evaluate-item-search-graph.component';

describe('EvaluateItemSearchGraphComponent', () => {
  let component: EvaluateItemSearchGraphComponent;
  let fixture: ComponentFixture<EvaluateItemSearchGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateItemSearchGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateItemSearchGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
