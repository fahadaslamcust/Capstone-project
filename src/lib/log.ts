import { logs, SeverityNumber } from "@opentelemetry/api-logs";
import { after } from "next/server";
const logger = logs.getLogger("app");
function flush() {
  const provider = (globalThis as any).__otelLoggerProvider;
  if (provider) after(() => provider.forceFlush());
}
export function logInfo(body: string, attributes: Record<string, string | number | boolean> = {}) {
  logger.emit({ severityNumber: SeverityNumber.INFO, severityText: "INFO", body, attributes });
  flush();
}

export function logError(body: string, attributes: Record<string, string | number | boolean> = {}) {
  logger.emit({ severityNumber: SeverityNumber.ERROR, severityText: "ERROR", body, attributes });
  flush();
}