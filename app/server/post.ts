import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function UserPostInfo(
  userName: string,
  options: RequestInit = {},
) {
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

  return fetch(`${BASE_URL}/posts/user/${userName}`, {
    ...options,
    headers,
  });
}
export async function GetAllPost(options: RequestInit = {}) {
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

  return fetch(`${BASE_URL}/posts/all`, {
    ...options,
    headers,
  });
}
