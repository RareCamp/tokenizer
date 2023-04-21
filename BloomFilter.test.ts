import { BloomFilter } from "./BloomFilter";

test('hash', () => {

  expect(1+2).toBe(3);

  let bf = new BloomFilter(1000, 10);

  //console.log(bf.nodeHash("hello"));
  //console.log(BigInt("0x" + bf.nodeHash("hello")));
  //console.log(BigInt("0x" + bf.nodeHash("hello")) % BigInt(10000));
  //console.log(bf.hashIndex(bf.nodeHash("hello")));

  expect(bf.nodeHash("hello")).toBe("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");

});
