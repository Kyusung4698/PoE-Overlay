import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MaterialModule } from './module/material/material.module';
import { PoeModule } from './module/poe/poe.module';

@NgModule({
    exports: [
        // default
        CommonModule,
        RouterModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,

        // third party
        NgxChartsModule,

        // modules
        MaterialModule,
        PoeModule,
    ]
})
export class SharedModule { }
