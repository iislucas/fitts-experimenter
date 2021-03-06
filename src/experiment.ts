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
import * as helpers from './helpers';

// Global web audio api context
const audioCtx = new AudioContext();

export let logs: trial.Log[] = [];
export function setLogs(new_logs: trial.Log[]) {
  // Convert old single orbit_distance to new orbit distance format.
  for(let trialLog of new_logs) {
    if (trialLog.params.circle1.orbit_distance) {
      trialLog.params.circle1.orbit_distances = [trialLog.params.circle1.orbit_distance];
      console.log('updating circle1 orbit_distances from old format.');
    } 
    if (trialLog.params.circle2.orbit_distance) {
      trialLog.params.circle2.orbit_distances = [trialLog.params.circle2.orbit_distance];
      console.log('updating circle2 orbit_distances from old format.');
    }
  }
  logs = new_logs;
}

export function changeSkipEvents(n:number) {
  logs.map((t:trial.Log) => {
    t.params.skipFirstNTaps = n;
    return t;
  });
}

export function clearLogs() {
  logs = [];
}

export function makeRawTextLogs(): string {
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
        trialLogStrings.concat([JSON.stringify(allEventStats.summary, null, 2)]);

    trialLogStrings.push(`-- Stats for ${params.CIRCLE1_NAME} --`);
    let c1EventStats = trial.stats(trialLog, params.CIRCLE1_NAME);
    trialLogStrings =
        trialLogStrings.concat([JSON.stringify(c1EventStats.summary, null, 2)]);

    trialLogStrings.push(`-- Stats for ${params.CIRCLE2_NAME} --`);
    let c2EventStats = trial.stats(trialLog, params.CIRCLE2_NAME);
    trialLogStrings =
        trialLogStrings.concat([JSON.stringify(c2EventStats.summary, null, 2)]);
    trialLogStrings.push(`-----------------------------------------`);

    return trialLogStrings.join('\n');
  });

  return logStrings.join('\n');
}

function calcOrientation(trialLog:trial.Log) : string {
    let orientation = "M";
    if(trialLog.params.circle1.init_angle === 0
       || trialLog.params.circle2.init_angle === 180) {
      orientation = "H";
    } else if(trialLog.params.circle1.init_angle === 90
       || trialLog.params.circle2.init_angle === 270) {
      orientation = "V";
    }
    return orientation;
}

function pickRandomOrbitDistance(c: params.Circle) : number {
  return mathjs.pickRandom(c.orbit_distances);
}

function initDistancesString(trialLog:trial.Log) : string {
  return JSON.stringify(
    {c1: trialLog.params.circle1.orbit_distances,
     c2: trialLog.params.circle2.orbit_distances}).replace(',',';');

  // let p = trialLog.params;

  // let d1 = pickRandomOrbitDistance(p.circle1);
  // let x1 = Math.cos(helpers.toRadians(p.circle1.init_angle)) * d1;
  // let y1 = Math.sin(helpers.toRadians(p.circle1.init_angle)) * d1

  // let d2 = pickRandomOrbitDistance(p.circle2);
  // let x2 = Math.cos(helpers.toRadians(p.circle2.init_angle)) * d2;
  // let y2 = Math.sin(helpers.toRadians(p.circle2.init_angle)) * d2;

  // return Math.sqrt(Math.pow((x1 - x2),2) + Math.pow((y1 - y2),2));
}

function numbersOfSummary(summary:trial.TargetStatsSummary) : string[] {
  return [`${summary.n}`,
          `${summary.mt_mean}`,
          `${summary.mt_std}`,
          `${summary.eff_width}`,
          `${summary.eff_xwidth}`,
          `${summary.eff_ywidth}`,
          `${summary.mean_d}`,
          `${summary.std_d}`,
          `${summary.mean_dx}`,
          `${summary.std_dx}`,
          `${summary.mean_dy}`,
          `${summary.std_dy}` ];
}

export function csvTrialLogs() {
  let strings : string[] = [
      [ 'trialId','orientation','distance','nEvents',
        'both_nevents','both_mt_mean','both_mt_std',
        'both_eff_dwidth','both_eff_xwidth','both_eff_ywidth',
        'both_ds_mean','both_ds_std',
        'both_dxs_mean','both_dxs_std',
        'both_dys_mean','both_dys_std',
        'c1_nevents','c1_mt_mean','c1_mt_std',
        'c1_eff_dwidth','c1_eff_xwidth','c1_eff_ywidth',
        'c1_ds_mean','c1_ds_std',
        'c1_dxs_mean','c1_dys_std',
        'c1_dys_mean','c1_dys_std',
        'c2_nevents','c2_mt_mean','c2_mt_std',
        'c2_eff_dwidth','c2_eff_xwidth','c2_eff_ywidth',
        'c2_ds_mean','c2_ds_std',
        'c2_dxs_mean','c2_dys_std',
        'c2_dys_mean','c2_dys_std',
      ].join(',')]

  strings = strings.concat(logs.map((trialLog:trial.Log) => {
    let trialStrings: string[] = [];
    trialStrings.push(`${trialLog.trialId}`);
    trialStrings.push(`${calcOrientation(trialLog)}`);
    trialStrings.push(`${initDistancesString(trialLog)}`);
    trialStrings.push(`${trialLog.events.length}`);

    let allEventStats = trial.stats(trialLog);
    trialStrings = trialStrings.concat(
        numbersOfSummary(allEventStats.summary));
    let c1EventStats = trial.stats(trialLog, params.CIRCLE1_NAME);
    trialStrings = trialStrings.concat(
        numbersOfSummary(c1EventStats.summary));
    let c2EventStats = trial.stats(trialLog, params.CIRCLE2_NAME);
    trialStrings = trialStrings.concat(
        numbersOfSummary(c2EventStats.summary));
    return trialStrings.join(',');
  }));
  return strings.join('\n');
}

