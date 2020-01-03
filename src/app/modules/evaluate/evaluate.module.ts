import { NgModule } from '@angular/core';
import { FEATURE_MODULES } from '@app/token';
import { Feature, FeatureModule } from '@app/type';
import { SharedModule } from '@shared/shared.module';
import { EvaluateDialogComponent } from './component/evaluate-dialog/evaluate-dialog.component';
import { EvaluateService } from './service/evaluate.service';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: EvaluateModule, multi: true }],
    declarations: [EvaluateDialogComponent],
    entryComponents: [EvaluateDialogComponent],
    imports: [SharedModule]
})
export class EvaluateModule implements FeatureModule {

    constructor(private readonly evaluateService: EvaluateService) {
    }

    public getFeatures(): Feature[] {
        return [
            {
                name: 'evaluate',
                defaultShortcut: 'CommandOrControl+D'
            },
            {
                name: 'evaluate-english',
                defaultShortcut: 'CommandOrControl+F'
            }
        ];
    }

    public run(feature: string): void {
        switch (feature) {
            case 'evaluate':
                this.evaluateService.evaluate().subscribe();
                break;
            case 'evaluate-english':
                this.evaluateService.evaluateEnglish().subscribe();
                break;
            default:
                break;
        }
    }
}
