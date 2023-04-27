import { PIITokenizer as PIIT } from './PIITokenizer';


test('PIITokenizer', () => {
  let piit = new PIIT();

  let tokens = piit.tokenize("John", "Doe", new Date("2020-05-25"), "M");
  expect(tokens).toHaveLength(500);
  expect(tokens).toContain(0);
  expect(tokens).toContain(1);
  
  // TODO: check the value of the tokens
});
