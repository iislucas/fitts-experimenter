/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

import {
  PixiEnvironment, CircleSprite, OrbitingCircleSprite,
  MeasurementTextSprite, dateStringOfTimestamp
} from './helpers';

import * as mathjs from 'mathjs';
import * as trial_parameters from './trial_parameters';

// Global web audio api context
const audioCtx = new AudioContext();

export interface EventLog {
  timestamp: number;
  circleClickedOn: string;
  distanceToCenter: number;
  timeSinceLastClick: number;
  dx: number;
  dy: number;
  x: number;
  y: number;
}

export interface ContactEventLog {
  timestamp: number;
  kind: 'connected'|'disconnected';
}

export interface TrialLog {
  start_timestamp: number;
  end_timestamp: number;
  trialId: string;
  params: trial_parameters.Params;
  events: EventLog[];
  // Times when the participants lost contact.
  contactEvents: ContactEventLog[];
}

export function trialAverageDistanceToCenter(trialLog: TrialLog) {
    let sumOfDistances = 0;
    // Skip the zeroth value they weren't moving from a prebvious tap/click
    for (let i = 1; i < trialLog.events.length; i++) {
      sumOfDistances += trialLog.events[i].distanceToCenter;
    }
    return sumOfDistances / trialLog.events.length;
}

export function trialAverageDxToCenter(trialLog: TrialLog) {
    let sumOfDistances = 0;
    // Skip the zeroth value they weren't moving from a prebvious tap/click
    for (let i = 1; i < trialLog.events.length; i++) {
      sumOfDistances += Math.abs(trialLog.events[i].dx);
    }
    return sumOfDistances / trialLog.events.length;
}

export function trialAverageDyToCenter(trialLog: TrialLog) {
    let sumOfDistances = 0;
    // Skip the zeroth value they weren't moving from a prebvious tap/click
    for (let i = 1; i < trialLog.events.length; i++) {
      sumOfDistances += Math.abs(trialLog.events[i].dy);
    }
    return sumOfDistances / trialLog.events.length;
}

export function trialAverageTimeToTap(trialLog: TrialLog) {
    let sumOfTimes = 0;
    // Skip the zeroth value they weren't moving from a prebvious tap/click
    for (let i = 1; i < trialLog.events.length; i++) {
      sumOfTimes += trialLog.events[i].timeSinceLastClick;
    }
    return sumOfTimes / trialLog.events.length;
}

export let logs: TrialLog[] = [];
export function setLogs(new_logs: TrialLog[]) {
  logs = new_logs;
}

export function clearLogs() {
  logs = [];
}

export function textOfLogs(): string {
  let logStrings : string[] = logs.map((trialLog:TrialLog) => {
    let trialLogStrings: string[] = [];
    trialLogStrings.push(`\nTrial-params: \n${JSON.stringify(trialLog.params, null, 2)}`);

    trialLogStrings = trialLogStrings.concat(trialLog.events.map((eventLog: EventLog) => {
      let dateString = dateStringOfTimestamp(eventLog.timestamp);
      return `trial-${trialLog.trialId}, ` +
        `${eventLog.x}, ${eventLog.y}, ` +
        `${eventLog.circleClickedOn}, ${eventLog.distanceToCenter}, ` +
        `${eventLog.dx.toFixed(2)}, ${eventLog.dy.toFixed(2)}, ` +
        `${eventLog.timeSinceLastClick}`;
    }));

    trialLogStrings = trialLogStrings.concat(trialLog.contactEvents.map((eventLog: ContactEventLog) => {
      let dateString = dateStringOfTimestamp(eventLog.timestamp);
      return `trial-${trialLog.trialId}, ${dateString}, ${eventLog.kind}`;
    }));

    let ds = trialLog.events.map(
        (e: EventLog) => { return e.distanceToCenter; });

    trialLogStrings.push(`std-dev-distanceToCenter: ${mathjs.std(ds)}`);
    trialLogStrings.push(`mean-distanceToCenter: ${mathjs.mean(ds)}`);
    trialLogStrings.push(`averageDistanceToCenter: ${trialAverageDistanceToCenter(trialLog)}`);
    trialLogStrings.push(`averageTimeToTap: ${trialAverageTimeToTap(trialLog)}`);
    return trialLogStrings.join('\n');
  });

  return logStrings.join('\n');
}

function beep(time:number) {
  // create Oscillator node
  let oscillator = audioCtx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.value = 400; // value in hertz
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  setTimeout(() => { oscillator.stop(); }, time);
}

export class Trial {
  public env: PixiEnvironment;
  public startTime: number;
  public centerCircle: CircleSprite;
  public orbitingCircle1: OrbitingCircleSprite;
  public orbitingCircle2: OrbitingCircleSprite;
  public lastclicktime: number;
  public onceDone: Promise<void>;
  public domElement: HTMLElement;
  public trialLog: TrialLog;
  private timingText: PIXI.Text;
  // Used to detect is participants are connected.
  private isConnected: boolean = false;

  private _mouseDistanceTo = (p: PIXI.Point) => {
    //console.log('mouse: ' + JSON.stringify(this.env.mousePosition));
    //console.log('p: ' + JSON.stringify(p));
    let dx = this.env.mousePosition.x - p.x;
    let dy = this.env.mousePosition.y - p.y;
    let d = Math.sqrt(dx * dx + dy * dy);
    return Math.round(d);
  }

