/* eslint-disable import/no-extraneous-dependencies */
import { fakeCertificateLabel, faker, fakerFromSchema } from '@frontend/fake'
import { format, parseISO, subDays } from 'date-fns'
import { rest } from 'msw'
import { CertificateStatus, certificateListItemSchema } from '../schema/certificateList.schema'
import { testabilityPersonSchema } from '../schema/testability/person.schema'
import { userSchema } from '../schema/user.schema'

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

  rest.post('/api/certificate', (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        content: Array.from({ length: 5 }, () => {
          const timestamp = faker.date.between('2021-01-01T00:00:00.000Z', new Date().toISOString()).toISOString()
          const startDate = subDays(parseISO(timestamp), faker.datatype.number({ min: 1, max: 120 }))
          const endDate = parseISO(timestamp)

          return fakerFromSchema(certificateListItemSchema, {
            stringMap: {
              title: fakeCertificateLabel,
              certificateId: faker.datatype.uuid,
              timestamp: () => timestamp,
            },
          })({
            statuses: faker.helpers.arrayElements(Object.values(CertificateStatus), faker.datatype.number({ min: 1, max: 2 })),
            summary: faker.helpers.arrayElements([
              ['intygsperiod', `${format(startDate, 'yyyy-MM-dd')} - ${format(endDate, 'yyyy-MM-dd')}`],
              ['diagnos', 'Downs syndrom'],
            ]),
          })
        }),
      })
    )
  ),

  rest.post('/api/testability/fake', (_, res, ctx) => res(ctx.status(200))),

  rest.get('/api/testability/person', (_, res, ctx) =>
    res(ctx.json({ testPerson: Array.from({ length: 10 }, fakerFromSchema(testabilityPersonSchema)) }))
  ),
]
