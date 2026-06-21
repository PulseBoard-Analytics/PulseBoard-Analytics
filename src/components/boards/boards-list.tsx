"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { deleteBoard } from "@/server/actions/boards";
import { formatDate } from "@/lib/utils";
import {
  BarChart3, ExternalLink, Globe, Lock,
  MoreHorizontal, Pencil, Trash2, ArrowRight, Activity,
} from "lucide-react";
import type { BoardSummary } from "@/lib/types";
import { EditBoardDialog } from "./edit-board-dialog";

interface BoardsListProps {
  boards: BoardSummary[];
}

export function BoardsList({ boards }: BoardsListProps) {
  if (boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/10 p-16 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
          <BarChart3 className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">No boards yet</h3>
        <p className="text-muted-foreground text-sm mt-1.5 max-w-xs">
          Create your first board to start tracking and visualising your metrics
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {boards.map((board, i) => (
        <BoardCard key={board.id} board={board} index={i} />
      ))}
    </div>
  );
}

function BoardCard({ board, index }: { board: BoardSummary; index: number }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteBoard(board.id);
      if (result.success) {
        toast({ title: "Board deleted" });
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const shareUrl = `${window.location.origin}/share/${board.shareToken}`;

  return (
    <>
      <div className="group relative rounded-2xl border glass-card overflow-hidden hover:border-primary/30 hover:teal-glow transition-all duration-300">
        {/* Top teal accent line */}
        <div className={`h-px w-full ${index === 0 ? "bg-primary" : "bg-border group-hover:bg-primary/50 transition-colors"}`} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  aria-label="Board options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl shadow-xl">
                <DropdownMenuItem onSelect={() => setEditOpen(true)} className="gap-2">
                  <Pencil className="h-4 w-4" /> Edit
                </DropdownMenuItem>
                {board.isPublic && (
                  <DropdownMenuItem className="gap-2" onSelect={() => {
                    navigator.clipboard.writeText(shareUrl);
                    toast({ title: "Share link copied!" });
                  }}>
                    <ExternalLink className="h-4 w-4" /> Copy share link
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive gap-2"
                  onSelect={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title */}
          <Link href={`/boards/${board.id}`} className="block group/link">
            <h3 className="font-bold text-base leading-snug line-clamp-1 group-hover/link:text-primary transition-colors">
              {board.name}
            </h3>
          </Link>
          {board.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {board.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground tabular-nums">{board._count.metrics}</span>
            <span>metric{board._count.metrics !== 1 ? "s" : ""}</span>
            <span className="opacity-30">·</span>
            <span>{formatDate(board.updatedAt)}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <Badge className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold gap-1 border ${
              board.isPublic
                ? "text-primary bg-primary/10 border-primary/20"
                : "text-muted-foreground bg-muted/30 border-border"
            }`}>
              {board.isPublic ? <Globe className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
              {board.isPublic ? "Public" : "Private"}
            </Badge>
            <Link
              href={`/boards/${board.id}`}
              className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Open <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{board.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the board and all its metrics. Cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditBoardDialog board={board} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
