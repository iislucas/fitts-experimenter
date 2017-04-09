webpackJsonp([1,4],{

/***/ 1167:
/***/ (function(module, exports) {

module.exports = "<md-sidenav-container fullscreen>\n    <md-sidenav #sidenav mode=\"push\" opened=\"false\">\n      <md-toolbar color=\"primary\">\n          <button md-icon-button (click)=\"sidenav.toggle()\">\n            <md-icon>menu</md-icon>\n          </button>\n          <span>Menu</span>\n      </md-toolbar>\n      <div class=\"menu\">\n        <div><input #fileEl type=\"file\" hidden name=\"file\" (change)=\"fileSelected($event)\" />\n            <button md-button (click)=\"loadTrialsFromFile()\">\n            <md-icon>file_upload</md-icon>Upload more trials...</button>\n        </div>\n        <div><button md-button (click)=\"saveTrials()\">\n            <md-icon>check_circle</md-icon>Save trials</button>\n        </div>\n        <div><button md-button (click)=\"saveTrialsToFile()\">\n            <a #downloadLinkEl hidden></a>\n            <md-icon>file_download</md-icon>Download trials </button>\n        </div>\n        <hr />\n        <div><button md-button (click)=\"restoreTrials()\">\n            <md-icon>restore</md-icon>Restore trials</button>\n        </div>\n        <hr />\n        <div><button md-button (click)=\"deleteAllTrials()\">\n            <md-icon>delete</md-icon>Delete all trials</button>\n        </div>\n      </div>\n    </md-sidenav>\n    <div class=\"my-content\">\n      <md-toolbar color=\"primary\">\n          <button md-icon-button (click)=\"sidenav.toggle()\">\n            <md-icon>menu</md-icon>\n          </button>\n          <span id=\"title\">{{title}}</span>\n      </md-toolbar>\n\n      <md-tab-group #tabBar>\n        <md-tab label=\"Run a Trial\">\n          <div>\n            <md-input-container class=\"codeInput\">\n              <textarea mdInput rows=\"26\"\n                placeholder=\"Trial Settings\" [(ngModel)]=\"trialParamsString\"></textarea>\n            </md-input-container>\n          </div>\n          <div>\n            <button md-raised-button (click)=\"resetParams()\">Reset</button>\n            <button md-raised-button (click)=\"loadParams()\">Load</button>\n            <button md-raised-button (click)=\"saveParams()\">Save</button>\n            <button md-fab (click)=\"startTrial()\">Start</button>\n          </div><br>\n        </md-tab>\n        <md-tab label=\"Tials List\">\n          <button md-raised-button (click)=\"splitByDistance()\">Split by distance</button>\n          <button md-raised-button (click)=\"mergeByDistance()\">Merge by distance</button>\n\n          <div *ngFor=\"let data of allTrialsData; let i=index\">\n            <md-card>\n              <app-fitts-trial-view [data]=\"data\" [index]=\"i\"\n                (deleteEvent)=\"deleteOneTrial($event)\"></app-fitts-trial-view>\n            </md-card>\n          </div>\n        </md-tab>\n        <md-tab label=\"Visualization\">\n          <md-card>\n            <div>\n              <md-input-container class=\"codeInput\">\n                  <textarea mdInput rows=\"1\"\n                    placeholder=\"Selected trials (RegExp)\" [(ngModel)]=\"vizGroupSearchRegex\"></textarea>\n              </md-input-container>\n              <md-input-container class=\"codeInput\">\n                  <textarea mdInput rows=\"1\"\n                    placeholder=\"Trial Grouping (Subst)\" [(ngModel)]=\"vizGroupSubst\"></textarea>\n              </md-input-container>\n              <md-checkbox checked [(ngModel)]=\"showGraph\">Show trials-distance graphs</md-checkbox>\n              <md-checkbox checked [(ngModel)]=\"showTapsPlot\">Show tap-scatter</md-checkbox>\n            </div>\n            <button md-raised-button (click)=\"resetVisualizationPrefs()\">Reset</button>\n            <button md-raised-button (click)=\"restoreVisualizationPrefs()\">Load</button>\n            <button md-raised-button (click)=\"saveVisualizationPrefs()\">Save</button>\n            <button md-raised-button (click)=\"showVizualizations()\">Show</button>\n          </md-card>\n          <md-card *ngFor=\"let group of selectedTrialGroups; let gindex=index\">\n              <div class=\"groupTitle\">{{gindex}} : {{group.name}}</div>\n              <div *ngFor=\"let trial of group.trials; let i=index\">\n                <app-fitts-trial-view [data]=\"trial\" [index]=\"i\"\n                  (delete)=\"removeOneTrial($event)\"></app-fitts-trial-view>\n              </div>\n              <app-fitts-visualization [trials]=\"group.trials\"\n                [showGraph]=\"showGraph\" [showTapsPlot]=\"showTapsPlot\"></app-fitts-visualization>\n          </md-card>\n        </md-tab>\n        <md-tab label=\"Stats Table\">\n          <md-input-container class=\"codeInput\">\n                  <textarea mdInput rows=\"1\"\n                    placeholder=\"Selected trials (RegExp)\" [(ngModel)]=\"tableSearchRegex\"></textarea>\n          </md-input-container>\n          <button md-raised-button (click)=\"resetTablePrefs()\">Reset</button>\n          <button md-raised-button (click)=\"restoreTablePrefs()\">Load</button>\n          <button md-raised-button (click)=\"saveTablePrefs()\">Save</button>\n          <button md-raised-button (click)=\"showTable()\">Show</button>\n\n          <table class=\"statsTable\" *ngIf=\"tableSelectedTrials.length > 0\"><tr>\n            <th>i</th>\n            <th>id</th>\n            <th>description</th>\n            <th>tags</th>\n            <th>nevents</th>\n            <th>lookahead</th>\n            <th>distances</th>\n            <th>mt_mean</th>\n            <th>eff_width</th>\n            <th>mean_d</th>\n            <th>std_d</th>\n            </tr>\n          <tr *ngFor=\"let trial of tableSelectedTrials; let i=index\">\n            <td>{{i}}</td>\n            <td>{{dateStringifyTrialLog(trial.log)}}</td>\n            <td>{{trial.log.description}}</td>\n            <td>{{trial.log.tags}}</td>\n            <td>{{trial.log.events.length}}</td>\n            <td>{{trial.lookahead}}</td>\n            <td>{{distancesString(trial.distances)}}</td>\n            <td>{{trial.stats.summary.mt_mean}}</td>\n            <td>{{trial.stats.summary.eff_width}}</td>\n            <td>{{trial.stats.summary.mean_d}}</td>\n            <td>{{trial.stats.summary.std_d}}</td>\n          </tr>\n          </table>\n\n        </md-tab>\n      </md-tab-group>\n    </div>\n</md-sidenav-container>"

/***/ }),

/***/ 1168:
/***/ (function(module, exports) {

module.exports = "<div class=\"trialTitle\" (click)=\"showDetails = !showDetails\"><b>{{index + 1}}</b>:\n    {{ trialString(data) }}\n</div>\n<div *ngIf=\"showDetails\">\n  <md-input-container><input mdInput placeholder=\"Description\"\n      [(ngModel)]=\"data.log.description\">\n      </md-input-container>\n  <md-input-container><input mdInput placeholder=\"Tags\"\n      [(ngModel)]=\"data.log.tags\">\n      </md-input-container>\n  <button md-raised-button (click)=\"showLog(data)\">View</button>\n  <button md-raised-button (click)=\"delete()\">Delete</button>\n</div>"

/***/ }),

/***/ 1169:
/***/ (function(module, exports) {

module.exports = "<div #vizEl></div>"

/***/ }),

/***/ 1222:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(557);


/***/ }),

