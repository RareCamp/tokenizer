
export class DifferentialPrivacyNoiseAdder {
  eta: number; // Probability of *not* flipping a bit

  constructor(epsilon: number) {
    this.eta = 1 / (1 + Math.exp(epsilon));
  }

  diffuse(bits: Uint8Array): Uint8Array {
    return bits.map(this.diffuseBit);
  }

  diffuseBit(bit: number): number {
    return this.random() <= this.eta ? bit : 1 - bit;
  }

  random(): number {
    return this.mathRandom();
  }

  mathRandom(): number {
    return Math.random();
  }

  cryptoRandom(): number {
    let array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / 0xffffffff;
  }
}
