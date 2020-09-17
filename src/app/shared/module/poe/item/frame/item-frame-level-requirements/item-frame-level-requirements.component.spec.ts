import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Language } from '@data/poe/schema';
import { ItemFrameLevelRequirementsComponent } from './item-frame-level-requirements.component';


describe('ItemFrameLevelRequirementsComponent', () => {
    let component: ItemFrameLevelRequirementsComponent;
    let fixture: ComponentFixture<ItemFrameLevelRequirementsComponent>;

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
        fixture = TestBed.createComponent(ItemFrameLevelRequirementsComponent);
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
