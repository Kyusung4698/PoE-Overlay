import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Language } from '@data/poe/schema';
import { ItemCategory } from '../../base-item-type';
import { ItemFramePropertiesComponent } from './item-frame-properties.component';

describe('ItemFramePropertiesComponent', () => {
  let component: ItemFramePropertiesComponent;
  let fixture: ComponentFixture<ItemFramePropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFramePropertiesComponent);
    component = fixture.componentInstance;
    component.item = {
      influences: {},
      damage: {},
      stats: [],
      properties: {},
      requirements: {},
      sockets: [],
      category: ItemCategory.Gem
    };
    component.queryItem = component.item;
    component.language = Language.English;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
