import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CurrencyFrameComponent } from './currency-frame.component';


describe('CurrencyFrameComponent', () => {
  let component: CurrencyFrameComponent;
  let fixture: ComponentFixture<CurrencyFrameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyFrameComponent],
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
