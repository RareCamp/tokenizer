import { expect, test } from '@jest/globals';

import { DateExpander, QGramExpander } from './Expander';


/*****************/
/* QGramExpander */
/*****************/

test('QGramExpander', () => {
  let qe = new QGramExpander();

  let expanded = qe.expand("hello");
  expect(expanded).toContain("hello");
  expect(expanded).toHaveLength(1);
});


/****************/
/* DateExpander */
/****************/

test('DateExpander formatDate', () => {
  let ds = new DateExpander();
  
  expect(ds.formatDate(new Date("2020-05-25"))).toBe("2020-05-25");
  expect(ds.formatDate(new Date("2020-01-01"))).toBe("2020-01-01");
});

test('DateExpander', () => {
  let ds = new DateExpander();
  
  let date = new Date("2020-05-25");
  let expanded = ds.expand(date);
  expect(expanded).toHaveLength(3);
  expect(expanded).toContain("2020-05-25");
  expect(expanded).toContain("2020-05-24");
  expect(expanded).toContain("2020-05-26");

  date = new Date("2020-01-01");
  expanded = ds.expand(date);
  expect(expanded).toHaveLength(3);
  expect(expanded).toContain("2020-01-01");
  expect(expanded).toContain("2019-12-31");
  expect(expanded).toContain("2020-01-02");
});