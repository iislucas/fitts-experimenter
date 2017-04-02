/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

import * as charts from './charts';
import * as d3 from 'd3';
import * as experiment from './experiment';
import * as helpers from './helpers';
import * as mathjs from 'mathjs';
import * as params from './params';
import * as taps_viz from './taps_viz';
import * as trial from './trial';

import 'pixi.js';

const STORAGE_KEY_PARAMS = 'params';
const STORAGE_KEY_LOGS = 'logs';
// DOM element shown before a trial starts.
const DOM_ID_PRETRIAL = 'pre-trial';
// DOM element shown during a trial.
const DOM_ID_TRIAL = 'trial';
const DOM_ID_LOGS = 'logs';
const DOM_ID_GRAPHS = 'graphs';
const DOM_ID_INFO = 'info';
const DOM_ID_TRIAL_PARAMS = 'trial-params';
const DOM_ID_DELETE_LOGS_DIV = 'really-delete-logs-div';

export class App {
  private trialParamsEl: HTMLTextAreaElement =
    (document.getElementById(DOM_ID_TRIAL_PARAMS) as any);

  private domInfoEl: HTMLElement = document.getElementById(DOM_ID_INFO);

  public experiment = experiment;

  public data: {
      currentTrial?: experiment.Trial
    } = {};

  constructor() {
    console.log('loading!');
    let logsLoadedFromStorage = localStorage.getItem(STORAGE_KEY_LOGS);
    if (logsLoadedFromStorage != null) {
      experiment.setLogs(JSON.parse(logsLoadedFromStorage));
    }

    // Initialize params
    let trial_params_string = localStorage.getItem(STORAGE_KEY_PARAMS);
    let trial_params: params.Experiment;
    if(!trial_params_string) {
      trial_params = JSON.parse(JSON.stringify(params.defaults));
    } else {
      trial_params = JSON.parse(trial_params_string);
    }
    this.trialParamsEl.value = JSON.stringify(trial_params, null, 2);

    document.getElementById('file')
            .addEventListener('change', this.handleFileSelect);

    this.removeInfoStuff();
  }

  removeInfoStuff() {
    let elements = this.domInfoEl.children;
    while(elements.length > 0) {
      this.domInfoEl.removeChild(this.domInfoEl.children[0]);
    }
  }

  addTapViz(parentEl: HTMLElement, trial: trial.Log, stats: trial.TargetStats) {
    let tapPoints = trial.events.map((e:trial.Event) => {
      return { x: e.dx, y: e.dy, circleClickedOn: e.circleClickedOn }
    });
  
    new taps_viz.TapsViz({
        name: 'all',
        tapPoints: tapPoints, 
        tapFill: 'rgba(255, 0, 0, 0.2)',
        tapStroke: 'rgba(0, 0, 0, 0.2)',
        effectiveWidth: stats.summary.eff_width,
        effectiveWidthFill: 'rgba(0, 0, 0, 0.1)',
        effectiveWidthStroke: 'rgba(0, 0, 0, 0.5)',
      }, parentEl);

    let targetsTapPoints : { [target:string]:{ x: number, y: number}[]; } = {}
    for (let t of tapPoints) {
      if(!(t.circleClickedOn in targetsTapPoints)) {
        targetsTapPoints[t.circleClickedOn] = [];
      }
      targetsTapPoints[t.circleClickedOn].push(t);
    }

    for (let target of Object.keys(targetsTapPoints)) {
      new taps_viz.TapsViz({
        name: target,
        tapPoints: targetsTapPoints[target], 
        tapFill: 'rgba(255, 0, 0, 0.2)',
        tapStroke: 'rgba(0, 0, 0, 0.2)',
        effectiveWidth: stats.summary.eff_width,
        effectiveWidthFill: 'rgba(0, 0, 0, 0.1)',
        effectiveWidthStroke: 'rgba(0, 0, 0, 0.5)',
      }, parentEl);
    }
  }

  addGraphForTrial(parentEl: HTMLElement, trial: trial.Log) {
    let data_dx = trial.events.map((e:trial.Event) => {
      return { x: e.timestamp - trial.start_timestamp,
               y: e.dx }
    });
    let data_dy = trial.events.map((e:trial.Event) => {
      return { x: e.timestamp - trial.start_timestamp,
               y: e.dy }
    });
    let data_d = trial.events.map((e:trial.Event) => {
      return { x: e.timestamp - trial.start_timestamp,
               y: Math.sqrt(Math.pow(e.dx, 2) + Math.pow(e.dy, 2)) }
    });
    new charts.Chart(
      400, 200,
      { 'dx': { data: data_dx, fill: 'rgba(255, 0, 0, 0.5)', },
        'dy': { data: data_dy, fill: 'rgba(0, 255, 0, 0.5)', },
        'd': { data: data_d, fill: 'rgba(0, 0, 255, 0.5)', },
      },
      parentEl,
      { bounds: { x_min: 0,
                  x_max: (trial.end_timestamp - trial.start_timestamp),
                }
      });
  }

