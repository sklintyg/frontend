import { faker, fakerFromSchema, fakerFromSchemaFactory } from '@frontend/fake'
import { mottagningSchema, vardenhetSchema } from '../../schemas'

const fakeMottagning = fakerFromSchema(mottagningSchema, {
  stringMap: {
    namn: faker.company.name,
  },
})

export const fakeVardenhet = fakerFromSchemaFactory(
  vardenhetSchema,
  () => ({
    mottagningar: Array.from({ length: faker.datatype.number({ max: 3 }) }, fakeMottagning),
  }),
  {
    stringMap: {
      namn: faker.company.name,
    },
  }
)
