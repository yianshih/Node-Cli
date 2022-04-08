interface ParseStdoutOption {
  splitBy?: string;
  parse?: (o: string) => string;
  filter?: (o: string) => boolean;
}

export const splitStdout = (
  output: string,
  options: ParseStdoutOption
): string[] => {
  const { splitBy = "\n", parse, filter } = options;
  let data = output.split(splitBy);
  if (parse) data = data.map(parse);
  if (filter) data = data.filter(filter);
  return data;
};

export const trimMultiSpaces = (value: string) =>
  value.replace(/\s+/g, " ").trim();
