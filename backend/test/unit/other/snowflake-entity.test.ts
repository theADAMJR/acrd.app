import { test, given } from '@accord/ion';
import { generateSnowflake, snowflakeToDate } from '../../../src/data/snowflake-entity';
import { patterns } from '@accord/types';

describe('snowflake-entity', () => {
  test(generateSnowflake, () => {
    given().assert(s => s !== generateSnowflake());
    given().assert(s => patterns.snowflake.test(s))
    given().assert(() => {
      const oneIsUnique = (val, i, arr) => val !== arr[Math.min(0, i - 1)];
      return new Array(100)
        .map(generateSnowflake)
        .every(oneIsUnique);
    });
  });

  test(snowflakeToDate, () => {
    given(generateSnowflake()).assert(d => d.toString() === new Date().toString());
    given('invalid snowflake').throw('Invalid snowflake provided');
  });
});