/***/ 285:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mathjs__ = __webpack_require__(492);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mathjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mathjs__);
/* unused harmony export distancesString */
/* harmony export (immutable) */ __webpack_exports__["c"] = dateStringifyTrialLog;
/* harmony export (immutable) */ __webpack_exports__["a"] = trialString;
/* unused harmony export updatePrevCirclePositions */
/* unused harmony export trialEventsByDistances */
/* harmony export (immutable) */ __webpack_exports__["e"] = splitTrialByDistances;
/* unused harmony export distancesOfTrial */
/* harmony export (immutable) */ __webpack_exports__["d"] = makeTrialData;
/* unused harmony export calcTrialOrientation */
/* harmony export (immutable) */ __webpack_exports__["b"] = eventStats;
/* unused harmony export stats */
/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

function distancesString(distances) {
    let outputs = [];
    for (let d of Object.keys(distances).sort()) {
        outputs.push(`${d}:${distances[d]}`);
    }
    return outputs.join(',');
}
function dateStringifyTrialLog(log) {
    let length = Math.round((log.end_timestamp - log.start_timestamp) / 1000);
    let date = new Date(log.start_timestamp);
    function makeTwoDigit(x) {
        let s = `${x}`;
        if (s.length < 2) {
            s = '0' + s;
        }
        return s;
    }
    return `${date.getFullYear()}-${makeTwoDigit(date.getMonth() + 1)}` +
        `-${makeTwoDigit(date.getDate())}` +
        `@${makeTwoDigit(date.getHours())}:${makeTwoDigit(date.getMinutes())}` +
        `:${makeTwoDigit(date.getSeconds())}+${makeTwoDigit(length)}s`;
}
function trialString(t) {
    return `description:${t.log.description} ` +
        `time:${dateStringifyTrialLog(t.log)} ` +
        `lookahead:${t.lookahead} ` +
        `orientation:${t.orientation} ` +
        `distances:[${distancesString(t.distances)}] ` +
        `tags:${t.log.tags || ''} `;
}
// Note: changes events.
function updatePrevCirclePositions(events) {
    let last_pos;
    for (let e of events) {
        if (e.prevCircleClickedPos === undefined) {
            e.prevCircleClickedPos = last_pos;
        }
        last_pos = e.circleClickedPos;
    }
}
function trialEventsByDistances(trialLog) {
    updatePrevCirclePositions(trialLog.events);
    let eventsByDistance = {};
    for (let e of trialLog.events) {
        let d_key = 'undefined';
        if (e.prevCircleClickedPos !== undefined && e.circleClickedPos !== undefined) {
            d_key = `${Math.sqrt(Math.pow(e.prevCircleClickedPos[0] - e.circleClickedPos[0], 2) +
                Math.pow(e.prevCircleClickedPos[1] - e.circleClickedPos[1], 2))}`;
        }
        if (!(d_key in eventsByDistance)) {
            eventsByDistance[d_key] = [];
        }
        eventsByDistance[d_key].push(e);
    }
    return eventsByDistance;
}
function splitTrialByDistances(trialLog) {
    let eventsByDistance = trialEventsByDistances(trialLog);
    let logsByDistance = Object.keys(eventsByDistance).map(d => {
        let newLog = Object.assign({}, trialLog);
        newLog.events = eventsByDistance[d];
        return newLog;
    });
    return logsByDistance;
}
function distancesOfTrial(trialLog) {
    let eventsByDistance = trialEventsByDistances(trialLog);
    let distances = {};
    for (let d_key of Object.keys(eventsByDistance)) {
        distances[d_key] = eventsByDistance[d_key].length;
    }
    return distances;
}
function makeTrialData(trialLog) {
    let stats = eventStats(trialLog.events);
    let orientation = calcTrialOrientation(trialLog);
    let lookahead = '?';
    if (trialLog.params.circle1.lookahead && trialLog.params.circle2.lookahead) {
        lookahead = '2';
    }
    else if (!trialLog.params.circle1.lookahead && !trialLog.params.circle2.lookahead) {
        lookahead = '1';
    }
    return {
        log: trialLog,
        stats: stats,
        orientation: orientation,
        distances: distancesOfTrial(trialLog),
        lookahead: lookahead,
    };
}
function calcTrialOrientation(trialLog) {
    let orientation = "?";
    if (trialLog.params.circle1.init_angle === 0
        || trialLog.params.circle2.init_angle === 180) {
        orientation = "T";
    }
    else if (trialLog.params.circle1.init_angle === 90
        || trialLog.params.circle2.init_angle === 270) {
        orientation = "M";
    }
    return orientation;
}
// Take the first |percentile| of elements.
function takeFirstPercentile(ns, percentile) {
    ns.length;
    let selected = [];
    let dropped = [];
    let i = 0;
    for (; percentile >= (i / (ns.length - 1)) && i < ns.length; i++) {
        selected.push(ns[i]);
    }
    for (; i < ns.length; i++) {
        dropped.push(ns[i]);
    }
    return { selected: selected, dropped: dropped };
}
// Returns indexes to keep.
function removeOutlers(ns, f, percentile) {
    let indexed_ns = ns.map((n, i) => { return { n: n, i: i }; });
    let selected_ns = takeFirstPercentile(indexed_ns.sort((n1, n2) => { return f(n1.n) - f(n2.n); }), percentile);
    return { selected: selected_ns.selected.map((indexed_n) => { return indexed_n.n; }),
        dropped: selected_ns.dropped.map((indexed_n) => { return indexed_n.n; }) };
}
function mean(xs) {
    if (xs.length === 0) {
        return 0;
    }
    else {
        return __WEBPACK_IMPORTED_MODULE_0_mathjs__["mean"](xs);
    }
}
function std(xs) {
    if (xs.length === 0) {
        return 0;
    }
    else {
        return __WEBPACK_IMPORTED_MODULE_0_mathjs__["std"](xs);
    }
}
function eventStats(events, targetName) {
    let realEvents = events;
    // events.slice(
    //       5, // trialLog.params.skipFirstNTaps,
    //       events.length);
    if (targetName) {
        realEvents = realEvents.filter((e) => { return e.circleClickedOn === targetName; });
    }
    let absdxs = realEvents.map((e) => { return Math.abs(e.dx); });
    let absdys = realEvents.map((e) => { return Math.abs(e.dy); });
    let ds = realEvents.map((e) => { return e.distanceToCenter; });
    let xWidth = takeFirstPercentile(absdxs.sort((n, m) => { return n - m; }), 0.95).selected.pop();
    let yWidth = takeFirstPercentile(absdys.sort((n, m) => { return n - m; }), 0.95).selected.pop();
    let width = takeFirstPercentile(ds.sort((n, m) => { return n - m; }), 0.95).selected.pop();
    // Removes points with 95%
    let selectedEvents = removeOutlers(realEvents, (n) => { return n.distanceToCenter; }, 0.95);
    realEvents = selectedEvents.selected;
    // console.log('selected ds: ' + JSON.stringify(
    //     selectedEvents.selected.map((e) => { return e.distanceToCenter; }), 
    //     null, 2));
    // console.log('dropped ds: ' + JSON.stringify(
    //     selectedEvents.dropped.map((e) => { return e.distanceToCenter; }), 
    //     null, 2));
    let dxs = realEvents.map((e) => { return e.dx; });
    let dys = realEvents.map((e) => { return e.dy; });
    ds = realEvents.map((e) => { return e.distanceToCenter; });
    absdxs = realEvents.map((e) => { return Math.abs(e.dx); });
    absdys = realEvents.map((e) => { return Math.abs(e.dy); });
    let ts = realEvents.map((e) => { return e.timeSinceLastClick; });
    let values = {
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
    let selected_ts = removeOutlers(values.ts, (n) => { return n; }, 0.95);
    // console.log('selected ts: ' + JSON.stringify(selected_ts.selected, null, 2));
    // console.log('dropped ts: ' + JSON.stringify(selected_ts.dropped, null, 2));
    let summary = {
        n: values.ts.length,
        ts_n: selected_ts.selected.length,
        ds_n: values.ds.length,
        mt_mean: Math.round(mean(selected_ts.selected)),
        mt_std: std(selected_ts.selected),
        eff_width: Math.round(values.width),
        eff_xwidth: Math.round(values.xWidth),
        eff_ywidth: Math.round(values.yWidth),
        mean_d: Math.round(mean(values.ds)),
        std_d: Math.round(std(values.ds)),
        mean_dx: Math.round(mean(values.dxs)),
        std_dx: Math.round(std(values.dxs)),
        mean_dy: Math.round(mean(values.dys)),
        std_dy: Math.round(std(values.dys)),
    };
    return {
        data: values,
        summary: summary,
    };
}
function stats(trialLog, targetName) {
    return eventStats(trialLog.events, targetName);
}
//# sourceMappingURL=trial.js.map

/***/ }),

