import { bindPermit, bindRecord, bindPlayback } from "./eventListeners";
import { setSync } from "./sync";
import { data } from "./data/liveData";

function createCanvas(id: string = "", className: string = "") {
  const canvas = document.createElement("canvas");
  if (id) {
    canvas.id = id;
  }
  if (className) {
    canvas.className = className;
  }
  return canvas;
}

function createText(id: string = "", className: string = "") {
  const text = document.createElement("span");
  if (id) {
    text.id = id;
  }
  if (className) {
    text.className = className;
  }
  return text;
}

function createButton(
  id: string = "",
  className: string = "",
  text: string = ""
) {
  const button = document.createElement("button");
  if (id) {
    button.id = id;
  }
  if (className) {
    button.className = className;
  }
  if (text) {
    const buttonText = document.createTextNode(text);
    button.appendChild(buttonText);
  }
  return button;
}

function createGroup(
  id: string = "",
  className: string = "",
  ...childNodes: Array<string | Node>
) {
  const div = document.createElement("div");
  if (id) {
    div.id = id;
  }
  if (className) {
    div.className = className;
  }
  div.append(...childNodes);
  return div;
}

export function prepareDocument() {
  const app = document.getElementById("app");
  if (!app) {
    return;
  }

  const canvas = createCanvas("canvas");

  const text = createText("current-note");

  const permissionButton = createButton(
    "permit",
    "control-button active",
    "Audio please"
  );

  const recordButton = createButton(
    "record-note",
    "control-button disabled",
    "Record"
  );

  const playbackButton = createButton(
    "playback-note",
    "control-button disabled",
    "Playback"
  );

  const buttonGroup = createGroup(
    "button-group",
    "",
    recordButton,
    playbackButton
  );

  app.append(canvas, permissionButton, buttonGroup, text);

  requestAnimationFrame(() => {
    bindPermit(permissionButton, () => {
      recordButton.classList.remove("disabled");
      playbackButton.classList.remove("disabled");
      bindRecord(recordButton);
      bindPlayback(playbackButton);
    });
    setSync(data, "currentNote", undefined, undefined, (value: any) => {
      text.innerText = value;
    });
  });
}
