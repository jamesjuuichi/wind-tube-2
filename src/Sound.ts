/**
 * https://codepen.io/gregh/pen/RKVNgB
 */
export class Sound {
  private context: AudioContext;
  private oscillator!: OscillatorNode;
  private gainNode!: GainNode;

  constructor(context: AudioContext) {
    this.context = context;
  }

  private setup() {
    this.oscillator = this.context.createOscillator();
    this.gainNode = this.context.createGain();

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.oscillator.type = "sine";
  }

  play(value: number, duration: number) {
    this.setup();

    this.oscillator.frequency.value = value;
    this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(
      1,
      this.context.currentTime + 0.01
    );

    this.oscillator.start(this.context.currentTime);

    this.gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.context.currentTime + duration / 1000
    );
    this.oscillator.stop(this.context.currentTime + duration / 1000);
  }
}
