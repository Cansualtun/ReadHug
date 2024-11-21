export function formatDate(date: string, type: string = 'date'): string {
  if (!date) return '';
  const newTimeFormat = new Date(date).toLocaleTimeString();
  const newDateFormat = new Date(date).toLocaleDateString();
  if (type == 'date') {
    return newDateFormat;
  } else if (type === 'dateTime') {
    return (
      newDateFormat +
      ' ' +
      newTimeFormat
        .split(' ')[0]
        .split(':')
        .reverse()
        .splice(1, 3)
        .reverse()
        .join(':')
    );
  }
  return '';
}
