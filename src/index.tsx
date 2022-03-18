import React, { createContext, useContext, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type WindowSizeClass = string | number;

export type WindowSizes = { [key in WindowSizeClass]: number };

export const WindowSizeClassContext = createContext<WindowSizeClass>('');

export const WindowSizesContext = createContext<WindowSizes>({});

export const useWindowSizeClass = () => useContext(WindowSizeClassContext);

export const useWindowSizes = () => useContext(WindowSizesContext);

export interface ProviderProps {
  windowSizes: WindowSizes;
}

export const Provider: React.FC<ProviderProps> = ({
  windowSizes,
  children,
}) => {
  const { width } = useWindowDimensions();

  const windowSizeClass = useMemo(() => {
    const keys = Object.keys(windowSizes).reverse() as WindowSizeClass[];
    const values = Object.values(windowSizes).reverse();

    return keys[values.findIndex((size) => width >= size)];
  }, [width, windowSizes]);

  return (
    <WindowSizeClassContext.Provider value={windowSizeClass}>
      <WindowSizesContext.Provider value={windowSizes}>
        {children}
      </WindowSizesContext.Provider>
    </WindowSizeClassContext.Provider>
  );
};

if (__DEV__) {
  Provider.displayName = 'WindowSizeProvider';
}

export const useIsWindowSizeClassUp = (sx: WindowSizeClass) => {
  const windowSizes = useWindowSizes();
  const keys = useMemo(
    () => Object.keys(windowSizes) as WindowSizeClass[],
    [windowSizes]
  );

  const windowSizeClass = useWindowSizeClass();

  return useMemo(() => {
    return keys.indexOf(windowSizeClass) >= keys.indexOf(sx);
  }, [sx, keys, windowSizeClass]);
};

export const useIsWindowSizeClassDown = (sx: WindowSizeClass) => {
  const windowSizes = useWindowSizes();
  const keys = useMemo(
    () => Object.keys(windowSizes) as WindowSizeClass[],
    [windowSizes]
  );

  const windowSizeClass = useWindowSizeClass();

  return useMemo(() => {
    return keys.indexOf(windowSizeClass) <= keys.indexOf(sx);
  }, [sx, keys, windowSizeClass]);
};

export const useIsWindowSizeClassBetween = (
  sx1: WindowSizeClass,
  sx2: WindowSizeClass
) => {
  const windowSizeClassUp = useIsWindowSizeClassUp(sx1);
  const windowSizeClassDown = useIsWindowSizeClassDown(sx2);

  return useMemo(() => {
    return windowSizeClassUp && windowSizeClassDown;
  }, [windowSizeClassUp, windowSizeClassDown]);
};

export const useIsWindowSizeClass = (sx: WindowSizeClass) => {
  const windowSizeClass = useWindowSizeClass();

  return useMemo(() => {
    return windowSizeClass === sx;
  }, [windowSizeClass, sx]);
};

export const useIsWindowSizeClassNot = (sx: WindowSizeClass) => {
  const windowSizeClass = useWindowSizeClass();

  return useMemo(() => {
    return windowSizeClass !== sx;
  }, [windowSizeClass, sx]);
};

export const useWindowSizeClassValue = <T,>(
  query: Partial<Record<WindowSizeClass, T>>
) => {
  const windowSizes = useWindowSizes();
  const keys = useMemo(
    () => Object.keys(windowSizes) as WindowSizeClass[],
    [windowSizes]
  );

  const windowSizeClass = useWindowSizeClass();

  return useMemo(() => {
    const queryKeys = Object.keys(query) as WindowSizeClass[];

    let nearest = windowSizeClass;
    while (!queryKeys.includes(nearest)) {
      nearest = keys[keys.indexOf(nearest) - 1];
    }
    return query[nearest];
  }, [query, keys, windowSizeClass]);
};
