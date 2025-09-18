import { useCallback, useRef, useEffect } from 'react';
import { logger, logPerformance } from '../utils/logger';

interface PerformanceEntry {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

export const usePerformanceMonitor = () => {
  const performanceEntries = useRef<Map<string, PerformanceEntry>>(new Map());

  // Start timing an operation
  const startTiming = useCallback((name: string) => {
    const startTime = performance.now();
    performanceEntries.current.set(name, {
      name,
      startTime,
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.time(`Performance: ${name}`);
    }
  }, []);

  // End timing and log results
  const endTiming = useCallback((name: string) => {
    const entry = performanceEntries.current.get(name);
    if (!entry) {
      logger.warn(`Performance timing not found: ${name}`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - entry.startTime;

    // Update entry
    entry.endTime = endTime;
    entry.duration = duration;

    // Log performance
    logPerformance(name, duration);

    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(`Performance: ${name}`);
    }

    // Clean up
    performanceEntries.current.delete(name);

    return duration;
  }, []);

  // Measure function execution time
  const measureFunction = useCallback(<T extends (...args: any[]) => any>(
    name: string,
    fn: T
  ): T => {
    return ((...args: any[]) => {
      startTiming(name);
      try {
        const result = fn(...args);
        
        // Handle promises
        if (result instanceof Promise) {
          return result.finally(() => endTiming(name));
        }
        
        endTiming(name);
        return result;
      } catch (error) {
        endTiming(name);
        throw error;
      }
    }) as T;
  }, [startTiming, endTiming]);

  // Measure async function
  const measureAsync = useCallback(async <T>(
    name: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    startTiming(name);
    try {
      const result = await asyncFn();
      endTiming(name);
      return result;
    } catch (error) {
      endTiming(name);
      throw error;
    }
  }, [startTiming, endTiming]);

  // Get all performance entries
  const getPerformanceEntries = useCallback(() => {
    return Array.from(performanceEntries.current.values());
  }, []);

  // Clear all entries
  const clearPerformanceEntries = useCallback(() => {
    performanceEntries.current.clear();
  }, []);

  // Monitor component render performance
  const measureRender = useCallback((componentName: string) => {
    const renderStart = performance.now();
    
    return () => {
      const renderEnd = performance.now();
      const duration = renderEnd - renderStart;
      logPerformance(`${componentName} Render`, duration);
    };
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      performanceEntries.current.clear();
    };
  }, []);

  return {
    startTiming,
    endTiming,
    measureFunction,
    measureAsync,
    measureRender,
    getPerformanceEntries,
    clearPerformanceEntries,
  };
};