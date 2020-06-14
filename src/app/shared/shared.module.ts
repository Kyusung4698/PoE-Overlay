import { CommonModule as NgCommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AreaChartModule, BarChartModule } from '@swimlane/ngx-charts';
import { AnnotationModule } from './module/annotation/annotation.module';
import { CommonModule } from './module/common/common.module';
import { MaterialModule } from './module/material/material.module';
import { OdkModule } from './module/odk/odk.module';
import { PoeModule } from './module/poe/poe.module';

@NgModule({
    exports: [
        // default
        NgCommonModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,

        // third party
        BarChartModule,
        AreaChartModule,
        TranslateModule,

        // modules
        PoeModule,
        OdkModule,
        MaterialModule,
        AnnotationModule,
        CommonModule
    ],
    declarations: []
})
export class SharedModule { }
