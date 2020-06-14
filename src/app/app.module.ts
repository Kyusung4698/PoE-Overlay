import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { BookmarksModule } from '@modules/bookmarks/bookmarks.module';
import { CommandsModule } from '@modules/commands/commands.module';
import { EvaluateModule } from '@modules/evaluate/evaluate.module';
import { InspectModule } from '@modules/inspect/inspect.module';
import { MarketModule } from '@modules/market/market.module';
import { MiscModule } from '@modules/misc/misc.module';
import { ReplayModule } from '@modules/replay/replay.module';
import { TradeModule } from '@modules/trade/trade.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppErrorHandler } from './app-error-handler';
import { AppTranslationsLoader } from './app-translation-loader';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        CommonModule,

        // translate
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useClass: AppTranslationsLoader }
        }),

        // layout
        LayoutModule,

        // app
        EvaluateModule,
        MarketModule,
        TradeModule,
        InspectModule,
        CommandsModule,
        ReplayModule,
        MiscModule,
        BookmarksModule
    ],
    providers: [{ provide: ErrorHandler, useClass: AppErrorHandler }],
    bootstrap: [AppComponent]
})
export class AppModule { }
