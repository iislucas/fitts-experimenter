import { TestBed, async } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule
      ],
      declarations: [
        AppComponent
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