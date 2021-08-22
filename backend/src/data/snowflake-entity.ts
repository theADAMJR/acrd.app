import cluster from 'cluster';

let inc = 0;
let lastSnowflake: string;
const accordEpoch = 1577836800000;

export function generateSnowflake() {
  const msSince = (new Date().getTime() - accordEpoch)
    .toString(2)
    .padStart(42, '0');  
  const pid = process.pid
    .toString(2)
    .slice(0, 5)
    .padStart(5, '0');
  const wid = (cluster.worker?.id ?? 0)
    .toString(2)
    .slice(0, 5)
    .padStart(5, '0');
  const getInc = (add: number) => (inc + add)
    .toString(2)
    .padStart(12, '0');
  
  let snowflake = `0b${msSince}${wid}${pid}${getInc(0)}`;
  (snowflake === lastSnowflake)
    ? snowflake = `0b${msSince}${wid}${pid}${getInc(1)}`
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
