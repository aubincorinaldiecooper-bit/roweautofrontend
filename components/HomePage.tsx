"use client";

import { ArrowRight, Car } from "iconoir-react";
import { Button } from "@/components/atoms/Button";
import { StatusPill } from "@/components/atoms/StatusPill";
import { ThemeToggle } from "@/components/site/ThemeToggle";

function basePath(path:string) {
  const base = process.env.NODE_ENV === "production" ? "/roweautofrontend" : "";
  return `${base}${path}`;
}

export default function HomePage() {
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
              <span className="text-[12px] text-white/65">5821 Rodman St · Hollywood, FL · 954-374-8384</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
