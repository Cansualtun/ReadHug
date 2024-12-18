export default () => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1];
  let BASE_URL = '';
  if (process.env.NODE_ENV === 'development') {
    BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  }
  if (process.env.NODE_ENV === 'production') {
    BASE_URL = 'https://bookarchive-production.up.railway.app';
  }
  return { token, BASE_URL };
};
