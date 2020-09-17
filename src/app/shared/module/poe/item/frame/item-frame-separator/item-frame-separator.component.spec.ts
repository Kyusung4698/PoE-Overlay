import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ItemFrameSeparatorComponent } from './item-frame-separator.component';


describe('ItemFrameSeparatorComponent', () => {
  let component: ItemFrameSeparatorComponent;
  let fixture: ComponentFixture<ItemFrameSeparatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFrameSeparatorComponent);
    component = fixture.componentInstance;
    component.item = {
      influences: {},
      damage: {},
      stats: [],
      properties: {},
      requirements: {},
      sockets: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
