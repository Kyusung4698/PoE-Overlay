import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommandModule } from '@modules/command/command.module';
import { EvaluateModule } from '@modules/evaluate/evaluate.module';
import { AppComponent } from './app.component';
import { UserSettingsDialogComponent } from './layout/component';
import { LayoutModule } from './layout/layout.module';
import { UserSettingsComponent } from './layout/page/user-settings/user-settings.component';
import { OverlayComponent } from './layout/page/overlay/overlay.component';

const routes: Routes = [
  {
    path: 'user-settings',
    component: UserSettingsComponent,
  },
  {
    path: '**',
    component: OverlayComponent
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    // routing
    RouterModule.forRoot(routes, {
      useHash: true
    }),

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
