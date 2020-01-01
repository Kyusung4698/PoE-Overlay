import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { EvaluateDialogComponent } from './evaluate-dialog.component';


describe('EvaluateDialogComponent', () => {
    let component: EvaluateDialogComponent;
    let fixture: ComponentFixture<EvaluateDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EvaluateDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // TODO: requires electron
    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
});
