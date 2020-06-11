import { FeatureSettings } from '@app/feature';

export interface ReplayFeatureSettings extends FeatureSettings {
    replayCaptureDeath?: boolean;
    replayCaptureDeathPastDuration?: number;
    replayCaptureDeathFutureDuration?: number;
    replayCaptureKill?: boolean;
    replayCaptureKillPastDuration?: number;
    replayCaptureKillFutureDuration?: number;
}
