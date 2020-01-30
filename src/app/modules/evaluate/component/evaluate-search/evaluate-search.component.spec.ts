import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectronProvider } from '@app/provider';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ContextService } from '@shared/module/poe/service';
import { Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { BehaviorSubject } from 'rxjs';
import { EvaluateChartComponent } from '../evaluate-chart/evaluate-chart.component';
import { EvaluateSearchComponent } from './evaluate-search.component';

class ElectronProviderFake {
  public provideRemote(): Electron.Remote {
    return null;
  }

  public provideIpcRenderer(): Electron.IpcRenderer {
    return null;
  }
}

describe('EvaluateSearchComponent', () => {
  let component: EvaluateSearchComponent;
  let fixture: ComponentFixture<EvaluateSearchComponent>;
  let contextService: ContextService;

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
      declarations: [EvaluateSearchComponent, EvaluateChartComponent],
      providers: [
        { provide: ElectronProvider, useClass: ElectronProviderFake }
      ]
    })
      .compileComponents();

    contextService = TestBed.get<ContextService>(ContextService);
    contextService.init({
      language: Language.English
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateSearchComponent);
    component = fixture.componentInstance;
    component.settings = {} as any;
    component.queryItem = {};
    component.queryItemChange = new BehaviorSubject({});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
