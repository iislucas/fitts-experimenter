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
  trialSearch: '^(.*)$',
  trialGrouping: '$1',
};

interface SelectedTrials {
  name: string;
  trials: trial.TrialData[]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Fitts Experimenter';
  trialParamsString: string;
  trialSearch: string = DEFAULT_PREFS.trialSearch ;
  trialGrouping: string = DEFAULT_PREFS.trialGrouping;
  allTrialsData: trial.TrialData[] = [];
  selectedTrials: SelectedTrials[] = [];
  @ViewChild('fileEl') fileEl:ElementRef;
  @ViewChild('downloadLinkEl') downloadLinkEl:ElementRef;
  @ViewChild('tabBar') tabsGroup: MdTabGroup;
  @ViewChild('sidenav') sidenav: MdSidenav;

  ngOnInit() {
    this.restoreVisualizationPrefs();
    this.restoreParams();
    this.restoreTrials();
  }

  distancesString(distances : {[s: string] : number }) : string {
    let outputs: string[] = [];
    for (let d of Object.keys(distances).sort()) {
      outputs.push(`${d}:${distances[d]}`);
    }
    return outputs.join(',');
  }

  dateStringifyTrialLog(log: trial.Log) : string {
    let length = Math.round((log.end_timestamp - log.start_timestamp) / 1000);
    let date = new Date(log.start_timestamp);
    function makeTwoDigit(x) {
      let s = `${x}`;
      if (s.length < 2){
        s = '0' + s;
      }
      return s;
    }
    return `${date.getFullYear()}-${makeTwoDigit(date.getMonth() + 1)}` +
           `-${makeTwoDigit(date.getDate())}` +
           `@${makeTwoDigit(date.getHours())}:${makeTwoDigit(date.getMinutes())}` +
           `:${makeTwoDigit(date.getSeconds())}+${makeTwoDigit(length)}s`;
  }

  trialString(t:trial.TrialData) {
    return `description:${t.log.description} ` +
           `time:${this.dateStringifyTrialLog(t.log)} ` +
           `lookahead:${t.lookahead} ` +
           `orientation:${t.orientation} ` +
           `distances:[${this.distancesString(t.distances)}] ` +
           `tags:${t.log.tags} `;
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
      [JSON.stringify(this.allTrialsData.map(d => d.log))],
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
    this.allTrialsData.splice(index, 1);
  }

  // Load/save of trials.
  deleteAllTrials() {
    this.allTrialsData = [];
    this.sidenav.close();
  }
  saveTrials() {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(
      this.allTrialsData.map((d) => d.log)));
    this.sidenav.close();
  }
  restoreTrials() {
    let trialLogs = JSON.parse(localStorage.getItem(STORAGE_KEY_LOGS));
    if (!trialLogs) {
      this.allTrialsData = [];
    } else {
      this.allTrialsData = trialLogs.map(t => trial.makeTrialData(t));
    }
    this.sidenav.close();
  }
  loadTrialsFromFile() {
    this.fileEl.nativeElement.click();
  }
  // Called indirectly by loadTrialsFromFile
  fileSelected(event: Event) {
    let files = (event.target as any).files; // FileList object
    if(files === []) { return; }
    // files is a FileList of File objects. List some properties.
    for (let f of files) {
      console.log(`name: ${f.name}; type: ${f.type}; ` +
                  `size: ${f.size}, ` +
                  `lastmodified: ${f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'unknown'}`);

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
          // Set description according to filename.
          for (let l of moreLogs) {
            if (!l.description || l.description === '') {
              l.description = f.name;
            }
          }
          let moreData = moreLogs.map(l => trial.makeTrialData(l));
          // this.allTrialsData = moreData.concat(this.allTrialsData);
          let combinedLogs : {[id:string]: trial.TrialData} = {} ;
          for (let l of this.allTrialsData) {
            combinedLogs[l.log.trialId] = l;
          }
          // Newly loaded data overwrites local data.
          for (let l of moreData) {
            combinedLogs[l.log.trialId] = l;
          }
          //
          let combinedLogsList : trial.TrialData[] = [];
          for (let k of Object.keys(combinedLogs)) {
            combinedLogsList.push(combinedLogs[k]);
          }
          this.allTrialsData = combinedLogsList.sort(
              (d1, d2) => d1.log.start_timestamp - d2.log.start_timestamp);
          localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.allTrialsData.map(d => d.log)));
          console.log(this.allTrialsData);
        }
      };

      // Read in the image file as a data URL.
      reader.readAsText(f);
    }
    files = [];
    this.sidenav.close();
    this.tabsGroup.selectedIndex = TAB_INDEX_TRIALS;
  }

  showLog(t:trial.TrialData) {
    console.log(JSON.stringify(t,null,2));
  }

  showVizualizations() {
    let trialSearchRegExp = new RegExp(this.trialSearch);

    let trialGroups : { [name:string] : trial.TrialData[] } = {};

    for (let d of this.allTrialsData) {
      let tagStringToMatch : string = this.trialString(d);
      if (trialSearchRegExp.test(tagStringToMatch)){
        let key = tagStringToMatch.replace(trialSearchRegExp, this.trialGrouping);
        if(!(key in trialGroups)) {
          trialGroups[key] = [];
        }
        trialGroups[key].push(d);
      }
    }

    //
    this.selectedTrials = [];
    for (let key of Object.keys(trialGroups)) {
      this.selectedTrials.push({
        name: key,
        trials: trialGroups[key],
      })
    }
    console.log(this.selectedTrials);
  }

  splitByDistance() {
    console.log(JSON.stringify(this.allTrialsData.map(d=> d.log), null, 2));
    let newLogs : trial.Log[] = [];
    for(let t of this.allTrialsData) {
      newLogs = newLogs.concat(trial.splitTrialByDistances(t.log));
    }
    this.allTrialsData = newLogs.map(l => trial.makeTrialData(l));
    console.log(JSON.stringify(newLogs, null, 2));
  }

  mergeByDistance() {

  }
}