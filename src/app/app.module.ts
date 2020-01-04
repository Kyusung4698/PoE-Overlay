import { NgModule } from '@angular/core';
import { CommandModule } from '@modules/command/command.module';
import { EvaluateModule } from '@modules/evaluate/evaluate.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // layout
    LayoutModule,

    // app
    EvaluateModule,
    CommandModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
