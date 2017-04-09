import { Component, Optional, ElementRef, ViewChild } from '@angular/core';
import { MdTabGroup, MdSidenav } from '@angular/material';
import * as d3 from 'd3';

import * as params from './lib/params';
import * as trial from './lib/trial';
import * as helpers from './lib/helpers';

const STORAGE_KEY_LOGS = 'logs';
const STORAGE_KEY_PARAMS = 'params';
const STORAGE_KEY_VIZ_PREFS = 'viz-prefs';
const STORAGE_KEY_TABLE_PREFS = 'table-prefs';

const TAB_INDEX_RUN_TRIAL = 0;
const TAB_INDEX_TRIALS = 1;
const TAB_INDEX_VIZ = 2;

interface VisualizationPreferences {
  vizGroupSearchRegex: string;
  vizGroupSubst: string;
}
const DEFAULT_VIZ_PREFS : VisualizationPreferences = {
  vizGroupSearchRegex: '^(.*)$',
  vizGroupSubst: '$1',
};

interface TablePreferences {
  tableSearchRegex: string,
}
const DEFAULT_TABLE_PREFS : TablePreferences = {
  tableSearchRegex: '^.*$',
};

interface SelectedTrialGroups {
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
  // All data.
  allTrialsData: trial.TrialData[] = [];
  // Used for table.
  tableSearchRegex: string = DEFAULT_TABLE_PREFS.tableSearchRegex;
  tableSelectedTrials: trial.TrialData[] = [];
  // Used for Viz groups.
  vizGroupSearchRegex: string = DEFAULT_VIZ_PREFS.vizGroupSearchRegex ;
  vizGroupSubst: string = DEFAULT_VIZ_PREFS.vizGroupSubst;
  selectedTrialGroups: SelectedTrialGroups[] = [];
  showGraph: boolean;
  showTapsPlot: boolean;

  @ViewChild('fileEl') fileEl:ElementRef;
  @ViewChild('downloadLinkEl') downloadLinkEl:ElementRef;
  @ViewChild('tabBar') tabsGroup: MdTabGroup;
  @ViewChild('sidenav') sidenav: MdSidenav;

  ngOnInit() {
    this.restoreVisualizationPrefs();
    this.restoreParams();
    this.restoreTrials();
  }

  // Table Preferences
  // TODO: Generalize a view's prefs into a save-class thing.
  saveTablePrefs() {
    localStorage.setItem(STORAGE_KEY_TABLE_PREFS, JSON.stringify({
      tableSearchRegex: this.tableSearchRegex,
    }));
  }
  restoreTablePrefs() {
    let prefsString = localStorage.getItem(STORAGE_KEY_VIZ_PREFS);
    if(!prefsString) {
      this.resetTablePrefs();
      return;
    }
    let prefs: TablePreferences = JSON.parse(prefsString);
    this.tableSearchRegex = prefs.tableSearchRegex;
  }
  resetTablePrefs() {
    this.vizGroupSearchRegex = DEFAULT_TABLE_PREFS.tableSearchRegex;
  }

  // Visualization Preferences
  saveVisualizationPrefs() {
    localStorage.setItem(STORAGE_KEY_VIZ_PREFS, JSON.stringify({
      vizGroupSearchRegex: this.vizGroupSearchRegex,
      vizGroupSubst: this.vizGroupSubst,
    }));
  }
  restoreVisualizationPrefs() {
    let prefsString = localStorage.getItem(STORAGE_KEY_VIZ_PREFS);
    if(!prefsString) {
      this.resetVisualizationPrefs();
      return;
    }
    let prefs: VisualizationPreferences = JSON.parse(prefsString);
    this.vizGroupSearchRegex = prefs.vizGroupSearchRegex;
    this.vizGroupSubst = prefs.vizGroupSubst;
  }
  resetVisualizationPrefs() {
    this.vizGroupSearchRegex = DEFAULT_VIZ_PREFS.vizGroupSearchRegex;
    this.vizGroupSubst = DEFAULT_VIZ_PREFS.vizGroupSubst;
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
  deleteOneTrial(index) {
    console.log(index);
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

  showVizualizations() {
    let trialSearchRegExp = new RegExp(this.vizGroupSearchRegex);

    let trialGroups : { [name:string] : trial.TrialData[] } = {};

    for (let d of this.allTrialsData) {
      let tagStringToMatch : string = trial.trialString(d);
      if (trialSearchRegExp.test(tagStringToMatch)){
        let key = tagStringToMatch.replace(trialSearchRegExp, this.vizGroupSubst);
        console.log(`tagStringToMatch: ${tagStringToMatch}`);
        console.log(`this.trialGrouping: ${this.vizGroupSubst}`);
        console.log(`key: ${key}`);
        if(!(key in trialGroups)) {
          trialGroups[key] = [];
        }
        trialGroups[key].push(d);
      }
    }

    //
    this.selectedTrialGroups = [];
    for (let key of Object.keys(trialGroups)) {
      this.selectedTrialGroups.push({
        name: key,
        trials: trialGroups[key],
      })
    }
  }

  showTable() {
    this.tableSelectedTrials = [];
    let trialSearchRegExp = new RegExp(this.tableSearchRegex);
    for (let d of this.allTrialsData) {
      if (trialSearchRegExp.test(trial.trialString(d))){
        this.tableSelectedTrials.push(d);
      }
    }
  }
  dateStringifyTrialLog = trial.dateStringifyTrialLog;

  distancesString(distances : {[s: string] : number }) : string {
    let outputs: string[] = [];
    for (let d of Object.keys(distances).sort()) {
      outputs.push(`${d}`);
    }
    return outputs.join(',');
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