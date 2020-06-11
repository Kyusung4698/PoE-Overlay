import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

const MESSAGES = [
  'Still sane, Exile?',
  'Ta-daa, not-a-cockroach',
  `Don't be frightened little mountain. It'll all be over soon.`,
  `Oops, clumsy me!`
];

@Component({
  selector: 'app-launcher-window',
  templateUrl: './launcher-window.component.html',
  styleUrls: ['./launcher-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LauncherWindowComponent implements OnInit {
  public message$: Observable<string>;

  public ngOnInit(): void {
    this.message$ = timer(0, 5000).pipe(
      map((_, index) => {
        if (index % 2 === 0) {
          return 'Waiting for PoE to launch...';
        } else {
          return MESSAGES[Math.floor(MESSAGES.length * Math.random())];
        }
      })
    );
  }
}
