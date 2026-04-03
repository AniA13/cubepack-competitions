// Utility to group solves by competition, then event, then round
// Input: solves: Array<{ competition_id, event_code, round_number, ... }>
// Output: Array<{ competition_id, events: Array<{ event_code, rounds: Array<{ round_number, solves: Solve[] }> }> }>

// Helper: compute best single (lowest non-DNF time)
function computeBestSingle(solves) {
  const valid = solves.filter((s) => !s.is_dnf && typeof s.time_seconds === "number");
  if (valid.length === 0) return "DNF";
  return Math.min(...valid.map((s) => s.time_seconds));
}

// Helper: compute WCA average (remove best/worst, average the rest; 2+ DNFs = DNF)
function computeWcaAverage(solves) {
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
    return times.reduce((a, b) => a + b, 0) / 3;
  }
  // For other cases: mean of valid, DNF if none
  const valid = times.filter((t) => t !== null);
  if (valid.length > 0) return valid.reduce((a, b) => a + b, 0) / valid.length;
  return "DNF";
}

export function groupSolvesByCompetitionEventRound(solves, placements = []) {
  // Group by competition_id
  const competitionsMap = new Map();
  for (const solve of solves) {
    if (!competitionsMap.has(solve.competition_id)) {
      competitionsMap.set(solve.competition_id, new Map());
    }
    const eventsMap = competitionsMap.get(solve.competition_id);
    if (!eventsMap.has(solve.event_code)) {
      eventsMap.set(solve.event_code, new Map());
    }
    const roundsMap = eventsMap.get(solve.event_code);
    if (!roundsMap.has(solve.round_number)) {
      roundsMap.set(solve.round_number, []);
    }
    roundsMap.get(solve.round_number).push(solve);
  }
  // Helper to find placement for a round
  function findPlacement(competition_id, event_code, round_number) {
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
        .map(([event_code, roundsMap]) => ({
          event_code,
          rounds: Array.from(roundsMap.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([round_number, solves]) => {
              const sortedSolves = solves.sort((a, b) => a.solve_number - b.solve_number);
              const placement = findPlacement(competition_id, event_code, round_number);
              return {
                round_number,
                solves: sortedSolves,
                bestSingle: placement && typeof placement.best_single === "number" ? placement.best_single : computeBestSingle(sortedSolves),
                average: placement && typeof placement.average === "number" ? placement.average : computeWcaAverage(sortedSolves),
                placement: placement ? placement.placement : null,
              };
            }),
        })),
    }));
  return competitions;
}
