import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElectronProvider } from '@app/provider';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFeatureContainerComponent } from '../user-settings-feature-container/user-settings-feature-container.component';
import { UserSettingsFormComponent } from '../user-settings-form/user-settings-form.component';
import { UserSettingsDialogComponent } from './user-settings-dialog.component';

class ElectronProviderFake {
  public provideRemote(): Electron.Remote {
    return {
      getCurrentWindow: () => null,
    } as any as Electron.Remote;
  }

  public provideIpcRenderer(): Electron.IpcRenderer {
    return {
      once: () => null,
      send: () => null
    } as any as Electron.IpcRenderer;
  }
}

describe('UserSettingsDialogComponent', () => {
  let component: UserSettingsDialogComponent;
  let fixture: ComponentFixture<UserSettingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => new TranslateFakeLoader()
          }
        })
      ],
      declarations: [UserSettingsDialogComponent, UserSettingsFormComponent, UserSettingsFeatureContainerComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        { provide: ElectronProvider, useClass: ElectronProviderFake },

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsDialogComponent);
    component = fixture.componentInstance;
    component.settings = {};
    component.features = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
