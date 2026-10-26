import { logs } from "@opentelemetry/api-logs";
import { LoggerProvider, SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";

const provider = new LoggerProvider({
  resource: resourceFromAttributes({ "service.name": "capstone" }),
  processors: [new SimpleLogRecordProcessor({ exporter: new OTLPLogExporter() })],
});

logs.setGlobalLoggerProvider(provider);