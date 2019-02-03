import firebase from 'firebase/app';
import 'firebase/firestore';
import { Scene, Time } from 'phaser';

export const delayRunnable: (
  scene: Scene,
  delay: number,
  runnable: (...args: any[]) => any,
  context: any,
  ...args: any[]
) => Time.TimerEvent = (
  scene: Scene,
  delay: number,
  runnable: (...args: any[]) => any,
  context: any,
  ...args: any[]
) => {
  return _addRunnable(scene, delay, runnable, context, false, ...args);
};

export const loopRunnable: (
  scene: Scene,
  delay: number,
  runnable: (...args: any[]) => any,
  context: any,
  ...args: any[]
) => Time.TimerEvent = (
  scene: Scene,
  delay: number,
  runnable: (...args: any[]) => any,
  context: any,
  ...args: any[]
) => {
  return _addRunnable(scene, delay, runnable, context, true, ...args);
};

const _addRunnable: (
  scene: Scene,
  delay: number,
  runnable: (...args: any[]) => any,
  context: any,
  loop: boolean,
  ...args: any[]
) => Time.TimerEvent = (
  scene: Scene,
  delay: number,
  runnable: (...args: any[]) => any,
  context: any,
  loop: boolean = false,
  ...args: any[]
) => {
  return scene.time.addEvent({
    delay,
    callback: runnable,
    callbackScope: context,
    loop,
    args,
  });
};

export const removeRunnable: (runnable: Time.TimerEvent) => void = (
  runnable: Time.TimerEvent,
) => {
  runnable.destroy();
};

export const getFSDataAsync: any = async (docId: string) => {
  try {
    const dataObj: any = await firebase
      .firestore()
      .doc(docId)
      .get();
    return dataObj;
  } catch (err) {
    console.error(err);
  }
};

export const setFSDataAsync: any = async (docId: string, data: any) => {
  try {
    await firebase
      .firestore()
      .doc(docId)
      .set(serialise(data));
  } catch (err) {
    console.error(err);
  }
};

export const serialise: any = (object: any) => {
  return JSON.parse(JSON.stringify(object));
};

export async function wait(delay: number): Promise<void> {
  return new Promise<void>(
    (resolve: (value?: void | PromiseLike<void>) => void) => {
      setTimeout(resolve, delay);
    },
  );
}
