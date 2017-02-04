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
import * as trial from './trial';
import * as params from './params';

// Global web audio api context
const audioCtx = new AudioContext();

export let logs: trial.Log[] = [];
export function setLogs(new_logs: trial.Log[]) {
  logs = new_logs;
}

export function clearLogs() {
  logs = [];
}

function mean(xs:number[]) : number {
  if (xs.length === 0) {
    return 0;
  } else {
    mathjs.mean(xs);
  }
}

function std(xs:number[]) : number {
  if (xs.length === 0) {
    return 0;
  } else {
    mathjs.std(xs);
  }
}

export function textsForTargetStats(stats : trial.TargetStats): string[] {
  let trialLogStrings :string[] = [];
  trialLogStrings.push(`Number of events used: ${stats.ts.length}`);
  trialLogStrings.push(`mean(averageTimeToTap): ${mean(stats.ts)}`);
  trialLogStrings.push(`std(averageTimeToTap): ${std(stats.ts)}`);

  trialLogStrings.push(`xWidth: ${stats.xWidth}`);
  trialLogStrings.push(`yWidth: ${stats.xWidth}`);
  trialLogStrings.push(`width: ${stats.width}`);

  trialLogStrings.push(`mean(dx): ${mean(stats.dxs)}`);
  trialLogStrings.push(`std(dx): ${std(stats.dxs)}`);
  trialLogStrings.push(`mean(dy): ${mean(stats.dys)}`);
  trialLogStrings.push(`std(dy): ${std(stats.dys)}`);

  trialLogStrings.push(`mean(abs(dx)): ${mean(stats.absdxs)}`);
  trialLogStrings.push(`std(abs(dx)): ${std(stats.absdxs)}`);
  trialLogStrings.push(`mean(abd(dy)): ${mean(stats.absdys)}`);
  trialLogStrings.push(`std(abs(dy)): ${std(stats.absdys)}`);
  trialLogStrings.push(`mean(distanceToCenter): ${mean(stats.ds)}`);
  trialLogStrings.push(`std(distanceToCenter): ${std(stats.ds)}`);
  return trialLogStrings;
}

export function textOfLogs(): string {
  let logStrings : string[] = logs.map((trialLog:trial.Log) => {
    let trialLogStrings: string[] = [];
    trialLogStrings.push(`\nTrial-params: \n${JSON.stringify(trialLog.params, null, 2)}`);

    trialLogStrings = trialLogStrings.concat(trialLog.events.map((eventLog: trial.Event) => {
      let dateString = dateStringOfTimestamp(eventLog.timestamp);
      return `trial-${trialLog.trialId}, ` +
        `${eventLog.x}, ${eventLog.y}, ` +
        `${eventLog.circleClickedOn}, ${eventLog.distanceToCenter}, ` +
        `${eventLog.dx.toFixed(2)}, ${eventLog.dy.toFixed(2)}, ` +
        `${eventLog.timeSinceLastClick}`;
    }));

    trialLogStrings = trialLogStrings.concat(trialLog.contactEvents.map((eventLog: trial.ContactLog) => {
      let dateString = dateStringOfTimestamp(eventLog.timestamp);
      return `trial-${trialLog.trialId}, ${dateString}, ${eventLog.kind}`;
    }));

    trialLogStrings.push(`total number of events: ${trialLog.events.length}`);

    trialLogStrings.push(`-- Stats for all targets--`);
    let allEventStats = trial.stats(trialLog);
    trialLogStrings =
        trialLogStrings.concat(textsForTargetStats(allEventStats));

    trialLogStrings.push(`-- Stats for ${params.CIRCLE1_NAME} --`);
    let c1EventStats = trial.stats(trialLog, params.CIRCLE1_NAME);
    trialLogStrings =
        trialLogStrings.concat(textsForTargetStats(c1EventStats));

    trialLogStrings.push(`-- Stats for ${params.CIRCLE2_NAME} --`);
    let c2EventStats = trial.stats(trialLog, params.CIRCLE2_NAME);
    trialLogStrings =
        trialLogStrings.concat(textsForTargetStats(c2EventStats));
    trialLogStrings.push(`-----------------------------------------`);

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
  public trialLog: trial.Log;
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

  constructor(public trialParams: params.Experiment) {
    this.env = new PixiEnvironment({ bgcolor: trialParams.bgcolor });
    this.domElement = this.env.renderer.view;

    this.onceDone = new Promise<void>((F, R) => {
      this.stop = () => {
        F();
        this.env.updateFunctions = [];
      }

      this.env.updateFunctions.push((deltaTime) => {
        this.timingText.text = 'Expriment time: ' + (Date.now() - this.startTime);
        if (Date.now() - this.startTime > this.trialParams.durationSeconds * 1000) {
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
      params: trialParams,
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
      trialParams.circle1.orbit_distance, // orbit distance.
      trialParams.circle1.speed, // speed (in degrees / 60th of a second)
      trialParams.circle1.init_angle,  // initial angle (in degrees)
      trialParams.circle1.radius,  // radius
      parseInt(trialParams.circle1.color) //color
    );

    this.orbitingCircle2 = new OrbitingCircleSprite(
      this.env,
      centerCircle.getCenterPosition(),
      // orbitingCircle1.circleSprite.getCenterPosition(), // orbit center.
      trialParams.circle2.orbit_distance, // orbit distance.
      trialParams.circle2.speed, // speed (in degrees / 60th of a second)
      trialParams.circle2.init_angle,  // initial angle (in degrees)
      trialParams.circle2.radius,  // radius
      parseInt(trialParams.circle2.color) //color
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
      circleName = params.CIRCLE1_NAME;
      accuracy = d1;
      dx = this.env.mousePosition.x - c1.x;
      dy = this.env.mousePosition.y - c1.y;
    } else {
      circleName = params.CIRCLE2_NAME;
      accuracy = d2;
      dx = this.env.mousePosition.x - c2.x;
      dy = this.env.mousePosition.y - c2.y;
    }

    let eventLog: trial.Event = {
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
