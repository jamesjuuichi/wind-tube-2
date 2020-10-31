import { data } from "./data/analyser";
import { createPitchDetector } from "./pitchDetector";
const SAMPLING_SIZE = 8192;

export function pipeStream(stream: MediaStream) {
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();

  analyser.fftSize = SAMPLING_SIZE;
  const dataSize = analyser.frequencyBinCount;

  source.connect(analyser);

  data.frequencyDomainSize = dataSize;
  data.frequencyDomainArray = new Uint8Array(dataSize);
  data.timeDomainSize = SAMPLING_SIZE;
  data.timeDomainArray = new Float32Array(SAMPLING_SIZE);
  data.analyser = analyser;
  data.sampleRate = context.sampleRate;
  createPitchDetector(data.sampleRate);
}
