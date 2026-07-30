"use client";

import { Download, RotateCcw, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ResultActionsProps {
  onRetake?: () => void;
  onDownload?: () => void;
  onShare?: () => void;

  downloading?: boolean;
  sharing?: boolean;

  allowRetake?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
}

export default function ResultActions({
  onRetake,
  onDownload,
  onShare,
  downloading = false,
  sharing = false,
  allowRetake = false,
  allowDownload = true,
  allowShare = false,
}: ResultActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {allowDownload && (
        <Button
          onClick={onDownload}
          disabled={downloading}
          className="flex-1 sm:flex-none"
        >
          <Download className="mr-2 h-4 w-4" />
          {downloading ? "Downloading..." : "Download Result"}
        </Button>
      )}

      {allowShare && (
        <Button
          variant="secondary"
          onClick={onShare}
          disabled={sharing}
          className="flex-1 sm:flex-none"
        >
          <Share2 className="mr-2 h-4 w-4" />
          {sharing ? "Sharing..." : "Share Result"}
        </Button>
      )}

      {allowRetake && (
        <Button
          variant="outline"
          onClick={onRetake}
          className="flex-1 sm:flex-none"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake Exam
        </Button>
      )}
    </div>
  );
}
