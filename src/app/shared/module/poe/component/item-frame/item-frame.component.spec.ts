import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@shared/shared.module';
import { Item, ItemRarity, Language } from '../../type';
import { ItemFrameComponent } from './item-frame.component';

const gem: Item = {
  rarity: ItemRarity.Gem,
  requirements: {
    level: 58,
    str: 130,
    dex: 90,
    int: 127
  },
  stats: [],
};


describe('ItemFrameComponent', () => {
  let component: ItemFrameComponent;
  let fixture: ComponentFixture<ItemFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFrameComponent);
    component = fixture.componentInstance;
    component.item = gem;
    component.queryItem = component.item;
    component.language = Language.English;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
