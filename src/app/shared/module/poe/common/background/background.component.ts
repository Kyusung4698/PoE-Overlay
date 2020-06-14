import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackgroundComponent {
  @Input()
  public inline = false;
}
