import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ItemFrameComponent } from '../item-frame/item-frame.component';
import { ItemFrameSocketsComponent } from './item-frame-sockets.component';


describe('ItemFrameSocketsComponent', () => {
    let component: ItemFrameSocketsComponent;
    let fixture: ComponentFixture<ItemFrameSocketsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                HttpClientModule,
                BrowserModule
            ],
            providers: [
                {
                    provide: ItemFrameComponent, useValue: {
                        onPropertyChange: () => { },
                    }
                }
            ]
        }).compileComponents();
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
