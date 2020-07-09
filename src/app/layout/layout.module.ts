import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SettingsFeatureContainerComponent, SettingsFormComponent, SettingsSupportComponent } from './component';
import { AnnotationWindowComponent, BackgroundWindowComponent, LauncherWindowComponent, NotificationWindowComponent, SettingsWindowComponent } from './window';

const WINDOWS = [
    BackgroundWindowComponent,
    SettingsWindowComponent,
    NotificationWindowComponent,
    LauncherWindowComponent,
    AnnotationWindowComponent
];

@NgModule({
    declarations: [
        ...WINDOWS,
        SettingsFeatureContainerComponent,
        SettingsFormComponent,
        AnnotationWindowComponent,
        SettingsSupportComponent,
    ],
    exports: [
        ...WINDOWS
    ],
    imports: [SharedModule],
})
export class LayoutModule { }
