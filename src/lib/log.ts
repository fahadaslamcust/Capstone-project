import { logs, SeverityNumber } from "@opentelemetry/api-logs";
import { waitUntil } from "@vercel/functions";
const logger = logs.getLogger("app");
function flush() {
  const provider = globalThis.otelLoggerProvider;
  if (provider) waitUntil(provider.forceFlush());
}
export function logInfo(body: string, attributes: Record<string, string | number | boolean> = {}) {
  logger.emit({ severityNumber: SeverityNumber.INFO, severityText: "INFO", body, attributes });
  flush();
}