export function csvRawLogsOfTrial(trialLog:trial.Log) {
  let trialLogStrings: string[] = [];
  trialLogStrings = trialLogStrings.concat(
      trialLog.events.map((eventLog: trial.Event) => {
        let dateString = dateStringOfTimestamp(eventLog.timestamp);
        return `trial-${trialLog.trialId}, ` +
          `${eventLog.circleClickedOn}, ${eventLog.circleClickedPos[0]}, ${eventLog.circleClickedPos[1]}, ${eventLog.x}, ${eventLog.y}, ` +
          `${eventLog.distanceToCenter}, ` +
          `${eventLog.dx.toFixed(2)}, ${eventLog.dy.toFixed(2)}, ` +
          `${eventLog.timeSinceLastClick}`;
  }));
  return trialLogStrings.join('\n');
}

export function csvRawLogs(): string {
  // First line is the CSV headers.
  let logStrings : string[] = [
    'trialId,circleClickedOn,circleClickedOnX,circleClickedOnY,' +
    'x,y,distanceToCenter,dx,dy,timeSinceLastClick',
  ];
  logStrings = logStrings.concat(logs.map(csvRawLogsOfTrial));
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
        this.timingText.text = 'Expriment time: ' +
                                 (Date.now() - this.startTime);
        // Stop when trial time or
        if (this.trialTimePassed() || this.trialTapsPassed()) {
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
      pickRandomOrbitDistance(this.trialParams.circle1), // orbit distance.
      this.trialParams.circle1.speed, // speed (in degrees / 60th of a second)
      this.trialParams.circle1.init_angle,  // initial angle (in degrees)
      this.trialParams.circle1.radius,  // radius
      parseInt(this.trialParams.circle1.color) //color
    );

    this.orbitingCircle2 = new OrbitingCircleSprite(
      this.env,
      centerCircle.getCenterPosition(),
      // orbitingCircle1.circleSprite.getCenterPosition(), // orbit center.
      pickRandomOrbitDistance(this.trialParams.circle2), // orbit distance.
      this.trialParams.circle2.speed, // speed (in degrees / 60th of a second)
      this.trialParams.circle2.init_angle,  // initial angle (in degrees)
      this.trialParams.circle2.radius,  // radius
      parseInt(this.trialParams.circle2.color) //color
    );

    let dx = this.orbitingCircle1.circleSprite.getCenterPosition().x -
      this.orbitingCircle2.circleSprite.getCenterPosition().x;
    let dy = this.orbitingCircle1.circleSprite.getCenterPosition().y -
      this.orbitingCircle2.circleSprite.getCenterPosition().y;
    let d = Math.sqrt(dx * dx + dy * dy);
    console.log(' Distance between 2 circles: ' + d);
  }

  public trialTimePassed() : boolean {
    if (!this.trialParams.durationSeconds) {
      return false;
    }
    return (Date.now() - this.startTime >
                this.trialParams.durationSeconds * 1000);
  }

  public trialTapsPassed() : boolean {
    if (!this.trialParams.durationTaps) {
      return false;
    }
    return (this.trialLog.events.length >= this.trialParams.durationTaps);
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
    // [x,y] pos of circle clicked on.
    let circleClickedPos: [number,number];

    if (d1 < d2) {
      circleName = params.CIRCLE1_NAME;
      circleClickedPos = [c1.x, c1.y];
      accuracy = d1;
      dx = this.env.mousePosition.x - c1.x;
      dy = this.env.mousePosition.y - c1.y;

      if (this.trialParams.circle1.lookahead) {
        this.orbitingCircle1.circleSprite.sprite.visible = true;
        this.orbitingCircle1.orbitDistance =
            pickRandomOrbitDistance(this.trialParams.circle1);
      } else {
        this.orbitingCircle1.circleSprite.sprite.visible = false;
      }

      if (!this.trialParams.circle2.lookahead) {
        this.orbitingCircle2.orbitDistance =
            pickRandomOrbitDistance(this.trialParams.circle2);
        this.orbitingCircle2.circleSprite.sprite.visible = true;
      }
    } else {
      circleName = params.CIRCLE2_NAME;
      circleClickedPos = [c2.x, c2.y];
      accuracy = d2;
      dx = this.env.mousePosition.x - c2.x;
      dy = this.env.mousePosition.y - c2.y;

      if (this.trialParams.circle2.lookahead) {
        this.orbitingCircle2.circleSprite.sprite.visible = true;
        this.orbitingCircle2.orbitDistance =
            pickRandomOrbitDistance(this.trialParams.circle2);
      } else {
        this.orbitingCircle2.circleSprite.sprite.visible = false;
      }

      if (!this.trialParams.circle1.lookahead) {
        this.orbitingCircle1.orbitDistance =
            pickRandomOrbitDistance(this.trialParams.circle1);
        this.orbitingCircle1.circleSprite.sprite.visible = true;
      }
    }

    let eventLog: trial.Event = {
          timestamp: this.lastclicktime,
          circleClickedOn: circleName,
          circleClickedPos: circleClickedPos,
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
