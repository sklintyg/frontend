import faker from 'faker'

export function fakeId() {
  return faker.random.alpha({ count: 5 })
}
