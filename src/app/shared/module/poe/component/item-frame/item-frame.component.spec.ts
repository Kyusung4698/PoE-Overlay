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
  secondaryDescription: `Wendet eine Stärkung an, die Eure Rüstung verstärkt und die einen Teil des
      erlittenen Schadens von Treffern für Euch absorbieren kann, bevor sie verbraucht ist. Wenn die
      Stärkung ausläuft oder verbraucht ist, verursacht die Fertigkeit bei Gegnern im Umkreis
      reflektierten Schaden, der auf dem Gesamtschaden basiert, der von der Stärkung absorbiert wurde.
      Teilt sich eine Abklingzeit mit anderen Wächter-Fertigkeiten.`,
  explicits: [],
  description: `Setze die Gemme in eine Fassung mit der richtigen Farbe ein,
                um diese Fertigkeit zu erhalten. Entferne sie mit Rechtsklick aus der Fassung.`,
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
