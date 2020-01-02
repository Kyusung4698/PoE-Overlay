import { NgModule } from '@angular/core';
import { EvaluateModule } from '@modules/evaluate/evaluate.module';
import { SharedModule } from '@shared/shared.module';
import { AppComponent } from './app.component';
import { UserSettingsDialogComponent } from './layout/component/user-settings-dialog/user-settings-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    UserSettingsDialogComponent
  ],
  entryComponents: [
    UserSettingsDialogComponent
  ],
  imports: [
    // shared
    SharedModule,

    // app
    EvaluateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
