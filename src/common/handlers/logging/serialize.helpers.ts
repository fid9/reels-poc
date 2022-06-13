/* eslint @typescript-eslint/no-explicit-any: 0 */

function destroyCircular(data: {
  from: any;
  seen: any[];
  forceEnumerable: boolean;
}) {
  const { from, seen, forceEnumerable } = data;
  const to: any = Array.isArray(from) ? [] : {};
  seen.push(from);
  for (const [key, value] of Object.entries(from)) {
    if (typeof value === 'function') {
      continue;
    }
    if (!value || typeof value !== 'object') {
      to[key] = value;
      continue;
    }
    if (!seen.includes(from[key])) {
      to[key] = destroyCircular({
        from: from[key],
        seen: seen.slice(),
        forceEnumerable,
      });
      continue;
    }
    to[key] = '[Circular]';
  }
  for (const { property, enumerable } of [
    { property: 'name', enumerable: false },
    { property: 'message', enumerable: false },
    { property: 'stack', enumerable: false },
    { property: 'code', enumerable: true },
  ]) {
    if (typeof from[property] === 'string') {
      Object.defineProperty(to, property, {
        value: from[property],
        enumerable: forceEnumerable ? true : enumerable,
        configurable: true,
        writable: true,
      });
    }
  }

  return to;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function serialize(e: any): any {
  if (typeof e === 'object' && e !== null) {
    return destroyCircular({ from: e, seen: [], forceEnumerable: true });
  }
  if (typeof e === 'function') {
    return `[Function: ${(e as any).name || 'anonymous'}]`;
  }
  return e;
}
