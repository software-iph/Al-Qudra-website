export async function register() {
  // Database setup runs on the Node.js server only, and never during `next build`.
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NEXT_PHASE === "phase-production-build") return;

  const { bootstrap } = await import("./lib/db/bootstrap");
  await bootstrap();
}
