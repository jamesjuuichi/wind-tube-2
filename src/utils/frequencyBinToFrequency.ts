export function binToFrequency(
  binIndex: number,
  binCount: number,
  sampleRate: number
) {
  const nyquistFrequency = sampleRate / 2;
  const frequencyPerBin = nyquistFrequency / binCount;

  return frequencyPerBin * (binIndex + 0.5);
}
