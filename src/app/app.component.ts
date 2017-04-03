import { Component, Optional, ElementRef, ViewChild } from '@angular/core';
import { MdTabGroup, MdSidenav } from '@angular/material';
import * as d3 from 'd3';

import * as params from './lib/params';
import * as trial from './lib/trial';
import * as helpers from './lib/helpers';

const STORAGE_KEY_LOGS = 'logs';
const STORAGE_KEY_PARAMS = 'params';
const STORAGE_KEY_PREFS = 'prefs';

const TAB_INDEX_RUN_TRIAL = 0;
const TAB_INDEX_TRIALS = 1;
const TAB_INDEX_VIZ = 2;

interface VisualizationPreferences {
  trialSearch: string;
  trialGrouping: string;
}

const DEFAULT_PREFS : VisualizationPreferences = {
  trialSearch: '.*',
  trialGrouping: '.*',
};

interface SelectedTrial {
  name: string;
  trials: trial.Log[]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Fitts Experimenter';
  trialParamsString: string;
  trialSearch: string = '.*';
  trialGrouping: string = '.*';
  allTrials: trial.Log[] = [];
  selectedTrials: SelectedTrial[] = [];
  @ViewChild('fileEl') fileEl:ElementRef;
  @ViewChild('downloadLinkEl') downloadLinkEl:ElementRef;
  @ViewChild('tabBar') tabsGroup: MdTabGroup;
  @ViewChild('sidenav') sidenav: MdSidenav;

  ngOnInit() {
    this.restoreVisualizationPrefs();
    this.restoreParams();
    this.restoreTrials();
  }

  dateStringifyTrialLog(log: trial.Log) : string {
    let length = Math.round((log.end_timestamp - log.start_timestamp) / 1000);
    let date = new Date(log.start_timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` +
         `@${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}+${length}s`;
  }

  // Visualization Preferences
  saveVisualizationPrefs() {
    localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify({
      trialSearch: this.trialSearch,
      trialGrouping: this.trialGrouping,
    }));
  }
  restoreVisualizationPrefs() {
    let prefsString = localStorage.getItem(STORAGE_KEY_PREFS);
    if(!prefsString) {
      this.resetVisualizationPrefs();
      return;
    }
    let prefs: VisualizationPreferences = JSON.parse(prefsString);
    this.trialSearch = prefs.trialSearch;
    this.trialGrouping = prefs.trialGrouping;
  }
  resetVisualizationPrefs() {
    this.trialSearch = DEFAULT_PREFS.trialSearch;
    this.trialGrouping = DEFAULT_PREFS.trialGrouping;
  }

  // Default Trial Params
  saveParams() {
    localStorage.setItem(STORAGE_KEY_PARAMS, this.trialParamsString);
  }
  restoreParams() {
    this.trialParamsString = localStorage.getItem(STORAGE_KEY_PARAMS);
    if(!this.trialParamsString) {
      this.resetParams();
    }
  }
  resetParams() {
    this.trialParamsString = JSON.stringify(params.defaults, null, 2);
  }

  startTial() {
    let trialParams: params.Experiment = JSON.parse(this.trialParamsString);
  }

  saveTrialsToFile() {
    let file = new File(
      [JSON.stringify(this.allTrials)],
      'fitts-app-' + helpers.dateStringOfTimestamp(Date.now()) + '.json',
      { type: 'application/octet-stream;charset=utf-8'}
    );
    // let data = new Blob([experiment.textOfLogs()],
    //     { type: 'text/csv;charset=utf-8'});
    let url = URL.createObjectURL(file);
    this.downloadLinkEl.nativeElement.href = url;
    this.downloadLinkEl.nativeElement.download = file.name;
    this.downloadLinkEl.nativeElement.click();
    // window.open(url);
    this.sidenav.close().then(() => { URL.revokeObjectURL(url); });
  }

  // When UI wants us to remove a trial.
  removeOneTrial(index) {
    this.allTrials.splice(index, 1);
  }

  // Load/save of trials.
  loadTrialsFromFile() {
    this.fileEl.nativeElement.click();
  }
  deleteAllTrials() {
    this.allTrials = [];
    this.sidenav.close();
  }
  saveTrials() {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.allTrials));
    this.sidenav.close();
  }
  restoreTrials() {
    this.allTrials = JSON.parse(localStorage.getItem(STORAGE_KEY_LOGS));
    this.sidenav.close();
  }

  fileSelected(event: Event) {
    let files = (event.target as any).files; // FileList object
    if(files === []) { return; }
    // files is a FileList of File objects. List some properties.
    for (let f of files) {
      console.log(`name: ${f.name}; type: ${f.type}; size: ${f.size}, lastmodified: ${f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'unknown'}`);

      let filekind = 'unknown';
      if(f.type.match('csv')) {
        filekind = 'csv';
      } else if (f.type.match('json')) {
        filekind = 'json';
      } else {
        console.warn('file must be csv or json; going to pretend it is json and see what happens...');
        filekind = 'json';
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (e:Event) => {
        // Render thumbnail.
        if (filekind === 'csv') {
          console.log('parsing csv');
          let csv = d3.csvParse((e.target as FileReader).result);
          console.log(csv);
        } else if (filekind === 'json') {
          console.log('parsing json');
          let moreLogs : trial.Log[] = JSON.parse((e.target as FileReader).result);
          this.allTrials = moreLogs.concat(this.allTrials);
          let combinedLogs : {[id:string]: trial.Log} = {} ;
          for (let l of this.allTrials) {
            combinedLogs[l.trialId] = l;
          }
          for (let l of moreLogs) {
            combinedLogs[l.trialId] = l;
          }
          let combinedLogsList : trial.Log[] = [];
          for (let k of Object.keys(combinedLogs)) {
            combinedLogsList.push(combinedLogs[k]);
          }

          this.allTrials = combinedLogsList.sort((log) => log.start_timestamp);
          localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.allTrials));
          console.log(this.allTrials);
        }
      };

      // Read in the image file as a data URL.
      reader.readAsText(f);
    }
    files = [];
    this.sidenav.close();
    this.tabsGroup.selectedIndex = TAB_INDEX_TRIALS;
  }

  showVizualizations() {
    let trialSearchRegExp = new RegExp(this.trialSearch);
    let trialGroupingRegExp = new RegExp(this.trialGrouping);

    let trialGroups : { [name:string] : trial.Log[] } = {};

    for (let t of this.allTrials) {
      let tagStringToMatch : string = t.tags || '';
      if (trialSearchRegExp.test(tagStringToMatch)){
        let groupResult = trialGroupingRegExp.exec(tagStringToMatch);
        let key = '';
        if (groupResult) {
          groupResult.pop()
          for (let s of groupResult) {
            key = key.concat(s);
          }
        } else {
          key = 'id:' + t.trialId;
        }
        if(!(key in trialGroups)) {
          trialGroups[key] = [];
        }
        trialGroups[key].push(t);
      }
    }

    //
    this.selectedTrials = [];
    for (let key of Object.keys(trialGroups)) {
      this.selectedTrials.push({
        name: key,
        trials: trialGroups[key]
      })
    }
  }
}