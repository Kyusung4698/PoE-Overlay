import { FeatureSettings } from '@app/feature';
import { Hotkey } from '@app/config';

export interface Command {
    text: string;
    hotkey: Hotkey;
}

export interface CommandsFeatureSettings extends FeatureSettings {
    commands: Command[];
}
