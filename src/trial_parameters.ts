/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

export interface CircleParams {
  orbit_distance: number, // orbit distance.
  speed: number, // speed (in degrees / 60th of a second)
  init_angle: number,  // initial angle (in degrees)
  radius: number,  // radius
  color: string // color as a hex number in a string
};

export interface Params {
  circle1: CircleParams;
  circle2: CircleParams;
  duration: number;  // Length of the trial in microseconds.
};

let circle1_params = {
  orbit_distance: 100, // orbit distance.
  speed: 0.6, // speed (in degrees / 60th of a second)
  init_angle: 180,  // initial angle (in degrees)
  radius: 25,  // radius
  color: "0x0000FF" //color
};

let circle2_params = {
  orbit_distance: 100, // orbit distance.
  speed: 0.6, // speed (in degrees / 60th of a second)
  init_angle: 120,  // initial angle (in degrees)
  radius: 25,  // radius
  color: "0xFF0000" //color
};

export const default_params = {
  circle1: circle1_params,
  circle2: circle2_params,
  duration: 5
};
