import { generateMock, GenerateMockOptions } from '@anatine/zod-mock'
import { faker } from '@faker-js/faker'
import { deepmergeCustom, DeepMergeLeafURI } from 'deepmerge-ts'
import { DeepPartial } from 'ts-essentials'
import { z, ZodTypeAny } from 'zod'

export const fakeHSA = () =>
  `${faker.random.alpha({ count: 6, casing: 'upper' })}${faker.datatype.number({ min: 1e9 })}-${faker.datatype.number({ min: 1e3 })}`

export { faker } from '@faker-js/faker'
export * from './certificate'

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
}

const customDeepmerge = deepmergeCustom<{
  DeepMergeArraysURI: DeepMergeLeafURI
}>({
  mergeArrays: false,
})

export function fakerFromSchema<T extends ZodTypeAny>(schema: T, options?: GenerateMockOptions) {
  return (data?: DeepPartial<z.infer<T>>) =>
    customDeepmerge(generateMock(schema, { faker, ...options, stringMap: { ...stringMap, ...options?.stringMap } }), data ?? {})
}

export function fakerFromSchemaFactory<T extends ZodTypeAny>(
  schema: T,
  initialData: (data?: DeepPartial<z.infer<T>>) => DeepPartial<z.infer<T>>,
  options?: GenerateMockOptions
) {
  return (data?: DeepPartial<z.infer<T>>) => fakerFromSchema(schema, options)({ ...initialData(data), ...data })
}
