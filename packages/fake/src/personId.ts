import { faker } from '@faker-js/faker'

export const fakePersonId = () => {
  const birthdate = faker.date.birthdate({ min: 18, max: 86, mode: 'age', refDate: new Date('2024-01-01') })
  const id = `${faker.datatype.number({ min: 1, max: 1e4 - 1 })}`.padStart(4, '0')

  return `${birthdate.toISOString().replace(/T.*/g, '').replace(/-/g, '')}${id}`
}
