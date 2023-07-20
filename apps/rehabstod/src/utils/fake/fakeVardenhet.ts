import { faker, fakerFromSchema, fakerFromSchemaFactory } from '@frontend/fake'
import { mottagningSchema, vardenhetSchema } from '../../schemas'

const fakeMottagning = fakerFromSchema(mottagningSchema)

export const fakeVardenhet = fakerFromSchemaFactory(
  vardenhetSchema,
  {
    mottagningar: Array.from({ length: faker.datatype.number({ min: 1, max: 1 }) }, fakeMottagning),
  },
  {
    stringMap: {
      namn: faker.company.name,
    },
  }
)
