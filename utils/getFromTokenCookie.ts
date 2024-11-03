export const getFromTokenCookies = (): string | null => {
  const cookies = document.cookie.split('');
  const tokenCookie = cookies.find((cookie) => cookie.startsWith('token='));

  return tokenCookie ? tokenCookie.split('=')[1] : null;
};
