import { fakerFromSchema } from '@frontend/fake'
import { srsFeatureSchema } from '../schemas'
import { fakeUser } from './fake/fakeUser'
import { hasUserFeature } from './hasUserFeature'

it('Should return false if the feature is undefined', () => {
  const user = fakeUser({ features: {} })
  expect(hasUserFeature(user, 'SRS')).toBe(false)
})

it('Should return false if the feature is not global', () => {
  const user = fakeUser({ features: { SRS: fakerFromSchema(srsFeatureSchema)({ global: false }) } })
  expect(hasUserFeature(user, 'SRS')).toBe(false)
})

it('Should return true if the feature is defined and global', () => {
  const user = fakeUser({ features: { SRS: fakerFromSchema(srsFeatureSchema)({ global: true }) } })
  expect(hasUserFeature(user, 'SRS')).toBe(true)
})
