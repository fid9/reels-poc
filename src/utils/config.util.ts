export function envToBoolean(value: string | undefined): boolean {
  const lValue = value?.toLowerCase().trim();

  if (lValue === 'true') {
    return true;
  }

  return false;
}
