import { Feature, FeatureModule } from '@app/type';
import { UserSettingsFeature } from '../../layout/type';
import { ForumTradeSettingsComponent, ForumTradeUserSettings } from './component';
import { NgModule } from '@angular/core';
import { FEATURE_MODULES } from '@app/token';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  providers: [{provide: FEATURE_MODULES, useClass: ForumTradeModule, multi: true}],
  declarations: [ForumTradeSettingsComponent],
  imports: [SharedModule]
})
export class ForumTradeModule implements FeatureModule {
  getFeatures(settings: ForumTradeUserSettings): Feature[] {
    return [
      {
        name: 'price',
        accelerator: settings.priceKeyBinding
      }
    ];
  }

  getSettings(): UserSettingsFeature {
    const defaultSettings: ForumTradeUserSettings = {
      forumThread: '',
      priceKeyBinding: 'CmdOrCtrl + P',
      sessionId: ''
    };
    return {
      name: 'forum-trade.name',
      defaultSettings,
      component: ForumTradeSettingsComponent
    };
  }

  run(feature: string, settings: ForumTradeUserSettings): void {
  }
}
