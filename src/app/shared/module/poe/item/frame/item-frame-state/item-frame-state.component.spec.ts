import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Language } from '@data/poe/schema';
import { ItemFrameStateComponent } from './item-frame-state.component';


describe('ItemFrameStateComponent', () => {
    let component: ItemFrameStateComponent;
    let fixture: ComponentFixture<ItemFrameStateComponent>;

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
        fixture = TestBed.createComponent(ItemFrameStateComponent);
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
