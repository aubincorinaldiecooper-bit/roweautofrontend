"use client";

import { useRef, useState } from "react";

/**
 * Adapted directly from Beautiful UI's ChatComposer primitive
 * (slev12397/beautiful-ui @ 44a274e598395ab61e7c96c26fda2758780253b7).
 * Keep the visual structure, tokens, motion, and composer language aligned
 * with the source primitive. Product code supplies only conversation data.
 */

export type ChatThreadMessage = {
  id: string | number;
  role: "user" | "assistant";
  text: string;
};

export type ChatComposerLabels = {
  placeholder: string;
};

const DEFAULT_LABELS: ChatComposerLabels = {
  placeholder: "Write a message…",
};

function AssistantSection({ body }: { body: string }) {
  return (
    <div
      className="flex w-full flex-col gap-1.5"
      style={{ animation: "fade-up 400ms cubic-bezier(0.23,1,0.32,1) both" }}
    >
      <div className="flex items-center gap-1 text-[12px] leading-[1.3]">
        <span className="font-medium text-ink">First Rowe Auto</span>
        <span className="text-ink-2">AI intake</span>
        <span className="text-ink">now</span>
      </div>
      <p className="text-[13px] leading-normal text-ink">{body}</p>
    </div>
  );
}

export default function ChatComposer({
  messages,
  labels,
  onSend,
  disabled = false,
  suggestions = ["Diagnostic intake", "Estimate follows"],
  onAttach,
}: {
  messages: ChatThreadMessage[];
  labels?: Partial<ChatComposerLabels>;
  onSend?: (text: string) => void;
  disabled?: boolean;
  suggestions?: string[];
  onAttach?: () => void;
}) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const [draft, setDraft] = useState("");
  const [tab, setTab] = useState(suggestions[0] ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const canSend = draft.trim().length > 0 && !disabled;

  const send = () => {
    if (!canSend) return;
    const text = draft.trim();
    setDraft("");
    onSend?.(text);
  };

  return (
    <div className="flex h-full min-h-0 w-full max-w-[680px] flex-col self-start overflow-hidden rounded-[14px] bg-surface shadow-card">
      <div className="flex shrink-0 items-center justify-between border-b border-line p-1.5">
        <div className="flex items-center">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={tab === item}
              onClick={() => setTab(item)}
              className={`rounded-[6px] px-2 py-[3px] text-[13px] text-ink transition-[background-color,opacity] duration-100 ${tab === item ? "bg-field" : "opacity-50 hover:opacity-75"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Add diagnostic attachment"
            onClick={onAttach}
            className="flex size-6 items-center justify-center rounded-[6px] text-ink-3 transition-colors duration-100 hover:bg-hover hover:text-ink-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 pt-3 pb-2">
        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="flex justify-end pl-14">
              <div
                className="rounded-xl bg-field px-3 py-1.5 text-[13px] leading-[1.4] text-ink"
                style={{ animation: "fade-up 300ms cubic-bezier(0.23,1,0.32,1) both" }}
              >
                {message.text}
              </div>
            </div>
          ) : (
            <AssistantSection key={message.id} body={message.text} />
          ),
        )}
      </div>

      <div className="mt-auto shrink-0 p-1.5">
        <div
          role="presentation"
          onClick={() => inputRef.current?.focus()}
          className="flex cursor-text flex-col gap-2 rounded-control border border-line bg-field p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.035)] transition-[border-color,box-shadow] duration-150 focus-within:border-line-strong focus-within:shadow-[0_1px_2px_rgba(0,0,0,0.025)]"
        >
          <input
            ref={inputRef}
            value={draft}
            disabled={disabled}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.nativeEvent.isComposing) send();
            }}
            placeholder={disabled ? "Intake complete" : l.placeholder}
            aria-label="Chat prompt"
            className="min-h-4.5 bg-transparent text-[13px] leading-[1.4] text-ink outline-none placeholder:text-ink-3 disabled:cursor-not-allowed"
          />
          <div className="flex items-center justify-end">
            <button
              type="button"
              aria-label="Send"
              disabled={!canSend}
              onClick={send}
              className="flex size-7 items-center justify-center rounded-[8px] transition-[background-color,color,transform] duration-200 enabled:active:scale-[0.96]"
              style={{
                background: canSend ? "var(--ink)" : "var(--line-strong)",
                color: canSend ? "var(--surface)" : "var(--ink-2)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
