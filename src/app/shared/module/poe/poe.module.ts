import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CurrencyFrameComponent } from './component/currency-frame/currency-frame.component';
import { ItemFrameQueryComponent } from './component/item-frame-query/item-frame-query.component';
import { ItemFrameValueGroupComponent } from './component/item-frame-value-group/item-frame-value-group.component';
import { ItemFrameValueComponent } from './component/item-frame-value/item-frame-value.component';
import { ItemFrameComponent } from './component/item-frame/item-frame.component';
import { BaseItemTypePipe } from './pipe/base-item-type.pipe';
import { ClientStringPipe } from './pipe/client-string.pipe';
import { StatGroupPipe } from './pipe/stat-group.pipe';
import { StatTransformPipe } from './pipe/stat-transform.pipe';
import { WordPipe } from './pipe/word.pipe';

@NgModule({
    declarations: [
        ItemFrameComponent,
        CurrencyFrameComponent,
        ClientStringPipe,
        StatGroupPipe,
        StatTransformPipe,
        WordPipe,
        BaseItemTypePipe,
        ItemFrameQueryComponent,
        ItemFrameValueComponent,
        ItemFrameValueGroupComponent,
    ],
    imports: [
        BrowserModule
    ],
    exports: [
        ItemFrameComponent,
        CurrencyFrameComponent,
        ClientStringPipe,
        WordPipe,
        BaseItemTypePipe
    ]
})
export class PoeModule { }
