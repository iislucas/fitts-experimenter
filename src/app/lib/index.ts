/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

import * as fitts_app from './fitts_app';

// For debugging & JS console-level interactions.
declare namespace window {
  let fitts : any;
  let handleClientLoad : () => void;
  let handleSignInClick : (e:Event) => void;
  let handleSignOutClick : (e:Event) => void;
  // For debugging gapi
  let xgapi : any;
}
window.fitts = new fitts_app.App();

// For G+ signin, auth, and APIs
let script = document.createElement("script");
// This script has a callback function that will run when the script has
// finished loading.
script.src = "https://apis.google.com/js/api.js";
script.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(script);
