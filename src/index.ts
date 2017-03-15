/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

import * as fitts_app from './fitts_app';
import * as auth from './auth';

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
window.handleClientLoad = auth.handleClientLoad;
window.handleSignInClick = auth.handleSignInClick;
window.handleSignOutClick = auth.handleSignOutClick;
window.xgapi = auth.xgapi;
let script = document.createElement("script");
// This script has a callback function that will run when the script has
// finished loading.
script.src = "https://apis.google.com/js/api.js";
script.type = "text/javascript";
script.onload = auth.handleClientLoad;
document.getElementsByTagName("head")[0].appendChild(script);
