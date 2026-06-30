"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/what-is-claudis", label: "What is Claudis" },
  { href: "/context", label: "Context Engineering" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/control", label: "Control" },
  { href: "/evolution", label: "Evolution" },
  { href: "/claude-code", label: "Claude Code" },
  { href: "/news", label: "News & Research" },
  { href: "/understanding", label: "Understanding Claudis" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="bg-slate-900 text-slate-100 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:text-indigo-300 transition-colors font-mono">
          <span className="text-indigo-400">⬡</span>
          <span>Claudis</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                pathname === href
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
