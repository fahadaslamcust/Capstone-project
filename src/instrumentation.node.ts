import { logs } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
	LoggerProvider,
	SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";

declare global {
	var otelLoggerProvider: LoggerProvider | undefined;
}
const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
if (endpoint) {
	const exporter = new OTLPLogExporter({
		url: `${endpoint}/v1/logs`,
	});
	const provider = new LoggerProvider({
		resource: resourceFromAttributes({ "service.name": "capstone" }),
		processors: [new SimpleLogRecordProcessor({ exporter })],
	});
	globalThis.otelLoggerProvider = provider;
	logs.setGlobalLoggerProvider(provider);
}
