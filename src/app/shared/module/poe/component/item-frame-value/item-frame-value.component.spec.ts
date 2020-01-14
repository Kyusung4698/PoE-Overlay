import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFrameValueComponent } from './item-frame-value.component';

describe('ItemFrameValueComponent', () => {
  let component: ItemFrameValueComponent;
  let fixture: ComponentFixture<ItemFrameValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemFrameValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFrameValueComponent);
    component = fixture.componentInstance;
    component.value = {
      text: '0'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
