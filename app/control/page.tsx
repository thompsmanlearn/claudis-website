"use client";

import { useEffect, useState } from "react";

export default function ControlPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Control</h1>
        <p className="text-slate-500">
          Direct connection to the Pi — live session status, directive management,
          and work queue. Powered by Anvil uplink.
        </p>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900"
           style={{ height: "720px" }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Connecting to Pi…</p>
            </div>
          </div>
        )}
        <iframe
          src="https://inborn-rotating-anole.anvil.app/#control"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Claudis Control Panel"
          onLoad={() => setLoaded(true)}
          className={loaded ? "opacity-100" : "opacity-0"}
          style={{ transition: "opacity 0.3s" }}
        />
      </div>

      <p className="text-slate-400 text-xs mt-3 text-right">
        <a
          href="https://inborn-rotating-anole.anvil.app/#control"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-indigo-500 transition-colors"
        >
          Open full dashboard →
        </a>
      </p>
    </div>
  );
}
