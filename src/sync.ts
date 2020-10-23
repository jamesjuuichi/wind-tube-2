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
    destObj: Object | undefined;
    destKey: string | undefined;
    lastValue: any;
    callback: Function | undefined;
  }
>();

/**
 * This is incorrect, don't do this.
 * The only usecase: single edge dependency, from source to computed value.
 *
 * Don't be confused because
 * + It does not build dependency graph
 * + It does not check circular dependency
 * + It does not have a clear definition whether destination should be computed values only
 */
export function setSync(
  srcObj: Object,
  srcKey: string,
  destObj: Object | undefined,
  destKey: string | undefined,
  callback: Function | undefined
) {
  const existingInstance = map.get(srcObj);
  if (!existingInstance) {
    map.set(srcObj, {
      srcKey,
      destObj,
      destKey,
      lastValue: undefined,
      callback
    });
  }
  return () => map.delete(srcObj);
}

export function sync() {
  map.forEach((value, key) => {
    const { srcKey, destObj, destKey, lastValue, callback } = value;
    const newValue = key[srcKey];
    if (newValue === lastValue) {
      return;
    }
    value.lastValue = newValue;
    if (destObj && destKey) {
      destObj[destKey] = newValue;
    }
    if (typeof callback === "function") {
      callback(newValue);
    }
  });
}
