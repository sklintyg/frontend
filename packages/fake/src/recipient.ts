import { faker } from '@faker-js/faker'

const recipients = [
  {
    id: 'TRANSP',
    name: 'Transportstyrelsen',
    trusted: true,
  },
  {
    id: 'AF',
    name: 'Arbetsförmedlingen',
    trusted: true,
  },
  {
    id: 'INVANA',
    name: 'Invånaren',
    trusted: true,
  },
  {
    id: 'SOS',
    name: 'Socialstyrelsen',
    trusted: true,
  },
  {
    id: 'FKASSA',
    name: 'Försäkringskassan',
    trusted: true,
  },
  {
    id: 'SKANDIA',
    name: 'SKANDIA SSEK',
    trusted: true,
  },
  {
    id: 'HSVARD',
    name: 'Hälso- och sjukvården',
    trusted: true,
  },
  {
    id: 'SKV',
    name: 'Skatteverket',
    trusted: true,
  },
]

export const fakeRecipient = () => faker.helpers.arrayElement(recipients)

export const { fakeRecipientId, fakeRecipientName } = {
  fakeRecipientId: () => fakeRecipient().id,
  fakeRecipientName: () => fakeRecipient().name,
}
