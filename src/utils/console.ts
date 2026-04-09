type LogLevel = "log" | "warn" | "error" | "info" | "debug";

const originalConsole: Record<LogLevel, (...args: any[]) => void> = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  info: console.info.bind(console),
  debug: console.debug.bind(console),
};

function wrapConsole(onCapture: (level: LogLevel, args: any[]) => void) {
  (["log", "warn", "error", "info", "debug"] as LogLevel[]).forEach((level) => {
    console[level] = (...args: any[]) => {
      onCapture(level, args); // 캐치
      originalConsole[level](...args); // 원본 출력 유지
    };
  });
}

function restoreConsole() {
  (["log", "warn", "error", "info", "debug"] as LogLevel[]).forEach((level) => {
    console[level] = originalConsole[level];
  });
}

export { wrapConsole, restoreConsole, originalConsole };
