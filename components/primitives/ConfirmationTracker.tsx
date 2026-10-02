"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { StatusPill } from "@/components/atoms/StatusPill";

type TrackerUpdate = {
  title: string;
  detail?: string | null;
  created_at: string;
};

type TrackerResult = {
  confirmation_number: string;
  vehicle?: string | null;
  current_status: string;
  updates: TrackerUpdate[];
};

/**
 * Product adaptation of Beautiful UI's SearchList + TaskRows primitives
 * (slev12397/beautiful-ui @ 44a274e598395ab61e7c96c26fda2758780253b7).
 */
export default function ConfirmationTracker() {
  const [confirmation,setConfirmation]=useState("");
  const [result,setResult]=useState<TrackerResult|null>(null);
  const [state,setState]=useState<"idle"|"loading"|"error">("idle");

  async function lookup(event:FormEvent) {
    event.preventDefault();
    const value=confirmation.trim().toUpperCase();
    if(!value) return;

    const api=process.env.NEXT_PUBLIC_API_URL;
    if(!api){
      setResult(null);
      setState("error");
      return;
    }

    setState("loading");
    setResult(null);

    try{
      const response=await fetch(`${api}/api/status/${encodeURIComponent(value)}`);
      if(!response.ok) throw new Error("not found");
      setResult(await response.json());
      setState("idle");
    }catch{
      setState("error");
    }
  }

  return (
    <div className="w-full max-w-md overflow-hidden rounded-card bg-surface text-ink shadow-raised">
      <form onSubmit={lookup} className="flex h-11 items-center gap-2 border-b border-line px-3 transition-colors duration-100 focus-within:bg-hover">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" className="shrink-0" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          value={confirmation}
          onChange={event=>{
            setConfirmation(event.target.value.toUpperCase());
            if(state==="error") setState("idle");
          }}
          placeholder="Confirmation #"
          aria-label="Confirmation number"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3"
        />
        <Button type="submit" size="xs" variant="primary" disabled={!confirmation.trim()||state==="loading"}>
          {state==="loading" ? "Checking…" : "Check"}
        </Button>
      </form>

      {state==="error" && (
        <div className="px-3 py-3 text-[12px] text-ink-2" style={{animation:"fade-in 200ms ease-out both"}}>
          We couldn’t find that confirmation number.
        </div>
      )}

      {result && (
        <div className="p-2.5" style={{animation:"fade-up 300ms cubic-bezier(0.23,1,0.32,1) both"}}>
          <div className="flex items-center justify-between gap-3 px-1 pb-2">
            <div>
              <div className="font-mono text-[11.5px] text-ink-3">{result.confirmation_number}</div>
              {result.vehicle && <div className="mt-0.5 text-[13px] font-medium text-ink">{result.vehicle}</div>}
            </div>
            <StatusPill tone="accent" dot={false}>{result.current_status}</StatusPill>
          </div>

          <div className="overflow-hidden rounded-card bg-surface shadow-card">
            {result.updates.map((update,index)=>(
              <div key={`${update.created_at}-${index}`} className="flex gap-2.5 border-b border-line px-2.5 py-2.5 last:border-0">
                <span className="mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full bg-green text-white">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-ink">{update.title}</div>
                  {update.detail && <div className="mt-0.5 text-[12px] leading-5 text-ink-2">{update.detail}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
