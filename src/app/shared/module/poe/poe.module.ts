import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CurrencyFrameComponent } from './component/currency-frame/currency-frame.component';
import { ItemFrameComponent } from './component/item-frame/item-frame.component';
import { ClientStringPipe } from './pipe/client-string.pipe';
import { StatsDescriptionPipe } from './pipe/stats-description.pipe';

@NgModule({
    declarations: [
        ItemFrameComponent,
        CurrencyFrameComponent,
        ClientStringPipe,
        StatsDescriptionPipe
    ],
    imports: [
        BrowserModule
    ],
    exports: [
        ItemFrameComponent,
        CurrencyFrameComponent,
        ClientStringPipe,
        StatsDescriptionPipe
    ]
})
export class PoeModule { }
