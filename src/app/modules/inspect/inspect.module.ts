import { NgModule } from '@angular/core';
import { Hotkey } from '@app/config';
import { Feature, FeatureConfig, FeatureModule, FEATURE_MODULES } from '@app/feature';
import { SharedModule } from '@shared/shared.module';
import { InspectSettingsComponent } from './component';
import { InspectItemComponent } from './component/inspect-item/inspect-item.component';
import { InspectLinksComponent } from './component/inspect-links/inspect-links.component';
import { InspectMapComponent } from './component/inspect-map/inspect-map.component';
import { InspectFeatureSettings } from './inspect-feature-settings';
import { InspectService } from './service';
import { InspectWindowComponent } from './window';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: InspectModule, multi: true }],
    declarations: [
        InspectSettingsComponent,
        InspectWindowComponent,
        InspectMapComponent,
        InspectLinksComponent,
        InspectItemComponent
    ],
    exports: [InspectWindowComponent],
    imports: [SharedModule]
})
export class InspectModule implements FeatureModule<InspectFeatureSettings> {
    constructor(private readonly inspectService: InspectService) { }

    public getConfig(): FeatureConfig<InspectFeatureSettings> {
        const config: FeatureConfig<InspectFeatureSettings> = {
            name: 'inspect.name',
            component: InspectSettingsComponent,
            default: {
                inspectMapStatWarning: {
                    map_player_base_chaos_damage_taken_per_minute: true,
                    map_player_has_level_X_temporal_chains: true,
                    map_player_no_regeneration: true,
                    'map_monsters_life_leech_resistance_%': true,
                    'map_monsters_mana_leech_resistance_%': true,
                    'map_monsters_reflect_%_physical_damage': true,
                    'map_monsters_reflect_%_elemental_damage': true,
                    'map_monsters_%_physical_damage_to_add_as_fire': true,
                    'map_monsters_%_physical_damage_to_add_as_cold': true,
                    'map_monsters_%_physical_damage_to_add_as_lightning': true,
                    map_monsters_reflect_curses: true,
                    map_players_no_regeneration_including_es: true,
                    'map_players_and_monsters_chaos_damage_taken_+%': true,
                    'map_players_and_monsters_cold_damage_taken_+%': true,
                    'map_players_and_monsters_fire_damage_taken_+%': true,
                    'map_players_and_monsters_lightning_damage_taken_+%': true,
                    'map_players_and_monsters_physical_damage_taken_+%': true
                }
            },
        };
        return config;
    }

    public getFeatures(): Feature[] {
        const features: Feature[] = [
            {
                hotkey: Hotkey.Inspect
            }
        ];
        return features;
    }

    public onKeyPressed(hotkey: Hotkey, settings: InspectFeatureSettings): void {
        switch (hotkey) {
            case Hotkey.Inspect:
                this.inspectService.inspect(settings).subscribe();
                break;
            default:
                throw new Error(`Hotkey: '${hotkey}' out of range.`);
        }
    }
}
