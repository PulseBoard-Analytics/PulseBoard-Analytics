import { type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscribe } from "@/lib/sse";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;

  // Allow access if authenticated owner OR via share token
  const session = await auth();
  const shareToken = req.nextUrl.searchParams.get("token");

  const board = await db.board.findUnique({ where: { id: boardId } });
  if (!board) {
    return new Response("Board not found", { status: 404 });
  }

  const isOwner = session?.user?.id === board.ownerId;
  const isShared = board.isPublic && shareToken === board.shareToken;

  if (!isOwner && !isShared) {
    return new Response("Forbidden", { status: 403 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send a keep-alive comment immediately
      controller.enqueue(encoder.encode(": connected\n\n"));

      const unsubscribe = subscribe(boardId, controller);

      // Clean up when the client disconnects
      req.signal.addEventListener("abort", () => {
        unsubscribe();
        try {
          controller.close();
        } catch {
          // already closed
        }
      });

      // Keep-alive ping every 25s to prevent proxy timeouts
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          clearInterval(interval);
        }
      }, 25_000);

      req.signal.addEventListener("abort", () => clearInterval(interval));
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
