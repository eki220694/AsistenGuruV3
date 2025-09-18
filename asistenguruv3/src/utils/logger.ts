type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private isDevelopment: boolean = process.env.NODE_ENV === 'development';

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      data
    };
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.toUpperCase().padEnd(5);
    return `[${timestamp}] ${level} ${entry.message}`;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  debug(message: string, data?: any): void {
    const entry = this.createLogEntry('debug', message, data);
    this.addLog(entry);
    
    if (this.isDevelopment) {
      console.debug(this.formatMessage(entry), data ? data : '');
    }
  }

  info(message: string, data?: any): void {
    const entry = this.createLogEntry('info', message, data);
    this.addLog(entry);
    
    console.info(this.formatMessage(entry), data ? data : '');
  }

  warn(message: string, data?: any): void {
    const entry = this.createLogEntry('warn', message, data);
    this.addLog(entry);
    
    console.warn(this.formatMessage(entry), data ? data : '');
  }

  error(message: string, data?: any): void {
    const entry = this.createLogEntry('error', message, data);
    this.addLog(entry);
    
    console.error(this.formatMessage(entry), data ? data : '');
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (!level) return [...this.logs];
    return this.logs.filter(log => log.level === level);
  }

  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return this.logs.map(entry => this.formatMessage(entry)).join('\n');
  }

  // Performance timing utility
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }

  // Group logging for related operations
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }
}

// Create singleton instance
export const logger = new Logger();

// Utility functions for common logging patterns
export const logApiCall = (method: string, url: string, data?: any) => {
  logger.info(`API Call: ${method} ${url}`, data);
};

export const logApiResponse = (method: string, url: string, status: number, data?: any) => {
  logger.info(`API Response: ${method} ${url} - ${status}`, data);
};

export const logApiError = (method: string, url: string, error: any) => {
  logger.error(`API Error: ${method} ${url}`, error);
};

export const logUserAction = (action: string, data?: any) => {
  logger.info(`User Action: ${action}`, data);
};

export const logStateChange = (component: string, oldState: any, newState: any) => {
  logger.debug(`State Change in ${component}`, { oldState, newState });
};

export const logComponentMount = (componentName: string, props?: any) => {
  logger.debug(`Component Mounted: ${componentName}`, props);
};

export const logComponentUnmount = (componentName: string) => {
  logger.debug(`Component Unmounted: ${componentName}`);
};

// Performance logging
export const logPerformance = (operation: string, duration: number) => {
  logger.info(`Performance: ${operation} took ${duration}ms`);
};

// Error boundary logging
export const logErrorBoundary = (error: Error, errorInfo: any, componentStack?: string) => {
  logger.error('Error Boundary Caught Error', {
    error: error.toString(),
    stack: error.stack,
    errorInfo,
    componentStack
  });
};