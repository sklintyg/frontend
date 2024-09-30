import { faker, fakerFromSchema, fakerFromSchemaFactory } from 'fake'
import { userPreferencesSchema, userSchema } from '../../schemas'
import { fakeVardenhet } from './fakeVardenhet'
import { fakeVardgivare } from './fakeVardgivare'

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
