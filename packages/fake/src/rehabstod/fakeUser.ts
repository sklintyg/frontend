import { userFeatureSchema, userPreferencesSchema, userRoleSchema, userSchema } from '@frontend/types'
import { fakerFromSchema, fakerFromSchemaFactory } from '../factory'
import { fakeVardenhet } from './fakeVardenhet'
import { fakeVardgivare } from './fakeVardgivare'

export const fakeUserRole = fakerFromSchema(userRoleSchema)
export const fakeUserPreferences = fakerFromSchema(userPreferencesSchema)
export const fakeUserFeature = fakerFromSchema(userFeatureSchema)

export const fakeUser = fakerFromSchemaFactory(userSchema, {
  valdVardgivare: fakeVardgivare(),
  valdVardenhet: fakeVardenhet(),
  vardgivare: Array.from({ length: 3 }, fakeVardgivare),
})
