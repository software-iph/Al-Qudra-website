import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { UPLOAD_DIR } from "@/lib/uploads";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

/** Serves files uploaded from the dashboard (stored outside the build, in UPLOAD_DIR). */
export async function GET(request: Request, ctx: RouteContext<"/uploads/[...path]">) {
  const { path: parts } = await ctx.params;
  const file = path.resolve(UPLOAD_DIR, ...parts);
  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type || !file.startsWith(UPLOAD_DIR + path.sep)) return new Response("Not found", { status: 404 });

  const info = await stat(file).catch(() => null);
  if (!info?.isFile()) return new Response("Not found", { status: 404 });

  const headers = new Headers({
    "Content-Type": type,
    "Cache-Control": "public, max-age=31536000, immutable", // file names are unique
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
  });

  // Byte ranges so videos can be streamed and scrubbed.
  const range = request.headers.get("range")?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), info.size - 1) : info.size - 1;
    if (start > end || start >= info.size) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${info.size}` } });
    }
    headers.set("Content-Range", `bytes ${start}-${end}/${info.size}`);
    headers.set("Content-Length", String(end - start + 1));
    const stream = Readable.toWeb(createReadStream(file, { start, end })) as ReadableStream;
    return new Response(stream, { status: 206, headers });
  }

  headers.set("Content-Length", String(info.size));
  return new Response(Readable.toWeb(createReadStream(file)) as ReadableStream, { headers });
}
