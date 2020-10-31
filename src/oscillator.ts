import { data } from "./data/record";
import {
  SAMPLE_PICK_UP_FRAME_COUNT,
  MS_PER_FRAME,
  NOTE_ARRAY,
  NOISE_MAX_LENGTH
} from "./constants";
import { Sound } from "./Sound";

const TIME_UNIT = SAMPLE_PICK_UP_FRAME_COUNT * MS_PER_FRAME;
const SEMI_TONE_POWER = 1 / 12;

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

  function getNearestNoteFromRawFrequency(
    rawFrequency: number,
    rootError: number = 0
  ) {
    const frequency = rawFrequency - rootError;
    const firstExceed = NOTE_ARRAY.findIndex((value) => value > frequency);
    if (firstExceed === -1) {
      return {
        error: frequency - NOTE_ARRAY[NOTE_ARRAY.length - 1],
        note: NOTE_ARRAY[NOTE_ARRAY.length - 1]
      };
    }
    if (firstExceed === 0) {
      return {
        error: frequency - NOTE_ARRAY[0],
        note: NOTE_ARRAY[0]
      };
    }

    const d = Math.log2(NOTE_ARRAY[firstExceed] / frequency);
    const returnedNote =
      d < SEMI_TONE_POWER / 2
        ? NOTE_ARRAY[firstExceed]
        : NOTE_ARRAY[firstExceed - 1];

    return {
      error: rawFrequency - returnedNote,
      note: returnedNote
    };
  }

  function isNoise(dataArray: number[], currentFrame: number) {
    let length = 0;
    while (
      dataArray.length > currentFrame &&
      length < NOISE_MAX_LENGTH &&
      dataArray[currentFrame] !== 0
    ) {
      ++currentFrame;
      ++length;
    }
    if (length < 2) {
      return true;
    }
    let diffInPitch = 0;
    for (let i = 1; i < length; ++i) {
      const index = currentFrame - length + i;
      diffInPitch =
        diffInPitch +
        Math.abs(Math.log2(dataArray[index] / dataArray[index - 1]));
    }
    if (diffInPitch > SEMI_TONE_POWER * (length - 1)) {
      return true;
    }
    return false;
  }

  function getNextNote(dataArray: number[], currentFrame: number) {
    while (
      (dataArray[currentFrame] === 0 || isNoise(dataArray, currentFrame)) &&
      dataArray.length > currentFrame
    ) {
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
    const { error, note } = getNearestNoteFromRawFrequency(
      dataArray[currentFrame]
    );
    let duration = 1;
    while (dataArray.length > ++currentFrame) {
      const { note: nextNote } = getNearestNoteFromRawFrequency(
        dataArray[currentFrame],
        error
      );
      if (nextNote === note) {
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
