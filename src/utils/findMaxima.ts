// TODO: Consider noises and should only take in the one with steepest slopes.
export function findMaxima(array: Uint8Array) {
  if (array.length === 0) {
    return {
      value: -1,
      index: -1
    };
  }
  const max = array.reduce(
    (acc, current, index) => {
      if (acc.value < current) {
        acc.value = current;
        acc.index = index;
      }
      return acc;
    },
    {
      value: -1,
      index: -1
    }
  );
  if (max.value > 127) {
    return max;
  } else {
    return {
      value: -1,
      index: -1
    };
  }
}
