export function loggingMiddleware(req, res, next) {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  // Capture when the response finishes sending
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    // Color code based on status
    let statusLabel = `[${statusCode}]`;
    if (statusCode >= 500) {
      statusLabel = `\x1b[31m${statusLabel}\x1b[0m`; // Red
    } else if (statusCode >= 400) {
      statusLabel = `\x1b[33m${statusLabel}\x1b[0m`; // Yellow
    } else if (statusCode >= 200) {
      statusLabel = `\x1b[32m${statusLabel}\x1b[0m`; // Green
    }

    console.log(
      `[HTTP] ${method.padEnd(6)} ${originalUrl.padEnd(28)} ${statusLabel} ${duration}ms - IP: ${ip || '127.0.0.1'}`
    );
  });

  next();
}
