/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

import * as mathjs from 'mathjs';
import * as params from './params';

export interface ContactLog {
  timestamp: number;
  kind: 'connected'|'disconnected';
}

export interface Event {
  timestamp: number;
  circleClickedOn: string;
  circleClickedPos: [number,number];
  distanceToCenter: number;
  timeSinceLastClick: number;
  dx: number;
  dy: number;
  x: number;
  y: number;
}

export interface Log {
  start_timestamp: number;
  end_timestamp: number;
  trialId: string;
  params: params.Experiment;
  events: Event[];
  // Times when the participants lost contact.
  contactEvents: ContactLog[];
}

export interface TargetStatsData {
  // Time since last event.
  ts : number[];
  // distance on x-axis from target (negative is to left of the target,
  // positive is to the right).
  dxs : number[];
  // distance on y-axis from target (negative is above the target,
  // positive is bellow).
  dys : number[];
  // absolute distance on the x-axis to target.
  absdxs : number[];
  // absolute distance on the y-axis to target.
  absdys : number[];
  // absolute distances to target sqrt(x^2 + y^2).
  ds : number[];
  // The effective width (95%ile max distance), as measured on x-axis.
  xWidth: number,
  // The effective width (95%ile max distance), as measured on y-axis.
  yWidth: number,
  // The effective width (95%ile max distance), as measured by
  // absolute distance.
  width: number,
}

export interface TargetStatsSummary {
  // The total number of events
  n: number;
  // The number of selected events w.r.t. time (95% ile)
  ts_n: number;
  // The number of selected events w.r.t. distance (95% ile)
  ds_n: number;
  mt_mean: number;
  mt_std: number;
  eff_width: number;
  eff_xwidth: number;
  eff_ywidth: number;
  mean_d: number;
  std_d: number;
  mean_dx: number;
  std_dx: number;
  mean_dy: number;
  std_dy: number;
}

export interface TargetStats {
  summary: TargetStatsSummary;
  data: TargetStatsData;
}

// Take the first |percentile| of elements.
function takeFirstPercentile<T>(ns: T[], percentile:number) : { selected:T[], dropped:T[] } {
  ns.length;
  let selected :T[] = [];
  let dropped :T[] = [];
  let i:number = 0;
  for (; percentile >= (i / (ns.length - 1)) && i < ns.length; i++) {
    selected.push(ns[i]);
  }
  for (; i < ns.length; i++) {
    dropped.push(ns[i]);
  }
  return { selected: selected, dropped: dropped };
}

// Returns indexes to keep.
function removeOutlers<T>(ns: T[], f:(n:T) => number, percentile:number)
    : { selected: T[], dropped: T[] } {
  let indexed_ns = ns.map((n,i) => { return { n:n, i:i } });

  let selected_ns = takeFirstPercentile(
    indexed_ns.sort((n1,n2) => { return f(n1.n) - f(n2.n); }),
    percentile);

  return { selected: selected_ns.selected.map((indexed_n) => { return indexed_n.n; }),
           dropped: selected_ns.dropped.map((indexed_n) => { return indexed_n.n; }) };
}

function mean(xs:number[]) : number {
  if (xs.length === 0) {
    return 0;
  } else {
    return mathjs.mean(xs);
  }
}

function std(xs:number[]) : number {
  if (xs.length === 0) {
    return 0;
  } else {
    return mathjs.std(xs);
  }
}

export function stats(trialLog: Log, targetName?:string) : TargetStats {
  let realEvents = trialLog.events.slice(
        5, // trialLog.params.skipFirstNTaps,
        trialLog.events.length);

  if (targetName) {
    realEvents = realEvents.filter(
        (e) => { return e.circleClickedOn === targetName; });
  }

  let absdxs = realEvents.map((e) => { return Math.abs(e.dx); });
  let absdys = realEvents.map((e) => { return Math.abs(e.dy); });
  let ds = realEvents.map((e) => { return e.distanceToCenter; });

  let xWidth = takeFirstPercentile(absdxs.sort((n,m) => { return n - m; }),
                                   0.95).selected.pop();
  let yWidth = takeFirstPercentile(absdys.sort((n,m) => { return n - m; }),
                                   0.95).selected.pop();
  let width = takeFirstPercentile(ds.sort((n,m) => { return n - m; }),
                                   0.95).selected.pop();

  // Removes points with 95%
  let selectedEvents = removeOutlers(realEvents,
      (n:Event) => { return n.distanceToCenter; }, 0.95);
  realEvents = selectedEvents.selected;
  // console.log('selected ds: ' + JSON.stringify(
  //     selectedEvents.selected.map((e) => { return e.distanceToCenter; }), 
  //     null, 2));
  // console.log('dropped ds: ' + JSON.stringify(
  //     selectedEvents.dropped.map((e) => { return e.distanceToCenter; }), 
  //     null, 2));

  let dxs = realEvents.map((e) => { return e.dx; });
  let dys = realEvents.map((e) => { return e.dy; });
  ds = realEvents.map((e) => { return e.distanceToCenter; });
  absdxs = realEvents.map((e) => { return Math.abs(e.dx); });
  absdys = realEvents.map((e) => { return Math.abs(e.dy); });

  let ts = realEvents.map((e) => { return e.timeSinceLastClick; });

  let values = {
    ts: ts,
    dxs: dxs,
    dys: dys,
    absdxs: absdxs,
    absdys: absdys,
    ds: ds,
    xWidth: xWidth,
    yWidth: yWidth,
    width: width,
  };

  let selected_ts = 
      removeOutlers(values.ts, (n:number) => { return n; }, 0.95);
  // console.log('selected ts: ' + JSON.stringify(selected_ts.selected, null, 2));
  // console.log('dropped ts: ' + JSON.stringify(selected_ts.dropped, null, 2));

  let summary = {
    n: values.ts.length,
    ts_n: selected_ts.selected.length,
    ds_n: values.ds.length,
    mt_mean: mean(selected_ts.selected),
    mt_std: std(selected_ts.selected),
    eff_width: values.width,
    eff_xwidth: values.xWidth,
    eff_ywidth: values.yWidth,
    mean_d: mean(values.ds),
    std_d: std(values.ds),
    mean_dx: mean(values.dxs),
    std_dx: std(values.dxs),
    mean_dy: mean(values.dys),
    std_dy: std(values.dys),
  };

  return {
    data: values,
    summary: summary,
  };
}