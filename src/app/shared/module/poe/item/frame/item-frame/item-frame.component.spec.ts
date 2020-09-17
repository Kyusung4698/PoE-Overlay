import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Language } from '@data/poe/schema';
import { Item, ItemRarity } from '../../item';
import { ItemFrameComponent } from './item-frame.component';

const gem: Item = {
    rarity: ItemRarity.Gem
};


describe('ItemFrameComponent', () => {
    let component: ItemFrameComponent;
    let fixture: ComponentFixture<ItemFrameComponent>;

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