/***/ 556:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 556;


/***/ }),

/***/ 557:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(682);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(703);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(710);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 702:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_material__ = __webpack_require__(429);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_d3__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_params__ = __webpack_require__(708);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_trial__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__lib_helpers__ = __webpack_require__(707);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






const STORAGE_KEY_LOGS = 'logs';
const STORAGE_KEY_PARAMS = 'params';
const STORAGE_KEY_VIZ_PREFS = 'viz-prefs';
const STORAGE_KEY_TABLE_PREFS = 'table-prefs';
const TAB_INDEX_RUN_TRIAL = 0;
const TAB_INDEX_TRIALS = 1;
const TAB_INDEX_VIZ = 2;
const DEFAULT_VIZ_PREFS = {
    vizGroupSearchRegex: '^.* distances:\\[([^0]\\d+):\\d+([^\\]]+)\\] .*$',
    vizGroupSubst: '$1',
};
const DEFAULT_TABLE_PREFS = {
    tableSearchRegex: '^.* distances:\\[([^0]\\d+):\\d+([^\\]]+)\\] .*$',
};
let AppComponent = class AppComponent {
    constructor() {
        this.title = 'Fitts Experimenter';
        // All data.
        this.allTrialsData = [];
        // Used for table.
        this.tableSearchRegex = DEFAULT_TABLE_PREFS.tableSearchRegex;
        this.tableSelectedTrials = [];
        // Used for Viz groups.
        this.vizGroupSearchRegex = DEFAULT_VIZ_PREFS.vizGroupSearchRegex;
        this.vizGroupSubst = DEFAULT_VIZ_PREFS.vizGroupSubst;
        this.selectedTrialGroups = [];
        this.dateStringifyTrialLog = __WEBPACK_IMPORTED_MODULE_4__lib_trial__["c" /* dateStringifyTrialLog */];
    }
    ngOnInit() {
        this.restoreVisualizationPrefs();
        this.restoreParams();
        this.restoreTrials();
    }
    // Table Preferences
    // TODO: Generalize a view's prefs into a save-class thing.
    saveTablePrefs() {
        localStorage.setItem(STORAGE_KEY_TABLE_PREFS, JSON.stringify({
            tableSearchRegex: this.tableSearchRegex,
        }));
    }
    restoreTablePrefs() {
        let prefsString = localStorage.getItem(STORAGE_KEY_VIZ_PREFS);
        if (!prefsString) {
            this.resetTablePrefs();
            return;
        }
        let prefs = JSON.parse(prefsString);
        this.tableSearchRegex = prefs.tableSearchRegex;
    }
    resetTablePrefs() {
        this.vizGroupSearchRegex = DEFAULT_TABLE_PREFS.tableSearchRegex;
    }
    // Visualization Preferences
    saveVisualizationPrefs() {
        localStorage.setItem(STORAGE_KEY_VIZ_PREFS, JSON.stringify({
            vizGroupSearchRegex: this.vizGroupSearchRegex,
            vizGroupSubst: this.vizGroupSubst,
        }));
    }
    restoreVisualizationPrefs() {
        let prefsString = localStorage.getItem(STORAGE_KEY_VIZ_PREFS);
        if (!prefsString) {
            this.resetVisualizationPrefs();
            return;
        }
        let prefs = JSON.parse(prefsString);
        this.vizGroupSearchRegex = prefs.vizGroupSearchRegex;
        this.vizGroupSubst = prefs.vizGroupSubst;
    }
    resetVisualizationPrefs() {
        this.vizGroupSearchRegex = DEFAULT_VIZ_PREFS.vizGroupSearchRegex;
        this.vizGroupSubst = DEFAULT_VIZ_PREFS.vizGroupSubst;
    }
    // Default Trial Params
    saveParams() {
        localStorage.setItem(STORAGE_KEY_PARAMS, this.trialParamsString);
    }
    restoreParams() {
        this.trialParamsString = localStorage.getItem(STORAGE_KEY_PARAMS);
        if (!this.trialParamsString) {
            this.resetParams();
        }
    }
    resetParams() {
        this.trialParamsString = JSON.stringify(__WEBPACK_IMPORTED_MODULE_3__lib_params__["a" /* defaults */], null, 2);
    }
    startTial() {
        let trialParams = JSON.parse(this.trialParamsString);
    }
    saveTrialsToFile() {
        let file = new File([JSON.stringify(this.allTrialsData.map(d => d.log))], 'fitts-app-' + __WEBPACK_IMPORTED_MODULE_5__lib_helpers__["a" /* dateStringOfTimestamp */](Date.now()) + '.json', { type: 'application/octet-stream;charset=utf-8' });
        // let data = new Blob([experiment.textOfLogs()],
        //     { type: 'text/csv;charset=utf-8'});
        let url = URL.createObjectURL(file);
        this.downloadLinkEl.nativeElement.href = url;
        this.downloadLinkEl.nativeElement.download = file.name;
        this.downloadLinkEl.nativeElement.click();
        // window.open(url);
        this.sidenav.close().then(() => { URL.revokeObjectURL(url); });
    }
    // When UI wants us to remove a trial.
    deleteOneTrial(index) {
        console.log(index);
        this.allTrialsData.splice(index, 1);
    }
    // Load/save of trials.
    deleteAllTrials() {
        this.allTrialsData = [];
        this.sidenav.close();
    }
    saveTrials() {
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.allTrialsData.map((d) => d.log)));
        this.sidenav.close();
    }
    restoreTrials() {
        let trialLogs = JSON.parse(localStorage.getItem(STORAGE_KEY_LOGS));
        if (!trialLogs) {
            this.allTrialsData = [];
        }
        else {
            try {
                this.allTrialsData = trialLogs.map(t => __WEBPACK_IMPORTED_MODULE_4__lib_trial__["d" /* makeTrialData */](t));
            }
            catch (e) {
                console.error(`Cannot load trialLogs: ${e.message}`);
                this.allTrialsData = [];
            }
        }
        this.sidenav.close();
    }
    loadTrialsFromFile() {
        this.fileEl.nativeElement.click();
    }
    // Called indirectly by loadTrialsFromFile
    fileSelected(event) {
        let files = event.target.files; // FileList object
        if (files === []) {
            return;
        }
        // files is a FileList of File objects. List some properties.
        for (let f of files) {
            console.log(`name: ${f.name}; type: ${f.type}; ` +
                `size: ${f.size}, ` +
                `lastmodified: ${f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'unknown'}`);
            let filekind = 'unknown';
            if (f.type.match('csv')) {
                filekind = 'csv';
            }
            else if (f.type.match('json')) {
                filekind = 'json';
            }
            else {
                console.warn('file must be csv or json; going to pretend it is json and see what happens...');
                filekind = 'json';
            }
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (e) => {
                // Render thumbnail.
                if (filekind === 'csv') {
                    console.log('parsing csv');
                    let csv = __WEBPACK_IMPORTED_MODULE_2_d3__["csvParse"](e.target.result);
                    console.log(csv);
                }
                else if (filekind === 'json') {
                    console.log('parsing json');
                    let moreLogs = JSON.parse(e.target.result);
                    // Set description according to filename.
                    for (let l of moreLogs) {
                        if (!l.description || l.description === '') {
                            l.description = f.name;
                        }
                    }
                    let moreData = moreLogs.map(l => __WEBPACK_IMPORTED_MODULE_4__lib_trial__["d" /* makeTrialData */](l));
                    // this.allTrialsData = moreData.concat(this.allTrialsData);
                    let combinedLogs = {};
                    for (let l of this.allTrialsData) {
                        combinedLogs[l.log.trialId] = l;
                    }
                    // Newly loaded data overwrites local data.
                    for (let l of moreData) {
                        combinedLogs[l.log.trialId] = l;
                    }
                    //
                    let combinedLogsList = [];
                    for (let k of Object.keys(combinedLogs)) {
                        combinedLogsList.push(combinedLogs[k]);
                    }
                    this.allTrialsData = combinedLogsList.sort((d1, d2) => d1.log.start_timestamp - d2.log.start_timestamp);
                    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.allTrialsData.map(d => d.log)));
                    console.log(this.allTrialsData);
                }
            };
            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
        files = [];
        this.sidenav.close();
        this.tabsGroup.selectedIndex = TAB_INDEX_TRIALS;
    }
    showVizualizations() {
        this.selectedTrialGroups = [];
        try {
            let trialSearchRegExp = new RegExp(this.vizGroupSearchRegex);
            let trialGroups = {};
            for (let d of this.allTrialsData) {
                let tagStringToMatch = __WEBPACK_IMPORTED_MODULE_4__lib_trial__["a" /* trialString */](d);
                if (trialSearchRegExp.test(tagStringToMatch)) {
                    let key = tagStringToMatch.replace(trialSearchRegExp, this.vizGroupSubst);
                    console.log(`tagStringToMatch: ${tagStringToMatch}`);
                    console.log(`this.trialGrouping: ${this.vizGroupSubst}`);
                    console.log(`key: ${key}`);
                    if (!(key in trialGroups)) {
                        trialGroups[key] = [];
                    }
                    trialGroups[key].push(d);
                }
            }
            //
            for (let key of Object.keys(trialGroups)) {
                this.selectedTrialGroups.push({
                    name: key,
                    trials: trialGroups[key],
                });
            }
        }
        catch (e) {
            console.warn('bad regexp.', e);
        }
    }
    showTable() {
        this.tableSelectedTrials = [];
        try {
            let trialSearchRegExp = new RegExp(this.tableSearchRegex);
            for (let d of this.allTrialsData) {
                if (trialSearchRegExp.test(__WEBPACK_IMPORTED_MODULE_4__lib_trial__["a" /* trialString */](d))) {
                    this.tableSelectedTrials.push(d);
                }
            }
        }
        catch (e) {
            console.warn('bad regexp.', e);
        }
    }
    distancesString(distances) {
        let outputs = [];
        for (let d of Object.keys(distances).sort()) {
            outputs.push(`${d}`);
        }
        return outputs.join(',');
    }
    splitByDistance() {
        console.log(JSON.stringify(this.allTrialsData.map(d => d.log), null, 2));
        let newLogs = [];
        for (let t of this.allTrialsData) {
            newLogs = newLogs.concat(__WEBPACK_IMPORTED_MODULE_4__lib_trial__["e" /* splitTrialByDistances */](t.log));
        }
        this.allTrialsData = newLogs.map(l => __WEBPACK_IMPORTED_MODULE_4__lib_trial__["d" /* makeTrialData */](l));
        console.log(JSON.stringify(newLogs, null, 2));
    }
    mergeByDistance() {
    }
};
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* ViewChild */])('fileEl'), 
    __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* ElementRef */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* ElementRef */]) === 'function' && _a) || Object)
], AppComponent.prototype, "fileEl", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* ViewChild */])('downloadLinkEl'), 
    __metadata('design:type', (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* ElementRef */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* ElementRef */]) === 'function' && _b) || Object)
], AppComponent.prototype, "downloadLinkEl", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* ViewChild */])('tabBar'), 
    __metadata('design:type', (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_material__["b" /* MdTabGroup */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_material__["b" /* MdTabGroup */]) === 'function' && _c) || Object)
], AppComponent.prototype, "tabsGroup", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* ViewChild */])('sidenav'), 
    __metadata('design:type', (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__angular_material__["c" /* MdSidenav */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_material__["c" /* MdSidenav */]) === 'function' && _d) || Object)
], AppComponent.prototype, "sidenav", void 0);
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__(1167),
        styles: [__webpack_require__(787)],
    }), 
    __metadata('design:paramtypes', [])
], AppComponent);
var _a, _b, _c, _d;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 703:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_hammerjs__ = __webpack_require__(791);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_hammerjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_hammerjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_material__ = __webpack_require__(429);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(702);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__fitts_visualization_fitts_visualization_component__ = __webpack_require__(705);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__fitts_trial_view_fitts_trial_view_component__ = __webpack_require__(704);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









