/* eslint-disable import/no-extraneous-dependencies */
import { fakerFromSchema } from '@frontend/fake'
import { rest } from 'msw'
import { z } from 'zod'
import { configSchema, Link, linkSchema, userPreferencesSchema } from '../../schemas'
import { agCertificatesInfoSchema } from '../../schemas/agCertificatesSchema'
import { diagnosKapitelSchema } from '../../schemas/diagnosisSchema'
import { lakareSchema } from '../../schemas/lakareSchema'
import { luCertificatesInfoSchema } from '../../schemas/luCertificatesSchema'
import { patientSchema } from '../../schemas/patientSchema'
import { sickLeaveInfoSchema } from '../../schemas/sickLeaveSchema'
import { fakeUser } from '../../utils/fake/fakeUser'

const fakeLink = fakerFromSchema(linkSchema)

export const handlers = [
  rest.post('/logout', (req, res, ctx) => res(ctx.status(302))),

  rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser()))),

  rest.get('/api/config', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(configSchema)()))),

  rest.post('/api/user/preferences', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(userPreferencesSchema)()))),

  rest.get('/api/config/links', (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json<Record<string, Link>>({
        ineraManualRehabstod: fakeLink({ text: 'ineraManualRehabstod' }),
        ineraNationellKundservice: fakeLink({ text: 'ineraNationellKundservice' }),
        ineraMainPage: fakeLink({ text: 'ineraMainPage' }),
        ineraBehandlingPersonuppgifter: fakeLink({ text: 'ineraBehandlingPersonuppgifter' }),
        statistiktjanstenTooltip: fakeLink({ text: 'statistiktjanstenTooltip' }),
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

  rest.post('/api/user/preferences', (_, res, ctx) => res(ctx.status(200), ctx.json(fakeUser()))),

  rest.get('/api/sickleaves/filters', (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json(
        fakerFromSchema(
          z.object({
            activeDoctors: z.array(lakareSchema),
            allDiagnosisChapters: z.array(diagnosKapitelSchema),
            enabledDiagnosisChapters: z.array(diagnosKapitelSchema),
          })
        )()
      )
    )
  ),

  rest.post('/api/log/error', (_, res, ctx) => res(ctx.status(200))),

  rest.get('/api/lu/filters', (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json(
        fakerFromSchema(
          z.object({
            activeDoctors: z.array(lakareSchema),
            allDiagnosisChapters: z.array(diagnosKapitelSchema),
          })
        )()
      )
    )
  ),
]
