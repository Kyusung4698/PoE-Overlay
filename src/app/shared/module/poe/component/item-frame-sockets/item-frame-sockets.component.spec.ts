import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { ItemFrameComponent } from '../item-frame/item-frame.component';
import { ItemFrameSocketsComponent } from './item-frame-sockets.component';


describe('ItemFrameSocketsComponent', () => {
  let component: ItemFrameSocketsComponent;
  let fixture: ComponentFixture<ItemFrameSocketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [
        {
          provide: ItemFrameComponent, useValue: {
            onPropertyChange: () => { },
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFrameSocketsComponent);
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
