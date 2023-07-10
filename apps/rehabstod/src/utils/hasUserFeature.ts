import { User } from '../schemas/userSchema'

export function hasUserFeature(user: User, feature: keyof User['features']): boolean {
  const f = user.features[feature]
  return f != null && f.global === true
}
