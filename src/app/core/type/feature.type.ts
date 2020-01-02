export interface Feature {
    name: string;
    defaultShortcut: string;
}

export interface FeatureModule {
    getFeatures(): Feature[];
    run(feature: string): void;
}
