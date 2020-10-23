import { data } from "./data/analyser";
const SAMPLING_SIZE = 8192;

export function pipeStream(stream: MediaStream) {
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();

  analyser.fftSize = SAMPLING_SIZE;
  const dataSize = analyser.frequencyBinCount;

  source.connect(analyser);

  data.dataSize = dataSize;
  data.dataArray = new Uint8Array(dataSize);
  data.analyser = analyser;
  data.sampleRate = context.sampleRate;
}
