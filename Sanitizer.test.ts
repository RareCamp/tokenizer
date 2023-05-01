import { expect, test } from '@jest/globals';

import { DateSanitizer, GenderSanitizer, StringSanitizer } from './Sanitizer';


/*******************/
/* StringSanitizer */
/*******************/

test('StringSanitizer', () => {
  let ss = new StringSanitizer();

  expect(ss.sanitize("hello")).toBe("hello");

  // To lower case
  expect(ss.sanitize("HELLO")).toBe("hello");
  expect(ss.sanitize("HelloWorld")).toBe("helloworld");

  // Remove spaces from both ends
  expect(ss.sanitize(" hello")).toBe("hello");
  expect(ss.sanitize("    hello")).toBe("hello");
  expect(ss.sanitize("hello ")).toBe("hello");
  expect(ss.sanitize("hello   ")).toBe("hello");
  expect(ss.sanitize(" hello  ")).toBe("hello");

  // Convert multiple spaces to single space
  expect(ss.sanitize("hello  world")).toBe("hello world");
  expect(ss.sanitize("hello     world")).toBe("hello world");
  expect(ss.sanitize("hello\tworld")).toBe("hello world");
  expect(ss.sanitize("hello \t \t world")).toBe("hello world");

});

/*******************/
/* GenderSanitizer */
/*******************/

test('GenderSanitizer', () => {
  let gs = new GenderSanitizer();

  const maleWords = ["male", "MALE", "Male", "MalE", "man", "boy", "M", "m"];
  maleWords.forEach(word => {
    expect(gs.sanitize(word)).toBe("M");
  });

  const femaleWords = ["female", "FEMALE", "Female", "FemalE", "woman", "girl", "F", "f"];
  femaleWords.forEach(word => {
    expect(gs.sanitize(word)).toBe("F");
  });

  expect(() => gs.sanitize("")).toThrow();
  expect(() => gs.sanitize("unknown")).toThrow();
});

/*****************/
/* DateSanitizer */
/*****************/

test('DateSanitizer', () => {
  let ds = new DateSanitizer();
  let date = new Date("2020-01-01");
  expect(ds.sanitize(date)).toEqual(date);
});