import React from "react";
import Link from "next/link";

interface Competitor {
  id: number;
  name: string;
}

interface CompetitorsTableProps {
  competitors: Competitor[];
  loading: boolean;
}

const CompetitorsTable: React.FC<CompetitorsTableProps> = ({ competitors, loading }) => {
  if (loading) {
    return <div className="text-center text-lg text-[var(--acid-white-75)]">Loading...</div>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl shadow-lg border-2 border-[var(--acid-red-75)] bg-[var(--acid-black-75)]">
      <table className="min-w-full divide-y divide-[var(--acid-red-75)]">
        <thead className="bg-[var(--acid-red-75)]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--acid-white-0)]">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--acid-white-0)]">Name</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--acid-red-25)]">
          {competitors.map((c) => (
            <tr key={c.id}>
              <td className="px-6 py-4 whitespace-nowrap text-[var(--acid-white-75)]">
                <Link href={`/competitors/${c.id}`} className="hover:underline">
                  {c.id}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[var(--acid-white-0)]">
                <Link href={`/competitors/${c.id}`} className="hover:underline">
                  {c.name}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompetitorsTable;
