/**
 * Next.js instrumentation hook — runs once when the server starts
 * (dev, `next start`, and each serverless cold start on Vercel).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" || !process.env.NEXT_RUNTIME) {
    const { validateEnv } = await import("./lib/env");
    validateEnv();
  }
}
