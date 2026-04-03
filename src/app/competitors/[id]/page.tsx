import CompetitorDetails from "./CompetitorDetails";
import Navbar from "../../..//components/navbar";
import { createClient } from "@supabase/supabase-js";
import { groupSolvesByCompetitionEventRound } from "../../../utils/groupSolves";
import { GroupedCompetition, Placement, Podium } from "../../../types/competition";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function Page({ params }: { params: any }) {
  // Handle both Promise and object for params
  let realParams = params;
  if (typeof params?.then === "function") {
    realParams = await params;
  }
  const id = realParams.id;
  const idNum = Number(id);
  let competitor = null;
  let groupedSolves: GroupedCompetition[] = [];
  let placements: Placement[] = [];
  let podiums: Podium[] = [];
  if (!isNaN(idNum)) {
    // Fetch competitor
    console.log('[QUERY] competitors', { idNum });
    const { data: competitorData, error: competitorError } = await supabase.from("competitors").select("*").eq("id", idNum).single();
    console.log('[RESULT] competitors', { data: competitorData, error: competitorError });
    competitor = competitorData ?? null;
    // Fetch solves
    console.log('[QUERY] solves', { competitor_id: idNum });
    const { data: solvesData, error: solvesError } = await supabase.from("solves").select("*").eq("competitor_id", idNum);
    console.log('[RESULT] solves', solvesData);
    // Fetch placements (filtered by competitor_id)
    console.log('[QUERY] round_placements', { competitor_id: idNum });
    const { data: placementsData, error: placementsError } = await supabase.from("round_placements").select("*").eq("competitor_id", idNum);
    console.log('[RESULT] round_placements', placementsData);
    if (solvesData) {
      placements = placementsData || [];
      groupedSolves = groupSolvesByCompetitionEventRound(solvesData, placements);
      // Find podiums (placement 1,2,3 in last round of event in competition)
      const podiumList = [];
      for (const comp of groupedSolves) {
        for (const event of comp.events) {
          const lastRound = event.rounds[event.rounds.length - 1];
          const placement = lastRound?.placement;
          if (typeof placement === "number" && [1, 2, 3].includes(placement)) {
            podiumList.push({
              competition_id: comp.competition_id,
              event_code: event.event_code,
              round_number: lastRound.round_number,
              placement
            });
          }
        }
      }
      podiums = podiumList;
    }
  }
  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <Navbar />
      </div>
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-[var(--acid-white-0)]">Competitor Details</h1>
        <CompetitorDetails
          competitor={competitor}
          groupedSolves={groupedSolves}
          placements={placements}
          podiums={podiums}
        />
      </div>
    </main>
  );
}

