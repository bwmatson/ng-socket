import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSlideComponent } from './stock-slide.component';

describe('StockComponent', () => {
  let component: StockSlideComponent;
  let fixture: ComponentFixture<StockSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
