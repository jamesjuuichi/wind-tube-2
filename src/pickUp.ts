import { SAMPLE_PICK_UP_FRAME_COUNT } from "./constants";
import { getData } from "./data/analyser";
import { data as liveData } from "./data/liveData";
import { findMaxima } from "./utils/findMaxima";
import { binToFrequency } from "./utils/frequencyBinToFrequency";

let localCounter = -1;

/**
 * We pick up the sample instantaneous at any given point, because:
 * 1. Made up solutions might not work
 * 2. Lazy
 * Alternatively we can apply Gaussian function over a few frames
 */
export function pickUp(stepScale: number) {
  localCounter = localCounter + stepScale;
  const data = getData();
  if (!data) {
    return;
  } else if (localCounter === -1) {
    // NOTE: So it can pick up note as soon as possible
    localCounter = SAMPLE_PICK_UP_FRAME_COUNT - 1;
  }

  const { dataArray, dataSize, sampleRate } = data;

  if ((localCounter % SAMPLE_PICK_UP_FRAME_COUNT) - stepScale < 0) {
    const max = findMaxima(dataArray);
    if (max.index === -1) {
      liveData.currentNote = 0;
      return;
    }
    liveData.currentNote = binToFrequency(max.index, dataSize, sampleRate);
  }
}
