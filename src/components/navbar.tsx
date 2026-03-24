
import React from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Records", href: "/records" },
  { label: "Competitors", href: "/competitors" },
  { label: "Signup", href: "/signup" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  return (
    <nav className="flex flex-col items-center justify-center rounded-3xl border-2 border-black bg-[var(--acid-red-75)] px-6 py-8 shadow-[6px_6px_0_0_#000000]">
      {/* Tabs */}
      <div
        className="flex flex-row flex-wrap sm:flex-row md:flex-row lg:flex-row xl:flex-row gap-4 w-full justify-center items-center"
      >
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex-1 w-32 sm:w-40 md:w-48 lg:w-56 xl:w-60 h-14 md:h-16 rounded-2xl border-2 border-[var(--acid-white-0)] bg-black px-4 md:px-6 text-base md:text-lg uppercase tracking-[0.2em] text-[var(--acid-white-0)] flex items-center justify-center hover:bg-[var(--acid-red-100)] transition-colors duration-150"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
