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
            }
        ];
    }

    public run(feature: string): void {
        switch (feature) {
            case 'evaluate':
                this.evaluateService.evaluate().toPromise();
                break;
            default:
                break;
        }
    }
}
