import { registerOTel } from "@vercel/otel";

export async function register() {
  registerOTel({ serviceName: "my-nextjs-app" });

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.node");
  }
}