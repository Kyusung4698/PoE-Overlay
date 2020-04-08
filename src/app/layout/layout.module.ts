import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsDialogComponent, UserSettingsFeatureContainerComponent, UserSettingsFormComponent } from './component';
import { UserSettingsHelpComponent } from './component/user-settings-help/user-settings-help.component';
import { OverlayComponent } from './page/overlay/overlay.component';
import { UserSettingsComponent } from './page/user-settings/user-settings.component';
import { ResizeDirective } from './directive/resize.directive';

@NgModule({
    declarations: [
        // components
        UserSettingsDialogComponent,
        UserSettingsFeatureContainerComponent,
        UserSettingsFormComponent,
        UserSettingsHelpComponent,
        // pages
        OverlayComponent,
        UserSettingsComponent,
        ResizeDirective,
    ],
    imports: [SharedModule],
})
export class LayoutModule { }
