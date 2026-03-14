export function logInfo(message, data = {}) {
  console.info(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      ...data,
    })
  );
}

export function logError(data) {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      ...data,
    })
  );
}

export function logWarning(message, data = {}) {
  console.warn(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      ...data,
    })
  );
}
