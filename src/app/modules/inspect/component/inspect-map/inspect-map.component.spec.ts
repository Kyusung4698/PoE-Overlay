import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { AssetService } from '@app/assets';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { InspectMapComponent } from './inspect-map.component';


describe('InspectMapComponent', () => {
  let component: InspectMapComponent;
  let fixture: ComponentFixture<InspectMapComponent>;

  beforeEach(waitForAsync(async () => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: () => new TranslateFakeLoader()
          }
        })
      ],
      declarations: [InspectMapComponent]
    })
      .compileComponents();
    const asset = TestBed.inject<AssetService>(AssetService);
    await asset.load().toPromise();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectMapComponent);
    component = fixture.componentInstance;
    component.item = {
      stats: []
    };
    component.settings = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
