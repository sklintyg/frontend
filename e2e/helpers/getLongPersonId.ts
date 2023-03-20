export function getLongPersonId(personId: string) {
  return [personId.slice(0, -4), '-', personId.slice(-4)].join('')
}
