/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

export interface Circle {
  // When true, the new position is calculated when a tap event happens.
  // When false, the new position is calculated only when the other circle
  // is tapped.
  lookahead: boolean;
  // A set of distances to randomly select between.
  orbit_distances: number[],
  orbit_distance?: number, // depricated old distance format.
  speed: number, // speed (in degrees / 60th of a second)
  init_angle: number,  // initial angle (in degrees)
  radius: number,  // radius
  color: string // color as a hex number in a string
};

export interface Experiment {
  bgcolor:  string;
  circle1: Circle;
  circle2: Circle;
  // Length of the trial in seconds.
  durationSeconds ?: number;
  // Length of the trial in tap-events.
  durationTaps ?: number;
  // When calculating stats, skip the first N taps.
  skipFirstNTaps: number;
};

export const CIRCLE1_NAME : string = 'c1';
let circle1_params : Circle = {
  lookahead: true,
  orbit_distances: [200], // orbit distance.
  speed: 0, // speed (in degrees / 60th of a second)
  init_angle: 0,  // initial angle (in degrees)
  radius: 5,  // radius
  color: '0x0000FF' //color
};

export const CIRCLE2_NAME : string = 'c2';
let circle2_params : Circle = {
  lookahead: true,
  orbit_distances: [200], // orbit distance.
  speed: 0, // speed (in degrees / 60th of a second)
  init_angle: 180,  // initial angle (in degrees)
  radius: 5,  // radius
  color: '0xFF0000' //color
};

export const defaults : Experiment = {
  circle1: circle1_params,
  circle2: circle2_params,
  skipFirstNTaps: 3,
  durationTaps: 60,
  durationSeconds: 120,
  bgcolor: '0x000000'
};