let AppModule = class AppModule {
};
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_7__fitts_visualization_fitts_visualization_component__["a" /* FittsVisualizationComponent */],
            __WEBPACK_IMPORTED_MODULE_8__fitts_trial_view_fitts_trial_view_component__["a" /* FittsTrialViewComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_5__angular_material__["a" /* MaterialModule */],
        ],
        providers: [],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */]]
    }), 
    __metadata('design:paramtypes', [])
], AppModule);
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 704:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_trial__ = __webpack_require__(285);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FittsTrialViewComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let FittsTrialViewComponent = class FittsTrialViewComponent {
    constructor() {
        this.deleteEvent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["r" /* EventEmitter */]();
        this.showDetails = false;
        this.trialString = __WEBPACK_IMPORTED_MODULE_1__lib_trial__["a" /* trialString */];
    }
    ngOnInit() {
    }
    showLog(t) {
        console.log(JSON.stringify(t, null, 2));
    }
    delete() {
        console.log(`clicked on: ${this.index}`);
        this.deleteEvent.emit(this.index);
    }
};
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Input */])(), 
    __metadata('design:type', Object)
], FittsTrialViewComponent.prototype, "data", void 0);
__decorate([
    // trial.TrialData;
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Input */])(), 
    __metadata('design:type', Number)
], FittsTrialViewComponent.prototype, "index", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["s" /* Output */])(), 
    __metadata('design:type', Object)
], FittsTrialViewComponent.prototype, "deleteEvent", void 0);
FittsTrialViewComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* Component */])({
        selector: 'app-fitts-trial-view',
        template: __webpack_require__(1168),
        styles: [__webpack_require__(788)]
    }), 
    __metadata('design:paramtypes', [])
], FittsTrialViewComponent);
// <!--{{ dateStringifyTrialLog(data.log) }}
// (nevents: {{ data.log.events.length }})
// [ {{ data.log.trialId }} ]<br>
// o={{ data.orientation }}, d:n=[{{ distancesString(data.distances) }}],
// l={{ data.lookahead }}--> 
//# sourceMappingURL=fitts-trial-view.component.js.map

