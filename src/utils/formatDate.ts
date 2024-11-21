export function formatDate(date: string, type: string = 'date'): string {
  if (!date) return '';
  let formattedDate = '';
  const newDate = new Date(date).toLocaleString().split(', ');
  if (type == 'date') {
    formattedDate = newDate[0];
  } else if (type === 'dateTime') {
    formattedDate = newDate[0] + ' ' + newDate[1].split(' AM')[0];
  }
  return formattedDate;
}
