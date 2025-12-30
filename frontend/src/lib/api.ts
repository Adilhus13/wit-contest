const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL missing");

type TokenResponse = { token: string; token_type: string };

export async function getToken(): Promise<string> {
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

export async function apiGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}