/***/ }),

/***/ 705:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_mathjs__ = __webpack_require__(492);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_mathjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_mathjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_trial__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_charts__ = __webpack_require__(706);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_taps_viz__ = __webpack_require__(709);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FittsVisualizationComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let FittsVisualizationComponent = class FittsVisualizationComponent {
    constructor() {
        this.trials = [];
        this.showGraph = false;
        this.showTapsPlot = false;
        this.showc1c2TapsPlot = false;
    }
    ngOnInit() {
        if (this.showGraph) {
            this.addGraph();
        }
        if (this.showTapsPlot) {
            this.addTapViz();
        }
    }
    addGraph() {
        let d_t_avg_data = [];
        let dx_t_avg_data = [];
        let dy_t_avg_data = [];
        for (let t of this.trials) {
            let stats = t.stats;
            if (stats.data.ts.length > 0 &&
                stats.data.ds.length > 0 &&
                stats.data.dxs.length > 0 &&
                stats.data.dys.length > 0) {
                d_t_avg_data.push({
                    x: __WEBPACK_IMPORTED_MODULE_1_mathjs__["mean"](stats.data.ts),
                    y: __WEBPACK_IMPORTED_MODULE_1_mathjs__["mean"](stats.data.ds),
                });
                dx_t_avg_data.push({
                    x: __WEBPACK_IMPORTED_MODULE_1_mathjs__["mean"](stats.data.ts),
                    y: __WEBPACK_IMPORTED_MODULE_1_mathjs__["mean"](stats.data.dxs),
                });
                dy_t_avg_data.push({
                    x: __WEBPACK_IMPORTED_MODULE_1_mathjs__["mean"](stats.data.ts),
                    y: __WEBPACK_IMPORTED_MODULE_1_mathjs__["mean"](stats.data.dys),
                });
            }
        }
        new __WEBPACK_IMPORTED_MODULE_3__lib_charts__["a" /* Chart */](400, 200, { 'dx': { data: dx_t_avg_data, fill: 'rgba(255, 0, 0, 0.5)', },
            'dy': { data: dy_t_avg_data, fill: 'rgba(0, 255, 0, 0.5)', },
            'd': { data: d_t_avg_data, fill: 'rgba(0, 0, 255, 0.5)', },
        }, this.vizEl.nativeElement);
    }
    addTapViz() {
        let aggregateEvents = [];
        for (let t of this.trials) {
            aggregateEvents = aggregateEvents.concat(t.log.events);
        }
        let stats = __WEBPACK_IMPORTED_MODULE_2__lib_trial__["b" /* eventStats */](aggregateEvents);
        if (stats.data.ts.length === 0 ||
            stats.data.ds.length === 0 ||
            stats.data.dxs.length === 0 ||
            stats.data.dys.length === 0) {
            return;
        }
        let tapPoints = aggregateEvents.map((e) => {
            return { x: e.dx, y: e.dy, circleClickedOn: e.circleClickedOn };
        });
        new __WEBPACK_IMPORTED_MODULE_4__lib_taps_viz__["a" /* TapsViz */]({
            name: 'all',
            tapPoints: tapPoints,
            tapFill: 'rgba(255, 0, 0, 0.2)',
            tapStroke: 'rgba(0, 0, 0, 0.2)',
            effectiveWidth: stats.summary.eff_width,
            effectiveWidthFill: 'rgba(0, 0, 0, 0.1)',
            effectiveWidthStroke: 'rgba(0, 0, 0, 0.5)',
        }, this.vizEl.nativeElement);
        if (this.showc1c2TapsPlot) {
            let targetsTapPoints = {};
            for (let t of tapPoints) {
                if (!(t.circleClickedOn in targetsTapPoints)) {
                    targetsTapPoints[t.circleClickedOn] = [];
                }
                targetsTapPoints[t.circleClickedOn].push(t);
            }
            for (let target of Object.keys(targetsTapPoints)) {
                new __WEBPACK_IMPORTED_MODULE_4__lib_taps_viz__["a" /* TapsViz */]({
                    name: target,
                    tapPoints: targetsTapPoints[target],
                    tapFill: 'rgba(255, 0, 0, 0.2)',
                    tapStroke: 'rgba(0, 0, 0, 0.2)',
                    effectiveWidth: stats.summary.eff_width,
                    effectiveWidthFill: 'rgba(0, 0, 0, 0.1)',
                    effectiveWidthStroke: 'rgba(0, 0, 0, 0.5)',
                }, this.vizEl.nativeElement);
            }
        }
    }
};
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Input */])(), 
    __metadata('design:type', Array)
], FittsVisualizationComponent.prototype, "trials", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Input */])(), 
    __metadata('design:type', Boolean)
], FittsVisualizationComponent.prototype, "showGraph", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Input */])(), 
    __metadata('design:type', Boolean)
], FittsVisualizationComponent.prototype, "showTapsPlot", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Input */])(), 
    __metadata('design:type', Boolean)
], FittsVisualizationComponent.prototype, "showc1c2TapsPlot", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* ViewChild */])('vizEl'), 
    __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* ElementRef */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* ElementRef */]) === 'function' && _a) || Object)
], FittsVisualizationComponent.prototype, "vizEl", void 0);
FittsVisualizationComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* Component */])({
        selector: 'app-fitts-visualization',
        template: __webpack_require__(1169),
        styles: [__webpack_require__(789)],
    }), 
    __metadata('design:paramtypes', [])
], FittsVisualizationComponent);
var _a;
//# sourceMappingURL=fitts-visualization.component.js.map

