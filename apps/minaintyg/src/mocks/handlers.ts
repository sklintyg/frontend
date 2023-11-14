/* eslint-disable import/no-extraneous-dependencies */
import {fakeCertificate, fakeCertificateEvent, fakeHSA, faker, fakerFromSchema} from '@frontend/fake'
import {format, getYear, parseISO, subDays} from 'date-fns'
import {DefaultBodyType, PathParams, rest, RestRequest} from 'msw'
import {
  availableFunctionSchema,
  certificateEventSchema,
  certificateMetadataSchema,
  certificateRecipientSchema,
  certificateSchema,
  CertificateStatus,
  CertificateStatusEnum,
} from '../schema/certificate.schema'
import {certificateFilterOptionsSchema} from '../schema/certificateListFilter.schema'
import {testabilityPersonSchema} from '../schema/testability/person.schema'
import {loginMethodEnum, userSchema} from '../schema/user.schema'
import {certificateContentMock} from './certificateContentMock'

const certificateIngress = (id: string): string | undefined => {
  const ingress = [
    {
      ids: ['lisjp', 'fk7263'],
      ingress:
        'Här kan du läsa ditt läkarintyg. För medicinska frågor kontaktar du den mottagning som utfärdat ditt intyg. Om du vill ansöka om sjukpenning, gör du det på <a href="http://www.forsakringskassan.se/sjuk" target="_blank">Försäkringskassan</a>.',
    },
    {
      ids: ['ag7804', 'ag1-14'],
      ingress: `
        <p>Här kan du läsa ditt läkarintyg. För medicinska frågor kontaktar du den mottagning som utfärdat ditt intyg. Detta intyg går inte att skicka digitalt till din arbetsgivare.</p>
        <p>Vid utskrift av intyget kan du välja om du vill dölja din diagnos för arbetsgivaren. Ingen annan information kan döljas.</p>
      `,
    },
    {
      ids: ['luse', 'luae-fs', 'luae-na'],
      ingress: 'Här kan du läsa ditt läkarintyg. För medicinska frågor kontaktar du den mottagning som utfärdat ditt intyg.',
    },
    {
      ids: ['ts-bas', 'ts-diabetes'],
      ingress: 'Här kan du läsa ditt läkarintyg. För medicinska frågor kontaktar du den mottagning som utfärdat ditt intyg.',
    },
  ]
  return ingress.find(({ids}) => ids.includes(id.toLowerCase()))?.ingress
}

const fakeCertificateMetadata = (req: RestRequest<never | DefaultBodyType, PathParams<string>>) => {
  const timestamp = faker.date.between('2021-01-01T00:00:00.000Z', new Date().toISOString()).toISOString()
  const startDate = subDays(parseISO(timestamp), faker.datatype.number({min: 1, max: 120}))
  const endDate = parseISO(timestamp)
  const certificate = fakeCertificate()
  const id = (req.params.id instanceof Array ? req.params.id.at(0) : req.params.id) ?? faker.datatype.uuid()
  const recipient = fakerFromSchema(certificateRecipientSchema)({
    sent: faker.date.recent().toISOString(),
    name: certificate.recipient,
  })

  return fakerFromSchema(certificateMetadataSchema)({
    id,
    issued: timestamp,
    type: {
      id: certificate.id.toUpperCase(),
      name: certificate.label,
      version: '1',
      description: certificateIngress('fk7263') ?? '',
    },
    statuses: faker.helpers.uniqueArray(CertificateStatusEnum.options, 2),
    events: faker.helpers.uniqueArray(
      () =>
        fakerFromSchema(certificateEventSchema)({
          description: fakeCertificateEvent(),
        }),
      faker.datatype.number({min: 0, max: 2})
    ),
    unit: {
      name: faker.company.name(),
      address: `${faker.address.streetAddress()}, ${faker.address.zipCode('### ##')} ${faker.address.city()}`,
    },
    summary: faker.helpers.arrayElement([
      {label: 'Gäller intygsperiod', value: `${format(startDate, 'yyyy-MM-dd')} - ${format(endDate, 'yyyy-MM-dd')}`},
      {label: 'Avser diagnos', value: 'Downs syndrom'},
    ]),
    recipient,
  })
}

export const handlers = [
  rest.get('/api/user', (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json(
        fakerFromSchema(userSchema)({
          loginMethod: loginMethodEnum.enum.FAKE,
        })
      )
    )
  ),

  rest.post('/api/certificate', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        content: Array.from({length: 5}, () => fakeCertificateMetadata(req)),
      })
    )
  ),

  rest.get('/api/certificate/:id', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        certificate: fakerFromSchema(certificateSchema)({
          content: certificateContentMock,
          metadata: fakeCertificateMetadata(req),
        }),
        availableFunctions: fakerFromSchema(availableFunctionSchema),
      })
    )
  ),

  rest.post('/api/certificate/:id/send', (req, res, ctx) => res(ctx.status(200), ctx.json({}))),

  rest.get('/api/filters', (req, res, ctx) => {
    const certificates = Array.from({length: 5}, () => fakeCertificateMetadata(req))
    return res(
      ctx.status(200),
      ctx.json(
        fakerFromSchema(certificateFilterOptionsSchema)({
          total: certificates.length,
          years: Array.from(new Set(certificates.map(({issued}) => getYear(parseISO(issued)).toString()))),
          statuses: Array.from(new Set(certificates.map(({statuses}) => statuses).flat())).filter(Boolean) as CertificateStatus[],
          certificateTypes: faker.helpers.uniqueArray(fakeCertificate, certificates.length).map(({id, label}) => ({id, name: label})),
          units: faker.helpers.uniqueArray(() => ({id: fakeHSA(), name: faker.company.name()}), certificates.length),
        })
      )
    )
  }),

  rest.post('/api/testability/fake', (_, res, ctx) => res(ctx.status(200))),

  rest.get('/api/testability/person', (_, res, ctx) =>
    res(
      ctx.json({
        testPerson: Array.from({length: 10}, fakerFromSchema(testabilityPersonSchema)),
      })
    )
  ),
]
