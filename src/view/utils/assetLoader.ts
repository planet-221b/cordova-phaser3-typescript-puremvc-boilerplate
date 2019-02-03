function loadAssets(
  scene: Phaser.Scene,
  loaderName: string,
  checker: (name: string) => boolean,
  node: any,
  keys: string[],
  autoStartLoader?: boolean,
  scalingVariant?: ScalingVariant,
): void {
  if (typeof node === 'function') {
    if (!checker(node.Name)) {
      (scene.load as any)[loaderName](
        node.Name,
        ...keys.map((key: string) => node[key]),
      );
    } else {
      console.warn(`${node.Name} is already exists!!!`);
    }
  } else {
    for (const child of Object.keys(node)) {
      loadAssets(
        scene,
        loaderName,
        checker,
        node[child],
        keys,
        autoStartLoader,
        scalingVariant,
      );
    }
  }
  if (autoStartLoader) {
    scene.load.start();
  }
}

enum SpriteFontAlign {
  AlignTop = 0,
  AlignCenter = 1,
  AlignBottom = 2,
}

function addSpriteIntoFont(
  game: Phaser.Game,
  fontName: string,
  frame: string | number,
  newCharCode: number,
  referenceChar: number | string,
  align: number,
  originY: number,
  cutX: number,
  cutY: number,
): void {
  // if reference char is string, convert it to number

  const referenceCharF: number =
    typeof referenceChar === 'string' ? referenceChar.charCodeAt(0) : null;

  // get font characters and reference character
  const font: any = game.cache.bitmapFont.get(fontName);
  const fontChars: any = (font.data as BitmapFontData).chars;
  const refChar: any = fontChars[referenceCharF];

  if (refChar == null) {
    throw new Error(
      `Reference character ${String.fromCharCode(
        referenceCharF,
      )} with code ${referenceCharF} is missing in font. Try another.`,
    );
  }

  // get frame of new sprite character
  const f: any = game.textures.getFrame(font['texture'], frame);
  const fWidth: number = f.customData['sourceSize']['w'];
  const fHeight: number = f.customData['sourceSize']['h'];

  // calculate y offset of sprite chracter
  const refY: any =
    refChar.yOffset +
    (align === SpriteFontAlign.AlignCenter
      ? refChar.height / 2
      : align === SpriteFontAlign.AlignBottom
      ? refChar.height
      : 0);
  const yOffset: any = Math.round(refY - fHeight * originY);

  // add new sprite character
  fontChars[newCharCode] = {
    yOffset,
    xOffset: 0,
    x: f.cutX - cutX,
    y: f.cutY - cutY,
    width: f.cutWidth,
    height: f.cutHeight,
    centerX: Math.floor(fWidth / 2),
    centerY: Math.floor(fHeight / 2),
    xAdvance: fWidth + 2,
    data: {},
    kerning: {},
  };
}

export function loadImages(scene: Phaser.Scene, node: any): void {
  loadAssets(scene, 'image', scene.textures.exists.bind(scene.textures), node, [
    'FileURL',
  ]);
}

export function loadBitmapfonts(scene: Phaser.Scene, node: any): void {
  loadAssets(
    scene,
    'bitmapFont',
    scene.textures.exists.bind(scene.textures),
    node,
    ['PngURL', 'XmlURL'],
  );
}

export function loadSpritefonts(scene: Phaser.Scene, node: any): void {
  loadAssets(scene, 'xml', scene.cache.xml.exists.bind(scene.cache.xml), node, [
    'XmlURL',
  ]);
}

export function loadAtlases(scene: Phaser.Scene, node: any): void {
  loadAssets(scene, 'atlas', scene.textures.exists.bind(scene.textures), node, [
    'TextureURL',
    'AtlasURL',
  ]);
}

export function loadJsons(scene: Phaser.Scene, node: any): void {
  loadAssets(
    scene,
    'json',
    scene.cache.json.exists.bind(scene.cache.json),
    node,
    ['FileURL'],
  );
}

export function loadAudios(scene: Phaser.Scene, node: any): void {
  loadAssets(
    scene,
    'audio',
    scene.cache.audio.exists.bind(scene.cache.audio),
    node,
    ['Mp3URL', 'OggURL'],
  );
}

export function loadSpines(scene: Phaser.Scene, node: any): void {
  loadAssets(
    scene,
    'spine',
    // @ts-ignore
    () => false, // scene.spine.cache.exists.bind(scene.spine.cache),
    node,
    ['SkeletonURL', 'AtlasURL'],
  );
}

export function loadXMLs(scene: Phaser.Scene, node: any): void {
  loadAssets(scene, 'xml', scene.cache.xml.exists.bind(scene.cache.xml), node, [
    'FileURL',
  ]);
}

export function createSpritefont(scene: Phaser.Scene, node: any): void {
  const fontName: any = node['Name'];
  const textureKey: any = node['Atlas'];
  const frameKey: any = node['Name'];
  const chars: any = node['Chars'];
  // @ts-ignore
  Phaser.GameObjects.BitmapText.ParseFromAtlas(
    scene,
    fontName,
    textureKey,
    frameKey,
    node['Name'],
  );
  const fontFrame: Phaser.Textures.Frame = scene.sys.game.textures.getFrame(
    textureKey,
    frameKey,
  );
  chars.forEach((config: any) => {
    const {
      frame,
      charCode,
      align = SpriteFontAlign.AlignCenter,
      originY = 0.5,
    } = config;
    addSpriteIntoFont(
      scene.sys.game,
      fontName,
      frame,
      parseInt(charCode, 16),
      '0',
      align,
      originY,
      fontFrame.cutX,
      fontFrame.cutY,
    );
  });
}

export function loadText(
  scene: Phaser.Scene,
  node: any,
  autoStartLoader: boolean = false,
  scalingVariant?: ScalingVariant,
): void {
  loadAssets(
    scene,
    'text',
    scene.cache.text.exists.bind(scene.cache.text),
    node,
    ['FileURL'],
    autoStartLoader,
    scalingVariant,
  );
}

export function loadMultiAtlases(
  scene: Phaser.Scene,
  node: any,
  autoStartLoader: boolean = false,
): void {
  loadAssets(
    scene,
    'multiatlas',
    scene.textures.exists.bind(scene.textures),
    node,
    ['AtlasURL', 'TextureURL'],
    autoStartLoader,
  );
}

export enum ScalingVariant {
  HD = 'hd',
  SD = 'sd',
}
