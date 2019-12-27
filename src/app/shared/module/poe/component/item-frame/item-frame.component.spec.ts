import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Item, ItemRarity } from '../../type';
import { ItemFrameComponent } from './item-frame.component';

const gem: Item = {
  rarity: ItemRarity.Gem,
  nameType: 'Lavaschilde',
  type: 'Lavaschilde',
  properties: [
    {
      text: 'Zauber, Wirkungsbereich, Dauer, Feuer, Physisch, Wächter'
    },
    {
      text: 'Stufe: 16',
    },
    {
      text: 'Manakosten: 11',
    },
    {
      text: 'Abklingzeit: 4.00 Sek',
    },
    {
      text: 'Zauberzeit: Sofort',
    }
  ],
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
  explicits: [
    {
      text: 'Basisdauer beträgt 3.00 Sekunden',
    },
    {
      text: '599 zusätzliche Rüstung',
    },
    {
      text: 'Die Abklingzeit dieser Fertigkeit stellt sich während ihres Effekts nicht wieder her',
    },
    {
      text: `75% des Trefferschadens werden zuerst von der Stärkung abgezogen
          statt von Eurem Leben oder Energieschild Stärkung kann Schaden entsprechend 20% Eurer Rüstung
          erleiden, bis zu einem Maximum von 10000`,
    },
    {
      text: `Reflektiert 2040% des erlittenen Schadens der Stärkung als
          Feuerschaden, wenn die Stärkung ausläuft oder verbraucht ist`,
    }
  ],
  description: `Setze die Gemme in eine Fassung mit der richtigen Farbe ein,
                um diese Fertigkeit zu erhalten. Entferne sie mit Rechtsklick aus der Fassung.`,
};


describe('ItemFrameComponent', () => {
  let component: ItemFrameComponent;
  let fixture: ComponentFixture<ItemFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemFrameComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFrameComponent);
    component = fixture.componentInstance;
    component.item = gem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
