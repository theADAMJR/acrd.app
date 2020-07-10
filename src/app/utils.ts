export function toIterable(length: number) {
  const array = [];
  for (let i = 0; i < length; i++)
    array.push(i);
  return array;
}

export function camelToSentenceCase(words: string) {
  const regex = /([A-Z])(?=[a-z][A-Z])|([a-z])(?=[A-Z])/g;
  return words
      .replace(regex, '$& ')[0]
      .toUpperCase() +
    words
      .replace(regex, '$& ')
      .slice(1);
}

export function sentenceToCamelCase(words: string) {
  const capitalized = words
    .replace(/\s+(.)/g, (match, group) => group.toUpperCase());
  return capitalized[0].toLowerCase() + capitalized.slice(1);
}

export function kebabToCamelCase(words: string) {
  const arr = words.split('-');
  const capital = arr.map((item, index) =>
    index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item);

  const capitalized = capital.join('');
  return capitalized[0].toLowerCase() + capitalized.slice(1);
}