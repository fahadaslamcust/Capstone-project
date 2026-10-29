import { logs } from "@opentelemetry/api-logs";
import { LoggerProvider, SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
declare global{
  var otelLoggerProvider: LoggerProvider|undefined;
}
const exporter = new OTLPLogExporter({
  url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/logs`
});
const provider = new LoggerProvider({
  resource: resourceFromAttributes({ "service.name": "capstone" }),
  processors: [new SimpleLogRecordProcessor({ exporter })],
});
globalThis.otelLoggerProvider = provider;
logs.setGlobalLoggerProvider(provider);