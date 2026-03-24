"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { groupSolvesByCompetitionEventRound } from "../../../utils/groupSolves";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Competitor {
  id: number;
  name: string;
}

export default function CompetitorDetails({ id }: { id: string }) {
  const [competitor, setCompetitor] = useState<Competitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [groupedSolves, setGroupedSolves] = useState<any[]>([]);
  const [solvesLoading, setSolvesLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string>("333");
  const [placements, setPlacements] = useState<any[]>([]);
  const [podiums, setPodiums] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCompetitor() {
      const idNum = Number(id);
      if (isNaN(idNum)) {
        setCompetitor(null);
        setLoading(false);
        return;
      }
      const { data } = await supabase.from("competitors").select("*").eq("id", idNum).single();
      setCompetitor(data ?? null);
      setLoading(false);
    }
    fetchCompetitor();
  }, [id]);

  useEffect(() => {
    async function fetchSolvesAndPlacements() {
      setSolvesLoading(true);
      const idNum = Number(id);
      if (isNaN(idNum)) {
        setGroupedSolves([]);
        setPlacements([]);
        setPodiums([]);
        setSolvesLoading(false);
        return;
      }
      // Fetch solves
      const { data: solvesData, error: solvesError } = await supabase.from("solves").select("*").eq("competitor_id", idNum);
      // Fetch placements
      const { data: placementsData, error: placementsError } = await supabase.from("round_placements").select("*").eq("competitor_id", idNum);
      if (solvesError) {
        console.error("Error fetching solves:", solvesError);
        setGroupedSolves([]);
      } else {
        const grouped = groupSolvesByCompetitionEventRound(solvesData || []);
        // Merge placements into grouped structure
        if (placementsData) {
          setPlacements(placementsData);
          // Add placement to each round
          for (const comp of grouped) {
            for (const event of comp.events) {
              for (const round of event.rounds) {
                const placement = placementsData.find(
                  (p) => p.competition_id === comp.competition_id &&
                        p.event_code === event.event_code &&
                        p.round_number === round.round_number
                );
                round.placement = placement ? placement.placement : null;
              }
            }
          }
          // Find podiums (placement 1,2,3 in last round of event in competition)
          const podiumList = [];
          for (const comp of grouped) {
            for (const event of comp.events) {
              const lastRound = event.rounds[event.rounds.length - 1];
              if (lastRound && [1,2,3].includes(lastRound.placement)) {
                podiumList.push({
                  competition_id: comp.competition_id,
                  event_code: event.event_code,
                  round_number: lastRound.round_number,
                  placement: lastRound.placement
                });
              }
            }
          }
          setPodiums(podiumList);
        }
        setGroupedSolves(grouped);
      }
      setSolvesLoading(false);
    }
    fetchSolvesAndPlacements();
  }, [id]);

  if (loading) {
    return <div className="text-center text-lg text-[var(--acid-white-75)]">Loading...</div>;
  }
  if (!competitor) {
    return <div className="text-center text-lg text-[var(--acid-red-75)]">User not found</div>;
  }

  // List of all event codes to show as selectors
  const allEventCodes = Array.from(
    new Set(groupedSolves.flatMap((c) => c.events.map((e) => e.event_code)))
  );
  // Event code to WCA icon class and label
  const eventMeta: Record<string, { icon: string; label: string }> = {
    "333": { icon: "event-333", label: "3x3x3 Cube" },
    "222": { icon: "event-222", label: "2x2x2 Cube" },
    "444": { icon: "event-444", label: "4x4x4 Cube" },
    "555": { icon: "event-555", label: "5x5x5 Cube" },
    "666": { icon: "event-666", label: "6x6x6 Cube" },
    "777": { icon: "event-777", label: "7x7x7 Cube" },
    "333oh": { icon: "event-333oh", label: "3x3x3 One-Handed" },
    "pyram": { icon: "event-pyram", label: "Pyraminx" },
    "skewb": { icon: "event-skewb", label: "Skewb" },
    "sq1": { icon: "event-sq1", label: "Square-1" },
    
    
  };

  return (
    <div className="text-center text-lg text-[var(--acid-white-0)]">
      <p><span className="font-semibold">ID:</span> {competitor.id}</p>
      <p><span className="font-semibold">Name:</span> {competitor.name}</p>
      {/* CPR Table removed as per user request */}
      {/* Event Bests & CPR Table at the top */}
      {allEventCodes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2 text-center">Event Bests & CPR</h3>
          <div className="table-responsive overflow-x-auto">
            <table className="min-w-[600px] w-full border text-sm table-auto mb-4">
              <thead>
                <tr className="bg-[var(--acid-white-25)] text-black">
                  <th className="border px-2 py-1">Event</th>
                  <th className="border px-2 py-1">CPR (single)</th>
                  <th className="border px-2 py-1">Single</th>
                  <th className="border px-2 py-1">Average</th>
                  <th className="border px-2 py-1">CPR (average)</th>
                </tr>
              </thead>
              <tbody>
                {allEventCodes.map((code) => {
                  // Gather all rounds for this event across all competitions
                  const allRounds = groupedSolves.flatMap((competition) => {
                    const event = competition.events.find((e) => e.event_code === code);
                    return event ? event.rounds : [];
                  });
                  // Best single: lowest non-DNF (time_seconds >= 0)
                  let bestSingle = null;
                  let bestAverage = null;
                  const singles = allRounds
                    .flatMap(r => r.solves)
                    .filter(s => !s.is_dnf && typeof s.time_seconds === "number" && s.time_seconds >= 0);
                  if (singles.length > 0) {
                    bestSingle = Math.min(...singles.map(s => s.time_seconds));
                  }
                  // Best average: lowest valid average (number and >= 0)
                  const averages = allRounds
                    .map(r => typeof r.average === "number" && r.average >= 0 ? r.average : null)
                    .filter(a => a !== null);
                  if (averages.length > 0) {
                    bestAverage = Math.min(...averages);
                  }
                  return (
                    <tr key={code}>
                      <td className="border px-2 py-1 flex items-center gap-2">
                        <i className={`cubing-icon icon ${eventMeta[code]?.icon || code}`}></i>
                        {eventMeta[code]?.label || code}
                      </td>
                      <td className="border px-2 py-1">CPR</td>
                      <td className="border px-2 py-1">{bestSingle !== null ? bestSingle.toFixed(2) : "DNF"}</td>
                      <td className="border px-2 py-1">{bestAverage !== null ? bestAverage.toFixed(2) : "DNF"}</td>
                      <td className="border px-2 py-1">CPR</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {podiums.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Podiums</h3>
          <div className="flex flex-wrap gap-4 justify-center mb-2">
            <span className="px-3 py-1 rounded font-semibold bg-yellow-300 text-black">🥇 {podiums.filter(p => p.placement === 1).length} First</span>
            <span className="px-3 py-1 rounded font-semibold bg-gray-300 text-black">🥈 {podiums.filter(p => p.placement === 2).length} Second</span>
            <span className="px-3 py-1 rounded font-semibold bg-orange-300 text-black">🥉 {podiums.filter(p => p.placement === 3).length} Third</span>
          </div>
        </div>
      )}
      <div className="mt-8 text-left">
        <h2 className="text-2xl font-bold mb-4">Results by Event</h2>
        {/* Event Selector */}
        <div className="event-selector flex flex-wrap gap-2 justify-center mb-6">
          {allEventCodes.map((code) => (
            <span className="event-radio" key={code}>
              <label htmlFor={`radio-${code}`} className="cursor-pointer flex items-center gap-1">
                <input
                  type="radio"
                  name="event"
                  id={`radio-${code}`}
                  value={code}
                  checked={selectedEvent === code}
                  onChange={() => setSelectedEvent(code)}
                  className="mr-1"
                />
                <i className={`cubing-icon icon ${eventMeta[code]?.icon || code}`}></i>
                <span className="hidden md:inline">{eventMeta[code]?.label || code}</span>
              </label>
            </span>
          ))}
        </div>
        {/* Table */}
        <div className="table-responsive overflow-x-auto">
          {solvesLoading ? (
            <div className="text-center text-[var(--acid-white-75)]">Loading solves...</div>
          ) : groupedSolves.length === 0 ? (
            <div className="text-center text-[var(--acid-red-75)]">No solves found.</div>
          ) : (
            <table className="min-w-[800px] w-full border text-sm table-auto">
              <thead>
                <tr className="bg-[var(--acid-white-25)] text-black">
                  <th className="border px-2 py-1">Competition</th>
                  <th className="border px-2 py-1">Round</th>
                  <th className="border px-2 py-1">Place</th>
                  <th className="border px-2 py-1">Single</th>
                  <th className="border px-2 py-1">Average</th>
                  <th className="border px-2 py-1">CPR Single</th>
                  <th className="border px-2 py-1">CPR Average</th>
                  <th className="border px-2 py-1" colSpan={5}>Solves</th>
                </tr>
              </thead>
              <tbody>
                {/* CPR columns will be filled in future. */}
                {/* For each competition, for the selected event, show all rounds */}
                {groupedSolves.map((competition) => {
                  const event = competition.events.find((e) => e.event_code === selectedEvent);
                  if (!event) return null;
                  return event.rounds.map((round, idx) => (
                    <tr className="result" key={competition.competition_id + "-" + round.round_number}>
                      <td className="border px-2 py-1 align-middle">
                        {idx === 0 ? (
                          <a href={`#competition-${competition.competition_id}`}>Competition {competition.competition_id}</a>
                        ) : null}
                      </td>
                      <td className="border px-2 py-1 align-middle">{`Round ${round.round_number}`}</td>
                      <td className={`border px-2 py-1 align-middle ${[1,2,3].includes(round.placement) ? (round.placement === 1 ? "bg-yellow-300 text-black" : round.placement === 2 ? "bg-gray-300 text-black" : "bg-orange-300 text-black") : ""}`}>
                        {round.placement ?? "-"}
                      </td>
                      <td className="border px-2 py-1 align-middle">{typeof round.bestSingle === "number" ? round.bestSingle.toFixed(2) : round.bestSingle}</td>
                      <td className="border px-2 py-1 align-middle">{typeof round.average === "number" ? round.average.toFixed(2) : round.average}</td>
                      <td className="border px-2 py-1 align-middle">CPR Single</td>
                      <td className="border px-2 py-1 align-middle">CPR Average</td>
                      {/* Solves */}
                      {Array.from({ length: 5 }).map((_, i) => {
                        const solve = round.solves[i];
                        let display = "";
                        if (solve) {
                          if (solve.is_dnf || (typeof solve.time_seconds === "number" && solve.time_seconds < 0)) {
                            display = "DNF";
                          } else if (typeof solve.time_seconds === "number") {
                            display = solve.time_seconds;
                          }
                        }
                        return (
                          <td className={`border px-2 py-1 align-middle ${solve?.is_dnf || (solve && typeof solve.time_seconds === "number" && solve.time_seconds < 0) ? "bg-[var(--acid-red-25)]" : ""}`} key={i}>
                            {display}
                          </td>
                        );
                      })}
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
