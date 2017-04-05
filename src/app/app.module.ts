import 'hammerjs';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { FittsVisualizationComponent } from './fitts-visualization/fitts-visualization.component';
import { FittsTrialViewComponent } from './fitts-trial-view/fitts-trial-view.component';

@NgModule({
  declarations: [
    AppComponent,
    FittsVisualizationComponent,
    FittsTrialViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
