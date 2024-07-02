/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { fakerFromSchema } from '@frontend/fake'
import { rest } from 'msw'
import { z } from 'zod'
import type { Link} from '../schemas';
import { configSchema, linkSchema, userPreferencesSchema } from '../schemas'
import { agCertificatesInfoSchema } from '../schemas/agCertificatesSchema'
import { luCertificateFilterOptions, luCertificatesInfoSchema } from '../schemas/luCertificatesSchema'
import { patientSchema } from '../schemas/patientSchema'
import { sickLeaveFilterOptions, sickLeaveInfoSchema, sickLeaveSummary } from '../schemas/sickLeaveSchema'
import { fakeUser } from '../utils/fake/fakeUser'

const fakeLink = fakerFromSchema(linkSchema)

export const handlers = [
  rest.post('/logout', (_, res, ctx) => res(ctx.status(302))),

  rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser()))),

  rest.get('/api/config', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(configSchema)()))),

  rest.post('/api/user/preferences', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(userPreferencesSchema)()))),

  rest.post('/api/user/giveconsent', (_, res, ctx) => res(ctx.status(200), ctx.json({ pdlConsentGiven: true }))),

  rest.get('/api/config/links', (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json<Record<string, Link>>({
        ineraManualRehabstod: fakeLink({ text: 'ineraManualRehabstod' }),
        ineraNationellKundservice: fakeLink({ text: 'ineraNationellKundservice' }),
        ineraMainPage: fakeLink({ text: 'ineraMainPage' }),
        ineraBehandlingPersonuppgifter: fakeLink({ text: 'ineraBehandlingPersonuppgifter' }),
        statistiktjanstenTooltip: fakeLink({ text: 'statistiktjanstenTooltip' }),
        rehabstodTillganglighetsredogorelse: fakeLink({ text: 'Tillgänglighetsredogörelse' }),
      })
    )
  ),

  rest.post<{ id: string }>('/api/user/andraenhet', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser()))),

  rest.get('/api/session-auth-check/ping', (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        hasSession: true,
        secondsUntilExpire: 1800,
        authenticated: true,
      })
    )
  ),

  rest.post('/api/sjukfall/patient', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(patientSchema)()))),

  rest.post('/api/certificate/lu/person', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(luCertificatesInfoSchema)()))),
  rest.post('/api/certificate/ag/person', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(agCertificatesInfoSchema)()))),

  rest.post('/api/sickleaves/active', (_, res, ctx) =>
    res(ctx.status(200), ctx.json(fakerFromSchema(z.object({ content: z.array(sickLeaveInfoSchema) }))()))
  ),

  rest.post('api/reko', (_, res, ctx) => res(ctx.status(200))),

  rest.post('/api/user/preferences', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser()))),

  rest.get('/api/sickleaves/filters', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(sickLeaveFilterOptions)()))),

  rest.get('/api/sickleaves/summary', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(sickLeaveSummary)))),

  rest.post('/api/log/error', (_, res, ctx) => res(ctx.status(200))),

  rest.get('/api/lu/filters', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(luCertificateFilterOptions)()))),
]
