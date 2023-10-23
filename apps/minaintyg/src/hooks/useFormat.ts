import { format, parseISO } from 'date-fns'

export function useFormat() {
  const date = (timestamp: string) => format(parseISO(timestamp), 'yyyy-MM-dd')
  const time = (timestamp: string) => format(parseISO(timestamp), 'HH:mm')

  return {
    date,
    time,
    datetime: (timestamp: string) => `${date(timestamp)}, ${time(timestamp)}`,
  }
}
