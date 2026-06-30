const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ?? "";

const SB_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

export async function sbFetch(
  path: string,
  params: Record<string, string> = {},
  revalidate = 60
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${path}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), {
      headers: SB_HEADERS,
      next: { revalidate },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function sbFetchWithCount(
  path: string,
  params: Record<string, string> = {},
  revalidate = 60
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ data: any[]; count: number }> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return { data: [], count: 0 };
  try {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${path}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), {
      headers: { ...SB_HEADERS, Prefer: "count=exact" },
      next: { revalidate },
    });
    if (!res.ok) return { data: [], count: 0 };
    const data = await res.json();
    const range = res.headers.get("Content-Range") ?? "*/0";
    const count = parseInt(range.split("/")[1] ?? "0", 10);
    return { data, count };
  } catch {
    return { data: [], count: 0 };
  }
}
