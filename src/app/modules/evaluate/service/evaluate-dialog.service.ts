import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WindowService } from '@app/service';
import { DialogsService } from '@app/service/input/dialogs.service';
import { Point } from '@app/type';
import { StatsService } from '@shared/module/poe/service';
import { Item, Language, StatType } from '@shared/module/poe/type';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EvaluateDialogComponent, EvaluateDialogData } from '../component/evaluate-dialog/evaluate-dialog.component';
import { EvaluateUserSettings } from '../component/evaluate-settings/evaluate-settings.component';

const DIALOG_MIN_WIDTH = 400;
const DIALOG_LINE_HEIGHT = 19;
const DIALOG_DIVIDER_HEIGHT = 8;
const DIALOG_AVG_CHAR_WIDTH = 7.6;
const DIALOG_AVG_VALUE_WIDTH = 36;

@Injectable({
    providedIn: 'root'
})
export class EvaluateDialogService {
    constructor(
        private readonly dialog: MatDialog,
        private readonly window: WindowService,
        private readonly dialogs: DialogsService,
        private readonly stats: StatsService) {
    }

    public open(point: Point, item: Item, settings: EvaluateUserSettings, language?: Language): Observable<void> {
        const { width, height } = this.estimateBounds(item, language);

        const bounds = this.window.getBounds();
        const left = Math.min(Math.max(point.x - width * 0.5, bounds.x), bounds.x + bounds.width - width);
        const top = Math.min(Math.max(point.y - height * 0.5, bounds.y), bounds.y + bounds.height - height);

        const data: EvaluateDialogData = {
            item,
            settings,
            language,
        };

        this.window.enableInput();
        const dialogRef = this.dialog.open(EvaluateDialogComponent, {
            position: {
                left: `${left}px`,
                top: `${top}px`,
            },
            backdropClass: 'backdrop-clear',
            data
        });
        const close = dialogRef.close.bind(dialogRef);
        this.dialogs.add(close);
        return dialogRef.afterClosed().pipe(tap(() => {
            if (this.dialog.openDialogs.length === 0) {
                this.window.disableInput();
            }
            this.dialogs.remove(close);
        }));
    }

    private estimateBounds(item: Item, language: Language): { width: number, height: number } {
        let width = 4;  // padding
        let height = 4; // padding

        if (item.nameId) {
            height += 20;
        }
        if (item.typeId) {
            height += 33;
        }

        if (item.damage || item.properties) {
            if (item.damage) {
                if (item.damage.dps) {
                    height += DIALOG_LINE_HEIGHT;
                }
                if (item.damage.edps) {
                    height += DIALOG_LINE_HEIGHT;
                }
                if (item.damage.edps) {
                    height += DIALOG_LINE_HEIGHT;
                }
            }
            if (item.properties) {
                Object.getOwnPropertyNames(item.properties).forEach(key => {
                    if (item.properties[key]) {
                        height += DIALOG_LINE_HEIGHT;
                    }
                });
            }
            height += DIALOG_DIVIDER_HEIGHT;
        }

        if (item.level || item.requirements) {
            if (item.level) {
                height += DIALOG_LINE_HEIGHT;
            }
            if (item.requirements) {
                height += DIALOG_LINE_HEIGHT;
            }
            height += DIALOG_DIVIDER_HEIGHT;
        }

        if (item.sockets) {
            const length = item.sockets.length;
            const socketHeight = Math.floor((length + 1) / 2) * 34;
            const linkHeight = length >= 3
                ? Math.floor((length - 1) / 2) * 22
                : 0;
            height += socketHeight + linkHeight;
            height += DIALOG_DIVIDER_HEIGHT;
        }

        if (item.stats) {
            height += item.stats.reduce((a) => a + DIALOG_LINE_HEIGHT, 0);

            item.stats.forEach(stat => {
                const parts = this.stats.transform(stat, language);
                const count = parts.reduce((a, b) => a + b.length, 0);
                const size = count * DIALOG_AVG_CHAR_WIDTH + stat.values.length * DIALOG_AVG_VALUE_WIDTH;
                if (size >= width) {
                    width = size;
                }
            });

            const unique = {};
            item.stats.forEach(stat => unique[stat.type] = true);
            if (unique[StatType.Enchant]) {
                height += DIALOG_DIVIDER_HEIGHT;
            }
            if (unique[StatType.Implicit]) {
                height += DIALOG_DIVIDER_HEIGHT;
            }
            if (unique[StatType.Explicit] || unique[StatType.Crafted] || unique[StatType.Fractured]) {
                height += DIALOG_DIVIDER_HEIGHT;
            }
            if (unique[StatType.Pseudo]) {
                height += DIALOG_DIVIDER_HEIGHT;
            }
        }

        if (item.veiled || item.corrupted) {
            if (item.veiled) {
                height += DIALOG_LINE_HEIGHT;
            }
            if (item.corrupted) {
                height += DIALOG_LINE_HEIGHT;
            }
            height += DIALOG_DIVIDER_HEIGHT;
        }

        if (item.influences) {
            height += DIALOG_LINE_HEIGHT;
            height += DIALOG_DIVIDER_HEIGHT;
        }

        // price / graph
        height += DIALOG_DIVIDER_HEIGHT;

        const value = 45;
        height += value;
        height += DIALOG_DIVIDER_HEIGHT;

        const price = 64;
        height += price;

        const graph = 200;
        height += graph;

        return {
            width: Math.max(width, DIALOG_MIN_WIDTH),
            height
        };
    }
}
