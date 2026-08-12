"use client";

import { useState } from "react";
import { Loader2, Upload, Download } from "lucide-react";
import { toast } from "sonner";

import { CBTService } from "@/app/services/cbt.service";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function BatchUploadDialog({
  open,
  onOpenChange,
  examId,
  onUploaded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examId: string;
  onUploaded: () => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      toast.error("Select an Excel or CSV file");
      return;
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".csv")) {
      toast.error("Please upload an Excel (.xlsx) or CSV (.csv) file");
      return;
    }

    try {
      setUploading(true);

      const response = await CBTService.batchUploadQuestions(examId, file);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message || "Questions uploaded successfully");

      onOpenChange(false);
      setFile(null);

      await onUploaded();
    } catch {
      toast.error("Batch upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            Batch Upload Questions
          </DialogTitle>

          <DialogDescription className="text-sm leading-6">
            Download the template, fill in your questions, then upload the
            completed file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Download template */}
          <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
            <p className="text-sm font-medium">Download template</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-center"
              >
                <a href="/templates/cbt-question-template.xlsx" download>
                  <Download className="mr-2 h-4 w-4" />
                  Excel Template
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-center"
              >
                <a href="/templates/cbt-question-template.csv" download>
                  <Download className="mr-2 h-4 w-4" />
                  CSV Template
                </a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Keep the column headers exactly as provided in the template.
            </p>
          </div>

          {/* Upload file */}
          <div className="rounded-xl border p-4 space-y-4">
            <p className="text-sm font-medium">Upload completed file</p>

            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-foreground
                         file:mr-3 file:rounded-md file:border-0
                         file:bg-primary file:px-3 file:py-2
                         file:text-sm file:font-medium
                         file:text-primary-foreground
                         hover:file:bg-primary/90"
            />

            {file && (
              <div className="rounded-md bg-muted p-3 text-sm break-all">
                <p className="font-medium">Selected file</p>
                <p className="text-muted-foreground">{file.name}</p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="w-full sm:w-auto"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Questions
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
