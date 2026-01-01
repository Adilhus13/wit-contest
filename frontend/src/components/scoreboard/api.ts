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

export async function request<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  token: string,
  body?: unknown
): Promise<T> {
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

export async function apiGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, token: string, body: unknown): Promise<T> {
  return request<T>("POST", path, token, body);
}

export async function apiPut<T>(path: string, token: string, body: unknown): Promise<T> {
  return request<T>("PUT", path, token, body);
}

export async function apiDelete<T>(path: string, token: string): Promise<T> {
  return request<T>("DELETE", path, token)
}
