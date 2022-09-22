import faker from 'faker'

interface ListItem {
  id: string
  label: string
}

export const fakeList = (length = 5): ListItem[] => new Array(length).fill(0).map(() => fakeListItem())

export const fakeListItem = (data?: Partial<ListItem>): ListItem => {
  return {
    id: faker.random.alpha({ count: 10 }),
    label: faker.lorem.sentence(5),
    ...data,
  }
}
