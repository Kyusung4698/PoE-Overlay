import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectronProvider } from '@app/provider';
import { SharedModule } from '@shared/shared.module';
import { EvaluateSettingsComponent } from './evaluate-settings.component';

class ElectronProviderFake {
  public provideRemote(): Electron.Remote {
    return null;
  }

  public provideIpcRenderer(): Electron.IpcRenderer {
    return null;
  }
}

describe('EvaluateSettingsComponent', () => {
  let component: EvaluateSettingsComponent;
  let fixture: ComponentFixture<EvaluateSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluateSettingsComponent],
      imports: [SharedModule],
      providers: [
        { provide: ElectronProvider, useClass: ElectronProviderFake }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateSettingsComponent);
    component = fixture.componentInstance;
    component.settings = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
