import { useEffect, useState } from "react";
/**
 * Returns a "debounced" version of a value.
 *
 * Why:
 * - In UIs (search inputs, filters, autosave), we often don't want to react to
 *   every single keystroke/change immediately.
 * - Debouncing waits for the user to pause before updating the derived value.
 *
 * Example:
 * - `value` updates on every keypress
 * - `debouncedValue` updates only after `delay` ms with no further changes
 */
export const useDebouncedValue = <T,>(value: T, delay = 250) => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
};
