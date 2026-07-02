export function getNestedValue(record: object, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[key];
  }, record);
}
