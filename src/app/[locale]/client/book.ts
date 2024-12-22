let BASE_URL = '';

if (process.env.NODE_ENV === 'development') {
  BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://bookarchive-production.up.railway.app';
}
if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://bookarchive-production.up.railway.app';
}

export enum BookType {
  Read = 0,
  Reading = 1,
  WishList = 2,
}

export async function getClientBookNotes(bookId: string) {
  try {
    const response = await fetch(`${BASE_URL}/note/getNotes/${bookId}`);
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
export async function clientCreateBookNotes(body: any) {

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
  try {
    const response = await fetch(`${BASE_URL}/note/create`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
export async function clientBookTypeChange(body: any) {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
  try {
    const response = await fetch(`${BASE_URL}/book/user/updateBookFromList`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
export async function clientBookDelete(bookId: string) {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
  try {
    const response = await fetch(`${BASE_URL}/book/user/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Kitap Silinemedi');
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

export async function getLibraryLists(
  userName: string,
  type: 0 | 1 | 2,
  limit: number = 10,
  page: number = 1,
) {
  const requests = [
    fetch(
      `${BASE_URL}/book/user/books/${userName}/${type}?limit=${limit}&page=${page}`,
    ),
  ];

  const responses = await Promise.all(requests);
  const [data] = await Promise.all(responses.map((res) => res.json()));

  return {
    status: true,
    data: data.data || [],
  };
}

export async function getAllBookLists(userName: string) {
  const requests = [
    fetch(`${BASE_URL}/book/user/books/${userName}/${BookType.Read}`, {}),
    fetch(`${BASE_URL}/book/user/books/${userName}/${BookType.Reading}`, {}),
    fetch(`${BASE_URL}/book/user/books/${userName}/${BookType.WishList}`, {}),
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
export async function getRecommendedBooks() {
  const requests = [fetch(`${BASE_URL}/book/lastBook`)];

  const responses = await Promise.all(requests);
  const [data] = await Promise.all(responses.map((res) => res.json()));

  return {
    status: true,
    data: data.data || [],
  };
}
