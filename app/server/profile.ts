import { cookies } from 'next/headers';

export async function ProfilInfo(url: string, options: RequestInit = {}) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    console.log('Token bulunamadı');
  }
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
