export function deterministicStringify(obj: any) {
  return JSON.stringify(
    obj,
    (_, value) =>
      value instanceof Object && !Array.isArray(value)
        ? Object.keys(value)
            .sort()
            .reduce((sorted: any, k) => {
              sorted[k] = value[k];
              return sorted;
            }, {})
        : value,
    2,
  );
}
