import { FeatureSettings } from '@app/feature';

export interface ReplayFeatureSettings extends FeatureSettings {
    replayCaptureManually?: boolean;
    replayCaptureManuallyPastDuration?: number;
    replayCaptureManuallyFutureDuration?: number;
    replayCaptureDeath?: boolean;
    replayCaptureDeathPastDuration?: number;
    replayCaptureDeathFutureDuration?: number;
    replayCaptureKill?: boolean;
    replayCaptureKillPastDuration?: number;
    replayCaptureKillFutureDuration?: number;
}
