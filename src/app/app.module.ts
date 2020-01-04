import { NgModule } from '@angular/core';
import { CommandModule } from '@modules/command/command.module';
import { EvaluateModule } from '@modules/evaluate/evaluate.module';
import { SharedModule } from '@shared/shared.module';
import { AppComponent } from './app.component';
import { UserSettingsComponent, UserSettingsDialogComponent, UserSettingsFeatureContainerComponent } from './layout/component';

@NgModule({
  declarations: [
    AppComponent,
    UserSettingsDialogComponent,
    UserSettingsFeatureContainerComponent,
    UserSettingsComponent
  ],
  entryComponents: [
    UserSettingsDialogComponent
  ],
  imports: [
    // shared
    SharedModule,

    // app
    EvaluateModule,
    CommandModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
