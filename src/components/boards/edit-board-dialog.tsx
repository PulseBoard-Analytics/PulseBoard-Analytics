"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { updateBoard } from "@/server/actions/boards";
import { Loader2, Globe } from "lucide-react";
import type { BoardSummary } from "@/lib/types";

interface EditBoardDialogProps {
  board: BoardSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBoardDialog({ board, open, onOpenChange }: EditBoardDialogProps) {
  const router = useRouter();
  const [name, setName] = useState(board.name);
  const [description, setDescription] = useState(board.description ?? "");
  const [isPublic, setIsPublic] = useState(board.isPublic);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(board.name);
    setDescription(board.description ?? "");
    setIsPublic(board.isPublic);
  }, [board]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateBoard(board.id, { name, description, isPublic });
      if (result.success) {
        toast({ title: "Board updated" });
        onOpenChange(false);
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Board settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-1">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Board name *
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-desc" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </Label>
            <Input
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10">
                <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Public board</p>
                <p className="text-xs text-muted-foreground">Share link becomes active when enabled</p>
              </div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} aria-label="Make board public" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl btn-glow font-semibold" disabled={loading || !name.trim()}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
