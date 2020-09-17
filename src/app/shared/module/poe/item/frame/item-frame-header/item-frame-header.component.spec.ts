import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Language } from '@data/poe/schema';
import { ItemFrameHeaderComponent } from './item-frame-header.component';


describe('ItemFrameHeaderComponent', () => {
  let component: ItemFrameHeaderComponent;
  let fixture: ComponentFixture<ItemFrameHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFrameHeaderComponent);
    component = fixture.componentInstance;
    component.item = {
      influences: {},
      damage: {},
      stats: [],
      properties: {},
      requirements: {},
      sockets: []
    };
    component.queryItem = component.item;
    component.language = Language.English;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
