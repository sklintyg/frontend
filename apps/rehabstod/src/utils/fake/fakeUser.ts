import { faker, fakerFromSchema, fakerFromSchemaFactory } from '@frontend/fake'
import { userPreferencesSchema, userSchema } from '../../schemas'
import { fakeVardenhet } from './fakeVardenhet'
import { fakeVardgivare } from './fakeVardgivare'

const fakeUserPreferences = fakerFromSchema(userPreferencesSchema, {
  stringMap: {
    maxAntalDagarMellanIntyg: () => faker.number.int().toString(),
    maxAntalDagarSedanSjukfallAvslut: () => faker.number.int().toString(),
  },
})

export const fakeUser = fakerFromSchemaFactory(userSchema, (data) => ({
  authenticationScheme: 'urn:inera:rehabstod:siths:fake',
  preferences: fakeUserPreferences(data?.preferences),
  valdVardgivare: fakeVardgivare(),
  valdVardenhet: fakeVardenhet(),
  vardgivare: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, fakeVardgivare),
}))
