/* eslint-disable import/no-extraneous-dependencies */

import { fakeCertificateId, fakeCertificateLabel, faker, fakerFromSchema } from '@frontend/fake'
import { getYear, parseISO } from 'date-fns'
import { rest } from 'msw'
import { CertificateStatus, certificateListItemSchema } from '../schema/certificateList.schema'
import { certificateFilterOptionsSchema } from '../schema/certificateListFilter.schema'

const certificates = Array.from(
  { length: 5 },
  fakerFromSchema(certificateListItemSchema, {
    stringMap: {
      title: fakeCertificateLabel,
      certificateId: faker.datatype.uuid,
      timestamp: () => faker.date.between('2021-01-01T00:00:00.000Z', new Date().toISOString()).toISOString(),
    },
  })
)

export const handlers = [
  rest.post('/api/certificates', (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        content: certificates,
      })
    )
  ),
  rest.get('/api/filter-certificate', (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json(
        fakerFromSchema(certificateFilterOptionsSchema)({
          total: certificates.length,
          years: Array.from(new Set(certificates.map(({ timestamp }) => getYear(parseISO(timestamp)).toString()))),
          statuses: Array.from(new Set(certificates.map(({ status }) => status))).filter(Boolean) as CertificateStatus[],
          certificateTypes: faker.helpers.uniqueArray(() => fakeCertificateId().toUpperCase(), certificates.length),
          units: faker.helpers.uniqueArray(faker.company.name, certificates.length),
        })
      )
    )
  ),
]