  showGraphsForTrials() {
    this.removeInfoStuff();

    let summaryGraphEl = document.createElement('div');
    summaryGraphEl.setAttribute('class', 'summary');
    this.domInfoEl.appendChild(summaryGraphEl);

    let summaryTextEl = document.createElement('p');
    summaryTextEl.setAttribute('class', 'summary-text');
    summaryTextEl.textContent = 'Summary graph:';
    summaryGraphEl.appendChild(summaryTextEl);

    let d_t_avg_data : { x:number; y:number; }[] = [];
    let dx_t_avg_data : { x:number; y:number; }[] = [];
    let dy_t_avg_data : { x:number; y:number; }[] = [];

    let graphsEl = document.createElement('div');
    graphsEl.setAttribute('id', DOM_ID_GRAPHS);
    this.domInfoEl.appendChild(graphsEl);

    for (let trialLog of experiment.logs) {
      let graphEl = document.createElement('div');
      graphsEl.appendChild(graphEl);

      let textEl = document.createElement('p');
      textEl.setAttribute('class', 'graph-text');
      textEl.textContent = 'Trial ' + trialLog.trialId + ':';
      graphsEl.appendChild(textEl);

      let stats = trial.stats(trialLog);
      if (stats.data.ts.length > 0 &&
          stats.data.ds.length > 0 &&
          stats.data.dxs.length > 0 &&
          stats.data.dys.length > 0) {
        this.addGraphForTrial(graphsEl, trialLog);
        this.addTapViz(graphsEl, trialLog, stats);
        d_t_avg_data.push({
              x: mathjs.mean(stats.data.ts),
              y: mathjs.mean(stats.data.ds),
            });
        dx_t_avg_data.push({
              x: mathjs.mean(stats.data.ts),
              y: mathjs.mean(stats.data.dxs),
            });
        dy_t_avg_data.push({
              x: mathjs.mean(stats.data.ts),
              y: mathjs.mean(stats.data.dys),
            });
      }
    }

    new charts.Chart(
      400, 200,
      { 'dx': { data: dx_t_avg_data, fill: 'rgba(255, 0, 0, 0.5)', },
        'dy': { data: dy_t_avg_data, fill: 'rgba(0, 255, 0, 0.5)', },
        'd': { data: d_t_avg_data, fill: 'rgba(0, 0, 255, 0.5)', },
      },
      summaryGraphEl);
  }

  startTrial() {
    console.log('starting new trial.');
    this.removeInfoStuff();

    let trial_params = JSON.parse(this.trialParamsEl.value);
    localStorage.setItem(STORAGE_KEY_PARAMS, JSON.stringify(trial_params));

    let preTrialElement = document.getElementById(DOM_ID_PRETRIAL);
    let trialElement = document.getElementById(DOM_ID_TRIAL);
    preTrialElement.hidden = true;
    trialElement.hidden = false;
    this.data.currentTrial = new experiment.Trial(trial_params);
    trialElement.appendChild(this.data.currentTrial.domElement);

    this.data.currentTrial.onceDone.then(() => {
      preTrialElement.hidden = false;
      trialElement.hidden = true;
      trialElement.removeChild(this.data.currentTrial.domElement);
      this.save();
    });
  }

  showRawLogs() {
    this.removeInfoStuff();

    let logsEl = document.createElement('div');
    logsEl.setAttribute('id', DOM_ID_LOGS);
    this.domInfoEl.appendChild(logsEl);
    logsEl.textContent = experiment.makeRawTextLogs();
  }

  showTrialLogs() {
    this.removeInfoStuff();

    let logsEl = document.createElement('div');
    logsEl.setAttribute('id', DOM_ID_LOGS);
    this.domInfoEl.appendChild(logsEl);
    logsEl.textContent = experiment.csvTrialLogs();
  }

  resetToDefaultParams() {
    let trial_params = JSON.parse(this.trialParamsEl.value);
    trial_params = JSON.parse(JSON.stringify(params.defaults));
    this.trialParamsEl.value = JSON.stringify(trial_params, null, 2);
  }

  public clearLogs() {
    experiment.clearLogs();
    localStorage.clear();
    this.removeInfoStuff();
    let element = document.getElementById(DOM_ID_DELETE_LOGS_DIV);
    element.hidden = true;
  }

  public maybeClearLogs() {
    let element = document.getElementById(DOM_ID_DELETE_LOGS_DIV);
    element.hidden = false;
  }

  public dontClearLogs() {
    let element = document.getElementById(DOM_ID_DELETE_LOGS_DIV);
    element.hidden = true;
  }


  public downloadJsonLogs = () : void => {
    let file = new File(
      [JSON.stringify(experiment.logs)],
      'fitts-app-' + helpers.dateStringOfTimestamp(Date.now()) + '.json',
      { type: 'application/octet-stream;charset=utf-8'}
    );
    // let data = new Blob([experiment.textOfLogs()],
    //     { type: 'text/csv;charset=utf-8'});
    let url = URL.createObjectURL(file);
    window.open(url);
  }

  public downloadCsvTrialLogs = () : void => {
    let file = new File(
      [experiment.csvTrialLogs()],
      'fitts-app-' + helpers.dateStringOfTimestamp(Date.now()) + '.csv',
      { type: 'text/csv;charset=utf-8'}
    );
    // let data = new Blob([experiment.textOfLogs()],
    //     { type: 'text/csv;charset=utf-8'});
    let url = URL.createObjectURL(file);
    window.open(url);
  }

  public save() {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(experiment.logs));
  }

  public handleFileSelect = (evt:Event) : void => {
    let files = (evt.target as any).files; // FileList object
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
          console.log('parseing csv');
          let csv = d3.csvParse((e.target as FileReader).result);
          console.log(csv);
        } else if (filekind === 'json') {
          console.log('parseing json');
          let json = JSON.parse((e.target as FileReader).result);
          console.log(json);
          experiment.setLogs(json);
          this.save();
        }
      };

      // Read in the image file as a data URL.
      reader.readAsText(f);
    }
  }
}
