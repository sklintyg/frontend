import { v4 } from 'uuid'

export function randomUUID() {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return v4()
}
