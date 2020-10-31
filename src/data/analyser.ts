interface AnalyserDataInterface {
  frequencyDomainSize: number;
  frequencyDomainArray: Uint8Array | void; // frequency domain
  timeDomainSize: number;
  timeDomainArray: Float32Array | void;
  analyser: AnalyserNode | void;
  sampleRate: number;
}
export const data: AnalyserDataInterface = {
  frequencyDomainSize: 0,
  frequencyDomainArray: undefined,
  timeDomainSize: 0,
  timeDomainArray: undefined,
  analyser: undefined,
  sampleRate: 0
};

export function getData() {
  const {
    analyser,
    frequencyDomainSize,
    frequencyDomainArray,
    timeDomainSize,
    timeDomainArray,
    sampleRate
  } = data;
  if (
    !analyser ||
    !frequencyDomainArray ||
    frequencyDomainSize === 0 ||
    !timeDomainArray ||
    timeDomainSize === 0 ||
    sampleRate === 0
  ) {
    return false;
  }
  return {
    analyser,
    frequencyDomainArray,
    frequencyDomainSize,
    timeDomainArray,
    timeDomainSize,
    sampleRate
  };
}
