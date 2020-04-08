import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserSettings, UserSettingsComponent } from 'src/app/layout/type';

export interface CommandUserSettings extends UserSettings {
  commands: CommandUserCommand[];
}

export interface CommandUserCommand {
  text: string;
  shortcut: string;
}

@Component({
  selector: 'app-command-settings',
  templateUrl: './command-settings.component.html',
  styleUrls: ['./command-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommandSettingsComponent implements UserSettingsComponent {

  @Input()
  public settings: CommandUserSettings;

  public load(): void {
    // stub
  }

  public onAddCommandClick(): void {
    this.addCommand();
  }

  public onRemoveClick(index: number): void {
    this.removeCommand(index);
  }

  private addCommand(): void {
    this.settings.commands.push({
      text: '/',
      shortcut: undefined
    });
  }

  private removeCommand(index: number): void {
    this.settings.commands.splice(index, 1);
  }
}
