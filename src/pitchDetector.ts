import { YIN } from "pitchfinder";

const pitchDetector: {
  detect: ReturnType<typeof YIN>;
} = {
  detect: () => 0
};

export function createPitchDetector(sampleRate: number) {
  pitchDetector.detect = YIN({ sampleRate });
}

export default pitchDetector;
