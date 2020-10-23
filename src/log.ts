import { SAMPLE_PICK_UP_FRAME_COUNT } from "./constants";
interface Object {
  [id: string]: any;
}

/**
 * The source of memory leak
 */
const map = new Map<
  Object,
  {
    srcKey: string;
    destObj: Object;
    destKey: string;
    recordingKey: string;
    remainingWaitTime: number;
    period: number;
    callback: Function | undefined;
  }
>();

/**
 * Stream data from a source to a log stream
 * Does not handle lock / release... yet
 */
export function setLog(
  srcObj: Object,
  srcKey: string,
  destObj: Object,
  destKey: string,
  recordingKey: string,
  period: number = SAMPLE_PICK_UP_FRAME_COUNT,
  callback?: Function
) {
  const existingInstance = map.get(srcObj);
  if (!existingInstance) {
    map.set(srcObj, {
      srcKey,
      destObj,
      destKey,
      remainingWaitTime: 0,
      recordingKey,
      period,
      callback
    });
  }
  return () => {
    destObj[recordingKey] = false;
    map.delete(srcObj);
  };
}

export function log(stepScale: number) {
  map.forEach((value, key) => {
    const { srcKey, destObj, destKey, recordingKey, callback, period } = value;
    value.remainingWaitTime -= stepScale;
    if (value.remainingWaitTime > 0) {
      return;
    }
    value.remainingWaitTime = (value.remainingWaitTime % period) + period;
    const newValue = key[srcKey];
    // TODO: Real stream plz
    if (!Array.isArray(destObj[destKey])) {
      destObj[destKey] = [];
    }
    destObj[destKey].push(newValue);
    destObj[recordingKey] = true;
    if (typeof callback === "function") {
      callback(newValue);
    }
  });
}
