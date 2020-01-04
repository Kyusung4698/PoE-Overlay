import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsComponent, UserSettingsDialogComponent, UserSettingsFeatureContainerComponent } from './component';

@NgModule({
    declarations: [
        UserSettingsDialogComponent,
        UserSettingsFeatureContainerComponent,
        UserSettingsComponent
    ],
    entryComponents: [UserSettingsDialogComponent],
    imports: [SharedModule],
})
export class LayoutModule { }
