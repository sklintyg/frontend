import type { GenerateMockOptions } from '@anatine/zod-mock'
import { generateMock } from '@anatine/zod-mock'
import { faker } from '@faker-js/faker'
import type { DeepMergeLeafURI } from 'deepmerge-ts'
import { deepmergeCustom } from 'deepmerge-ts'
import type { DeepPartial } from 'ts-essentials'
import type { z, ZodTypeAny } from 'zod'
import { fakeHSA } from './hsa'
import { fakePersonId } from './personId'

export { faker } from '@faker-js/faker'
export * from './certificate'
export * from './hsa'
export * from './personId'

export const stringMap = {
  id: faker.datatype.uuid,
  hsaId: fakeHSA,
  forvaldEnhet: fakeHSA,
  unitId: fakeHSA,
  namn: faker.name.fullName,
  fornamn: faker.name.firstName,
  efternamn: faker.name.lastName,
  stad: faker.address.city,
  postadress: faker.address.streetAddress,
  postnummer: faker.address.zipCode,
  postort: faker.address.cityName,
  epost: faker.internet.email,
  telefonnummer: faker.phone.number,
  arbetsplatskod: faker.datatype.uuid,
  personId: fakePersonId,
  personName: faker.name.fullName,
}

type FakeFromSchemaOptions = Omit<GenerateMockOptions, 'seed'> & { seed?: number }

const customDeepmerge = deepmergeCustom<{
  DeepMergeArraysURI: DeepMergeLeafURI
}>({
  mergeArrays: false,
})

function handleOptions(options?: FakeFromSchemaOptions) {
  const { seed, ...other } = options ?? { seed: undefined }
  if (seed !== undefined) {
    faker.seed(seed)
  }
  return other
}

export function fakerFromSchema<T extends ZodTypeAny>(schema: T, options?: FakeFromSchemaOptions) {
  const o = handleOptions({ faker, ...options, stringMap: { ...stringMap, ...options?.stringMap } })
  return (data?: DeepPartial<z.infer<T>>) => customDeepmerge(generateMock(schema, o), data ?? {})
}

export function fakerFromSchemaFactory<T extends ZodTypeAny>(
  schema: T,
  initialData: (data?: DeepPartial<z.infer<T>>) => DeepPartial<z.infer<T>>,
  options?: FakeFromSchemaOptions
) {
  return (data?: DeepPartial<z.infer<T>>) => fakerFromSchema(schema, options)({ ...initialData(data), ...data })
}
