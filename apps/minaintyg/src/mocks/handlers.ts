/* eslint-disable import/no-extraneous-dependencies */
import { fakeCertificate, fakeCertificateEvent, faker, fakerFromSchema } from '@frontend/fake'
import { format, parseISO, subDays } from 'date-fns'
import { DefaultBodyType, PathParams, RestRequest, rest } from 'msw'
import { CertificateStatusEnum, certificateEventSchema, certificateMetadataSchema, certificateSchema } from '../schema/certificate.schema'
import { testabilityPersonSchema } from '../schema/testability/person.schema'
import { userSchema } from '../schema/user.schema'
import { certificateContentMock } from './certificateContentMock'

const fakeCertificateMetadata = (req: RestRequest<never | DefaultBodyType, PathParams<string>>) => {
  const timestamp = faker.date.between('2021-01-01T00:00:00.000Z', new Date().toISOString()).toISOString()
  const startDate = subDays(parseISO(timestamp), faker.datatype.number({ min: 1, max: 120 }))
  const endDate = parseISO(timestamp)
  const certificate = fakeCertificate()
  const id = (req.params.id instanceof Array ? req.params.id.at(0) : req.params.id) ?? faker.datatype.uuid()

  return fakerFromSchema(certificateMetadataSchema)({
    id,
    issued: timestamp,
    type: { id: certificate.id.toUpperCase(), name: certificate.label, version: '1' },
    statuses: faker.helpers.arrayElements(CertificateStatusEnum.options, faker.datatype.number({ min: 1, max: 2 })),
    events: faker.helpers.uniqueArray(
      () =>
        fakerFromSchema(certificateEventSchema)({
          description: fakeCertificateEvent(),
        }),
      faker.datatype.number({ min: 0, max: 2 })
    ),
    unit: {
      name: faker.company.name(),
      address: `${faker.address.streetAddress()}, ${faker.address.zipCode('### ##')} ${faker.address.city()}`,
    },
    summary: faker.helpers.arrayElement([
      { label: 'Gäller intygsperiod', value: `${format(startDate, 'yyyy-MM-dd')} - ${format(endDate, 'yyyy-MM-dd')}` },
      { label: 'Avser diagnos', value: 'Downs syndrom' },
    ]),
  })
}

export const handlers = [
  rest.get('/api/user', (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json(
        fakerFromSchema(userSchema, {
          stringMap: {
            personName: faker.name.fullName,
          },
        })()
      )
    )
  ),

  rest.post('/api/certificate', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        content: Array.from({ length: 5 }, () => fakeCertificateMetadata(req)),
      })
    )
  ),

  rest.get('/api/certificate/:id', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json(
        fakerFromSchema(certificateSchema)({
          content: certificateContentMock,
          metadata: fakeCertificateMetadata(req),
        })
      )
    )
  ),

  rest.post('/api/testability/fake', (_, res, ctx) => res(ctx.status(200))),

  rest.get('/api/testability/person', (_, res, ctx) =>
    res(ctx.json({ testPerson: Array.from({ length: 10 }, fakerFromSchema(testabilityPersonSchema)) }))
  ),
]
