import { DifferentialPrivacyNoiseAdder as DPNA } from './DifferentialPrivacyNoiseAdder';

//   expect(bf.nodeHash("hello")).toBe("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");

test('eta calculation', () => {

  function eta(epsilon) {
    // eta = 1 / (1 + exp(epsilon))
    return 1 / (1 + Math.exp(epsilon));
  }

  let epsilons: number[] = [-100, -5, -1, 0, 0.2, 0.5, 0.8, 1, 2, 5, 10, 100, 1000, 10000, 100000, 1000000];

  for (let epsilon of epsilons) {
    expect((new DPNA(epsilon)).eta).toBe(eta(epsilon));
  }
});

test('diffuse bit', () => {
  const ITERATIONS = 1000;

  // Never flip bit
  DPNA.prototype.mathRandom = () => 0.0;
  let dpna = new DPNA(0);
  for (let i = 0; i < ITERATIONS; i++) {
    for (let bit of [0, 1]) {
      expect(dpna.diffuseBit(bit)).toBe(bit);
    }
  }

  // Always flip bit
  DPNA.prototype.mathRandom = () => 1.0;
  dpna = new DPNA(0);
  for (let i = 0; i < ITERATIONS; i++) {
    for (let bit of [0, 1]) {
      expect(dpna.diffuseBit(bit)).toBe(1 - bit);
    }
  }
});

test('diffuse bits', () => {
  let diffuseBit = jest.fn(DPNA.prototype.diffuseBit);
  const N = 1000;
  let dpna = new DPNA(0);
  dpna.diffuse(new Uint8Array(N));
  expect(diffuseBit).toHaveBeenCalledTimes(N);
});


test('use math.random', () => {
  DPNA.prototype.mathRandom = () => 0.5; // Mock Math.random()
  expect((new DPNA(0)).random()).toBe(0.5);
});

test('math random', () => {
  for (let x of [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]) {
    Math.random = () => x; // Mock Math.random()
    expect((new DPNA(0)).mathRandom()).toBe(x);
  }
});