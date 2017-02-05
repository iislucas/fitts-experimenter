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
  n: number;
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
function takeFirstPercentile<T>(ns: T[], percentile:number) : T[] {
  ns.length;
  let selected :T[] = [];
  for (let i = 0; percentile >= (i / (ns.length - 1)) && i < ns.length; i++) {
    selected.push(ns[i]);
  }
  return selected;
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
  let realEvents = RealEvents(trialLog);
  if (targetName) {
    realEvents = realEvents.filter(
        (e) => { return e.circleClickedOn === targetName; });
  }

  let ds = realEvents.map((e) => { return e.distanceToCenter; });
  let dxs = realEvents.map((e) => { return e.dx; });
  let dys = realEvents.map((e) => { return e.dy; });
  let absdxs = realEvents.map((e) => { return Math.abs(e.dx); });
  let absdys = realEvents.map((e) => { return Math.abs(e.dy); });
  let ts = realEvents.map((e) => { return e.timeSinceLastClick; });

  let xWidth = takeFirstPercentile(absdxs.sort((n,m) => { return n - m; }),
                                   0.95).pop();
  let yWidth = takeFirstPercentile(absdys.sort((n,m) => { return n - m; }),
                                   0.95).pop();
  let width = takeFirstPercentile(ds.sort((n,m) => { return n - m; }),
                                   0.95).pop();

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

  let summary = {
    n: values.ts.length,
    mt_mean: mean(values.ts),
    mt_std: std(values.ts),
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




export function RealEvents(trialLog: Log) {
    let events : Event[] = trialLog.events.slice(
        trialLog.params.skipFirstNTaps, trialLog.events.length);
    return events;
}

export function Mean(f: (e:Event) => number, trialLog: Log) {
    let xs = RealEvents(trialLog).map<number>(f);
    return mathjs.mean(xs);
}

export function Std(f: (e:Event) => number, trialLog: Log) {
    let xs = RealEvents(trialLog).map<number>(f);
    return mathjs.std(xs);
}

