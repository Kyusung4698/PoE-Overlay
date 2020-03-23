import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CurrencyFrameComponent } from './component/currency-frame/currency-frame.component';
import { ItemFrameHeaderComponent } from './component/item-frame-header/item-frame-header.component';
import { ItemFrameInfluencesComponent } from './component/item-frame-influences/item-frame-influences.component';
import { ItemFrameLevelRequirementsComponent } from './component/item-frame-level-requirements/item-frame-level-requirements.component';
import { ItemFramePropertiesComponent } from './component/item-frame-properties/item-frame-properties.component';
import { ItemFrameQueryComponent } from './component/item-frame-query/item-frame-query.component';
import { ItemFrameSeparatorComponent } from './component/item-frame-separator/item-frame-separator.component';
import { ItemFrameSocketsComponent } from './component/item-frame-sockets/item-frame-sockets.component';
import { ItemFrameStateComponent } from './component/item-frame-state/item-frame-state.component';
import { ItemFrameStatsComponent } from './component/item-frame-stats/item-frame-stats.component';
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
        ItemFrameHeaderComponent,
        ItemFrameSeparatorComponent,
        ItemFrameInfluencesComponent,
        ItemFramePropertiesComponent,
        ItemFrameSocketsComponent,
        ItemFrameLevelRequirementsComponent,
        ItemFrameStatsComponent,
        ItemFrameStateComponent,
    ],
    imports: [
        BrowserModule
    ],
    exports: [
        ItemFrameComponent,
        CurrencyFrameComponent,
        ClientStringPipe,
        WordPipe,
        BaseItemTypePipe,
        ItemFrameSeparatorComponent
    ]
})
export class PoeModule { }