/***/ }),

/***/ 706:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_axis__ = __webpack_require__(782);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_d3_array__ = __webpack_require__(479);
/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */



function* datums_of_dataset(datasets) {
    for (let dataset_name in datasets) {
        for (let d of datasets[dataset_name].data) {
            yield d;
        }
    }
}
class Chart {
    constructor(width, height, datassets, parent, options) {
        this.datassets = datassets;
        this.options = options;
        if (options) {
            this.bounds = options.bounds;
        }
        // console.log(`drawing data: ${JSON.stringify(datassets)}`);
        let margin = { top: 20, right: 20, bottom: 30, left: 50 };
        this.width = width - margin.left - margin.right,
            this.height = height - margin.top - margin.bottom;
        var outer_svg = __WEBPACK_IMPORTED_MODULE_0_d3__["select"](parent).append('svg')
            .attr('width', this.width + margin.left + margin.right)
            .attr('height', this.height + margin.top + margin.bottom);
        var bound_rect = outer_svg.append('rect')
            .attr('x', '0')
            .attr('y', '0')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'transparent')
            .attr('stroke', 'black')
            .attr('stroke-width', '2');
        var main_g = outer_svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        let data = [];
        for (let d of datums_of_dataset(datassets)) {
            data.push(d);
        }
        if (data.length === 0) {
            main_g.append('text').text('No data');
            return;
        }
        if (!this.bounds) {
            this.bounds = {};
        }
        if (typeof (this.bounds.x_min) === 'undefined') {
            this.bounds.x_min = __WEBPACK_IMPORTED_MODULE_2_d3_array__["a" /* min */](data, (d) => { return d.x; });
        }
        if (typeof (this.bounds.x_max) === 'undefined') {
            this.bounds.x_max = __WEBPACK_IMPORTED_MODULE_2_d3_array__["b" /* max */](data, (d) => { return d.x; });
        }
        if (typeof (this.bounds.y_min) === 'undefined') {
            this.bounds.y_min = __WEBPACK_IMPORTED_MODULE_2_d3_array__["a" /* min */](data, (d) => { return d.y; });
        }
        if (typeof (this.bounds.y_max) === 'undefined') {
            this.bounds.y_max = __WEBPACK_IMPORTED_MODULE_2_d3_array__["b" /* max */](data, (d) => { return d.y; });
        }
        this.x = __WEBPACK_IMPORTED_MODULE_0_d3__["scaleLinear"]().range([0, this.width]);
        this.x.domain([this.bounds.x_min, this.bounds.x_max]);
        var xAxis = __WEBPACK_IMPORTED_MODULE_1_d3_axis__["a" /* axisBottom */](this.x).ticks(10);
        this.y = __WEBPACK_IMPORTED_MODULE_0_d3__["scaleLinear"]().range([this.height, 0]);
        this.y.domain([this.bounds.y_min, this.bounds.y_max]);
        var yAxis = __WEBPACK_IMPORTED_MODULE_0_d3__["axisLeft"](this.y).ticks(10);
        main_g.append('g') // Add the X Axis
            .attr('class', 'xaxis')
            .attr('transform', `translate(${0},${this.height})`)
            .call(xAxis);
        main_g.append('g')
            .attr('class', 'yaxis')
            .call(yAxis);
        // Adding x-axis through 0
        if (this.bounds.y_min < 0 && this.bounds.y_max > 0) {
            let xaxis_path = __WEBPACK_IMPORTED_MODULE_0_d3__["path"]();
            // Note: we have to add 0.5 because the ticks on the left add that too.
            xaxis_path.moveTo(this.x(0), this.y(0) + 0.5);
            xaxis_path.lineTo(this.x(this.bounds.x_max), this.y(0) + 0.5);
            xaxis_path.closePath();
            main_g.append('path')
                .attr('d', xaxis_path.toString())
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', '1')
                .attr('stroke-dasharray', '5,5')
                .attr("fill", "none")
                .attr("stroke", "rgba(0,0,0,1)")
                .attr("stroke-width", 1);
        }
        this.data_graph = main_g.append('g');
        for (let name in datassets) {
            this.addData(name, datassets[name]);
        }
    }
    addData(name, dataset) {
        this.data_graph.selectAll('g')
            .data(dataset.data)
            .enter()
            .append('circle')
            .attr('cx', (d) => { return this.x(d.x); })
            .attr('r', '3')
            .attr('cy', (d) => { return this.y(d.y); })
            .style('fill', dataset.fill ? dataset.fill : 'rgba(0,0,0,0.3)')
            .style('stroke', dataset.stroke ? dataset.stroke : 'rgba(0,0,0,0.3)')
            .style('stroke-width', '1')
            .append('text').text((d) => { return d.x + "," + d.y; });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Chart;

//# sourceMappingURL=charts.js.map

/***/ }),

