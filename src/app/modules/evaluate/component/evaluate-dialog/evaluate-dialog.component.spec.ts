import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ElectronProvider } from '@app/provider';
import { ContextService } from '@shared/module/poe/service';
import { Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { EvaluateDialogComponent } from './evaluate-dialog.component';

class ElectronProviderFake {
    public provideRemote(): Electron.Remote {
        return null;
    }

    public provideIpcRenderer(): Electron.IpcRenderer {
        return null;
    }
}

describe('EvaluateDialogComponent', () => {
    let component: EvaluateDialogComponent;
    let fixture: ComponentFixture<EvaluateDialogComponent>;
    let contextService: ContextService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule],
            declarations: [EvaluateDialogComponent],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        language: Language.English,
                        type: '',
                    }
                },
                { provide: ElectronProvider, useClass: ElectronProviderFake }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EvaluateDialogComponent);

        contextService = TestBed.get<ContextService>(ContextService);
        contextService.init({
            language: Language.English
        });

        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
