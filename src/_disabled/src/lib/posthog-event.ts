export function errorEventName(name: string): string {
  return name.endsWith('_error') ? name : `${name}_error`;
}