/***/ 707:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export toRadians */
/* harmony export (immutable) */ __webpack_exports__["a"] = dateStringOfTimestamp;
/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */
// The basic stuff for the environment.
class PixiEnvironment {
    constructor(params) {
        this.dispose = () => {
            this.ticker.remove(this.updateFunction_);
        };
        this.updateFunction_ = (deltaTime) => {
            this.updateFunctions.map((f) => { f(deltaTime); });
            this.renderer.render(this.container);
        };
        //console.log('new env');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mousePosition = new PIXI.Point(0, 0);
        this.ticker = PIXI.ticker.shared;
        this.updateFunctions = [];
        this.renderer = PIXI.autoDetectRenderer(this.width, this.height, { backgroundColor: params.bgcolor ?
                parseInt(params.bgcolor) : 0xFFFFFF });
        this.renderer.view.style.position = 'absolute';
        this.renderer.view.style.display = 'block';
        this.renderer.autoResize = true;
        // create the root of the scene graph
        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
        this.fps = new FpsSprite(this, new PIXI.Point(0, 0));
        this.ticker.add(this.updateFunction_);
        this.container.on('mousemove', (e) => {
            this.mousePosition.set(e.data.global.x, e.data.global.y);
        });
        this.container.on('tap', (e) => {
            this.mousePosition.set(e.data.global.x, e.data.global.y);
        });
        this.container.on('click', (e) => {
            this.mousePosition.set(e.data.global.x, e.data.global.y);
        });
    }
}
/* unused harmony export PixiEnvironment */

class MeasurementTextSprite {
    constructor(env, position, name, metricFn) {
        this.position = position;
        this.name = name;
        this.metricFn = metricFn;
        this.pixiText = new PIXI.Text(name, { fontFamily: '11px Arial', fill: 0x000000, align: 'left' });
        this.pixiText.position = position;
        env.container.addChild(this.pixiText);
        env.updateFunctions.push((deltaTime) => {
            this.update(deltaTime);
        });
    }
    update(deltaTime) {
        let newValue = this.metricFn(deltaTime);
        if (newValue != null && newValue != this.oldValue) {
            this.pixiText.text = this.name + newValue;
            this.oldValue = newValue;
        }
    }
}
/* unused harmony export MeasurementTextSprite */

// Frames per second text shown at the given position.
class FpsSprite extends MeasurementTextSprite {
    constructor(env, positon) {
        super(env, positon, 'FPS: ', (timeDelta) => {
            return env.ticker.FPS;
            // return timeDelta;
        });
    }
}
/* unused harmony export FpsSprite */

class CircleSprite {
    constructor(env, radius, _centerPosition, color) {
        this.radius = radius;
        this._centerPosition = _centerPosition;
        this.color = color;
        let graphic = new PIXI.Graphics();
        // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        graphic.lineStyle(0);
        graphic.beginFill(color, 1);
        graphic.drawCircle(radius, radius, radius - 1);
        graphic.endFill();
        graphic.boundsPadding = 2;
        let texture = graphic.generateCanvasTexture();
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.interactive = true;
        this.sprite.on('click', (e) => {
            //console.log(e);
            //sprite.scale.x += 0.3;
            //sprite.scale.y += 0.3;
        });
        this._updatePosition();
        env.container.addChild(this.sprite);
    }
    _updatePosition() {
        this.sprite.position.set(this._centerPosition.x - this.radius, this._centerPosition.y - this.radius);
    }
    updateCenterPosition(x, y) {
        this._centerPosition.set(x, y);
        this._updatePosition();
    }
    getCenterPosition() {
        return this._centerPosition;
    }
}
/* unused harmony export CircleSprite */

function toRadians(degrees) {
    const DEGREES_TO_RADIANS = (Math.PI + Math.PI) / 360;
    return degrees * DEGREES_TO_RADIANS;
}
class OrbitingCircleSprite {
    constructor(env, orbitCenter, orbitDistance, orbitSpeed, angle, radius, color) {
        this.orbitCenter = orbitCenter;
        this.orbitDistance = orbitDistance;
        this.orbitSpeed = orbitSpeed;
        this.angle = angle;
        this.color = color;
        let circlePosition = new PIXI.Point(this.calculateCircleXPosition(), this.calculateCircleYPosition());
        this.circleSprite = new CircleSprite(env, radius, circlePosition, color);
        env.updateFunctions.push(() => { this.update(); });
    }
    calculateCircleYPosition() {
        return this.orbitCenter.y +
            Math.sin(toRadians(this.angle)) * this.orbitDistance;
    }
    calculateCircleXPosition() {
        return this.orbitCenter.x +
            Math.cos(toRadians(this.angle)) * this.orbitDistance;
    }
    update() {
        this.angle += this.orbitSpeed;
        if (this.angle >= 360) {
            this.angle -= 360;
        }
        this.circleSprite.updateCenterPosition(this.calculateCircleXPosition(), this.calculateCircleYPosition());
    }
}
/* unused harmony export OrbitingCircleSprite */

