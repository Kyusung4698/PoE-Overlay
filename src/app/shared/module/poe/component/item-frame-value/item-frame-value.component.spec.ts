import { EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemFrameComponent } from '../item-frame/item-frame.component';
import { ItemFrameValueComponent } from './item-frame-value.component';


describe('ItemFrameValueComponent', () => {
  let component: ItemFrameValueComponent;
  let fixture: ComponentFixture<ItemFrameValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemFrameValueComponent],
      providers: [
        {
          provide: ItemFrameComponent, useValue: {
            queryItemChange: new EventEmitter(),
            onValueChange: () => { },
          }
        }
      ]
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
