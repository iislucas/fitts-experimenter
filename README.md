# A Fitts Experiment WebApp

This repository provides a webapp to experiment with
[Fitts tasks](https://en.wikipedia.org/wiki/Fitts's_law). The github hosted
(static) webapp is at: https://iislucas.github.com/fitts-experimenter

## How is it built?

 * This project uses the [PixiJS](http://pixijs.github.io/docs/) library for
   the animation and interaction, and [D3js](https://d3js.org/) for drawing
   graphs.
 * It is written in [Typescript](http://www.typescriptlang.org/).
 * It uses [Angular2](https://angular.io/) as the UI and the [Angular CLI](https://github.com/angular/angular-cli) for the build framework.
 * It uses [HTML5 local storage](https://www.html5rocks.com/en/features/storage)
   to store data locally in your browser.
 * The webapp is static (any static web-server will support hosting it).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
