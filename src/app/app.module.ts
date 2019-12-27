import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EvaluateModule } from '@modules/evaluate/evaluate.module';
import { SharedModule } from '@shared/shared.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // shared
    SharedModule,

    // app
    EvaluateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
