"use client";

import { ArrowRight, Car } from "iconoir-react";

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/35" />

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

            <div className="hidden text-right text-[12px] leading-5 text-white/70 sm:block">
              <div>Hollywood, Florida</div>
              <div>954-374-8384</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14 md:pb-16">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_320px] md:items-end md:gap-12">
            <div className="max-w-3xl">
              <div className="mb-4 text-[12px] font-medium uppercase tracking-[.12em] text-white/65">
                Repair · maintenance · vehicle sales
              </div>
              <h1 className="text-[42px] font-semibold leading-[.98] tracking-[-.045em] text-white sm:text-[58px] md:text-[72px]">
                Straight answers for your car.
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-7 text-white/80 sm:text-[18px]">
                Tell us what you need before you arrive. We’ll keep the details clear from drop-off and approval through pickup—or help you get started on your next vehicle.
              </p>
            </div>

            <div className="rounded-window bg-surface/95 p-5 text-ink shadow-raised backdrop-blur">
              <div className="mb-4">
                <div className="text-[11px] font-medium uppercase tracking-[.08em] text-ink-3">Plan your visit</div>
                <div className="mt-1 text-[16px] font-semibold">First Rowe Auto</div>
              </div>

              <div className="grid gap-3 border-y border-line py-4 text-[13px]">
                <div>
                  <div className="text-[11px] text-ink-3">Address</div>
                  <div className="mt-0.5 font-medium">5821 Rodman St, Hollywood, FL</div>
                </div>
                <div>
                  <div className="text-[11px] text-ink-3">Hours</div>
                  <div className="mt-0.5 font-medium">Mon–Fri 9–6 · Sat 9–1</div>
                </div>
                <div>
                  <div className="text-[11px] text-ink-3">Phone</div>
                  <div className="mt-0.5 font-medium">954-374-8384</div>
                </div>
              </div>

              <a
                href={basePath("/intake/")}
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-[9px] text-sm font-medium leading-none text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-[transform,background-color,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.96]"
              >
                Start an intake
                <ArrowRight width={16} className="transition-transform duration-150 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
