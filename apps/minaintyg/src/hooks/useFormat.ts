import { format, parseISO } from 'date-fns'

export function useFormat() {
  const formatDate = (timestamp: string) => format(parseISO(timestamp), 'yyyy-MM-dd')
  const formatTime = (timestamp: string) => format(parseISO(timestamp), 'HH:mm')

  return {
    formatDate,
    formatTime,
    formatDatetime: (timestamp: string) => `${formatDate(timestamp)} ${formatTime(timestamp)}`,
  }
}
