import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { MiscSettingsComponent } from './misc-settings.component';


describe('MiscSettingsComponent', () => {
  let component: MiscSettingsComponent;
  let fixture: ComponentFixture<MiscSettingsComponent>;

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
      declarations: [MiscSettingsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscSettingsComponent);
    component = fixture.componentInstance;
    component.settings = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
