import { Injectable } from '@angular/core';
import { Hotkey } from '@app/config';
import { EventEmitter } from '@app/event';
import { ProcessStorageService, StorageService } from '@app/storage';
import { Observable, of } from 'rxjs';
import { flatMap, map, mergeMap } from 'rxjs/operators';
import { Annotation, AnnotationCondition, AnnotationConditionMap, AnnotationMap, AnnotationMessage } from './annotation';

const ANNOTATION_DATA_KEY = 'ANNOTATION_DATA';
const ANNOTATIONS: Annotation[] = [
    { id: 'welcome' },
    {
        id: 'settings',
        hotkey: Hotkey.SettingsToggle,
        expressions: [AnnotationCondition.SettingsOpen],
        children: [
            { id: 'game-settings' },
            { id: 'app-settings' },
            {
                id: 'close',
                hotkey: Hotkey.SettingsToggle,
                expressions: [AnnotationCondition.SettingsClose]
            }
        ]
    },
    {
        id: 'commands',
        hotkey: Hotkey.Command1,
        expressions: [AnnotationCondition.CommandExecuted],
        skippable: true
    },
    {
        id: 'market',
        hotkey: Hotkey.MarketToggle,
        expressions: [AnnotationCondition.MarketOpen],
        children: [
            { id: 'filter' },
            { id: 'search' },
            { id: 'reset' },
            {
                id: 'close',
                hotkey: Hotkey.MarketToggle,
                expressions: [AnnotationCondition.MarketClose]
            }
        ]
    },
    { id: 'trade.init' },
    { id: 'trade.incoming' },
    { id: 'trade.highlight' },
    { id: 'trade.outgoing' },
    { id: 'trade.settings' },
    {
        id: 'evaluate',
        hotkey: Hotkey.Evaluate,
        expressions: [AnnotationCondition.EvaluateOpen],
        children: [
            { id: 'properties' },
            { id: 'stats' },
            { id: 'price' },
            { id: 'search' },
            { id: 'options' },
            { id: 'settings' },
            { id: 'close', expressions: [AnnotationCondition.EvaluateClose] }
        ]
    },
    {
        id: 'inspect',
        hotkey: Hotkey.Inspect,
        expressions: [AnnotationCondition.InspectOpen],
        children: [
            { id: 'loot' },
            { id: 'urls' },
            { id: 'settings' },
            { id: 'close', expressions: [AnnotationCondition.InspectClose] }
        ]
    },
    {
        id: 'replay',
        hotkey: Hotkey.SettingsToggle
    },
    {
        id: 'misc',
        hotkey: Hotkey.MiscStashHighlight,
        expressions: [AnnotationCondition.MiscStashHighlightExecuted],
        skippable: true,
    },
    {
        id: 'bookmarks',
        hotkey: Hotkey.Bookmark1,
        expressions: [AnnotationCondition.BookmarkOpened],
        skippable: true
    },
    {
        id: 'support',
        hotkey: Hotkey.SettingsToggle
    },
    { id: 'thanks' },
    { id: 'changelog-1-0-11' },
];

@Injectable({
    providedIn: 'root'
})
export class AnnotationService {
    private get conditions(): AnnotationConditionMap {
        return this.processStorage.get(`${ANNOTATION_DATA_KEY}_CONDITIONS`, () => ({}));
    }

    constructor(
        private readonly processStorage: ProcessStorageService,
        private readonly storage: StorageService) { }

    public get message$(): EventEmitter<AnnotationMessage> {
        return this.processStorage.get(`${ANNOTATION_DATA_KEY}_MESSAGE`, () => new EventEmitter<AnnotationMessage>());
    }

    public init(): Observable<void> {
        return this.getAnnotations().pipe(
            mergeMap(annotations => {
                this.updateMessage(annotations, false);
                return this.updateAnnotations(annotations);
            })
        );
    }

    public continue(): Observable<void> {
        return this.getAnnotations().pipe(
            mergeMap(annotations => {
                this.updateMessage(annotations, true);
                return this.updateAnnotations(annotations);
            })
        );
    }

    public skip(): Observable<void> {
        return this.getAnnotations().pipe(
            mergeMap(annotations => {
                for (const annotation of ANNOTATIONS) {
                    if (annotation.id === 'thanks' || annotation.id.startsWith('changelog')) {
                        continue;
                    }
                    annotations[annotation.id] = true;
                }
                this.updateMessage(annotations, false);
                return this.updateAnnotations(annotations);
            })
        );
    }

    public update(condition: AnnotationCondition, value: boolean): Observable<void> {
        return this.getAnnotations().pipe(
            mergeMap(annotations => {
                this.conditions[condition] = value;
                this.updateMessage(annotations, false);
                return this.updateAnnotations(annotations);
            })
        );
    }

    private updateMessage(annotations: AnnotationMap, next: boolean): void {
        for (const annotation of ANNOTATIONS) {
            if (annotations[annotation.id]) {
                continue;
            }

            if (annotation.expressions) {
                if (annotation.expressions.some(x => !this.conditions[x])) {
                    if (!(annotation.skippable && next)) {
                        return this.setMessage(annotation);
                    }
                }
                if (!annotation.children) {
                    next = true;
                }
            }

            if (annotation.children) {
                for (const child of annotation.children) {
                    const id = `${annotation.id}.${child.id}`;
                    if (annotations[id]) {
                        continue;
                    }

                    if (child.expressions) {
                        if (child.expressions.some(x => !this.conditions[x])) {
                            if (!(child.skippable && next)) {
                                return this.setMessage(child, id);
                            }
                        }
                        next = false;
                        annotations[id] = true;
                    } else {
                        if (next) {
                            next = false;
                            annotations[id] = true;
                        } else {
                            return this.setMessage(child, id);
                        }
                    }
                }
                // next annotation if all children have been annotated
                next = true;
            }

            if (next) {
                next = false;
                annotations[annotation.id] = true;
            } else {
                return this.setMessage(annotation);
            }
        }
        return this.clearMessage();
    }

    private getAnnotations(): Observable<AnnotationMap> {
        return of(null).pipe(
            mergeMap(() => this.storage.get<AnnotationMap>(`${ANNOTATION_DATA_KEY}_ANNOTATIONS`)),
            map(value => value || {})
        );
    }

    private updateAnnotations(annotations: AnnotationMap): Observable<void> {
        return this.storage.put(`${ANNOTATION_DATA_KEY}_ANNOTATIONS`, annotations).pipe(
            map(() => null)
        );
    }

    private clearMessage(): void {
        this.message$.next(undefined);
    }

    private setMessage(annotation: Annotation, id?: string): void {
        this.message$.next({
            id: id || annotation.id,
            title: `annotation.${id || annotation.id}.title`,
            message: `annotation.${id || annotation.id}.message`,
            skippable: annotation.skippable || !annotation.expressions?.length,
            hotkey: annotation.hotkey
        });
    }
}
