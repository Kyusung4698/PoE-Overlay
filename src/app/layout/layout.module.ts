import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsDialogComponent, UserSettingsFeatureContainerComponent, UserSettingsFormComponent } from './component';
import { OverlayComponent } from './page/overlay/overlay.component';
import { UserSettingsComponent } from './page/user-settings/user-settings.component';

@NgModule({
    declarations: [
        // components
        UserSettingsDialogComponent,
        UserSettingsFeatureContainerComponent,
        UserSettingsFormComponent,
        // pages
        OverlayComponent,
        UserSettingsComponent
    ],
    entryComponents: [UserSettingsDialogComponent],
    imports: [SharedModule],
})
export class LayoutModule { }
