import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ItemFrameQueryComponent } from '../item-frame-query/item-frame-query.component';
import { ItemFrameComponent } from '../item-frame/item-frame.component';
import { ItemFrameValueComponent } from './item-frame-value.component';


describe('ItemFrameValueComponent', () => {
  let component: ItemFrameValueComponent;
  let fixture: ComponentFixture<ItemFrameValueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ],
      declarations: [ItemFrameValueComponent],
      providers: [
        {
          provide: ItemFrameComponent, useValue: {
            queryItemChange: new EventEmitter()
          }
        },
        {
          provide: ItemFrameQueryComponent, useValue: {
            checkChange: () => null
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
      text: '0',
      value: 0
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
