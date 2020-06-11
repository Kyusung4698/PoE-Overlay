import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureSettingsComponent } from '@app/feature';
import { CommandsFeatureSettings } from '@modules/commands/commands-feature-settings';

@Component({
  selector: 'app-commands-settings',
  templateUrl: './commands-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandsSettingsComponent extends FeatureSettingsComponent<CommandsFeatureSettings> {
  public load(): void {
  }

  public onChange(): void {
    this.save();
  }
}
