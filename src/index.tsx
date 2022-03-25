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

export const useWindowSize = () => {
  const breakpoints = useBreakpoints();
  const activeBreakpoint = useActiveBreakpoint();

  if (!breakpoints || !activeBreakpoint) {
    throw new Error('useWindowSize must be used within a WindowSizeProvider');
  }

  return useMemo(() => {
    const keys = Object.keys(breakpoints) as Breakpoint[];

    const up = (breakpoint: Breakpoint) => {
      return keys.indexOf(activeBreakpoint) >= keys.indexOf(breakpoint);
    };

    const down = (breakpoint: Breakpoint) => {
      return keys.indexOf(activeBreakpoint) <= keys.indexOf(breakpoint);
    };

    const between = (minBreakpoint: Breakpoint, maxBreakpoint: Breakpoint) => {
      return up(minBreakpoint) && down(maxBreakpoint);
    };

    const is = (breakpoint: Breakpoint) => {
      return activeBreakpoint === breakpoint;
    };

    const not = (breakpoint: Breakpoint) => {
      return activeBreakpoint !== breakpoint;
    };

    const value = <T,>(query: Partial<Record<Breakpoint, T>>) => {
      const queryKeys = Object.keys(query) as Breakpoint[];

      let nearest = activeBreakpoint;
      while (!queryKeys.includes(nearest)) {
        nearest = keys[keys.indexOf(nearest) - 1];
      }
      return query[nearest];
    };

    return { up, down, between, is, not, value };
  }, [breakpoints, activeBreakpoint]);
};