function dateStringOfTimestamp(timestamp) {
    let date = new Date(timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` +
        `-${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}.` +
        `${date.getMilliseconds()}`;
}
//# sourceMappingURL=helpers.js.map

/***/ }),

/***/ 708:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */
;
;
const CIRCLE1_NAME = 'c1';
/* unused harmony export CIRCLE1_NAME */

let circle1_params = {
    lookahead: true,
    orbit_distances: [200],
    speed: 0,
    init_angle: 0,
    radius: 5,
    color: '0x0000FF' //color
};
const CIRCLE2_NAME = 'c2';
/* unused harmony export CIRCLE2_NAME */

let circle2_params = {
    lookahead: true,
    orbit_distances: [200],
    speed: 0,
    init_angle: 180,
    radius: 5,
    color: '0xFF0000' //color
};
const defaults = {
    circle1: circle1_params,
    circle2: circle2_params,
    skipFirstNTaps: 3,
    durationTaps: 60,
    durationSeconds: 120,
    bgcolor: '0x000000'
};
/* harmony export (immutable) */ __webpack_exports__["a"] = defaults;

//# sourceMappingURL=params.js.map

/***/ }),

/***/ 709:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_d3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_d3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_d3_array__ = __webpack_require__(479);
/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */


// A visualization of all hits on a target.
class TapsViz {
    constructor(dataset, parent) {
        this.dataset = dataset;
        if (dataset.tapPoints.length === 0) {
            __WEBPACK_IMPORTED_MODULE_0_d3__["select"](parent).append('p').text('No taps to draw.');
            return;
        }
        this.x_min = __WEBPACK_IMPORTED_MODULE_1_d3_array__["a" /* min */](dataset.tapPoints, (d) => { return d.x; });
        this.x_max = __WEBPACK_IMPORTED_MODULE_1_d3_array__["b" /* max */](dataset.tapPoints, (d) => { return d.x; });
        this.y_min = __WEBPACK_IMPORTED_MODULE_1_d3_array__["a" /* min */](dataset.tapPoints, (d) => { return d.y; });
        this.y_max = __WEBPACK_IMPORTED_MODULE_1_d3_array__["b" /* max */](dataset.tapPoints, (d) => { return d.y; });
        let margin = 5;
        let max_r = Math.max(Math.abs(this.x_max), Math.abs(this.x_min), Math.abs(this.y_max), Math.abs(this.y_min));
        this.width = max_r * 2 + margin * 2;
        this.height = max_r * 2 + margin * 2;
        this.x = __WEBPACK_IMPORTED_MODULE_0_d3__["scaleLinear"]().range([margin + max_r + this.x_min, margin + max_r + this.x_max]);
        this.x.domain([this.x_min, this.x_max]);
        this.y = __WEBPACK_IMPORTED_MODULE_0_d3__["scaleLinear"]().range([margin + max_r + this.y_min, margin + max_r + this.y_max]);
        this.y.domain([this.y_min, this.y_max]);
        let container = __WEBPACK_IMPORTED_MODULE_0_d3__["select"](parent).append('div');
        container.append('div').text(dataset.name);
        let outer_svg = container.append('svg')
            .attr('width', max_r * 2 + margin * 2)
            .attr('height', max_r * 2 + margin * 2);
        let bound_rect = outer_svg.append('rect')
            .attr('x', '0')
            .attr('y', '0')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('fill', 'transparent')
            .attr('stroke', 'black')
            .attr('stroke-width', '2');
        let target_g = outer_svg.append('circle')
            .attr('r', '2')
            .attr('cx', this.x(0))
            .attr('cy', this.x(0))
            .style('fill', 'rgba(0, 0, 0, 1)')
            .style('stroke', 'rgba(0, 0, 0, 0.5)')
            .style('stroke-width', '1');
        let effective_width_g = outer_svg.append('circle')
            .attr('r', this.dataset.effectiveWidth)
            .attr('cx', this.x(0))
            .attr('cy', this.x(0))
            .style('fill', this.dataset.effectiveWidthFill)
            .style('stroke', this.dataset.effectiveWidthStroke)
            .style('stroke-width', '1');
        let main_g = outer_svg.append('g');
        main_g.selectAll('g')
            .data(dataset.tapPoints)
            .enter()
            .append('circle')
            .attr('r', '2.5')
            .attr('cx', (d) => { return this.x(d.x); })
            .attr('cy', (d) => { return this.y(d.y); })
            .style('fill', dataset.tapFill)
            .style('stroke', dataset.tapStroke)
            .style('stroke-width', '1');
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TapsViz;

//# sourceMappingURL=taps_viz.js.map

/***/ }),

/***/ 710:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
const environment = {
    production: false
};
/* harmony export (immutable) */ __webpack_exports__["a"] = environment;

//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 787:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(103)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, "h1 {\n  color: #369;\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 250%;\n}\n\n.app-content {\n  padding: 20px;\n}\n\n.app-content md-card {\n  margin: 20px;\n}\n\n.app-sidenav {\n  padding: 10px;\n  min-width: 100px;\n}\n\n.app-content md-checkbox {\n  margin: 10px;\n}\n\n.app-toolbar-filler {\n  -webkit-box-flex: 1;\n      -ms-flex: 1 1 auto;\n          flex: 1 1 auto;\n}\n\n.app-toolbar-menu {\n  padding: 0 14px 0 14px;\n  color: white;\n}\n\n.app-icon-button {\n  box-shadow: none;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  background: none;\n  border: none;\n  cursor: pointer;\n  -webkit-filter: none;\n          filter: none;\n  font-weight: normal;\n  height: auto;\n  line-height: inherit;\n  margin: 0;\n  min-width: 0;\n  padding: 0;\n  text-align: left;\n  text-decoration: none;\n}\n\n.app-action {\n  display: inline-block;\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n}\n\n.app-spinner {\n  height: 30px;\n  width: 30px;\n  display: inline-block;\n}\n\n.app-input-icon {\n  font-size: 16px;\n}\n\n.app-list {\n  border: 1px solid rgba(0,0,0,0.12);\n  width: 350px;\n  margin: 20px;\n}\n\n.app-progress {\n  margin: 20px;\n}\n\n.groupTitle {\n  color: #236;\n  background: #8AE;\n  margin-bottom: 5px;\n  padding: 5px;\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 100%;\n}\n\n.codeInput {\n  color: #333;\n  font-family: Roboto-Mono, Monospace;\n  font-size: 100%;\n  width: 100%;\n}\n\n.menu hr {\n  border-style: solid;\n  color: #CCC;\n  margin: 0.5em;\n}\n\ntable.statsTable {\n  margin: 10px;\n  border-collapse: collapse;\n  border: solid 1px #369;\n}\n\n.statsTable th, .statsTable td {\n  border: solid 1px #369;\n  margin: 0px;\n  padding: 2px;\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 788:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(103)();
// imports


// module
exports.push([module.i, ".trialTitle {\n  color: #333;\n  font-family: Roboto-Mono, Monospace;\n  font-size: 90%;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 789:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(103)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ })

},[1222]);
//# sourceMappingURL=main.bundle.js.map