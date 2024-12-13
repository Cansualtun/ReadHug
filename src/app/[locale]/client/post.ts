let BASE_URL = '';

if (process.env.NODE_ENV === 'development') {
  BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://bookarchive-production.up.railway.app';
}
if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://bookarchive-production.up.railway.app';
}

export async function getClientBookPosts(bookId: string) {
  try {
    const response = await fetch(`${BASE_URL}/posts/book/${bookId}`);
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
