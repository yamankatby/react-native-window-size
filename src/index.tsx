import React, { createContext, useContext, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type Breakpoint = string | number | symbol;

export type Breakpoints = { [key in Breakpoint]: number };

export const ActiveBreakpointContext = createContext<Breakpoint | null>(null);

export const BreakpointsContext = createContext<Breakpoints | null>(null);

export const useActiveBreakpoint = () => useContext(ActiveBreakpointContext);

export const useBreakpoints = () => useContext(BreakpointsContext);

export interface ProviderProps {
  breakpoints: Breakpoints;
}

export const Provider: React.FC<ProviderProps> = ({
  breakpoints,
  children,
}) => {
  const { width } = useWindowDimensions();

  const windowSizeClass = useMemo(() => {
    const keys = Object.keys(breakpoints).reverse() as Breakpoint[];
    const values = Object.values(breakpoints).reverse();

    return keys[values.findIndex((size) => width >= size)];
  }, [width, breakpoints]);

  return (
    <BreakpointsContext.Provider value={breakpoints}>
      <ActiveBreakpointContext.Provider value={windowSizeClass}>
        {children}
      </ActiveBreakpointContext.Provider>
    </BreakpointsContext.Provider>
  );
};

if (__DEV__) {
  Provider.displayName = 'WindowSizeProvider';
}

export interface WindowSize {
  up(breakpoint: Breakpoint): boolean;

  down(breakpoint: Breakpoint): boolean;

  between(minBreakpoint: Breakpoint, maxBreakpoint: Breakpoint): boolean;

  is(breakpoint: Breakpoint): boolean;

  is(...breakpoints: Breakpoint[]): boolean;

  not(breakpoint: Breakpoint): boolean;

  not(...breakpoints: Breakpoint[]): boolean;

  value<T>(query: Partial<Record<Breakpoint, T>>): T | undefined;
}

export const useWindowSize = (): WindowSize => {
  const breakpoints = useBreakpoints();
  const activeBreakpoint = useActiveBreakpoint();

  if (!breakpoints || !activeBreakpoint) {
    throw new Error('useWindowSize must be used within a WindowSizeProvider');
  }

  return useMemo(() => {
    const keys = Object.keys(breakpoints) as Breakpoint[];
    return {
      up: (breakpoint) => {
        return breakpoints[activeBreakpoint] >= breakpoints[breakpoint];
      },
      down: (breakpoint) => {
        return breakpoints[activeBreakpoint] <= breakpoints[breakpoint];
      },
      between: (minBreakpoint, maxBreakpoint) => {
        return (
          breakpoints[activeBreakpoint] >= breakpoints[minBreakpoint] &&
          breakpoints[activeBreakpoint] <= breakpoints[maxBreakpoint]
        );
      },
      is: (...breakpoint) => breakpoint.includes(activeBreakpoint),
      not: (...breakpoint) => !breakpoint.includes(activeBreakpoint),
      value: (query) => {
        const queryKeys = Object.keys(query) as Breakpoint[];

        let nearestBreakpoint = activeBreakpoint;
        while (!queryKeys.includes(nearestBreakpoint)) {
          nearestBreakpoint = keys[keys.indexOf(nearestBreakpoint) - 1];
        }
        return query[nearestBreakpoint];
      },
    };
  }, [breakpoints, activeBreakpoint]);
};
