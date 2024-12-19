import formatBaseUrl from '@/utils/formatBaseUrl';

export const createBookRequestClient = async (payload: any) => {
  const { token, BASE_URL } = formatBaseUrl();

  try {
    const response = await fetch(`${BASE_URL}/request/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
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
    console.error('Failed to update profile:', error);
  }
};
