import { NgModule } from '@angular/core';
import { AnnotationDirective } from './directive';

const DIRECTIVES = [
    AnnotationDirective
];


@NgModule({
    imports: [
    ],
    exports: [
        ...DIRECTIVES
    ],
    declarations: [
        ...DIRECTIVES
    ]
})
export class AnnotationModule { }
