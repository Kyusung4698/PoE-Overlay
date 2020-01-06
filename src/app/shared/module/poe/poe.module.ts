import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CurrencyFrameComponent } from './component/currency-frame/currency-frame.component';
import { ItemFrameComponent } from './component/item-frame/item-frame.component';
import { BaseItemTypePipe } from './pipe/base-item-type.pipe';
import { ClientStringPipe } from './pipe/client-string.pipe';
import { StatsDescriptionPipe } from './pipe/stats-description.pipe';
import { WordPipe } from './pipe/word.pipe';
import { ItemFrameQueryComponent } from './component/item-frame-query/item-frame-query.component';

@NgModule({
    declarations: [
        ItemFrameComponent,
        CurrencyFrameComponent,
        ClientStringPipe,
        StatsDescriptionPipe,
        WordPipe,
        BaseItemTypePipe,
        ItemFrameQueryComponent,
    ],
    imports: [
        BrowserModule
    ],
    exports: [
        ItemFrameComponent,
        CurrencyFrameComponent,
        ClientStringPipe,
        StatsDescriptionPipe,
        WordPipe,
        BaseItemTypePipe,
    ]
})
export class PoeModule { }
