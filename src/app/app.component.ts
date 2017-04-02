import { Component, Optional, ElementRef, ViewChild } from '@angular/core';
import { MdTabGroup, MdSidenav } from '@angular/material';
import * as d3 from 'd3';

import * as params from './lib/params';
import * as trial from './lib/trial';
import * as helpers from './lib/helpers';

const STORAGE_KEY_PARAMS = 'params';
const STORAGE_KEY_LOGS = 'logs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Fitts Experimenter';
  trialParamsString: string;
  logs: trial.Log[] = [];
  @ViewChild('fileEl') fileEl:ElementRef;
  @ViewChild('tabBar') tabsGroup: MdTabGroup;
  @ViewChild('sidenav') sidenav: MdSidenav;

  ngOnInit() {
    this.loadParams();
    this.logs = JSON.parse(localStorage.getItem(STORAGE_KEY_LOGS));
  }

  saveParams() {
    localStorage.setItem(STORAGE_KEY_PARAMS, this.trialParamsString);
  }

  loadParams() {
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

  saveFile() {
    let file = new File(
      [JSON.stringify(this.logs)],
      'fitts-app-' + helpers.dateStringOfTimestamp(Date.now()) + '.json',
      { type: 'application/octet-stream;charset=utf-8'}
    );
    // let data = new Blob([experiment.textOfLogs()],
    //     { type: 'text/csv;charset=utf-8'});
    let url = URL.createObjectURL(file);
    window.open(url);
    this.sidenav.close();
  }

  loadFile() {
    this.fileEl.nativeElement.click();
  }

  clearTrials() {
    this.logs = [];
    this.sidenav.close();
    this.tabsGroup.selectedIndex = 1;
  }

  fileSelected(event: Event) {
    let files = (event.target as any).files; // FileList object
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
          this.logs = JSON.parse((e.target as FileReader).result);
          this.logs = this.logs.sort((log) => log.start_timestamp);
          localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.logs));
          console.log(this.logs);
        }
      };

      // Read in the image file as a data URL.
      reader.readAsText(f);
    }
    this.sidenav.close();
    this.tabsGroup.selectedIndex = 1;
  }
}