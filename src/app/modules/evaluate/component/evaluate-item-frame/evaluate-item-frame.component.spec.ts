import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EvaluateItemFrameComponent } from './evaluate-item-frame.component';


describe('EvaluateItemFrameComponent', () => {
  let component: EvaluateItemFrameComponent;
  let fixture: ComponentFixture<EvaluateItemFrameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluateItemFrameComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateItemFrameComponent);
    component = fixture.componentInstance;
    component.item = {};
    component.settings = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
