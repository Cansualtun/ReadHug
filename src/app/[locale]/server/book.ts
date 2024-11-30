import { cookies } from 'next/headers';

let BASE_URL = '';

if (process.env.NODE_ENV === 'development') {
  BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
}
if (process.env.NODE_ENV === 'production') {
  BASE_URL = "https://bookarchive-production.up.railway.app";
}

export enum BookType {
  Read = 0,
  Reading = 1,
  WishList = 2,
}

export async function getAllBookLists(userName: string) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const requests = [
    fetch(`${BASE_URL}/book/user/books/${userName}/${BookType.Read}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    }),
    fetch(`${BASE_URL}/book/user/books/${userName}/${BookType.Reading}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    }),
    fetch(`${BASE_URL}/book/user/books/${userName}/${BookType.WishList}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    }),
  ];

  const responses = await Promise.all(requests);
  const [readBooks, readingBooks, wishlistBooks] = await Promise.all(
    responses.map((res) => res.json()),
  );

  return {
    status: true,
    data: [
      ...(readBooks.data || []),
      ...(readingBooks.data || []),
      ...(wishlistBooks.data || []),
    ],
  };
}

export async function getPersonalBooks(slug: string) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    console.log('Token bulunamadı');
    throw new Error('Token not found');
  }

  try {
    const response = await fetch(`${BASE_URL}/book/user/single/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    });
    if (!response.ok) {
      throw new Error('Kitap getirilemedi');
    }
    const data = await response.json();
    return {
      status: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Kitap getirilirken hata oluştu:', error);
    return {
      status: false,
      error: 'Kitap getirilirken bir hata oluştu',
    };
  }
}
export async function getSingleBook(slug: string) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  try {
    const response = await fetch(`${BASE_URL}/posts/single/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    });
    if (!response.ok) {
      throw new Error('Paylaşım Getirilemedi');
    }
    const data = await response.json();
    return {
      status: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Paylaşım getirilirken hata oluştu:', error);
    return {
      status: false,
      error: 'Paylaşım getirilirken bir hata oluştu',
    };
  }
}
