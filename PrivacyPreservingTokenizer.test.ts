const crypto = require('crypto').webcrypto

import { expect, jest, test } from '@jest/globals';

import { PrivacyPreservingTokenizer as PPT } from './PrivacyPreservingTokenizer';


/***************/
/* Constructor */
/***************/

test('constructor', () => {
  const bloomFilterLength = 100;
  const numberOfHashFunctions = 10;
  const privacyBudget = 0.5;
  let ppt = new PPT(bloomFilterLength, numberOfHashFunctions, privacyBudget);
  
  expect(ppt.bloomFilterLength).toBe(bloomFilterLength);
  expect(ppt.numberOfHashFunctions).toBe(numberOfHashFunctions);
  expect(ppt.eta).toBe(1 / (1 + Math.exp(privacyBudget)));
});

test('eta calculation', () => {
  function eta(epsilon) {
    // eta = 1 / (1 + exp(epsilon))
    return 1 / (1 + Math.exp(epsilon));
  }

  let epsilons: number[] = [-100, -5, -1, 0, 0.2, 0.5, 0.8, 1, 2, 5, 10, 100, 1000, 10000, 100000, 1000000];
  epsilons.forEach(eps => expect((new PPT(0, 0, eps)).eta).toBe(eta(eps)));
});


/************/
/* Tokenize */
/************/


/****************/
/* Bloom filter */
/****************/

const hello0_hash = "a1adff9e39d0a50875c683da7cf12ac7235c553ee416a93cfa989f07bc3c2e72"; // echo -n "hello#0" | sha256sum
const hello1_hash = "ee7f393ae922ddee969bd0b3b09d467488fe0141171fdb7148b382159d97c658"; // echo -n "hello#1" | sha256sum
const hello2_hash = "96ec99c4e8ebac94dc43dd6ad44e2df264aa6a2014a9ccec3a2f84fe130e0b00"; // echo -n "hello#2" | sha256sum

test('insert', () => {

  let ppt = new PPT(1000, 3, 0);

});

test('hash index', () => {
  let ppt = new PPT(1000, 0, 0);

  expect(ppt["hashIndex"]("00000000")).toBe(0);
  expect(ppt["hashIndex"]("00000001")).toBe(1);
  expect(ppt["hashIndex"]("0000000e")).toBe(14);

  // Only last 8 characters are used
  /*
  expect(ppt["hashIndex"]("ffffffff")).toBe(0xffffffff % 1000);
  expect(ppt["hashIndex"]("1ffffffff")).toBe(0xffffffff % 1000);
  expect(ppt["hashIndex"]("2ffffffff")).toBe(0xffffffff % 1000);
  expect(ppt["hashIndex"]("ffffffffffffff")).toBe(0xffffffff % 1000);
  */

  // The modulo is taken using the bloom filter length
  expect(ppt["hashIndex"]("000003e8")).toBe(0);
  expect(ppt["hashIndex"]("000003e9")).toBe(1);
  expect(ppt["hashIndex"]("000003ea")).toBe(2);
});

test('hashes', () => {
  let ppt = new PPT(0, 3, 0);
  expect(ppt["hashes"]("hello")).toEqual([hello0_hash, hello1_hash, hello2_hash]);
});

test('hash with index salt', () => {

  expect((new PPT(0, 0, 0))["hash"]("hello", 0)).toBe(hello0_hash);
  expect((new PPT(0, 0, 0))["hash"]("hello", 1)).toBe(hello1_hash);
  expect((new PPT(0, 0, 0))["hash"]("hello", 2)).toBe(hello2_hash);
});

test('node hash', () => {
  const hello_hash = "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"; // echo -n "hello" | sha256sum
  expect((new PPT(0, 0, 0))["nodeHash"]("hello")).toBe(hello_hash);
});


/************************/
/* Differential privacy */
/************************/

test('diffuse bit', () => {
  const ITERATIONS = 1000;

  let ppt = new PPT(0, 0, 0);

  // Never flip bit
  jest.spyOn(ppt as any, 'random').mockReturnValue(0);
  for (let i = 0; i < ITERATIONS; i++) {
    expect(ppt["diffuseBit"](0)).toBe(0);
    expect(ppt["diffuseBit"](1)).toBe(1);
  }

  // Always flip bit
  jest.spyOn(ppt as any, 'random').mockReturnValue(1);
  for (let i = 0; i < ITERATIONS; i++) {
    expect(ppt["diffuseBit"](0)).toBe(1);
    expect(ppt["diffuseBit"](1)).toBe(0);
  }
});


test('diffuse bits', () => {
  const N = 100;
  let ppt = new PPT(N, 0, 0);
  let diffuseBit = jest.spyOn(ppt as any, "diffuseBit").mockReturnValue(1);
  ppt["differentialPrivacy"](new Uint8Array(N).fill(0));
  expect(diffuseBit).toHaveBeenCalledTimes(N);
});


test('random uses Math.random', () => {
  for (let x of [0, 0.2, 0.4, 0.6, 0.8, 1]) {
    jest.spyOn(global.Math, 'random').mockReturnValue(x);
    expect((new PPT(0, 0, 0))["random"]()).toBe(x);
  }
  jest.spyOn(global.Math, 'random').mockRestore();
});

/*
test('cryptoRandom', () => {
  function cryptoRandom(n) {
    jest.spyOn(crypto, 'getRandomValues').mockReturnValue(
      new Uint32Array(1).fill(n));
    return new PPT(0, 0, 0)["cryptoRandom"]();
  }

  const VALUES = [
    [0x0, 0],
    [0x80000000, 0.5],
    [0xffffffff, 1],
  ];

  const PRECISION = 9;
  for (const [n, x] of VALUES) {
    expect(cryptoRandom(n)).toBeCloseTo(x, PRECISION);
  }

  // Should always be strictly less than 1
  expect(cryptoRandom(0xffffffff)).toBeLessThan(1);

  jest.spyOn(crypto, 'getRandomValues').mockRestore();
});
*/