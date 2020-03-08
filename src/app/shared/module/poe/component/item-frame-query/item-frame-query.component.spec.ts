import { EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemFrameComponent } from '../item-frame/item-frame.component';
import { ItemFrameQueryComponent } from './item-frame-query.component';


describe('ItemFrameQueryComponent', () => {
  let component: ItemFrameQueryComponent;
  let fixture: ComponentFixture<ItemFrameQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemFrameQueryComponent],
      providers: [
        {
          provide: ItemFrameComponent, useValue: {
            queryItemChange: new EventEmitter(),
            onPropertyChange: () => {},
          }
        }
      ]
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
