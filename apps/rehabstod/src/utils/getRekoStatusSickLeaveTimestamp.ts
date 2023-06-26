import { format, isAfter } from 'date-fns'

export const getRekoStatusSickLeaveTimestamp = (endDate: string) =>
  isAfter(new Date(endDate), new Date()) ? format(new Date(), 'yyyy-MM-dd') : endDate
