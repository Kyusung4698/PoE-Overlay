import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { AcceleratorComponent } from './component/accelerator/accelerator.component';

@NgModule({
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatCardModule
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
    // custom
    AcceleratorComponent
  ],
  declarations: [AcceleratorComponent]
})
export class MaterialModule { }
