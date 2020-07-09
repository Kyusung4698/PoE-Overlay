import { ChangeDetectionStrategy, Component, Inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EventSubscription } from '@app/event';
import { FeatureModule, FeatureSettings, FEATURE_MODULES } from '@app/feature';
import { FeatureSettingsService } from '@app/feature/feature-settings.service';
import { I18nService } from '@app/i18n';
import { OWWindow, OWWindows, WindowInfo } from '@app/odk';
import { ContextService } from '@shared/module/poe/context';
import { iif, Observable, of, throwError } from 'rxjs';
import { catchError, flatMap, map, retryWhen, tap } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
    private subscription: EventSubscription;

    public window$: Observable<WindowInfo>;

    constructor(
        @Inject(FEATURE_MODULES)
        private readonly modules: FeatureModule<FeatureSettings>[],
        private readonly settings: FeatureSettingsService,
        private readonly context: ContextService,
        private readonly i18n: I18nService,
        private readonly ngZone: NgZone,
        private readonly title: Title) { }

    public ngOnInit(): void {
        this.window$ = this.settings.init(this.modules).pipe(
            flatMap(settings => {
                this.i18n.use(settings.uiLanguage);
                const { language, leagueId } = settings;
                return this.context.init({ language, leagueId });
            }),
            tap(() => {
                this.subscription = this.settings.change().on(settings => {
                    this.ngZone.run(() => {
                        this.i18n.use(settings.uiLanguage);
                        const { language, leagueId } = settings;
                        this.context.update({ language, leagueId });
                    });
                });
            }),
            flatMap(() => OWWindows.getCurrentWindow()),
            retryWhen(errors => errors.pipe(
                flatMap(error => {
                    console.warn(`An unexpected error occured while loading PoE Overlay. ${error?.message ?? JSON.stringify(error)}`);
                    return OWWindows.displayMessageBox({
                        message_title: 'PoE Overlay could not be loaded.',
                        message_body: 'An unexpected error occured while loading PoE Overlay.\n' +
                            'Please check your internet connection and try again.',
                        confirm_button_text: 'Try again',
                        cancel_button_text: 'Exit',
                        message_box_icon: overwolf.windows.enums.MessagePromptIcon.ExclamationMark
                    }).pipe(
                        flatMap(confirmed => iif(
                            () => confirmed, of(null), throwError(error))
                        )
                    );
                })
            )),
            tap(win => this.title.setTitle(`PoE Overlay - ${win.name.charAt(0).toUpperCase()}${win.name.slice(1)}`)),
            catchError(() => new OWWindow().close().pipe(
                map(() => null)
            ))
        );
    }

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
