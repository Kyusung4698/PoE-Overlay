import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFrameQueryComponent } from './item-frame-query.component';

describe('ItemFrameQueryComponent', () => {
  let component: ItemFrameQueryComponent;
  let fixture: ComponentFixture<ItemFrameQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemFrameQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFrameQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
