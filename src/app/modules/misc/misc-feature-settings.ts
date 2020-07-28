import { FeatureSettings } from '@app/feature';


export enum MiscNavigation {
    Disabled = 0,
    Normal = 1,
    Inverse = 2
}

export interface MiscFeatureSettings extends FeatureSettings {
    miscNavigation: MiscNavigation;
}
