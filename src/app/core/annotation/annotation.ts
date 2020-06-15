import { Hotkey } from '@app/config';

export enum AnnotationCondition {
    SettingsOpen,
    SettingsClose,
    MarketOpen,
    MarketClose,
    InspectOpen,
    InspectClose,
    EvaluateOpen,
    EvaluateClose,
    CommandExecuted,
    BookmarkOpened,
    MiscStashHighlightExecuted
}

export interface AnnotationConditionMap {
    [condition: number]: boolean;
}

export interface Annotation {
    id: string;
    hotkey?: Hotkey;
    children?: AnnotationChild[];
    expressions?: AnnotationCondition[];
    skippable?: boolean;
}

export interface AnnotationChild {
    id: string;
    hotkey?: Hotkey;
    expressions?: AnnotationCondition[];
    skippable?: boolean;
}

export interface AnnotationMap {
    [id: string]: boolean;
}

export interface AnnotationMessage {
    id: string;
    title: string;
    message: string;
    skippable: boolean;
    hotkey?: string;
}
