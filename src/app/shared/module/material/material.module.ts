import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { AcceleratorComponent } from './component/accelerator/accelerator.component';
import { SelectListComponent } from './component/select-list/select-list.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatListModule,
    MatExpansionModule,

    // third party
    TranslateModule,
  ],
  exports: [
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatExpansionModule,
    // custom
    AcceleratorComponent,
    SelectListComponent
  ],
  declarations: [AcceleratorComponent, SelectListComponent]
})
export class MaterialModule { }
