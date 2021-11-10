export const notInArray = (arr: any[]) => (old) => !arr.some(e => e.id === old.id);
export const uniqueBy = (key: string) => (v, i, a) => a.findIndex(t => (t[key] === v[key])) === i;