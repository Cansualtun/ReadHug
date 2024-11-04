import { cookies } from 'next/headers';

export async function fetchWithToken(url: string, options: RequestInit = {}) {
  const token = cookies().get('access_token')?.value;
  const headers = {
    Authorization: `Bearer ${token}`,
    ...options?.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
