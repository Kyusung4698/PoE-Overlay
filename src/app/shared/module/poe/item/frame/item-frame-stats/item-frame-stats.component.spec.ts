import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Language } from '@data/poe/schema';
import { StatGroupPipe, StatTransformPipe } from '../../stat';
import { ItemFrameStatsComponent } from './item-frame-stats.component';


describe('ItemFrameStatsComponent', () => {
  let component: ItemFrameStatsComponent;
  let fixture: ComponentFixture<ItemFrameStatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ],
      declarations: [
        ItemFrameStatsComponent,
        StatGroupPipe,
        StatTransformPipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFrameStatsComponent);
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
