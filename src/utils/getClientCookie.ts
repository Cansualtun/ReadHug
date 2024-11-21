export const getClientCookie = () =>
  document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
