/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

export let xgapi :any = {};

export function handleClientLoad() {
  // Loads the client library and the auth2 library together for efficiency.
  // Loading the auth2 library is optional here since `gapi.client.init`
  // function will load it if not already loaded. Loading it upfront can save
  // one network request.
  gapi.load('client:auth2:picker', initClient);
}

function initClient() {
  // Initialize the client with API key and People API, and initialize OAuth
  // with an OAuth 2.0 client ID and scopes (space delimited string) to
  // request access.
  gapi.client.init({
      // apiKey: 'YOUR_API_KEY',
      discoveryDocs: [
        'https://people.googleapis.com/$discovery/rest?version=v1',
        'https://sheets.googleapis.com/$discovery/rest?version=v4',
        'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      clientId: '1026298405002-4ablf8sti600mfvd2d8qsduhllvjvnue.apps.googleusercontent.com',
      scope: 'profile https://www.googleapis.com/auth/drive.file'
  }).then(function (authResult) {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

// Create and render a Picker object for picking user Photos.
function createPicker() {
  var picker = new google.picker.PickerBuilder().
      addView(google.picker.ViewId.PHOTOS).
      setOAuthToken(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token).
      //setDeveloperKey(developerKey).
      setCallback(pickerCallback).
      build();
  picker.setVisible(true);
}

// A simple callback implementation.
function pickerCallback(data:any) {
  var url = 'nothing';
  if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
    var doc = data[google.picker.Response.DOCUMENTS][0];
    url = doc[google.picker.Document.URL];
  }
  var message = 'You picked: ' + url;
  document.getElementById('result').innerHTML = message;
}

function updateSigninStatus(isSignedIn:boolean) {
  xgapi.foo = gapi;
  // When signin status changes, this function is called.
  // If the signin status is changed to signedIn, we make an API call.
  if (isSignedIn) {
    makeApiCall();
  }
}

export function handleSignInClick(event:Event) {
  // Ideally the button should only show up after gapi.client.init finishes,
  // so that this handler won't be called before OAuth is initialized.
  gapi.auth2.getAuthInstance().signIn();
}

export function handleSignOutClick(event:Event) {
  gapi.auth2.getAuthInstance().signOut();
}

function createFolder() : Promise<void> {
  return gapi.client.drive.files.create({
    resource: {
      name : 'Fitts-Experimenter',
      mimeType : 'application/vnd.google-apps.folder'
    },
    fields: 'id'
  }).then((r) => {
    console.log('Folder Create Result id: ' + r.result.id);

// gapi.client.sheets.spreadsheets.values.get({
//           spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
//           range: 'Class Data!A2:E',
//         }).then(function(response) {
//           var range = response.result;
//           if (range.values.length > 0) {
//             appendPre('Name, Major:');
//             for (i = 0; i < range.values.length; i++) {
//               var row = range.values[i];
//               // Print columns A and E, which correspond to indices 0 and 4.
//               appendPre(row[0] + ', ' + row[4]);
//             }
//           } else {
//             appendPre('No data found.');
//           }
//         }, function(response) {
//           appendPre('Error: ' + response.result.error.message);
//         });

  });
}

function makeApiCall() {
  // Make an API call to the People API, and print the user's given name.
  gapi.client.people.people.get({
    resourceName: 'people/me'
  }).then(function(response) {
    console.log('Hello, ' + response.result.names[0].givenName);
  }, function(reason) {
    console.log('Error: ' + reason.result.error.message);
  });

  gapi.client.drive.files.list({
    q:'mimeType = "application/vnd.google-apps.folder" and name = "Fitts-Experimenter" and trashed = false'
  }).then((r) => {
    console.log(r.result.files);
    if(r.result.files.length === 0) {
      createFolder();
    } else {
      console.log('Existing folder id: ' + r.result.files[0].id);
    }
  });

  // console.log(gapi.client.drive);
  // createPicker();
}
