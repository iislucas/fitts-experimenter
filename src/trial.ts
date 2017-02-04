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

export interface TargetStats {
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

// Take the first |percentile| of elements.
function takeFirstPercentile<T>(ns: T[], percentile:number) : T[] {
  ns.length;
  let selected :T[] = [];
  for (let i = 0; percentile >= (i / (ns.length - 1)) && i < ns.length; i++) {
    selected.push(ns[i]);
  }
  return selected;
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

  return {
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

