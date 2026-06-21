"use client";

import { useState } from "react";
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
import { toast } from "@/hooks/use-toast";
import { addMetric } from "@/server/actions/metrics";
import { Loader2, Plus } from "lucide-react";
import type { MetricRow } from "@/lib/types";
import { toDatetimeLocal } from "@/lib/utils";

interface AddMetricDialogProps {
  boardId: string;
  onAdded: (metric: MetricRow) => void;
}

export function AddMetricDialog({ boardId, onAdded }: AddMetricDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [timestamp, setTimestamp] = useState(() => toDatetimeLocal(new Date()));
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName(""); setValue(""); setUnit("");
    setTimestamp(toDatetimeLocal(new Date()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      toast({ title: "Invalid value", description: "Value must be a number.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const result = await addMetric({
        boardId, name, value: numValue,
        unit: unit || undefined,
        timestamp: new Date(timestamp),
      });
      if (result.success) {
        onAdded(result.data);
        toast({ title: "Metric added" });
        reset();
        setOpen(false);
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
        <Button size="sm" className="rounded-xl gap-1.5 btn-glow font-semibold">
          <Plus className="h-4 w-4" />
          Add Metric
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add a metric</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-1">
          <div className="space-y-1.5">
            <Label htmlFor="metric-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Metric name *
            </Label>
            <Input
              id="metric-name"
              placeholder="e.g. Daily Active Users"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="metric-value" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Value *
              </Label>
              <Input
                id="metric-value"
                type="number"
                step="any"
                placeholder="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="metric-unit" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Unit
              </Label>
              <Input
                id="metric-unit"
                placeholder="users, %, ms…"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                maxLength={20}
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="metric-timestamp" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Timestamp
            </Label>
            <Input
              id="metric-timestamp"
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl btn-glow font-semibold" disabled={loading || !name.trim() || !value}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Metric
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
