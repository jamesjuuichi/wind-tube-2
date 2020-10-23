import { once } from "./utils/functional";
import { setLog } from "./log";
import { pipeStream } from "./fourierTransform";
import { data as liveData } from "./data/liveData";
import { data as recordData } from "./data/record";
import { playback } from "./oscillator";

export function bindPermit(button: HTMLElement, callback?: Function) {
  button.addEventListener(
    "click",
    once(async () => {
      button.classList.add("fade-away");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      pipeStream(stream);
      if (typeof callback === "function") {
        callback();
      }
    })
  );
}

let mutualExclusiveCleanUp: Function | undefined = undefined;

export function bindRecord(button: HTMLElement) {
  let toggle = false;
  button.addEventListener("click", () => {
    toggle = !toggle;
    if (typeof mutualExclusiveCleanUp === "function") {
      mutualExclusiveCleanUp();
      mutualExclusiveCleanUp = undefined;
    }

    if (!toggle) {
      return;
    }
    button.classList.add("active");

    const stopLogging = setLog(
      liveData,
      "currentNote",
      recordData,
      "record",
      "recording"
    );

    mutualExclusiveCleanUp = () => {
      stopLogging();
      toggle = false;
      button.classList.remove("active");
    };
  });
}

export function bindPlayback(button: HTMLElement) {
  let toggle = false;
  button.addEventListener("click", () => {
    toggle = !toggle;
    if (typeof mutualExclusiveCleanUp === "function") {
      mutualExclusiveCleanUp();
      mutualExclusiveCleanUp = undefined;
    }

    if (!toggle) {
      return;
    }
    button.classList.add("active");

    mutualExclusiveCleanUp = () => {
      toggle = false;
      button.classList.remove("active");
    };

    playback(mutualExclusiveCleanUp);
  });
}
