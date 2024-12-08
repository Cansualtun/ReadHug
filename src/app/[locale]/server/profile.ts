import { cookies } from 'next/headers';

let BASE_URL = '';
if (process.env.NODE_ENV === 'development') {
  BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://bookarchive-production.up.railway.app';
}
if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://bookarchive-production.up.railway.app';
}

export async function ProfilInfo(userName: string, options: RequestInit = {}) {
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

  return fetch(`${BASE_URL}/user/profile/${userName}`, {
    ...options,
    headers,
  });
}
