"use client";

import { useEffect, useState } from "react";
import { FileText, Download, ExternalLink, Loader2 } from "lucide-react";

export type BlogAttachment = {
  id: string;
  filename: string;
  url: string;
  public_id?: string;
  content_type?: string | null;
  file_size?: number | null;
};

type AttachmentPreviewProps = {
  attachment: BlogAttachment;
  blogId: string;
  apiBaseUrl: string;
};

export function AttachmentPreview({
  attachment,
  blogId,
  apiBaseUrl,
}: AttachmentPreviewProps) {
  const [textContent, setTextContent] = useState("");
  const [textLoading, setTextLoading] = useState(false);
  const [textError, setTextError] = useState(false);

  const extension = attachment.filename.split(".").pop()?.toLowerCase() ?? "";

  const isPdf =
    extension === "pdf" ||
    attachment.content_type?.toLowerCase().includes("application/pdf") === true;

  const isTxt =
    extension === "txt" ||
    attachment.content_type?.toLowerCase().startsWith("text/plain") === true;

  const downloadUrl =
    `${apiBaseUrl.replace(/\/$/, "")}/blogs/` +
    `${encodeURIComponent(blogId)}/attachments/` +
    `${encodeURIComponent(attachment.id)}/download`;

  const fileSize = attachment.file_size ?? 0;

  const formattedSize =
    fileSize >= 1024 * 1024
      ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB`
      : fileSize > 0
        ? `${Math.max(1, Math.round(fileSize / 1024))} KB`
        : "Size unavailable";

  useEffect(() => {
    if (!isTxt || !attachment.url) {
      return;
    }

    const controller = new AbortController();

    async function loadText() {
      setTextLoading(true);
      setTextError(false);

      try {
        const response = await fetch(attachment.url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load text preview.");
        }

        const text = await response.text();

        // Avoid rendering extremely large text files in the article page.
        const maxCharacters = 200_000;

        setTextContent(
          text.length > maxCharacters
            ? `${text.slice(0, maxCharacters)}\n\n[Preview shortened. Download the file to read the complete content.]`
            : text,
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setTextError(true);
      } finally {
        if (!controller.signal.aborted) {
          setTextLoading(false);
        }
      }
    }

    void loadText();

    return () => controller.abort();
  }, [isTxt, attachment.url]);

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="break-words font-semibold text-gray-900">
              {attachment.filename}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {isPdf
                ? "PDF document"
                : isTxt
                  ? "Text document"
                  : "Unsupported file"}
              {" · "}
              {formattedSize}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <a
            href={downloadUrl}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </div>
      </div>

      <div className="bg-gray-50 p-3 sm:p-5">
        {isPdf ? (
          <div>
            <div className="mb-3 text-sm font-medium text-gray-700">
              Preview
            </div>

            <iframe
              src={`${apiBaseUrl.replace(/\/$/, "")}/blogs/${encodeURIComponent(
                blogId,
              )}/attachments/${encodeURIComponent(
                attachment.id,
              )}/preview#page=1&toolbar=0&navpanes=0`}
              title={`First-page preview of ${attachment.filename}`}
              className="h-[480px] w-full rounded-lg border border-gray-200 bg-white sm:h-[600px]"
              loading="lazy"
            />

            <p className="mt-3 text-xs leading-5 text-gray-500">
              Preview of the PDF. Use the Download button to save the original
              file.
            </p>
          </div>
        ) : isTxt ? (
          <div>
            <div className="mb-3 text-sm font-medium text-gray-700">
              Text preview
            </div>

            <div className="max-h-[500px] min-h-48 overflow-auto rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
              {textLoading ? (
                <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading text preview...
                </div>
              ) : textError ? (
                <p className="text-sm leading-6 text-gray-600">
                  The text preview could not be loaded. Please download the
                  original file to read it.
                </p>
              ) : (
                <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-gray-800">
                  {textContent || "This text file is empty."}
                </pre>
              )}
            </div>
          </div>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center">
            <FileText className="h-10 w-10 text-gray-400" />

            <p className="font-medium text-gray-800">
              Preview is available only for PDF and TXT files.
            </p>

            <p className="text-sm text-gray-500">
              You can still download the original attachment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default AttachmentPreview;
