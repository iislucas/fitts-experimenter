/**
 * @license
 * Copyright The Fitts-Expeiment-WebApp Authors. All Rights Reserved.
 *
 * Use of this source code is governed by the Apache2 license that can be
 * found in the LICENSE file
 */

// The basic stuff for the environment.
export class PixiEnvironment {
  public renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  public container: PIXI.Container;
  public width: number;
  public height: number;
  public mousePosition: PIXI.Point;
  public ticker: PIXI.ticker.Ticker;
  public fps: FpsSprite;
  public updateFunctions: ((timeDelta: number) => void)[];

  public constructor() {

    //console.log('new env');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mousePosition = new PIXI.Point(0, 0);
    this.ticker = PIXI.ticker.shared;
    this.updateFunctions = [];

    this.renderer = PIXI.autoDetectRenderer(
        this.width, this.height,
        { backgroundColor: 0xFFFFFF });
    this.renderer.view.style.position = 'absolute';
    this.renderer.view.style.display = 'block';
    this.renderer.autoResize = true;

    // create the root of the scene graph
    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.container.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);

    this.fps = new FpsSprite(this, new PIXI.Point(0, 0));

    this.ticker.add(this.updateFunction_);
    this.container.on('mousemove', (e: PIXI.interaction.InteractionEvent) => {
      this.mousePosition.set(e.data.global.x, e.data.global.y);
    });
    this.container.on('tap', (e: PIXI.interaction.InteractionEvent) => {
      this.mousePosition.set(e.data.global.x, e.data.global.y);
    });
    this.container.on('click', (e: PIXI.interaction.InteractionEvent) => {
      this.mousePosition.set(e.data.global.x, e.data.global.y);
    });
  }

  public dispose = () => {
    this.ticker.remove(this.updateFunction_);
  }

  private updateFunction_ = (deltaTime: number) => {
      this.updateFunctions.map((f) => { f(deltaTime); });
      this.renderer.render(this.container);
  }
}

export class MeasurementTextSprite {
  public pixiText: PIXI.Text;
  public oldValue: number;

  constructor(env: PixiEnvironment, public position: PIXI.Point,
    public name: string,
    public metricFn: (deltaTime: number) => number) {
    this.pixiText = new PIXI.Text(name,
      { fontFamily: '11px Arial', fill: 0x000000, align: 'left' });
    this.pixiText.position = position;
    env.container.addChild(this.pixiText);

    env.updateFunctions.push((deltaTime: number) => {
      this.update(deltaTime);
    });
  }

  public update(deltaTime?: number) {
    let newValue = this.metricFn(deltaTime);
    if (newValue != null && newValue != this.oldValue) {
      this.pixiText.text = this.name + newValue;
      this.oldValue = newValue;
    }
  }
}

// Frames per second text shown at the given position.
export class FpsSprite extends MeasurementTextSprite {
  constructor(env: PixiEnvironment, positon: PIXI.Point) {
    super(env, positon, 'FPS: ', (timeDelta: number) => {
      return env.ticker.FPS;
      // return timeDelta;
    });
  }
}

export class CircleSprite {
  public sprite: PIXI.Sprite;

  constructor(env: PixiEnvironment, public radius: number,
              private _centerPosition: PIXI.Point, public color: number) {
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
    this.sprite.on('click', (e: PIXI.interaction.InteractionEvent) => {
      //console.log(e);
      //sprite.scale.x += 0.3;
      //sprite.scale.y += 0.3;
    });
    this._updatePosition();
    env.container.addChild(this.sprite);
  }

  private _updatePosition(): void {
    this.sprite.position.set(
      this._centerPosition.x - this.radius,
      this._centerPosition.y - this.radius);
  }

  public updateCenterPosition(x: number, y: number): void {
    this._centerPosition.set(x, y);
    this._updatePosition();
  }

  public getCenterPosition(): PIXI.Point {
    return this._centerPosition;
  }
}


function to_radians(degrees: number) {
  const DEGREES_TO_RADIANS = (Math.PI + Math.PI) / 360;
  return degrees * DEGREES_TO_RADIANS;
}

export class OrbitingCircleSprite {
  public circleSprite: CircleSprite;

  constructor(
      env: PixiEnvironment,
      public orbitCenter: PIXI.Point,
      public orbitDistance: number,
      public orbitSpeed: number,
      public angle: number,
      radius: number,
      public color: number) {

    let circlePosition = new PIXI.Point(
        this.calculateCircleXPosition(),
        this.calculateCircleYPosition());
    this.circleSprite = new CircleSprite(env, radius, circlePosition, color);

    env.updateFunctions.push(() => { this.update(); })
  }

  public calculateCircleYPosition() {
    return this.orbitCenter.y +
      Math.sin(to_radians(this.angle)) * this.orbitDistance;
  }
  public calculateCircleXPosition() {
    return this.orbitCenter.x +
      Math.cos(to_radians(this.angle)) * this.orbitDistance;
  }

  public update() {
    this.angle += this.orbitSpeed;
    if (this.angle >= 360) {
      this.angle -= 360;
    }
    this.circleSprite.updateCenterPosition(
        this.calculateCircleXPosition(),
        this.calculateCircleYPosition())
  }
}

export function dateStringOfTimestamp(timestamp:number) : string {
  let date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}` +
         `-${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}.` +
         `${date.getMilliseconds()}`;
}
