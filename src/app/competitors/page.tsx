"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "../../components/navbar";
import CompetitorsTable from "../../components/competitors/table";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Competitor {
  id: number;
  name: string;
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitors() {
      const { data, error } = await supabase.from("competitors").select("*");
      console.log("Supabase data:", data);
      console.log("Supabase error:", error);
      if (!error && data) setCompetitors(data);
      setLoading(false);
    }
    fetchCompetitors();
  }, []);

  return (
        <main className="min-h-screen px-6 py-8">
      <div className="mx-auto w-full max-w-6xl">
      <Navbar />
      <div className="mx-auto w-full max-w-4xl mt-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-[var(--acid-white-0)]">Competitors</h1>
        <CompetitorsTable competitors={competitors} loading={loading} />
      </div>
        </div>
    </main>
  );
}
