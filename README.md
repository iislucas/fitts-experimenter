# A Fitts Experiment WebApp

This repository provides a webapp to experiment with
[Fitts tasks](https://en.wikipedia.org/wiki/Fitts's_law).

## How is it built?

 * This project uses the [PixiJS](http://pixijs.github.io/docs/) library for
   the animation and interaction, and [D3js](https://d3js.org/) for drawing
   graphs.
 * It is written in [Typescript](http://www.typescriptlang.org/).
 * It uses [webpack](https://webpack.github.io/) for the bundling and local
   serving.
 * It uses [HTML5 local storage](https://www.html5rocks.com/en/features/storage)
   to store data locally in your browser.
 * The webapp is static (any static web-server will support hosting it).

## Prerequisities

```
npm install -g yarn typescript webpack
```

## Setup

```
yarn install
```

## Building

```
yarn run build
```

(Control-c to stop the watching build process)

Development build (including sourcemaps) is put in `build/dev`

## Testing/running

```
yarn run serve
```

This starts a simple express web-server running the code at http://localhost:8080/fitts-experiment/
and watches the source code for changes and recompiles as needed.

(Control-c to stop the server)

## Cleaning up a build or instalation

To create a totally fresh build, simply remove (or rename) the `build/dev`
directory.

To create a fresh install, remove the directories `node_modules` and the
`build`.

## Deployment to github pages

```
yarn run deploy
```

# The beep sound

The beep sound (`beep.mp3`) comes from https://notificationsounds.com/notification-sounds/beep-472
and is under the [Creative Commons Attribution 4.0 International
License](https://creativecommons.org/licenses/by/4.0/legalcode).
