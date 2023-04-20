import { isBefore, subDays } from 'date-fns'

export const isDateBeforeToday = (date: string | number | Date) => isBefore(new Date(date), subDays(Date.now(), 1))
