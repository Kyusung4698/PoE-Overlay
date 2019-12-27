import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CurrencyFrameComponent } from './component/currency-frame/currency-frame.component';
import { ItemFrameComponent } from './component/item-frame/item-frame.component';

@NgModule({
    declarations: [
        ItemFrameComponent,
        CurrencyFrameComponent
    ],
    imports: [
        BrowserModule
    ],
    exports: [
        ItemFrameComponent,
        CurrencyFrameComponent
    ]
})
export class PoeModule { }
