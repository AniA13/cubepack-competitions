"use client";

import CompetitorDetails from "./CompetitorDetails";
import Navbar from "../../..//components/navbar";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <Navbar />
      </div>
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-[var(--acid-white-0)]">Competitor Details</h1>
        <CompetitorDetails id={id} />
      </div>
    </main>
  );
}

