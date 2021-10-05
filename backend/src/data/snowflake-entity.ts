import cluster from 'cluster';

let inc = 0;
let lastSnowflake: string;
const accordEpoch = 1577836800000;

export function generateSnowflake() {
  const pad = (num: number, by: number) => num
    .toString(2)
    .padStart(by, '0');

  const msSince = pad(new Date().getTime() - accordEpoch, 42);
  const pid = pad(process.pid, 5).slice(0, 5);
  const wid = pad(cluster.worker?.id ?? 0, 5);
  const getInc = (add: number) => pad(inc + add, 12);
  
  let snowflake = `0b${msSince}${wid}${pid}${getInc(inc)}`;
  (snowflake === lastSnowflake)
    ? snowflake = `0b${msSince}${wid}${pid}${getInc(++inc)}`
    : inc = 0;  

  lastSnowflake = snowflake;   
  return BigInt(snowflake).toString();
}

function binary64(val: string) {
  try {
    return `0b${BigInt(val)
      .toString(2)
      .padStart(64, '0')}`;
  } catch (e) {
    return '';    
  }
}

// what this method does
// -> https://discord.com/developers/docs/reference#convert-snowflake-to-datetime
export function snowflakeToDate(snowflake: string) {
  const sinceEpochMs = Number(
    binary64(snowflake).slice(0, 42 + 2)
  );  
  return new Date(sinceEpochMs + accordEpoch);
}
