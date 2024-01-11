import { faker, fakerFromSchema, fakerFromSchemaFactory } from '@frontend/fake'
import { fakeVardenhet } from './fakeVardenhet'
import { fakeVardgivare } from './fakeVardgivare'
import { userPreferencesSchema, userSchema } from '../../schemas'

const fakeUserPreferences = fakerFromSchema(userPreferencesSchema, {
  stringMap: {
    maxAntalDagarMellanIntyg: () => faker.datatype.number().toString(),
    maxAntalDagarSedanSjukfallAvslut: () => faker.datatype.number().toString(),
  },
})

export const fakeUser = fakerFromSchemaFactory(userSchema, (data) => ({
  authenticationScheme: 'urn:inera:rehabstod:siths:fake',
  preferences: fakeUserPreferences(data?.preferences),
  valdVardgivare: fakeVardgivare(),
  valdVardenhet: fakeVardenhet(),
  vardgivare: Array.from({ length: faker.datatype.number({ min: 1, max: 3 }) }, fakeVardgivare),
}))
