import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { AssetService } from '@app/assets';
import { InspectItemComponent } from './inspect-item.component';


describe('InspectItemComponent', () => {
  let component: InspectItemComponent;
  let fixture: ComponentFixture<InspectItemComponent>;

  beforeEach(waitForAsync(async () => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ],
      declarations: [InspectItemComponent]
    })
      .compileComponents();
    const asset = TestBed.inject<AssetService>(AssetService);
    await asset.load().toPromise();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectItemComponent);
    component = fixture.componentInstance;
    component.item = {
      typeId: undefined,
      nameId: undefined
    };
    component.settings = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
