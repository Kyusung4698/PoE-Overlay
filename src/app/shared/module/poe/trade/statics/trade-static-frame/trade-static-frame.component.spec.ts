import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { TradeStaticPipe } from '../trade-static.pipe';
import { TradeStaticFrameComponent } from './trade-static-frame.component';


describe('TradeStaticFrameComponent', () => {
  let component: TradeStaticFrameComponent;
  let fixture: ComponentFixture<TradeStaticFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TradeStaticFrameComponent, TradeStaticPipe],
      imports: [
        CommonModule,
        HttpClientModule,
        BrowserModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeStaticFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
