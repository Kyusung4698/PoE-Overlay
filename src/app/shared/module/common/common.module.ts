import { NgModule } from '@angular/core';
import { TruncateTextPipe } from './pipe';
import { TimerPipe } from './pipe/timer.pipe';

const PIPES = [
    TruncateTextPipe,
    TimerPipe
];

@NgModule({
    imports: [
    ],
    exports: [
        ...PIPES
    ],
    declarations: [
        ...PIPES
    ]
})
export class CommonModule { }
