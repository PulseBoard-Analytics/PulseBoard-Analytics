"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { importCsvMetrics } from "@/server/actions/metrics";
import { parseCsvFile } from "@/lib/csv";
import { Loader2, Upload, FileText, AlertCircle, CheckCircle2, FileUp } from "lucide-react";

interface ImportCsvDialogProps {
  boardId: string;
  onImported: (count: number) => void;
}

export function ImportCsvDialog({ boardId, onImported }: ImportCsvDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ rows: number; errors: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selected: File) => {
    setFile(selected);
    const result = await parseCsvFile(selected);
    setPreview({ rows: result.rows.length, errors: result.errors });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) await handleFile(selected);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const selected = e.dataTransfer.files?.[0];
    if (selected?.name.endsWith(".csv")) await handleFile(selected);
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const text = await file.text();
      const result = await importCsvMetrics(boardId, text);
      if (result.success) {
        onImported(result.data.count);
        setOpen(false);
        reset();
      } else {
        toast({ title: "Import failed", description: result.error, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs h-8">
          <Upload className="h-3.5 w-3.5" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Import from CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
              dragging
                ? "border-primary bg-primary/5"
                : file
                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Upload CSV file"
            />
            <div className="flex flex-col items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${file ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-muted"}`}>
                {file ? (
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <FileUp className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              {file ? (
                <div>
                  <p className="text-sm font-semibold">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Click to change file</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium">Drop CSV here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Columns: <code className="font-mono bg-muted px-1 rounded">name</code>,{" "}
                    <code className="font-mono bg-muted px-1 rounded">value</code>{" "}
                    (+ optional <code className="font-mono bg-muted px-1 rounded">unit</code>,{" "}
                    <code className="font-mono bg-muted px-1 rounded">timestamp</code>)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Validation result */}
          {preview && (
            <div className={`rounded-xl border p-4 ${preview.errors.length === 0 ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20" : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20"}`}>
              {preview.errors.length === 0 ? (
                <div className="flex items-center gap-2.5 text-sm text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Ready to import {preview.rows} row{preview.rows !== 1 ? "s" : ""}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    {preview.errors.length} error{preview.errors.length !== 1 ? "s" : ""} found
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 pl-6 list-disc">
                    {preview.errors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-xl btn-glow font-semibold"
              disabled={!file || !preview || preview.errors.length > 0 || loading}
              onClick={handleImport}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
