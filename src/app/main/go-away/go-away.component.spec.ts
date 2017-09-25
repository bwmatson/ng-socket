import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoAwayComponent } from './go-away.component';

describe('GoAwayComponent', () => {
  let component: GoAwayComponent;
  let fixture: ComponentFixture<GoAwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoAwayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoAwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
