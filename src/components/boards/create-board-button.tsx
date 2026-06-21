"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { createBoard } from "@/server/actions/boards";
import { Loader2, Plus, Globe } from "lucide-react";

export function CreateBoardButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createBoard({ name, description, isPublic });
      if (result.success) {
        toast({ title: "Board created!" });
        setOpen(false);
        setName(""); setDescription(""); setIsPublic(false);
        router.push(`/boards/${result.data.id}`);
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-glow rounded-xl gap-2 font-semibold">
          <Plus className="h-4 w-4" />
          New Board
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create a board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-1">
          <div className="space-y-1.5">
            <Label htmlFor="board-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Board name *
            </Label>
            <Input
              id="board-name"
              placeholder="e.g. Product Metrics Q3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="board-description" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </Label>
            <Input
              id="board-description"
              placeholder="Optional short description…"
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
                <p className="text-xs text-muted-foreground">Anyone with the share link can view</p>
              </div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} aria-label="Make board public" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl btn-glow font-semibold" disabled={loading || !name.trim()}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Board
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
