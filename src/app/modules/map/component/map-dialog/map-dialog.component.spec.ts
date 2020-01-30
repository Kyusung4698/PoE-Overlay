import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElectronProvider } from '@app/provider';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { MapDialogComponent } from './map-dialog.component';

class ElectronProviderFake {
  public provideRemote(): Electron.Remote {
    return null;
  }

  public provideIpcRenderer(): Electron.IpcRenderer {
    return null;
  }
}

describe('MapDialogComponent', () => {
  let component: MapDialogComponent;
  let fixture: ComponentFixture<MapDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapDialogComponent],
      imports: [
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => new TranslateFakeLoader()
          }
        })
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            item: {}
          }
        },
        { provide: ElectronProvider, useClass: ElectronProviderFake }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
