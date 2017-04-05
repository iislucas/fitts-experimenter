import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FittsTrialViewComponent } from './fitts-trial-view.component';

describe('FittsTrialViewComponent', () => {
  let component: FittsTrialViewComponent;
  let fixture: ComponentFixture<FittsTrialViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FittsTrialViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FittsTrialViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
