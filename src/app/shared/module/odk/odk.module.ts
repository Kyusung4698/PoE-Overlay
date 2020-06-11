import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from './component';
import { ResizeDirective } from './directive';
import { HotkeyPipe, HotkeyUrlPipe } from './pipe';

const DIRECTIVES = [
    ResizeDirective
];

const PIPES = [
    HotkeyPipe,
    HotkeyUrlPipe,
];

const COMPONENTS = [
    HeaderComponent
];

@NgModule({
    declarations: [...DIRECTIVES, ...PIPES, ...COMPONENTS],
    imports: [CommonModule, MaterialModule],
    exports: [...DIRECTIVES, ...PIPES, ...COMPONENTS]
})
export class OdkModule { }
