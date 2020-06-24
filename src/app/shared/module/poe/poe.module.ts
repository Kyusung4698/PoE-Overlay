import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AnnotationModule } from '../annotation/annotation.module';
import { CommonModule } from '../common/common.module';
import { ClientStringPipe } from './client-string';
import { BackgroundComponent } from './common';
import { CurrencyPipe } from './currency';
import { CurrencyFrameComponent } from './currency/frame';
import { BaseItemTypePipe } from './item/base-item-type';
import { ItemFrameComponent, ItemFrameHeaderComponent, ItemFrameInfluencesComponent, ItemFrameLevelRequirementsComponent, ItemFramePropertiesComponent, ItemFrameQueryComponent, ItemFrameSeparatorComponent, ItemFrameSocketsComponent, ItemFrameStateComponent, ItemFrameStatsComponent, ItemFrameValueComponent, ItemFrameValueGroupComponent, ItemFrameValueInputComponent } from './item/frame';
import { StatGroupPipe, StatTransformPipe } from './item/stat';
import { WordPipe } from './item/word';
import { TradeFetchItemPipe, TradeSearchTextPipe, TradeStatsPipe, TradeStatsTypePipe } from './trade';
import { TradeWhisperTitlePipe } from './trade/chat';
import { TradeExchangeTextPipe } from './trade/exchange';
import { TradeStaticFrameComponent, TradeStaticPipe } from './trade/statics';

const COMPONENTS = [
    ItemFrameComponent,
    ItemFrameSeparatorComponent,
    CurrencyFrameComponent,
    TradeStaticFrameComponent,
    BackgroundComponent
];

const PIPES = [
    TradeStatsPipe,
    TradeStatsTypePipe,
    TradeFetchItemPipe,
    TradeWhisperTitlePipe,
    TradeSearchTextPipe,
    TradeExchangeTextPipe
];

@NgModule({
    declarations: [
        ...COMPONENTS,
        ItemFrameHeaderComponent,
        ItemFrameSocketsComponent,
        ItemFrameQueryComponent,
        ItemFrameInfluencesComponent,
        ItemFrameStateComponent,
        ItemFrameLevelRequirementsComponent,
        ItemFrameValueComponent,
        ItemFrameValueGroupComponent,
        ItemFrameValueInputComponent,
        ItemFramePropertiesComponent,
        ItemFrameStatsComponent,

        ...PIPES,
        ClientStringPipe,
        BaseItemTypePipe,
        WordPipe,
        StatGroupPipe,
        StatTransformPipe,
        CurrencyPipe,
        TradeStaticPipe,
    ],
    imports: [NgCommonModule, CommonModule, AnnotationModule],
    exports: [...COMPONENTS, ...PIPES]
})
export class PoeModule { }
