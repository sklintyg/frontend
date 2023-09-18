/* eslint-disable import/no-extraneous-dependencies */
import { fakeCertificateLabel, faker, fakerFromSchema } from '@frontend/fake'
import { rest } from 'msw'
import { certificateListItemSchema } from '../schema/certificateList.schema'
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
  rest.post('/api/certificates', (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        content: Array.from(
          { length: 5 },
          fakerFromSchema(certificateListItemSchema, {
            stringMap: {
              title: fakeCertificateLabel,
              certificateId: faker.datatype.uuid,
              timestamp: () => faker.date.between('2021-01-01T00:00:00.000Z', new Date().toISOString()).toISOString(),
            },
          })
        ),
      })
    )
  ),
]
