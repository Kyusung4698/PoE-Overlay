import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ItemFrameComponent } from '../item-frame/item-frame.component';
import { ItemFrameQueryComponent } from './item-frame-query.component';


describe('ItemFrameQueryComponent', () => {
  let component: ItemFrameQueryComponent;
  let fixture: ComponentFixture<ItemFrameQueryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ],
      declarations: [ItemFrameQueryComponent],
      providers: [
        {
          provide: ItemFrameComponent, useValue: {
            queryItemChange: new EventEmitter(),
            onPropertyChange: () => { },
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
