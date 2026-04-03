// Utility to group solves by competition, then event, then round
// Input: solves: Array<{ competition_id, event_code, round_number, ... }>
// Output: Array<{ competition_id, events: Array<{ event_code, rounds: Array<{ round_number, solves: Solve[] }> }> }>

import { GroupedCompetition, Placement, Solve } from "../types/competition";
// Helper: compute best single (lowest non-DNF time)
function computeBestSingle(solves: Solve[]): number | "DNF" {
  const valid = solves.filter(
    (s): s is Solve & { time_seconds: number } => !s.is_dnf && typeof s.time_seconds === "number"
  );
  if (valid.length === 0) return "DNF";
  return Math.min(...valid.map((s) => s.time_seconds));
}

// Helper: compute WCA average (remove best/worst, average the rest; 2+ DNFs = DNF)
function computeWcaAverage(solves: Solve[]): number | "DNF" | "" {
  if (!Array.isArray(solves) || solves.length < 3) return "";
  const times = solves.map((s) => (s.is_dnf || typeof s.time_seconds !== "number" || s.time_seconds < 0 ? null : s.time_seconds));
  const dnfCount = times.filter((t) => t === null).length;
  if (solves.length === 5) {
    if (dnfCount >= 2) return "DNF";
    // Remove best and worst valid (DNF is always worst)
    const valid = times.filter((t) => t !== null);
    if (valid.length < 3) return "DNF";
    const validSorted = [...valid].sort((a, b) => a - b);
    // Remove best and worst
    const toAverage = validSorted.slice(1, -1);
    if (toAverage.length !== 3) return "DNF";
    return toAverage.reduce((a, b) => a + b, 0) / 3;
  }
  if (solves.length === 3) {
    if (dnfCount > 0) return "DNF";
    const validTimes = times.filter((t) => t !== null) as number[];
    return validTimes.reduce((a, b) => a + b, 0) / 3;
  }
  // For other cases: mean of valid, DNF if none
  const valid = times.filter((t) => t !== null);
  if (valid.length > 0) return valid.reduce((a, b) => (a ?? 0) + (b ?? 0), 0) / valid.length;
  return "DNF";
}

export function groupSolvesByCompetitionEventRound(
  solves: Solve[],
  placements: Placement[] = []
): GroupedCompetition[] {
  // Group by competition_id
  const competitionsMap = new Map<number, Map<string, Map<number, Solve[]>>>();
  for (const solve of solves) {
    if (!competitionsMap.has(solve.competition_id)) {
      competitionsMap.set(solve.competition_id, new Map());
    }
    const eventsMap = competitionsMap.get(solve.competition_id)!;
    if (!eventsMap.has(solve.event_code)) {
      eventsMap.set(solve.event_code, new Map());
    }
    const roundsMap = eventsMap.get(solve.event_code)!;
    if (!roundsMap.has(solve.round_number)) {
      roundsMap.set(solve.round_number, []);
    }
    roundsMap.get(solve.round_number)!.push(solve);
  }
  // Helper to find placement for a round
  function findPlacement(competition_id: number, event_code: string, round_number: number) {
    return placements.find(
      (p) => p.competition_id === competition_id &&
             p.event_code === event_code &&
             p.round_number === round_number
    );
  }
  // Convert to array structure, sorted by competition_id, event_code, round_number
  const competitions = Array.from(competitionsMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([competition_id, eventsMap]) => ({
      competition_id,
      events: Array.from(eventsMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([event_code, roundsMap]) => {
          return {
            event_code,
            rounds: Array.from(roundsMap.entries())
              .sort((a, b) => a[0] - b[0])
              .map(([round_number, roundSolves]) => {
                const sortedSolves = [...roundSolves].sort((a, b) => a.solve_number - b.solve_number);
                const placement = findPlacement(competition_id, event_code, round_number);
                return {
                  competition_id, // Ensure round object has competition_id for placement lookup
                  round_number,
                  solves: sortedSolves,
                  bestSingle: placement && typeof placement.best_single === "number" ? placement.best_single : computeBestSingle(sortedSolves),
                  average: placement && typeof placement.average === "number" ? placement.average : computeWcaAverage(sortedSolves),
                  placement: placement?.placement ?? null,
                };
              })
          };
        })
    }));
  return competitions;
}
