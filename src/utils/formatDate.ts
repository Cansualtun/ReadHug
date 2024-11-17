export function formatDate(date: string): string {
  if (!date) return '';
  const formattedDate = new Date(date).toISOString().split('T')[0];

  return formattedDate;
}
