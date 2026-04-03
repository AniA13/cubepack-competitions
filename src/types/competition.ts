export type Solve = {
  id?: number;
  competitor_id?: number;
  competition_id: number;
  event_code: string;
  round_number: number;
  solve_number: number;
  time_seconds: number | null;
  is_dnf: boolean | null;
  solve_rank?: number | null;
  [key: string]: unknown;
};

export type Placement = {
  id?: number;
  competitor_id?: number;
  competition_id: number;
  event_code: string;
  round_number: number;
  placement?: number | null;
  best_single?: number | null;
  average?: number | null;
  solve_rank?: number | null;
  [key: string]: unknown;
};

export type Podium = {
  competition_id: number;
  event_code: string;
  round_number: number;
  placement: number;
};

export type GroupedRound = {
  competition_id: number;
  round_number: number;
  solves: Solve[];
  bestSingle: number | "DNF" | "";
  average: number | "DNF" | "";
  placement: number | null;
};

export type GroupedEvent = {
  event_code: string;
  rounds: GroupedRound[];
};

export type GroupedCompetition = {
  competition_id: number;
  events: GroupedEvent[];
};
