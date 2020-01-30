import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { AcceleratorComponent } from './accelerator.component';


describe('AcceleratorComponent', () => {
  let component: AcceleratorComponent;
  let fixture: ComponentFixture<AcceleratorComponent>;

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
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceleratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
