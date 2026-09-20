const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(path, BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new ApiError(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const url = new URL(path, BASE_URL);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiError(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  return response.json() as Promise<TResponse>;
}