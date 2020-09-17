import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EvaluateItemSearchGraphComponent } from './evaluate-item-search-graph.component';


describe('EvaluateItemSearchGraphComponent', () => {
  let component: EvaluateItemSearchGraphComponent;
  let fixture: ComponentFixture<EvaluateItemSearchGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluateItemSearchGraphComponent]
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
