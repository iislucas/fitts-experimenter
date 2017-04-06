import { TestBed, async } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { FittsVisualizationComponent } from './fitts-visualization/fitts-visualization.component';
import { FittsTrialViewComponent } from './fitts-trial-view/fitts-trial-view.component';

import * as trial from './lib/trial';
import { test_log } from './lib/testdata/log';

describe('trial', () => {
  it('trial data splitting behaves', async(() => {
    let split_logs = trial.splitTrialByDistances(test_log);
    console.log(JSON.stringify(split_logs, null, 2));
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
        FittsTrialViewComponent
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
