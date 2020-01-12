import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CurrencyFrameComponent } from './component/currency-frame/currency-frame.component';
import { ItemFrameQueryComponent } from './component/item-frame-query/item-frame-query.component';
import { ItemFrameComponent } from './component/item-frame/item-frame.component';
import { BaseItemTypePipe } from './pipe/base-item-type.pipe';
import { ClientStringPipe } from './pipe/client-string.pipe';
import { StatGroupPipe } from './pipe/stat-group.pipe';
import { StatPipe } from './pipe/stat.pipe';
import { WordPipe } from './pipe/word.pipe';

@NgModule({
    declarations: [
        ItemFrameComponent,
        CurrencyFrameComponent,
        ClientStringPipe,
        StatPipe,
        StatGroupPipe,
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
        StatPipe,
        WordPipe,
        BaseItemTypePipe
    ]
})
export class PoeModule { }
