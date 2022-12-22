const API_URL = import.meta.env.VITE_API_URL ?? '/api';

const isJSON = (type: string) =>
  ['application/json', 'application/problem+json'].some((t) =>
    type.startsWith(t),
  );

interface ClientOptions {
  body?: Record<string, unknown> | URLSearchParams;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
}

export default <T>(endpoint: string, options: ClientOptions = {}): Promise<T> =>
  fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    ...(options.body
      ? {
          body:
            options.body instanceof URLSearchParams
              ? options.body
              : JSON.stringify(options.body),
        }
      : {}),
    headers: {
      ...(options.body
        ? {
            'Content-Type':
              options.body instanceof URLSearchParams
                ? 'application/x-www-form-urlencoded'
                : 'application/json',
          }
        : {}),
    },
    method: options.method ?? (options.body ? 'POST' : 'GET'),
  })
    .catch(() => {
      throw {
        type: 'about:blank',
        title: 'NETWORK_ERROR',
        detail: 'An internal error occurred, please try again later.',
        status: -1,
        instance: endpoint,
      } satisfies APIError;
    })
    .then(async (response) => {
      const type = response.headers.get('Content-Type') ?? '';
      const data = isJSON(type) ? await response.json() : await response.text();
      if (!response.ok) throw data;
      return data;
    });
