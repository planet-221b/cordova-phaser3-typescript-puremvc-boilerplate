import { BlendModes } from 'phaser';

export class Spine extends Phaser.GameObjects.GameObject {
  active: boolean;
  alpha: number;
  alphaBottomLeft: number;
  alphaBottomRight: number;
  alphaTopLeft: number;
  alphaTopRight: number;
  angle: number;
  blendMode: BlendModes;
  body: any;
  cameraFilter: number;
  data: any;
  depth: number;
  drawDebug: boolean;
  ignoreDestroy: boolean;
  flipX: boolean;
  flipY: boolean;
  name: string;
  parentContainer: Phaser.GameObjects.Container;
  plugin: Phaser.Plugins.BasePlugin;
  renderFlags: number;
  rotation: number;
  runtime: any;
  scaleX: number;
  scaleY: number;
  scene: Phaser.Scene;
  scrollFactorX: number;
  scrollFactorY: number;
  skeleton: any;
  skeletonData: any;
  state: any;
  stateData: any;
  tabIndex: number;
  timeScale: number;
  type: string;
  visible: boolean;
  w: number;
  x: number;
  y: number;
  z: number;

  addAnimation(
    trackIndex: number,
    animationName: string,
    loop: boolean,
    delay: number,
  ): void;

  clearAlpha(): void;

  clearTrack(trackIndex: number): void;

  clearTracks(): void;
  getAnimationList(): string[];
  getBounds(): Phaser.Geom.Rectangle;
  getLocalTransformMatrix(): void;
  getWorldTransformMatrix(): void;
  play(animationName: string, loop: boolean): void;
  preDestroy(): void;
  preUpdate(time: number, delta: number): void;
  renderCanvas(): any;
  renderWebGL(
    renderer: any,
    src: any,
    interpolationPercentage: any,
    camera: any,
    parentMatrix: any,
  ): any;
  resetFlip(): void;

  setAlpha(
    topLeft: number,
    topRight: number,
    bottomLeft: number,
    bottomRight: number,
  ): this;
  setAngle(degrees: number): this;
  setAnimation(trackIndex: number, animationName: string, loop: boolean): void;
  setBlendMode(value: number): void;
  setDepth(value: number): this;
  setEmptyAnimation(trackIndex: number, mixDuration: number): void;
  setFlip(x: boolean, y: boolean): this;
  setFlipX(value: boolean): this;
  setFlipY(value: boolean): this;
  setMix(fromName: string, toName: string, duration: number): this;
  setPosition(x?: number, y?: number, z?: number, w?: number): this;
  setRandomPosition(
    x?: number,
    y?: number,
    width?: number,
    height?: number,
  ): this;
  setRotation(radians: number): this;
  setScale(x?: number, y?: number): this;
  setScrollFactor(x?: number, y?: number): void;
  setSkeleton(
    atlasDataKey: string,
    animationName: string,
    loop: boolean,
    skeletonJSON: any,
  ): void;
  setSkeletonFromJson(
    atlasDataKey: string,
    skeletonJSON: any,
    animationName: string,
    loop: boolean,
  ): void;
  setSkin(newSkin: string): void;
  setSkinByName(skinName: string): void;
  setVisible(value: boolean): this;
  setX(value: number): void;
  setY(value: number): void;
  setZ(value: number): void;
  setW(value: number): void;
  toggleFlipX(): void;
  toggleFlipY(): void;
}
