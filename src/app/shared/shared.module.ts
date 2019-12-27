import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from './module/material/material.module';
import { ItemFrameComponent } from './module/poe/component/item-frame/item-frame.component';
import { PoeModule } from './module/poe/poe.module';

@NgModule({
    exports: [
        // default
        CommonModule,

        // modules
        MaterialModule,
        PoeModule,
    ]
})
export class SharedModule { }
