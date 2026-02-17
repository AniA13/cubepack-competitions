"use client";
import React from "react";

const navItems = [
  "Placeholder 1",
  "Placeholder 2",
  "Placeholder 3",
  "Placeholder 4",
  "Placeholder 5",
  "Placeholder 6",
  "Placeholder 7",
  "Placeholder 8",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f3ee] text-[#1a1a1a]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap");
        :root {
          --font-display: "Fraunces", serif;
          --font-body: "Space Grotesk", sans-serif;
        }
      `}</style>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#f4b63f]/50 blur-3xl" />
          <div className="absolute -right-16 top-0 h-96 w-96 rounded-full bg-[#6ec1d6]/40 blur-3xl" />
          <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-[#d17b88]/40 blur-3xl" />
        </div>

        <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[#1a1a1a]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f4b63f] via-[#f7f3ee] to-[#6ec1d6]" />
            </div>
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.2em] text-[#7b6a58]">CubePack</p>
              <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Competitions
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[#5a4e42] md:flex" style={{ fontFamily: "var(--font-body)" }}>
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-full border border-transparent px-4 py-2 transition hover:border-[#1a1a1a]/20 hover:bg-white"
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="rounded-full border border-[#1a1a1a]/20 px-4 py-2 text-sm font-medium text-[#1a1a1a] transition hover:bg-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Get Started
          </button>
        </header>

        <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-10 sm:px-10 md:flex-row md:items-center">
          <section className="flex-1">
            <p
              className="text-sm uppercase tracking-[0.3em] text-[#7b6a58]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Demo Starting Page
            </p>
            <div
              className="mt-4 text-base font-medium uppercase tracking-[0.2em] text-[#1a1a1a]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              cube pack
            </div>
            <h1
              className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              A crisp launchpad for your next competition.
            </h1>
            <p
              className="mt-6 max-w-xl text-lg text-[#53463a]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Showcase the most important moments up front. Organize entry
              points, highlight milestones, and keep the energy focused.
            </p>
            <div className="mt-8 flex flex-wrap gap-4" style={{ fontFamily: "var(--font-body)" }}>
              <button className="rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-[#f7f3ee] transition hover:bg-black">
                Explore
              </button>
              <button className="rounded-full border border-[#1a1a1a]/20 px-6 py-3 text-sm font-medium text-[#1a1a1a] transition hover:bg-white">
                View Competitions
              </button>
              <button className="rounded-full border border-[#1a1a1a]/20 px-6 py-3 text-sm font-medium text-[#1a1a1a] transition hover:bg-white">
                Learn More
              </button>
            </div>
          </section>

          <section className="flex-1">
            <div className="grid gap-6 md:grid-cols-2">
              {navItems.map((item, index) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white bg-white/80 p-6 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.3)] backdrop-blur"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f4b63f]/70 text-sm font-semibold text-[#1a1a1a]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3
                    className="mt-4 text-lg font-semibold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item}
                  </h3>
                  <p
                    className="mt-2 text-sm text-[#6a5c4e]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Replace this block with detail that matches the competition
                    journey you want to highlight.
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
