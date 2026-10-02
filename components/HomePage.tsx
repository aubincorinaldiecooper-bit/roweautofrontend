"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Car } from "iconoir-react";
import { Button } from "@/components/atoms/Button";
import { StatusPill } from "@/components/atoms/StatusPill";
import TaskRows, { type TaskRow } from "@/components/primitives/TaskRows";
import { ThemeToggle } from "@/components/site/ThemeToggle";

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

function basePath(path:string) {
  const base = process.env.NODE_ENV === "production" ? "/roweautofrontend" : "";
  return `${base}${path}`;
}

function shortDate(value:string) {
  const date=new Date(value);
  if(Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined,{month:"short",day:"numeric"});
}

export default function HomePage() {
  const [showTracker,setShowTracker]=useState(false);
  const [confirmation,setConfirmation]=useState("");
  const [tracker,setTracker]=useState<TrackerResult|null>(null);
  const [trackerState,setTrackerState]=useState<"idle"|"loading"|"error">("idle");

  async function checkConfirmation(event:FormEvent) {
    event.preventDefault();
    const value=confirmation.trim().toUpperCase();
    if(!value) return;

    const api=process.env.NEXT_PUBLIC_API_URL;
    if(!api){
      setTracker(null);
      setTrackerState("error");
      return;
    }

    setTrackerState("loading");
    setTracker(null);

    try{
      const response=await fetch(`${api}/api/status/${encodeURIComponent(value)}`);
      if(!response.ok) throw new Error("not found");
      setTracker(await response.json());
      setTrackerState("idle");
    }catch{
      setTrackerState("error");
    }
  }

  const trackerRows:TaskRow[]=(tracker?.updates ?? []).map((update,index)=>({
    key:`${update.created_at}-${index}`,
    label:update.title,
    amount:shortDate(update.created_at),
    status:"done",
    details:update.detail ? [{label:update.detail,meta:""}] : [],
  }));

  return (
    <main className="min-h-screen bg-page text-ink">
      <section className="relative flex min-h-screen w-full items-end overflow-hidden bg-ink text-white">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1643700973089-baa86a1ab9ee?auto=format&fit=crop&fm=jpg&q=86&w=2400)",
            backgroundPosition: "center 45%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/35" />

        <div className="absolute inset-x-0 top-0 z-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
            <a
              href={basePath("/")}
              aria-label="First Rowe Auto home"
              className="flex items-center gap-2.5 rounded-control outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <span className="flex size-9 items-center justify-center rounded-control bg-white/95 text-black shadow-btn">
                <Car width={19} />
              </span>
              <div>
                <div className="text-[13px] font-semibold leading-4 text-white">FIRST ROWE AUTO</div>
                <div className="text-[11px] text-white/70">Repairs & Sales</div>
              </div>
            </a>
            <ThemeToggle />
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16 md:pb-20">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap gap-2">
              <StatusPill tone="neutral">Repair</StatusPill>
              <StatusPill tone="neutral">Maintenance</StatusPill>
              <StatusPill tone="neutral">Vehicle sales</StatusPill>
            </div>

            <h1 className="text-[42px] font-semibold leading-[.98] tracking-[-.045em] text-white sm:text-[58px] md:text-[72px]">
              Straight answers for your car.
            </h1>

            <p className="mt-5 max-w-2xl text-[16px] leading-7 text-white/80 sm:text-[18px]">
              Start with a quick AI intake. Tell us what’s going on, and we’ll review it and follow up with an estimate shortly.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                variant="accent"
                size="md"
                onClick={() => { window.location.href = basePath("/intake/"); }}
              >
                Start intake <ArrowRight width={16}/>
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowTracker(current=>!current)}
              >
                Check confirmation #
              </Button>
              <span className="text-[12px] text-white/65">5821 Rodman St · Hollywood, FL · 954-374-8384</span>
            </div>

            {showTracker && (
              <div className="mt-4 max-w-md" style={{animation:"fade-up 300ms cubic-bezier(0.23,1,0.32,1) both"}}>
                <form onSubmit={checkConfirmation} className="flex items-center gap-2">
                  <div className="flex h-10 flex-1 items-center rounded-control bg-surface px-3 text-ink shadow-btn transition-shadow duration-150 focus-within:shadow-raised">
                    <input
                      value={confirmation}
                      onChange={(event)=>{
                        setConfirmation(event.target.value.toUpperCase());
                        if(trackerState==="error") setTrackerState("idle");
                      }}
                      placeholder="Confirmation #"
                      aria-label="Confirmation number"
                      className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3"
                    />
                  </div>
                  <Button type="submit" variant="primary" size="md" disabled={!confirmation.trim()||trackerState==="loading"}>
                    {trackerState==="loading" ? "Checking…" : "Check"}
                  </Button>
                </form>

                {trackerState==="error" && (
                  <p className="mt-2 text-[12px] text-white/75">We couldn’t find that confirmation number.</p>
                )}

                {tracker && (
                  <div className="mt-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-mono text-[11.5px] text-white/65">{tracker.confirmation_number}</div>
                        {tracker.vehicle && <div className="mt-0.5 text-[13px] font-medium text-white">{tracker.vehicle}</div>}
                      </div>
                      <StatusPill tone="accent" dot={false}>{tracker.current_status}</StatusPill>
                    </div>
                    <TaskRows
                      variant="List"
                      rows={trackerRows}
                      labels={{completed:"Update",failed:"Issue"}}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
