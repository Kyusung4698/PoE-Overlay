import { Hotkey } from '@app/config/hotkey';
import { GameEvent, InfoUpdatesEvent, RunningGameInfo } from '@app/odk';
import { Feature } from './feature';
import { FeatureConfig } from './feature-config';
import { FeatureSettings } from './feature-settings';

export interface FeatureModule<TSettings extends FeatureSettings> {
    getConfig(): FeatureConfig<TSettings>;
    getFeatures(): Feature[];
    onKeyPressed?(hotkey: Hotkey, settings: TSettings): void;
    onSettingsChange?(settings: TSettings): void;
    onGameEvent?(event: GameEvent | InfoUpdatesEvent, settings: TSettings): void;
    onInfo?(info: RunningGameInfo, settings: TSettings): void;
    onLogLineAdd?(line: string): void;
}
