import { data } from "./data/record";
import {
  SAMPLE_PICK_UP_FRAME_COUNT,
  MS_PER_FRAME,
  NOTE_ARRAY
} from "./constants";
import { Sound } from "./Sound";

const TIME_UNIT = SAMPLE_PICK_UP_FRAME_COUNT * MS_PER_FRAME;

export function playback(callback: undefined | Function) {
  if (data.recording) {
    console.error("Cannot playback while recording");
    return;
  }
  const baseAudio = new AudioContext();

  let startTimerId: undefined | number = undefined;
  let endTimerId: undefined | number = undefined;

  function cleanUp() {
    clearTimeout(startTimerId);
    clearTimeout(endTimerId);
  }

  function getNearestNoteFromRawFrequency(frequency: number) {
    const firstExceed = NOTE_ARRAY.findIndex((value) => value > frequency);
    if (firstExceed === -1) {
      return NOTE_ARRAY[NOTE_ARRAY.length - 1];
    }
    if (firstExceed === 0) {
      return NOTE_ARRAY[0];
    }

    return NOTE_ARRAY[firstExceed] - frequency <
      frequency - NOTE_ARRAY[firstExceed - 1]
      ? NOTE_ARRAY[firstExceed]
      : NOTE_ARRAY[firstExceed - 1];
  }

  function getNextNote(dataArray: number[], currentFrame: number) {
    while (dataArray.length > currentFrame && dataArray[currentFrame] === 0) {
      ++currentFrame;
    }
    if (dataArray.length <= currentFrame) {
      return {
        note: 0,
        duration: 0,
        startFrame: 0
      };
    }
    const startFrame = currentFrame;
    const note = getNearestNoteFromRawFrequency(dataArray[currentFrame]);
    let duration = 1;
    while (dataArray.length > ++currentFrame) {
      if (getNearestNoteFromRawFrequency(dataArray[currentFrame]) === note) {
        ++duration;
      } else {
        break;
      }
    }
    return {
      note,
      duration,
      startFrame
    };
  }

  function scheduleNextNote(dataArray: number[], currentFrame: number) {
    const { note, duration, startFrame } = getNextNote(dataArray, currentFrame);
    if (!note) {
      cleanUp();
      if (typeof callback === "function") {
        callback();
      }
      return;
    }
    const startFromNowFrame = startFrame - currentFrame;
    const endFromNowFrame = startFromNowFrame + duration;
    setTimeout(() => {
      const sound = new Sound(baseAudio);
      sound.play(note, TIME_UNIT * duration);
    }, TIME_UNIT * startFromNowFrame);

    setTimeout(() => {
      scheduleNextNote(dataArray, currentFrame + endFromNowFrame);
    }, TIME_UNIT * endFromNowFrame);
  }

  scheduleNextNote(data.record, 0);
}
