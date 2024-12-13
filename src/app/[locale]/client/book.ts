let BASE_URL = '';

if (process.env.NODE_ENV === 'development') {
  BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://bookarchive-production.up.railway.app';
}
if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://bookarchive-production.up.railway.app';
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
  console.log('body', body);

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
