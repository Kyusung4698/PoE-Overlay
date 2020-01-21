import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContextService } from '../../service';
import { Item, Language } from '../../type';

@Component({
  selector: 'app-item-frame',
  templateUrl: './item-frame.component.html',
  styleUrls: ['./item-frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFrameComponent implements OnInit {
  @Input()
  public item: Item;

  @Input()
  public queryItem: Item;

  @Output()
  public queryItemChange = new EventEmitter<Item>();

  @Input()
  public language?: Language;

  @Input()
  public separator = false;

  @Input()
  public modifier = 0.1;

  @Input()
  public modifierMaxRange: boolean;

  @Input()
  public properties: [];

  public req: boolean;
  public sockets: boolean;
  public stats: boolean;
  public state: boolean;
  public influences: boolean;

  constructor(private readonly context: ContextService) { }

  public ngOnInit(): void {
    this.language = this.language || this.context.get().language;
    this.queryItem = this.queryItem || {
      influences: {},
      damage: {},
      stats: [],
      properties: {},
      requirements: {},
      sockets: new Array((this.item.sockets || []).length).fill({})
    };
    this.req = !!(this.item.level || this.item.requirements);
    this.sockets = !!(this.item.sockets && this.item.sockets.length > 0);
    this.stats = !!(this.item.stats && this.item.stats.length > 0);
    this.state = !!(this.item.corrupted !== undefined || this.item.veiled !== undefined);
    this.influences = !!this.item.influences;
  }

  public onPropertyChange(): void {
    this.queryItemChange.emit(this.queryItem);
  }

  public onValueChange(value: any): void {
    if (value !== undefined && value !== null) {
      this.queryItemChange.emit(this.queryItem);
    }
  }
}
