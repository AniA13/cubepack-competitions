"use client";
import React from "react";

export default function Home() {
  return (
    // Navbar only for now
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <nav className="flex flex-wrap items-center justify-center rounded-3xl border-2 border-black bg-[var(--acid-pink)] px-6 py-8 shadow-[6px_6px_0_0_#000000]">
          {/* Tabs */}
          <div className="flex flex-wrap gap-12 tracking-[1em] [transform:scaleX(1.3)] [transform-origin:center]">
            <button className="rounded-2xl border border-[var(--acid-pink-strong)] bg-black px-8 py-6 text-1xl uppercase tracking-[0.2em] text-[var(--acid-pink-strong)]">
              Home
            </button>
            <button className="px-2 py-2 text-base uppercase tracking-[0.2em] text-black">
              Signup
            </button>
            <button className="px-2 py-2 text-base uppercase tracking-[0.2em] text-black">
              Records
            </button>
            <button className="px-2 py-2 text-base uppercase tracking-[0.2em] text-black">
              Participants
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}
