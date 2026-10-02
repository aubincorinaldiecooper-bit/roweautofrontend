"use client";

import { Button } from "@/components/atoms/Button";
import { StatusPill } from "@/components/atoms/StatusPill";

/**
 * Product adaptation of Beautiful UI's ContextCards primitive
 * (slev12397/beautiful-ui @ 44a274e598395ab61e7c96c26fda2758780253b7).
 * The card structure, token usage, spacing, shadows, and motion remain aligned
 * with the upstream primitive; this version represents diagnostic attachments.
 */

export type DiagnosticAttachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
};

function formatBytes(bytes:number) {
  if(bytes < 1024) return `${bytes} B`;
  if(bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function badgeFor(file:DiagnosticAttachment) {
  if(file.type.startsWith("image/")) return "IMG";
  if(file.type.startsWith("video/")) return "VID";
  if(file.type.includes("pdf")) return "PDF";
  return "FILE";
}

export default function DiagnosticAttachments({
  files,
  onRequestAdd,
  onRequestPhoto,
  onRequestVideo,
  onRemove,
}: {
  files: DiagnosticAttachment[];
  onRequestAdd: () => void;
  onRequestPhoto: () => void;
  onRequestVideo: () => void;
  onRemove: (id:string) => void;
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-[14px] bg-surface shadow-card">
      <div className="flex shrink-0 items-center justify-between border-b border-line p-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-ink">Diagnostic files</span>
            <StatusPill tone="neutral" dot={false}>{files.length}</StatusPill>
          </div>
          <p className="mt-1 text-[12px] text-ink-3">Photos and documents stay with this intake.</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button type="button" variant="secondary" size="xs" onClick={onRequestPhoto}>
            Take photo
          </Button>
          <Button type="button" variant="secondary" size="xs" onClick={onRequestVideo}>
            Record video
          </Button>
          <Button type="button" variant="secondary" size="xs" onClick={onRequestAdd}>
            Add files
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {files.length===0 ? (
          <div
            className="overflow-hidden rounded-card bg-surface shadow-card"
            style={{animation:"fade-up 400ms cubic-bezier(0.23,1,0.32,1) both"}}
          >
            <div className="primitive-card-bar flex items-center gap-2.5 border-b border-line">
              <span className="text-[13px] font-medium text-ink">Add diagnostic context</span>
            </div>
            <p className="px-3 py-3 text-[12.5px] leading-relaxed text-ink-2">
              Add warning lights, visible damage, leaks, noises captured on video, prior estimates, or other documents that can help the shop understand the issue.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {files.map((file,index)=>(
              <div
                key={file.id}
                className="overflow-hidden rounded-card bg-surface shadow-card"
                style={{animation:`fade-up 400ms cubic-bezier(0.23,1,0.32,1) ${index*70}ms both`}}
              >
                {file.preview && file.type.startsWith("image/") && (
                  <div className="aspect-[16/10] w-full overflow-hidden bg-inset">
                    <img src={file.preview} alt="" className="h-full w-full object-cover"/>
                  </div>
                )}
                {file.preview && file.type.startsWith("video/") && (
                  <div className="aspect-[16/10] w-full overflow-hidden bg-inset">
                    <video src={file.preview} controls className="h-full w-full object-cover"/>
                  </div>
                )}
                <div className="primitive-card-bar flex items-center gap-2.5 border-b border-line">
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">{file.name}</span>
                  <span className="shrink-0 text-[12px] text-ink-3 tabular-nums">{formatBytes(file.size)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-inset px-2 text-[12px] font-medium text-ink-2 shadow-btn">
                    <span className="flex size-3.5 items-center justify-center rounded-[4px] bg-accent text-[7px] font-bold text-white">
                      {badgeFor(file)}
                    </span>
                    Diagnostic evidence
                  </span>
                  <Button type="button" variant="quiet" size="xs" onClick={()=>onRemove(file.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
