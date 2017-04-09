import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as trial from '../lib/trial';

@Component({
  selector: 'app-fitts-trial-view',
  templateUrl: './fitts-trial-view.component.html',
  styleUrls: ['./fitts-trial-view.component.css']
})
export class FittsTrialViewComponent implements OnInit {
  @Input() data: {}; // trial.TrialData;
  @Input() index: number;
  @Output() deleteEvent = new EventEmitter();

  showDetails : boolean = false;
  trialString = trial.trialString;

  constructor() { }

  ngOnInit() {
  }

  showLog(t:trial.TrialData) {
    console.log(JSON.stringify(t,null,2));
  }

  delete() {
    console.log(`clicked on: ${this.index}`);
    this.deleteEvent.emit(this.index);
  }
}


    // <!--{{ dateStringifyTrialLog(data.log) }}
    // (nevents: {{ data.log.events.length }})
    // [ {{ data.log.trialId }} ]<br>
    // o={{ data.orientation }}, d:n=[{{ distancesString(data.distances) }}],
    // l={{ data.lookahead }}-->