export const FPS = 60;
export const MS_PER_FRAME = 1000 / FPS;

/**
 * NOTE: this is based on BPM.
 * We pick up X samples every minute.
 */
export const SAMPLE_PICK_UP_RATE = 720;
export const NOISE_MAX_LENGTH = 5;
export const SAMPLE_PICK_UP_FRAME_COUNT = (FPS * 60) / SAMPLE_PICK_UP_RATE;

export const MAX_RECORD_POINT_COUNT = FPS * 8;

const ROOT = 440;

export const NOTE_ARRAY = Array.from({ length: 13 }).map((x, index) => {
  return Math.pow(2, index / 12) * ROOT;
});

export const LOWER_BOUND_ERROR = ROOT * Math.pow(2, -1 / 12);
export const UPPER_BOUND_ERROR = ROOT * Math.pow(2, 13 / 12);

export const MAJOR_SCALE_NOTES = [0, 2, 4, 5, 7, 9, 11, 12];
