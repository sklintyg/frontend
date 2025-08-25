import type { Mottagning, User, Vardenhet } from '../schemas'

export function getUnitsForUser(user: User): Array<Vardenhet | Mottagning> {
  return user.vardgivare.map(({ vardenheter }) => vardenheter.map((careUnit) => [careUnit, ...(careUnit.mottagningar ?? [])]).flat()).flat()
}
