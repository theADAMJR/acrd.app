import cluster from 'cluster';

let inc = 0;
let lastSnowflake: string;
const dcloneEpoch = 1609459200000;

export function generateSnowflake() {
  const pad = (num: number, by: number) =>
    num.toString(2).padStart(by, '0');

  const msSince = pad(new Date().getTime() - dcloneEpoch, 42);
  const pid = pad(process.pid, 5).slice(0, 5);
  const wid = pad(cluster.worker?.id ?? 0, 5);
  const getInc = (add: number) => pad(inc + add, 12);
  
  let snowflake = `0b${msSince}${wid}${pid}${getInc(0)}`;
  (snowflake === lastSnowflake)
    ? snowflake = `0b${msSince}${wid}${pid}${getInc(1)}`
    : inc = 0;  

  lastSnowflake = snowflake;   
  return BigInt(snowflake).toString();
}