import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

import * as mathjs from 'mathjs';

import * as trial from '../lib/trial';
import * as charts from '../lib/charts';
import * as taps_viz from '../lib/taps_viz';

@Component({
  selector: 'app-fitts-visualization',
  templateUrl: './fitts-visualization.component.html',
  styleUrls: ['./fitts-visualization.component.css'],
})
export class FittsVisualizationComponent implements OnInit {
  @Input() trials: trial.TrialData[] = [];
  @Input() showGraph: boolean = false;
  @Input() showTapsPlot: boolean = false;
  @ViewChild('vizEl') vizEl: ElementRef;

  constructor() { }

  ngOnInit() {
    this.addGraph();
    this.addTapViz();
  }

  addGraph() {
    let d_t_avg_data : { x:number; y:number; }[] = [];
    let dx_t_avg_data : { x:number; y:number; }[] = [];
    let dy_t_avg_data : { x:number; y:number; }[] = [];

    for (let t of this.trials) {
      let stats = t.stats;
      if (stats.data.ts.length > 0 &&
          stats.data.ds.length > 0 &&
          stats.data.dxs.length > 0 &&
          stats.data.dys.length > 0) {
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
      this.vizEl.nativeElement);
  }

  addTapViz() {

    let aggregateEvents : trial.Event[] = [];
    for (let t of this.trials) {
      aggregateEvents = aggregateEvents.concat(t.log.events);
    }

    let stats = trial.eventStats(aggregateEvents);
    if (stats.data.ts.length === 0 ||
        stats.data.ds.length === 0 ||
        stats.data.dxs.length === 0 ||
        stats.data.dys.length === 0) {

      return;
    }

    let tapPoints = aggregateEvents.map((e:trial.Event) => {
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
      }, this.vizEl.nativeElement);

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
      }, this.vizEl.nativeElement);
    }
  }

}
