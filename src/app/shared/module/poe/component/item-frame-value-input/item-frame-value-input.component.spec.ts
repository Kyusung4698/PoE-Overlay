import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFrameValueInputComponent } from './item-frame-value-input.component';

describe('ItemFrameValueInputComponent', () => {
  let component: ItemFrameValueInputComponent;
  let fixture: ComponentFixture<ItemFrameValueInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemFrameValueInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFrameValueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
