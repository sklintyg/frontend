export function isValidDate(date?: string | null): date is string {
  return date != null && Boolean(date.match(/\d{4}-\d{2}-\d{2}/))
}
