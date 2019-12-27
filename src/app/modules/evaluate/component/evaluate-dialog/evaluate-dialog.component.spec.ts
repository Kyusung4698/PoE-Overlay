import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateDialogComponent } from './evaluate-dialog.component';

describe('EvaluateDialogComponent', () => {
  let component: EvaluateDialogComponent;
  let fixture: ComponentFixture<EvaluateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
