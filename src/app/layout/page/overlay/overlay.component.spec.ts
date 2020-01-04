import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectronProvider } from '@app/provider';
import { FEATURE_MODULES } from '@app/token';
import { SharedModule } from '@shared/shared.module';
import { OverlayComponent } from './overlay.component';

class ElectronProviderFake {
  public provideRemote(): Electron.Remote {
    return null;
  }

  public provideIpcRenderer(): Electron.IpcRenderer {
    return null;
  }
}

describe('OverlayComponent', () => {
  let component: OverlayComponent;
  let fixture: ComponentFixture<OverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [OverlayComponent],
      providers: [
        {
          provide: FEATURE_MODULES,
          useValue: []
        },
        { provide: ElectronProvider, useClass: ElectronProviderFake }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
