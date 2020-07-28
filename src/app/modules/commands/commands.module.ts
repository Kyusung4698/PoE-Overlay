import { NgModule } from '@angular/core';
import { AnnotationCondition, AnnotationService } from '@app/annotation';
import { Hotkey } from '@app/config';
import { Feature, FeatureConfig, FeatureModule, FEATURE_MODULES } from '@app/feature';
import { NotificationService } from '@app/notification';
import { SharedModule } from '@shared/shared.module';
import { CommandsFeatureSettings } from './commands-feature-settings';
import { CommandsSettingsComponent } from './component';
import { CommandService } from './service/command.service';

@NgModule({
    providers: [{ provide: FEATURE_MODULES, useClass: CommandsModule, multi: true }],
    declarations: [
        CommandsSettingsComponent
    ],
    imports: [SharedModule]
})
export class CommandsModule implements FeatureModule<CommandsFeatureSettings> {

    constructor(
        private readonly command: CommandService,
        private readonly notification: NotificationService,
        private readonly annotation: AnnotationService) { }

    public getConfig(): FeatureConfig<CommandsFeatureSettings> {
        const config: FeatureConfig<CommandsFeatureSettings> = {
            name: 'commands.name',
            component: CommandsSettingsComponent,
            default: {
                commands: [
                    {
                        hotkey: Hotkey.Command1,
                        text: '/hideout'
                    },
                    {
                        hotkey: Hotkey.Command2,
                        text: '/dnd'
                    },
                    {
                        hotkey: Hotkey.Command3,
                        text: '/kick @char'
                    },
                    {
                        hotkey: Hotkey.Command4,
                        text: ''
                    },
                    {
                        hotkey: Hotkey.Command5,
                        text: ''
                    },
                    {
                        hotkey: Hotkey.Command6,
                        text: ''
                    }
                ]
            },
        };
        return config;
    }

    public getFeatures(): Feature[] {
        const features: Feature[] = [
            { hotkey: Hotkey.Command1 },
            { hotkey: Hotkey.Command2 },
            { hotkey: Hotkey.Command3 },
            { hotkey: Hotkey.Command4 },
            { hotkey: Hotkey.Command5 },
            { hotkey: Hotkey.Command6 },
        ];
        return features;
    }

    public onKeyPressed(hotkey: Hotkey, settings: CommandsFeatureSettings): void {
        switch (hotkey) {
            case Hotkey.Command1:
            case Hotkey.Command2:
            case Hotkey.Command3:
            case Hotkey.Command4:
            case Hotkey.Command5:
            case Hotkey.Command6:
                const index = +hotkey.replace('command', '');
                const { text } = settings.commands[index - 1];
                if (text?.length) {
                    this.command.execute(text, settings).subscribe(() => { }, error => {
                        console.warn(`Could not execute command: ${text}, ${error?.message ?? JSON.stringify(error)}`, error, text);
                        this.notification.show('commands.execute-error');
                    });
                }
                this.annotation.update(AnnotationCondition.CommandExecuted, true).subscribe();
                break;
            default:
                throw new Error(`Hotkey: '${hotkey}' out of range.`);
        }
    }

    public onLogLineAdd(line: string): void {
        this.command.onLogLineAdd(line);
    }
}
