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
  const times = solves.map((s) => (s.is_dnf ? null : s.time_seconds));
  const dnfCount = times.filter((t) => t === null).length;
  if (dnfCount >= 2) return "DNF"; // WCA: 2+ DNFs = DNF average
  // Remove best and worst (DNF is always worst)
  let bestIdx = -1, worstIdx = -1;
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < times.length; ++i) {
    if (times[i] !== null && times[i] < min) { min = times[i]; bestIdx = i; }
    if (times[i] !== null && times[i] > max) { max = times[i]; worstIdx = i; }
    if (times[i] === null) worstIdx = i; // DNF is always worst
  }
  // Remove best and worst
  const toAverage = times.filter((_, i) => i !== bestIdx && i !== worstIdx && times[i] !== null);
  if (toAverage.length === 0) return "";
  const avg = toAverage.reduce((a, b) => a + b, 0) / toAverage.length;
  return avg;
}

export function groupSolvesByCompetitionEventRound(solves) {
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
              return {
                round_number,
                solves: sortedSolves,
                bestSingle: computeBestSingle(sortedSolves),
                average: computeWcaAverage(sortedSolves),
              };
            }),
        })),
    }));
  return competitions;
}
