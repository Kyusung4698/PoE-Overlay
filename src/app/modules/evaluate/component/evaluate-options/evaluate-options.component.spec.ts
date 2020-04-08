import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextService } from '@shared/module/poe/service';
import { Language } from '@shared/module/poe/type';
import { SharedModule } from '@shared/shared.module';
import { EvaluateOptionsComponent } from './evaluate-options.component';


describe('EvaluateOptionsComponent', () => {
  let component: EvaluateOptionsComponent;
  let fixture: ComponentFixture<EvaluateOptionsComponent>;
  let contextService: ContextService;

  beforeEach(((done) => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [EvaluateOptionsComponent]
    })
      .compileComponents();

    contextService = TestBed.inject<ContextService>(ContextService);
    contextService.init({
      language: Language.English
  }).subscribe(() => done());
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