  public handleEvent = (e:KeyboardEvent) : void => {
    if(e.code === 'Space' && e.type === 'keyup') {
      this.trialLog.contactEvents.push({
        timestamp: Date.now(),
        kind: 'disconnected'
      });
      beep(25);
      this.isConnected = false;
    }

    if(e.code === 'Space' && e.type === 'keydown') {
      if(this.trialLog.contactEvents.length !== 0 && this.isConnected === true) {
        return;
      }
      this.trialLog.contactEvents.push({
        timestamp: Date.now(),
        kind: 'connected'
      });
      this.isConnected = true;
    }

    if(e.code === 'Escape' && e.type === 'keydown') {
      this.stop();
    }
  }

  public stop = () : void => {}

  constructor(public params: trial_parameters.Params) {
    this.env = new PixiEnvironment({ bgcolor: params.bgcolor });
    this.domElement = this.env.renderer.view;

    this.onceDone = new Promise<void>((F, R) => {
      this.stop = () => {
        F();
        this.env.updateFunctions = [];
      }

      this.env.updateFunctions.push((deltaTime) => {
        this.timingText.text = 'Expriment time: ' + (Date.now() - this.startTime);
        if (Date.now() - this.startTime > this.params.duration * 1000) {
          this.stop();
        }
      });
    });

    this.onceDone.then(() => {
      this.trialLog.end_timestamp = Date.now();
      this.env.dispose();
      window.removeEventListener('keyup', this.handleEvent);
      window.removeEventListener('keydown', this.handleEvent);
    });

    // this.onceDone = new Promise<void>((F, R) => { });
    this.timingText = new PIXI.Text(
        'Expriment time: ' + (Date.now() - this.startTime),
        { fontFamily: '16px Arial', fill: 0x000000, align: 'left' });
    this.timingText.position = new PIXI.Point(0, 40);
    this.env.container.addChild(this.timingText);

    let instructionsText = new PIXI.Text(
        'Try to click on the center of moving circles.',
        { fontFamily: '16px Arial', fill: 0x000000, align: 'left' });
    instructionsText.position = new PIXI.Point(0, 20);
    this.env.container.addChild(instructionsText);

    this.startTime = Date.now();
    this.lastclicktime = this.startTime;
    this.trialLog = {
      start_timestamp: this.startTime,
      end_timestamp: this.startTime,
      trialId: dateStringOfTimestamp(this.startTime),
      events: [],
      contactEvents: [],
      params: params,
    };
    logs.push(this.trialLog);

    this.env.container.on('click', this.handleTap);
    this.env.container.on('tap', this.handleTap);
    window.addEventListener('keydown', this.handleEvent);
    window.addEventListener('keyup', this.handleEvent);

    let centerCircle = new CircleSprite(
      this.env,
      5, // Radius
      new PIXI.Point(this.env.width / 2, this.env.height / 2), // position
      0x000000 //color
    );

    this.orbitingCircle1 = new OrbitingCircleSprite(
      this.env,
      centerCircle.getCenterPosition(), // orbit center.
      params.circle1.orbit_distance, // orbit distance.
      params.circle1.speed, // speed (in degrees / 60th of a second)
      params.circle1.init_angle,  // initial angle (in degrees)
      params.circle1.radius,  // radius
      parseInt(params.circle1.color) //color
    );

    this.orbitingCircle2 = new OrbitingCircleSprite(
      this.env,
      centerCircle.getCenterPosition(),
      // orbitingCircle1.circleSprite.getCenterPosition(), // orbit center.
      params.circle2.orbit_distance, // orbit distance.
      params.circle2.speed, // speed (in degrees / 60th of a second)
      params.circle2.init_angle,  // initial angle (in degrees)
      params.circle2.radius,  // radius
      parseInt(params.circle2.color) //color
    );

    let dx = this.orbitingCircle1.circleSprite.getCenterPosition().x -
      this.orbitingCircle2.circleSprite.getCenterPosition().x;
    let dy = this.orbitingCircle1.circleSprite.getCenterPosition().y -
      this.orbitingCircle2.circleSprite.getCenterPosition().y;
    let d = Math.sqrt(dx * dx + dy * dy);
    console.log(' Distance between 2 circles: ' + d);
  }



  // todo: use tap position of event: mouse pos is not tap pos on touchscreen windows/chrome.
  public handleTap = () => {
    let c1 = this.orbitingCircle1.circleSprite.getCenterPosition();
    let c2 = this.orbitingCircle2.circleSprite.getCenterPosition();

    let d1 = this._mouseDistanceTo(c1);
    let d2 = this._mouseDistanceTo(c2);

    let timeSinceStart = Date.now() - this.startTime;
    let timeDiff = Date.now() - this.lastclicktime;
    this.lastclicktime = Date.now();

    let accuracy: number;
    let circleName: string;
    let dx: number;
    let dy: number;

    if (d1 < d2) {
      circleName = 'c1:BlueTap';
      accuracy = d1;
      dx = this.env.mousePosition.x - c1.x;
      dy = this.env.mousePosition.y - c1.y;
    } else {
      circleName = 'c2:RedTap';
      accuracy = d2;
      dx = this.env.mousePosition.x - c2.x;
      dy = this.env.mousePosition.y - c2.y;
    }

    let eventLog: EventLog = {
          timestamp: this.lastclicktime,
          circleClickedOn: circleName,
          distanceToCenter: accuracy,
          timeSinceLastClick: timeDiff,
          dx: dx,
          dy: dy,
          x: this.env.mousePosition.x,
          y: this.env.mousePosition.y,
    };
    this.trialLog.events.push(eventLog);
    //console.log('Click happend! : ' + JSON.stringify(eventLog));
  }
}
