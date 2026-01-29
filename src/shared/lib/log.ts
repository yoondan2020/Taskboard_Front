const isLogMode = import.meta.env.VITE_LOG_MODE === "true";

export function log(...args: any[]) {
  if (isLogMode) {
    console.log(...args);
  }
}