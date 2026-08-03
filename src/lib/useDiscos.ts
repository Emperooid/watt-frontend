"use client";

import { useEffect, useState } from "react";
import { getDiscos } from "./api";
import type { Disco } from "./types";

// Several landing-page components need the Discos list independently.
// Without sharing the fetch, each one firing its own request at page load
// quadruples the load on the backend/DB connection pool for no reason —
// they all want the exact same data. This caches the in-flight/resolved
// promise at module scope so only one request happens per page load.
let cachedPromise: Promise<Disco[]> | null = null;

function fetchDiscosOnce(): Promise<Disco[]> {
  if (!cachedPromise) {
    cachedPromise = getDiscos().catch((err) => {
      cachedPromise = null; // allow a retry on next call instead of caching a failure forever
      throw err;
    });
  }
  return cachedPromise;
}

export function useDiscos() {
  const [discos, setDiscos] = useState<Disco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchDiscosOnce()
      .then((d) => {
        if (!cancelled) {
          setDiscos(d);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load data.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { discos, loading, error };
}
