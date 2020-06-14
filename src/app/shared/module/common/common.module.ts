import { NgModule } from '@angular/core';
import { TruncateTextPipe } from './pipe';

const PIPES = [
    TruncateTextPipe
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
