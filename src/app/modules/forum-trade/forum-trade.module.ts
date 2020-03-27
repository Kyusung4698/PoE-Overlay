import {Feature, FeatureModule} from '@app/type';
import {UserSettings, UserSettingsFeature} from '../../layout/type';
import {ForumTradeSettings, ForumTradeSettingsComponent, LoginType} from './component';
import {NgModule} from '@angular/core';
import {FEATURE_MODULES} from '@app/token';
import {SharedModule} from '@shared/shared.module';

@NgModule({
  providers: [{provide:FEATURE_MODULES, useClass: ForumTradeModule, multi:true}],
  declarations: [ForumTradeSettingsComponent],
  imports: [SharedModule]
})
export class ForumTradeModule implements FeatureModule {
  getFeatures(settings: UserSettings): Feature[] {
    return [];
  }

  getSettings(): UserSettingsFeature {
    const defaultSettings: ForumTradeSettings = {
      enabled: false,
      forumTread: '',
      loginType: LoginType.Account
    };
    return {
      name: 'trade.name',
      defaultSettings,
      component: ForumTradeSettingsComponent
    };
  }

  run(feature: string, settings: UserSettings): void {
  }
}
