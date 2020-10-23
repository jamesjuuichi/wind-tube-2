import { getData as getAnalyserData } from "./data/analyser";
import {
  MS_PER_FRAME,
  MAX_RECORD_POINT_COUNT,
  SAMPLE_PICK_UP_FRAME_COUNT,
  NOTE_ARRAY,
  MAJOR_SCALE_NOTES
} from "./constants";
import { pickUp } from "./pickUp";
import { sync } from "./sync";
import { log } from "./log";
import { data as recordData } from "./data/record";
import { getData as getReferenceData } from "./data/reference";

export function initializeCanvas() {
  const canvas: HTMLCanvasElement | null = document.querySelector(
    "canvas#canvas"
  );
  if (!canvas) {
    throw new Error("Cannot find #canvas");
  }
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  const context = canvas.getContext("2d");

  const drawLines = (beginY: number, endY: number) => {
    if (!context) {
      return;
    }
    const convertRatio =
      (NOTE_ARRAY[NOTE_ARRAY.length - 1] - NOTE_ARRAY[0]) / (endY - beginY);
    const yArray = NOTE_ARRAY.map(
      (noteFrequency) => endY - (noteFrequency - NOTE_ARRAY[0]) / convertRatio
    );
    const width = canvas.width;
    yArray.forEach((y, index) => {
      context.lineWidth = 1;
      context.strokeStyle = `rgba(200, 200, 200, ${
        MAJOR_SCALE_NOTES.includes(index) ? 0.7 : 0.2
      })`;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    });
  };

  /**
   * Last note length
   */
  let lastLength = 0;
  /**
   * Phase of last bar length
   */
  let phase = 0;

  const update = (stepScale: number) => {
    const data = getAnalyserData();
    if (!data) {
      return;
    }
    const { analyser, dataArray } = data;
    analyser.getByteFrequencyData(dataArray);
    pickUp(stepScale);
    sync();
    log(stepScale);
  };

  const draw = (stepScale: number) => {
    const data = getAnalyserData();
    if (!data || !context) {
      return;
    }
    const { dataArray, dataSize } = data;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#202020";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width - dataSize + 1) / dataSize;

    for (let i = 0; i < dataSize; i++) {
      const barHeight = dataArray[i];
      context.fillStyle = "rgb(" + (barHeight + 100) + ", 50, 50)";
      context.fillRect(
        (barWidth + 1) * i,
        canvas.height - barHeight / 2,
        barWidth,
        barHeight / 2
      );
    }

    const referenceData = getReferenceData();
    const { record, recording } = recordData;
    if (referenceData && record.length > 0) {
      const { lowNote, highNote } = referenceData;
      if (lowNote === 0 || highNote === 0 || lowNote >= highNote) {
        return;
      }

      const drawAt = (MAX_RECORD_POINT_COUNT * 2) / 3;

      const loopCount = Math.min(record.length, drawAt + 1);

      const unitX = canvas.width / MAX_RECORD_POINT_COUNT;
      const paddingY = canvas.height / 4;
      const drawableY = canvas.height - paddingY * 2;
      const firstDrawIndex = Math.floor(drawAt) - 1;

      /**
       * Draw lines
       */
      drawLines(paddingY, drawableY + paddingY);
      /**
       * End Draw lines
       */

      if (lastLength !== record.length) {
        lastLength = record.length;
        phase = 0;
      } else {
        phase += stepScale / SAMPLE_PICK_UP_FRAME_COUNT;
        if (phase > 1) {
          phase = 1;
        }
      }
      const getLine = (fromFirstDrawIndex: number, normalizedY: number) => {
        const startX = firstDrawIndex - fromFirstDrawIndex;
        const y = (1 - (normalizedY + 1) / 2) * drawableY + paddingY;
        return [startX * unitX, y, (startX + 1) * unitX, y];
      };
      let offset = (1 - phase) * unitX;

      context.strokeStyle = "rgb(255, 255, 255)";
      context.lineWidth = 1;

      for (let i = 0; i < loopCount; ++i) {
        const pointIndex = record.length - 1 - i;
        let point = record[pointIndex];
        if (
          point > highNote * Math.pow(2, 1 / 6) ||
          point < lowNote * Math.pow(2, -1 / 6)
        ) {
          continue;
        }

        const normalizedY =
          (2 * point - highNote - lowNote) / (highNote - lowNote);

        const [startX, startY, endX, endY] = getLine(i, normalizedY);

        context.beginPath();
        context.moveTo(startX + offset, startY);
        if (i === 0) {
          context.lineTo(endX, endY);
        } else {
          context.lineTo(endX + offset, endY);
        }

        context.stroke();
      }
    }
  };

  const step = (stepScale: number) => {
    update(stepScale);
    draw(stepScale);
  };

  let lastTime = 0;
  const frameCallback = (timeStamp: number) => {
    if (lastTime === 0) {
      step(1);
    } else {
      step((timeStamp - lastTime) / MS_PER_FRAME);
    }
    lastTime = timeStamp;
    requestAnimationFrame(frameCallback);
  };

  requestAnimationFrame(frameCallback);
}
