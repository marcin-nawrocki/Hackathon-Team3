import { useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

/**
 * Tracks a view's measured width via onLayout. Returns the current width and the
 * handler to attach. Useful for sizing SVG charts to their container.
 */
export function useElementWidth(initial = 0) {
  const [width, setWidth] = useState(initial);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    setWidth((prev) => (Math.abs(prev - next) > 0.5 ? next : prev));
  }, []);

  return { width, onLayout };
}
