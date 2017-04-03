import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FittsVisualizationComponent } from './fitts-visualization.component';

describe('FittsVisualizationComponent', () => {
  let component: FittsVisualizationComponent;
  let fixture: ComponentFixture<FittsVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FittsVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FittsVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
