import { downloadBlob } from "@/lib/download";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL missing");

type TokenResponse = { token: string; token_type: string };

export const getToken = async (): Promise<string> => {
  const email = process.env.NEXT_PUBLIC_API_EMAIL!;
  const password = process.env.NEXT_PUBLIC_API_PASSWORD!;

  const res = await fetch(`${baseUrl}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, device_name: "frontend" }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await res.text());
  const json = (await res.json()) as TokenResponse;
  return json.token;
}

export const request = async <T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  token: string,
  body?: unknown
): Promise<T> => {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  if(!res.ok) {
    const text = await res.text();
    throw new Error (`${method}${path} failed (${res.status}): ${text}`);
  }

  if (res.status === 204) return undefined as T

  return (await res.json()) as T
}

export const apiGet = async <T>(path: string, token: string): Promise<T> => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export const apiPost = async <T>(path: string, token: string, body: unknown): Promise<T> =>
  request<T>("POST", path, token, body);

export const apiPut = async <T>(path: string, token: string, body: unknown): Promise<T> =>
  request<T>("PUT", path, token, body);

export const apiDelete = async <T>(path: string, token: string): Promise<T> =>
  request<T>("DELETE", path, token);


export const exportLeaderboardCsv = async (params: {
  season: number;
  sort: string;
  order: string;
  search?: string;
}) => {
  const token = await getToken();

  const qs = new URLSearchParams({
    season: String(params.season),
    sort: params.sort,
    order: params.order,
  });

  if (params.search) qs.set("search", params.search);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/leaderboard/export?${qs.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/csv",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Export failed (${res.status})`);
  }

  const blob = await res.blob();
  downloadBlob(blob, `49ers_leaderboard_${params.season}.csv`);
};
