import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SettingsFeature, SettingsWindowService } from '@layout/service';
import { ReplayWindowService } from '@modules/replay/service';

@Component({
  selector: 'app-replay-window',
  templateUrl: './replay-window.component.html',
  styleUrls: ['./replay-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplayWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  private player: any;

  public url: SafeUrl;

  @ViewChild('video')
  public video: ElementRef<HTMLVideoElement>;

  constructor(
    private readonly window: ReplayWindowService,
    private readonly domSanitizer: DomSanitizer,
    private readonly settings: SettingsWindowService) { }

  public ngOnInit(): void {
    const data = this.window.data$.get();
    this.url = this.domSanitizer.bypassSecurityTrustUrl(data.url);
  }

  public ngAfterViewInit(): void {
    import('video.js').then(data => {
      const videojs = data.default;
      this.player = videojs(this.video.nativeElement, {
        fluid: true,
        autoplay: 'muted',
        playbackRates: [0.25, 0.5, 0.75, 1],
        controlBar: {
          pictureInPictureToggle: false
        }
      });
      this.player.on('click', (event: MouseEvent) => {
        if (this.player.el() === document.fullscreenElement) {
          return;
        }
        event.preventDefault();
        this.player.requestFullscreen();
        this.player.play();
      });
    });
  }

  public ngOnDestroy(): void {
    this.player.dispose();
  }

  public onVideoEnded(): void {
    if (this.player.el() === document.fullscreenElement) {
      return;
    }
    this.close();
  }

  public onVideoClose(): void {
    this.close();
  }

  public onSettingsToggle(): void {
    this.settings.toggle(SettingsFeature.Replay).subscribe();
  }

  private close(): void {
    this.window.close().subscribe();
  }
}
