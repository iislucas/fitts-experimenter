/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

import * as fitts_app from './fitts-app';

// For debugging & JS console-level interactions.
declare namespace window {
  let fitts : any;
}
window.fitts = new fitts_app.App();
