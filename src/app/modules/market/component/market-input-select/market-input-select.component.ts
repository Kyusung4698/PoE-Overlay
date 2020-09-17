import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MarketInputBaseComponent } from '../market-input-base.component';
import { MarketInputSelectOptionComponent } from '../market-input-select-option/market-input-select-option.component';

@Component({
  selector: 'app-market-input-select',
  templateUrl: './market-input-select.component.html',
  styleUrls: ['./market-input-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketInputSelectComponent extends MarketInputBaseComponent implements OnInit, AfterViewInit, OnDestroy {
  private changeSubscription: Subscription;

  public options$ = new BehaviorSubject<MarketInputSelectOptionComponent[]>([]);
  public optionsVisible$ = new BehaviorSubject<boolean>(false);
  public optionsFiltered$: Observable<MarketInputSelectOptionComponent[]>;

  public inputValue$ = new BehaviorSubject<string>('');

  public get value(): any { return this.getValue(this.name); }
  public set value(value: any) { this.setValue(this.name, value); }

  @Input()
  public width: string;

  @Input()
  public name = 'option';

  @ViewChild('input', { static: true })
  public ref: ElementRef<HTMLInputElement>;

  @ContentChildren(MarketInputSelectOptionComponent, { descendants: true })
  public options: QueryList<MarketInputSelectOptionComponent>;

  public ngOnInit(): void {
    this.optionsFiltered$ = this.options$.pipe(
      mergeMap(options => this.inputValue$.pipe(
        map(value => {
          const lower = value.toLowerCase();
          const exp = new RegExp(value, 'gi');
          return options.filter(option => {
            return option.text.toLowerCase().includes(lower);
          }).map(option => {
            option.html = option.text.replace(exp, (match) => `<span class="highlight">${match}</span>`);
            return option;
          });
        }),
      ))
    );
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.changeSubscription = this.options.changes.pipe(
        map(() => this.options.toArray()),
      ).subscribe(options => {
        this.options$.next(options);
        this.updateView();
      });
      this.options.notifyOnChanges();
    });
  }

  public ngOnDestroy(): void {
    this.changeSubscription?.unsubscribe();
  }

  public onOptionClick(option: MarketInputSelectOptionComponent): void {
    this.value = option.value;
    this.ref.nativeElement.value = option.text;
  }

  public onKeyup(): void {
    this.value = undefined;
    this.ref.nativeElement.placeholder = '';
    this.inputValue$.next(this.ref.nativeElement.value);
  }

  public onFocus(): void {
    this.ref.nativeElement.placeholder = this.ref.nativeElement.value;
    this.ref.nativeElement.value = '';
    this.inputValue$.next('');
    this.optionsVisible$.next(true);
  }

  public onBlur(event: FocusEvent): void {
    event.preventDefault();
    setTimeout(() => {
      this.updateView();
      this.optionsVisible$.next(false);
      this.ref.nativeElement.blur();
    }, 200);
  }

  protected update(): void {
    this.updateView();
  }

  private updateView(): void {
    const value = this.value;
    const option = this.options$.value.find(x => x.value === value);
    if (option) {
      this.ref.nativeElement.value = option.text;
    } else {
      const defaultOption = this.options$.value.find(x => !x.value);
      this.ref.nativeElement.value = defaultOption?.text || '';
    }
  }
}
