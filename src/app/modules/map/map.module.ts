import { NgModule, Injectable } from '@angular/core';
import { FEATURE_MODULES } from '@app/token';
import { Feature, FeatureModule } from '@app/type';
import { SharedModule } from '@shared/shared.module';
import { UserSettingsFeature } from 'src/app/layout/type';
import { MapDialogComponent } from './component/map-dialog/map-dialog.component';
import { MapSettingsComponent, MapUserSettings } from './component/map-settings/map-settings.component';
import { MapService } from './service/map.service';

@Injectable()
@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: MapModule, multi: true }],
    declarations: [MapDialogComponent, MapSettingsComponent],
    entryComponents: [MapDialogComponent, MapSettingsComponent],
    imports: [SharedModule]
})
export class MapModule implements FeatureModule {

    constructor(private readonly mapService: MapService) {
    }

    public getSettings(): UserSettingsFeature {
        const defaultSettings: MapUserSettings = {
            mapInfoKeybinding: 'Alt + Q',
            mapInfoWarningStats: {
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
            },
        };
        return {
            name: 'map.name',
            component: MapSettingsComponent,
            defaultSettings
        };
    }

    public getFeatures(settings: MapUserSettings): Feature[] {
        const features: Feature[] = [
            {
                name: 'info',
                shortcut: settings.mapInfoKeybinding
            },
        ];
        return features;
    }

    public run(feature: string, settings: MapUserSettings): void {
        switch (feature) {
            case 'info':
                this.mapService.info(settings).subscribe();
                break;
            default:
                break;
        }
    }
}
