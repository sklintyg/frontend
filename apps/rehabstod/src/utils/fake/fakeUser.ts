import { faker, fakerFromSchema, fakerFromSchemaFactory } from '@frontend/fake'
import { userFeatureSchema, userPreferencesSchema, userRoleSchema, userSchema } from '../../schemas'
import { fakeVardenhet } from './fakeVardenhet'
import { fakeVardgivare } from './fakeVardgivare'

export const fakeUserRole = fakerFromSchema(userRoleSchema)
export const fakeUserPreferences = fakerFromSchema(userPreferencesSchema)
export const fakeUserFeature = fakerFromSchema(userFeatureSchema)

export const fakeUser = fakerFromSchemaFactory(userSchema, {
  authenticationScheme: 'urn:inera:rehabstod:siths:fake',
  valdVardgivare: fakeVardgivare(),
  valdVardenhet: fakeVardenhet(),
  vardgivare: Array.from({ length: faker.datatype.number({ min: 1, max: 3 }) }, fakeVardgivare),
})
