import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SettingsFeatureContainerComponent, SettingsFormComponent, SettingsHelpComponent } from './component';
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
        SettingsHelpComponent,
        AnnotationWindowComponent,
    ],
    exports: [
        ...WINDOWS
    ],
    imports: [SharedModule],
})
export class LayoutModule { }
