import { v4 } from 'uuid'

export function randomUUID() {
  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return v4()
}
