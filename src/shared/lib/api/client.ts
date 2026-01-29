const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function getAccessToken() {
  return localStorage.getItem("access_token");
}

export async function request<T>(
  path: string,
  options: { method?: HttpMethod; body?: unknown; headers?: Record<string, string> } = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const token = getAccessToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers, // 호출부에서 Authorization을 덮어쓸 수도 있게 뒤에 둠
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    // 선택: 여기서 로그아웃 처리/리다이렉트 트리거
    // localStorage.removeItem("access_token");
    // window.location.href = "/";
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
