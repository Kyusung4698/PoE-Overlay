import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElectronProvider } from '@app/provider';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsDialogComponent } from './user-settings-dialog.component';

class ElectronProviderFake {
  public provideRemote(): Electron.Remote {
    return null;
  }

  public provideIpcRenderer(): Electron.IpcRenderer {
    return null;
  }
}

describe('UserSettingsDialogComponent', () => {
  let component: UserSettingsDialogComponent;
  let fixture: ComponentFixture<UserSettingsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [UserSettingsDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        { provide: ElectronProvider, useClass: ElectronProviderFake }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
