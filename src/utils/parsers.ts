import { trimMultiSpaces } from "@cli/utils";

const isHeaderValid = (headers: string[], obj: object): boolean => {
  const headersSet = new Set(headers);
  const objSet = new Set(Object.keys(obj));
  // if headers has same structure of obj, the set of headers will have the same size of header Set and obj Set combined
  return headersSet.size === new Set([...headersSet, ...objSet]).size;
};

const arrayToObject = <T extends object>(arr: string[], defaultObj: T): T => {
  const keys = Object.keys(defaultObj);
  if (keys.length !== arr.length) return defaultObj;
  return Object.fromEntries(keys.map((k, i) => [k, arr[i]])) as T;
};

export const parseTableOutputToObject = <T extends object>(
  output: string,
  defaultObj: T,
  parseContent?: (data: string) => string[]
): T[] => {
  const lines = output.split("\n");
  if (!lines.length) return [defaultObj];
  const [header, ...contentLines] = lines.filter((l) => l !== "");
  const headers = trimMultiSpaces(header).split(" ");
  if (!isHeaderValid(headers, defaultObj)) return [defaultObj];
  return contentLines.map((content) => {
    content = trimMultiSpaces(content);
    const parsedContent = parseContent
      ? parseContent(content)
      : content.split(" ");
    return arrayToObject(parsedContent, defaultObj);
  });
};
