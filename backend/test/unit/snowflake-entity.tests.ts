import { expect } from 'chai';
import { generateSnowflake, snowflakeToDate } from '../../src/data/snowflake-entity';
import patterns from '../../src/types/patterns';

describe('data/snowflake-entity', () => {
  it('get snowflake, 2 ids in same ms, snowflake is different', () => {
    expect(generateSnowflake()).to.not.equal(generateSnowflake());
  });

  it('snowflake to date, get date from snowflake, very similar time', () => {
    const date = new Date();
    const snowflake = generateSnowflake();
    const createdAt = snowflakeToDate(snowflake);
    
    expect(date.toString()).to.equal(createdAt.toString());
  });

  it('lots of snowflakes generated, all are unique', () => {
    const oneIsUnique = (val, i, arr) => val !== arr[Math.min(0, i - 1)];

    const equal = new Array(100)
      .map(generateSnowflake)
      .every(oneIsUnique);

    expect(equal).to.be.true;
  });

  it('snowflake id matches regex pattern', () => {
    expect(generateSnowflake()).to.match(patterns.snowflake);
  });
});
