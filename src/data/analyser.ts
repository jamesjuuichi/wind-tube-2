interface AnalyserDataInterface {
  dataSize: number;
  dataArray: Uint8Array | void;
  analyser: AnalyserNode | void;
  sampleRate: number;
}
export const data: AnalyserDataInterface = {
  dataSize: 0,
  dataArray: undefined,
  analyser: undefined,
  sampleRate: 0
};

export function getData() {
  const { analyser, dataArray, dataSize, sampleRate } = data;
  if (!analyser || !dataArray || dataSize === 0 || sampleRate === 0) {
    return false;
  }
  return {
    analyser,
    dataArray,
    dataSize,
    sampleRate
  };
}
