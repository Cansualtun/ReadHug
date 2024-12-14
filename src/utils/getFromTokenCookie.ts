export const getFromTokenCookies = (req?: { headers?: { cookie?: string } }): string | null => {

  if (typeof window === 'undefined') {
    if (!req || !req.headers?.cookie) {
      return null;
    }
    const cookies = req.headers.cookie.split('; ');
    const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  }

  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};
