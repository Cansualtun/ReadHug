export function formatDate(date: string, type: string = 'date'): string {
  if (!date) return '';

  const now = new Date();
  const targetDate = new Date(date);

  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  const isSameDay =
    now.getFullYear() === targetDate.getFullYear() &&
    now.getMonth() === targetDate.getMonth() &&
    now.getDate() === targetDate.getDate();

  const timeString = targetDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24 saat formatı
  });
  const dateString = targetDate.toLocaleDateString();

  if (type === 'dateTime') {
    if (diffInMinutes < 1) {
      return 'Now';
    } else if (isSameDay) {
      if (diffInHours < 1) {
        return `${diffInMinutes} minutes ago`; // Eğer 1 saati geçmemişse dakika cinsinden
      } else {
        return `${diffInHours} hours ago`; // Eğer gün içinde ve saat farkı varsa
      }
    } else {
      return `${dateString} ${timeString}`; // Farklı bir güne aitse tarih ve saat
    }
  } else if (type === 'date') {
    return dateString;
  }

  return '';
}
