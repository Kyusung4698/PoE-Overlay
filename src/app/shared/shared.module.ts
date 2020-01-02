import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './module/material/material.module';
import { PoeModule } from './module/poe/poe.module';

@NgModule({
    exports: [
        // default
        CommonModule,
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,

        // modules
        MaterialModule,
        PoeModule,
    ]
})
export class SharedModule { }
