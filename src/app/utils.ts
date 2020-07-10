export function toIterable(length: number) {
  const array = [];
  for (let i = 0; i < length; i++)
    array.push(i);
  return array;
}

export function camelToSentenceCase(words) {
  const regex = /([A-Z])(?=[a-z][A-Z])|([a-z])(?=[A-Z])/g;
  return words
      .replace(regex, '$& ')[0]
      .toUpperCase() +
    words
      .replace(regex, '$& ')
      .slice(1);
}