import { TestBed, async } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { FittsVisualizationComponent } from './fitts-visualization/fitts-visualization.component';
import { FittsTrialViewComponent } from './fitts-trial-view/fitts-trial-view.component';
import { FormsModule } from '@angular/forms';

import * as trial from './lib/trial';
import { test_log } from './lib/testdata/log';

describe('trial', () => {
  it('trial data splitting behaves', async(() => {
    let minimal_log = Object.assign({}, test_log);
    minimal_log.params = ('ignored patams as they dont matter' as any);
    let distances = trial.distancesOfTrial(minimal_log);
    expect(distances).toEqual({ '0': 1, '360': 5, '480': 4, 'undefined': 1 });
    let split_logs = trial.splitTrialByDistances(minimal_log);
    expect(split_logs.map(trial.distancesOfTrial)).toEqual([{ '0': 1}, {'360': 5}, {'480': 4}, {'undefined': 1}]);
    expect(split_logs.length).toBe(4);
  }));
});

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule
      ],
      declarations: [
        AppComponent,
        FittsVisualizationComponent,
        FittsTrialViewComponent,
        FormsModule,
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    fixture.detectChanges();
  }));

  it(`app title should be defined`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toBeDefined();
    fixture.detectChanges();
  }));

  it('should render title in a sidenav tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#title').textContent).toContain(app.title);
    fixture.detectChanges();
  }));
});
