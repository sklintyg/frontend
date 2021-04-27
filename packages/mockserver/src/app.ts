import express, { Application, NextFunction, Request, Response } from 'express'
import bootstrapCertificate from './bootstrap/fk7804.json'
import bootstrapUsers from './bootstrap/users.json'
import {
  Certificate,
  CertificateDataValueType,
  CertificateEventType,
  CertificateRelation,
  CertificateRelationType,
  CertificateStatus,
  FakeLogin,
  ResourceLinkChooseReceivers,
  ResourceLinkSend,
  ResourceLinkType,
  User,
  ValidationError,
  ValueBoolean,
  ValueCode,
  ValueDiagnosis,
  ValueDiagnosisList,
  ValueText,
  CertificateDataValidationType,
  ValueCodeList,
  ValueDateList,
  ValueDateRangeList,
} from '@frontend/common'
import bodyParser from 'body-parser'
import * as fs from 'fs'
import _ from 'lodash'
import { createEvent } from './util'
import { ValueDate } from '@frontend/common/src'

const app: Application = express()

const certificateRepository = {
  [bootstrapCertificate.metadata.id]: (_.cloneDeep(bootstrapCertificate) as unknown) as Certificate,
}

const certificateEventRepository = {
  [bootstrapCertificate.metadata.id]: Array.of(createEvent(bootstrapCertificate.metadata.id, CertificateEventType.CREATED, null, null)),
}

let loggedInUser: FakeLogin | null = null

const diagnoses = [
  { kod: 'F50', beskrivning: 'Ätstörningar' },
  { kod: 'F500', beskrivning: 'Anorexia nervosa' },
  { kod: 'F501', beskrivning: 'Atypisk anorexia nervosa' },
  { kod: 'F502', beskrivning: 'Bulimia nervosa' },
  { kod: 'F503', beskrivning: 'Atypisk bulimia nervosa' },
  { kod: 'F504', beskrivning: 'Överdrivet ätande sammanhängande med andra psykiska störningar' },
  { kod: 'F505', beskrivning: 'Kräkningar sammanhängande med andra psykiska störningar' },
  { kod: 'F508', beskrivning: 'Andra specificerade ätstörningar' },
  { kod: 'F509', beskrivning: 'Ätstörning, ospecificerad' },
]

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

app.get('/api/certificate/:id', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} GET /api/certificate/${req.params.id}`)
  if (certificateRepository[req.params.id]) {
    setValidation(certificateRepository[req.params.id])
    res.json(createResponse(certificateRepository[req.params.id]))
  } else if (req.params.id) {
    const certificateClone = (_.cloneDeep(bootstrapCertificate) as unknown) as Certificate
    certificateClone.metadata.id = req.params.id
    certificateRepository[req.params.id] = certificateClone

    const certificateEvent = createEvent(certificateClone.metadata.id, CertificateEventType.CREATED, null, null)

    certificateEventRepository[req.params.id] = Array.of(certificateEvent)
    setValidation(certificateRepository[req.params.id])
    res.json(createResponse(certificateClone))
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

const setValidation = (certificate: Certificate) => {
  const validationTypes = [CertificateDataValidationType.HIDE_VALIDATION]
  for (const id in certificate.data) {
    if (certificate.data[id].validation && certificate.data[id].validation.some((v) => validationTypes.some((type) => type === v.type))) {
      setValidationForChildren(id, validationTypes, certificate)
    }
  }
}

const setValidationForChildren = (parent: string, validationTypes: string[], certificate: Certificate) => {
  for (const id in certificate.data) {
    if (certificate.data[id].parent === parent) {
      certificate.data[parent].validation.forEach((v) => {
        if (validationTypes.some((type) => type === v.type)) {
          certificate.data[id].validation.push(v)
          setValidationForChildren(id, validationTypes, certificate)
        }
      })
    }
  }
}

app.get('/moduleapi/intyg/:type/:id/pdf', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} GET /moduleapi/intyg/${req.params.type}/${req.params.id}/pdf`)
  if (certificateRepository[req.params.id]) {
    const file = fs.createReadStream('./src/bootstrap/af_medicinskt_utlatande_20_09_29_1411.pdf')
    const stat = fs.statSync('./src/bootstrap/af_medicinskt_utlatande_20_09_29_1411.pdf')
    res.setHeader('Content-Length', stat.size)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=af_medicinskt_utlatande_20_09_29_1411.pdf')
    file.pipe(res)
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.delete('/api/certificate/:id/:version', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} DELETE /api/certificate/${req.params.id}/${req.params.version}`)
  if (certificateRepository[req.params.id]) {
    const certificate = certificateRepository[req.params.id]
    delete certificateRepository[req.params.id]

    if (certificate.metadata.relations.parent) {
      const parentCertificateId = certificate.metadata.relations.parent.certificateId

      const parentCertificate = certificateRepository[parentCertificateId]
      parentCertificate.metadata.relations.children = []

      const parentCertificateEvents = certificateEventRepository[parentCertificateId]
      const index = parentCertificateEvents.findIndex((event) => event.type === CertificateEventType.REPLACED)
      parentCertificateEvents.splice(index, 1)
    }

    certificateEventRepository[certificate.metadata.id].push(createEvent(certificate.metadata.id, CertificateEventType.DELETED, null, null))

    res.status(200).send()
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/api/certificate/:id/:version/forward', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/${req.params.version}/forward`)
  if (certificateRepository[req.params.id]) {
    const certificate = certificateRepository[req.params.id]

    certificate.metadata.forwarded = req.body.forward

    res.json(createResponse(certificate)).send()
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.put('/api/certificate/:id', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} PUT /api/certificate/${req.params.id}`)
  if (certificateRepository[req.params.id]) {
    certificateRepository[req.params.id] = req.body
    certificateRepository[req.params.id].metadata.version += 1
    res.json({ version: certificateRepository[req.params.id].metadata.version })
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/fake', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /fake user: ${req.body.userJsonDisplay}`)
  loggedInUser = JSON.parse(req.body.userJsonDisplay)
  res.status(200).send()
})

app.post('/api/certificate/:id/sign', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/sign`)
  if (certificateRepository[req.params.id]) {
    const certificate = certificateRepository[req.params.id]
    certificate.metadata.status = CertificateStatus.SIGNED

    for (const questionId in certificate.data) {
      certificate.data[questionId].readOnly = true
      certificate.data[questionId].visible = true
    }

    if (certificate.metadata.relations.parent) {
      const parentCertificateId = certificate.metadata.relations.parent.certificateId

      const parentCertificate = certificateRepository[parentCertificateId]
      parentCertificate.metadata.relations.children[0].status = certificate.metadata.status

      const parentCertificateEvents = certificateEventRepository[parentCertificateId]
      parentCertificateEvents.forEach((event) => {
        if (event.type === CertificateEventType.REPLACED) {
          event.relatedCertificateStatus = certificate.metadata.status
        }
      })
    }

    certificateEventRepository[certificate.metadata.id].push(
      createEvent(certificate.metadata.id, CertificateEventType.SIGNED, null, null),
      createEvent(certificate.metadata.id, CertificateEventType.AVAILABLE_FOR_PATIENT, null, null)
    )

    if (certificate.metadata.type === 'af00213') {
      certificateEventRepository[certificate.metadata.id].push(createEvent(certificate.metadata.id, CertificateEventType.SENT, null, null))
    }

    res.json(createResponse(certificate))
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/api/certificate/:id/:type/send', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/${req.params.type}/send`)
  const certificate = certificateRepository[req.params.id]
  certificateEventRepository[certificate.metadata.id].push(createEvent(certificate.metadata.id, CertificateEventType.SENT, null, null))
  res
    .json({ id: req.params.id })
    .status(200)
    .send()
})

app.post('/api/certificate/:id/revoke', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/revoke`)
  if (certificateRepository[req.params.id]) {
    const certificate = certificateRepository[req.params.id]

    certificate.metadata.status =
      certificate.metadata.status === CertificateStatus.LOCKED ? CertificateStatus.LOCKED_REVOKED : CertificateStatus.REVOKED

    if (certificate.metadata.relations.parent) {
      const parentCertificateId = certificate.metadata.relations.parent.certificateId

      const parentCertificate = certificateRepository[parentCertificateId]
      parentCertificate.metadata.relations.children[0].status = certificate.metadata.status

      const parentCertificateEvents = certificateEventRepository[parentCertificateId]
      parentCertificateEvents.forEach((event) => {
        if (event.type === CertificateEventType.REPLACED) {
          event.relatedCertificateStatus = certificate.metadata.status
        }
      })
    }

    if (certificate.metadata.relations.children && certificate.metadata.relations.children.length > 0) {
      const childCertificateId = certificate.metadata.relations.children[0].certificateId

      const childCertificate = certificateRepository[childCertificateId]
      if (childCertificate.metadata.relations.parent) {
        childCertificate.metadata.relations.parent.status = certificate.metadata.status
      }

      const childCertificateEvents = certificateEventRepository[childCertificateId]
      childCertificateEvents.forEach((event) => {
        if (event.type === CertificateEventType.REPLACES) {
          event.relatedCertificateStatus = certificate.metadata.status
        }
      })
    }

    certificateEventRepository[certificate.metadata.id].push(createEvent(certificate.metadata.id, CertificateEventType.REVOKED, null, null))

    res.json(createResponse(certificate)).send()
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/api/certificate/:id/replace', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/replace`)
  if (certificateRepository[req.params.id]) {
    const originalCertificate = certificateRepository[req.params.id]

    const certificateClone = createCopy(originalCertificate, false)

    const childRelation: CertificateRelation = {
      certificateId: certificateClone.metadata.id,
      type: CertificateRelationType.REPLACE,
      status: certificateClone.metadata.status,
      created: new Date().toLocaleString(),
    }

    if (originalCertificate.metadata.relations) {
      originalCertificate.metadata.relations = {
        parent: null,
        children: [],
      }
    }

    originalCertificate.metadata.relations.children.push(childRelation)

    const parentRelation: CertificateRelation = {
      certificateId: originalCertificate.metadata.id,
      type: CertificateRelationType.REPLACE,
      status: originalCertificate.metadata.status,
      created: new Date().toLocaleString(),
    }

    certificateClone.metadata.relations = {
      parent: parentRelation,
      children: [],
    }

    const certificateEvent = createEvent(
      certificateClone.metadata.id,
      CertificateEventType.REPLACES,
      originalCertificate.metadata.id,
      originalCertificate.metadata.status
    )

    certificateEventRepository[certificateClone.metadata.id] = Array.of(certificateEvent)

    certificateEventRepository[originalCertificate.metadata.id].push(
      createEvent(
        originalCertificate.metadata.id,
        CertificateEventType.REPLACED,
        certificateClone.metadata.id,
        certificateClone.metadata.status
      )
    )

    certificateRepository[certificateClone.metadata.id] = certificateClone
    res.json({ certificateId: certificateClone.metadata.id }).send()
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/api/certificate/:id/renew', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/renew`)
  if (certificateRepository[req.params.id]) {
    const originalCertificate = certificateRepository[req.params.id]

    const certificateClone = createCopy(originalCertificate, true)

    const childRelation: CertificateRelation = {
      certificateId: certificateClone.metadata.id,
      type: CertificateRelationType.RENEW,
      status: certificateClone.metadata.status,
      created: new Date().toLocaleString(),
    }

    if (originalCertificate.metadata.relations) {
      originalCertificate.metadata.relations = {
        parent: null,
        children: [],
      }
    }

    originalCertificate.metadata.relations.children.push(childRelation)

    const parentRelation: CertificateRelation = {
      certificateId: originalCertificate.metadata.id,
      type: CertificateRelationType.RENEW,
      status: originalCertificate.metadata.status,
      created: new Date().toLocaleString(),
    }

    certificateClone.metadata.relations = {
      parent: parentRelation,
      children: [],
    }

    const certificateEvent = createEvent(
      certificateClone.metadata.id,
      CertificateEventType.RENEWAL_OF,
      originalCertificate.metadata.id,
      originalCertificate.metadata.status
    )

    certificateEventRepository[certificateClone.metadata.id] = Array.of(certificateEvent)

    certificateRepository[certificateClone.metadata.id] = certificateClone
    res.json({ certificateId: certificateClone.metadata.id }).send()
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/api/certificate/:id/copy', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/copy`)
  if (certificateRepository[req.params.id]) {
    const originalCertificate = certificateRepository[req.params.id]

    const certificateClone = createCopy(originalCertificate, false)

    const childRelation: CertificateRelation = {
      certificateId: certificateClone.metadata.id,
      type: CertificateRelationType.COPIED,
      status: certificateClone.metadata.status,
      created: new Date().toLocaleString(),
    }

    if (originalCertificate.metadata.relations) {
      originalCertificate.metadata.relations = {
        parent: null,
        children: [],
      }
    }

    originalCertificate.metadata.relations.children.push(childRelation)

    const parentRelation: CertificateRelation = {
      certificateId: originalCertificate.metadata.id,
      type: CertificateRelationType.COPIED,
      status: originalCertificate.metadata.status,
      created: new Date().toLocaleString(),
    }

    certificateClone.metadata.relations = {
      parent: parentRelation,
      children: [],
    }

    const certificateEvent = createEvent(
      certificateClone.metadata.id,
      CertificateEventType.COPIED_FROM,
      originalCertificate.metadata.id,
      originalCertificate.metadata.status
    )

    certificateEventRepository[certificateClone.metadata.id] = Array.of(certificateEvent)

    certificateEventRepository[originalCertificate.metadata.id].push(
      createEvent(
        originalCertificate.metadata.id,
        CertificateEventType.COPIED_BY,
        certificateClone.metadata.id,
        certificateClone.metadata.status
      )
    )

    certificateRepository[certificateClone.metadata.id] = certificateClone
    res.json({ certificateId: certificateClone.metadata.id }).send()
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/api/certificate/:id/validate', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/validate`)
  const validationErrors = validate(req.body as Certificate)
  res.json({ validationErrors }).send()
})

app.post('/api/certificate/:id/lock', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/lock`)
  if (certificateRepository[req.params.id]) {
    certificateRepository[req.params.id].metadata.status = CertificateStatus.LOCKED
    certificateEventRepository[req.params.id].push(createEvent(req.params.id, CertificateEventType.LOCKED, null, null))
    res.status(200).send()
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.get('/api/certificate/:id/events', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} GET /api/certificate/${req.params.id}/events`)
  if (certificateRepository[req.params.id]) {
    const response = {
      certificateEvents: certificateEventRepository[req.params.id],
    }
    res.json(response).send()
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.get('/api/user', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} GET /api/user`)
  if (loggedInUser) {
    const userData: User | undefined = bootstrapUsers.find((user) => user.hsaId === loggedInUser!.hsaId)
    if (userData) {
      res.json(userData).send()
    } else {
      res.status(404).send(`User with ${loggedInUser.hsaId} doesn't exist`)
    }
  } else {
    res.status(404).send(`No user is logged in`)
  }
})

app.get('/api/fmb/:code', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} GET /api/fmb/${req.params.code}`)
  if (req.params.code === 'F500') {
    res
      .json({
        icd10Code: 'F500',
        icd10Description: 'Anorexia nervosa',
        diagnosTitle: 'Anorexia nervosa',
        relatedDiagnoses: 'F500, F501',
        referenceDescription: 'Information om Anorexia nervosa hos Socialstyrelsen',
        referenceLink: 'https://roi.socialstyrelsen.se/fmb/anorexia-nervosa/549',
        forms: [
          {
            name: 'DIAGNOS',
            content: [
              {
                heading: 'GENERELL_INFO',
                text:
                  '<p>Det finns en spännvidd för hur en given sjukdom påverkar olika individers arbetsförmåga och förmåga att utföra olika aktiviteter. Därför måste bedömningen av arbetsförmågan ske individuellt utifrån individens unika förutsättningar och sysselsättning.</p>\n<p>Vid anorexia nervosa saknas inte sällan sjukdomsinsikt. Patienten kan uttrycka önskemål om fortsatt arbete, trots betydande medicinska risker. Samsjuklighet med depression, ångest, tvångstankar, missbruk, personlighetsstörningar och neuropsykiatriska tillstånd är stor. Sjukskrivning i före-byggande syfte kan behövas när patienten genomgår medicinsk behandling som kräver daglig närvaro t.ex. dagvårdsbehandling.\nBarn med anorexia nervosa som inte kan gå i skolan kan periodvis behöva stöd av att en vuxen finns hemma.</p>\n',
              },
              {
                heading: 'SYMPTOM_PROGNOS_BEHANDLING',
                text:
                  '<p>Anorexia nervosa (med varianter) är viljestyrd viktnedgång som vidmakthålls av en upplevelse av att vara för tjock (även vid utpräglad undervikt) och en rädsla för att gå upp i vikt. Tillståndet debuterar oftast i tonåren och är vanligast hos flickor och unga kvinnor (cirka tio procent är pojkar eller unga män). Ofta undviker patienten all form av fett. I sällsynta fall förekommer total matvägran. Intensiv motion, dagliga kräkningar och laxermedelsmissbruk är vanliga.\nAnorexia nervosa innebär betydande medicinska risker vid allvarlig svält framför allt i kombination med frekventa kräkningar. Allvarliga tillstånd på-verkar kroppens alla organ, särskilt hjärtat och cirkulationen, och kan vara livshotande. Överdödligheten är sex till nio gånger högre jämfört med nor-malbefolkningen i samma åldersgrupp. Tillståndet kan också övergå till andra former av ätstörningar.\nTidig upptäckt och snabbt insatt behandling är den viktigaste åtgärden för god prognos. Behandlingen är en kombination av nutritionsbehandling och psykopedagogiska eller psykoterapeutiska insatser. Behandlingen fokuserar på att patienten snabbt ska komma ur sin ätstörning, så att patienten inte blir långvarigt sjuk eller går ner mer i vikt. Medicinska kontroller av det kroppsliga hälsotillståndet är centralt eftersom patienten snabbt kan försämras. Samsjuklighet ska behandlas samtidigt med ätstörningen och kan kräva farmakologisk behandling.Anorexia nervosa kan vara långdraget och pågå med olika intensitet under fem till femton år. Hos vissa unga patienter som kommer till snabb behandling kan dock tillfrisknandet gå betydligt fortare, ett halvt till ett år. För de flesta patienter skiftar svårighetsgraden och symtomen under årens lopp.</p>\n',
              },
            ],
          },
          {
            name: 'AKTIVITETSBEGRANSNING',
            content: [
              {
                heading: 'AKTIVITETSBEGRANSNING',
                text:
                  'Patienten har ofta en önskan att ha en högre aktivitetsgrad än vad läkaren tycker. Tillståndet påverkar förmågan att ta hand om sig själv och den sociala interaktionen med andra människor.',
              },
            ],
          },
          {
            name: 'INFORMATIONOMREHABILITERING',
            content: [
              {
                heading: 'INFORMATIONOMREHABILITERING',
                text:
                  '<p>Det är bra om arbetsuppgifterna kan anpassas till fysiskt lättare arbete och med möjlighet att upprätthålla regelbundna matrutiner (frukost, lunch och middag).</p>\n',
              },
            ],
          },
          {
            name: 'FUNKTIONSNEDSATTNING',
            content: [
              {
                heading: 'FUNKTIONSNEDSATTNING',
                text:
                  'Anorexia nervosa kan ge betydande kroppsliga funktionsnedsättningar, exempelvis problem med smärtor, ledbesvär, andfåddhet, trötthet och psykiska funktionsnedsättningar, exempelvis koncentrationssvårigheter, ångest, upptagenhet av mat (ej fokus på något annat).',
              },
            ],
          },
          {
            name: 'ARBETSFORMAGA',
            content: [
              {
                heading: 'BESLUTSUNDERLAG_TEXTUELLT',
                list: [
                  'Vid lindrig anorexia nervosa bör sjukskrivning undvikas.',
                  'Vid medelsvår anorexia nervosa kan hel sjukskrivning, alternativt partiell sjukskrivning, upp till 6 månader behövas.',
                  'Vid svår anorexia nervosa kan hel sjukskrivning, alternativt partiell sjukskrivning, upp till 12 månader behövas.',
                  'Vid långvarig utpräglad undervikt och samsjuklighet kan arbetsförmågan bli permanent nedsatt',
                ],
              },
            ],
          },
        ],
      })
      .status(200)
      .send()
  } else if (req.params.code === 'J20') {
    res
      .json({
        icd10Code: 'J20',
        icd10Description: 'Akut bronkit',
        diagnosTitle: 'Akut bronkit',
        relatedDiagnoses: 'J20',
        referenceDescription: 'Information om Akut bronkit hos Socialstyrelsen',
        referenceLink: 'https://roi.socialstyrelsen.se/fmb/akut-bronkit/1',
        forms: [
          {
            name: 'DIAGNOS',
            content: [
              {
                heading: 'GENERELL_INFO',
                text:
                  '<p>Det finns en spännvidd för hur en given sjukdom påverkar olika individers arbetsförmåga och förmåga att utföra olika aktiviteter. Därför måste bedömningen av arbetsförmågan ske individuellt utifrån individens unika förutsättningar och sysselsättning.</p>\n<p>Akut bronkit nedsätter normalt inte arbetsförmågan. Om patienten har långvarig svår hosta kan det påverka allmäntillståndet genom att patienten blir trött. Sjukskrivning enbart i undantagsfall vid tydligt nedsatt allmäntillstånd i upp till 2 veckor. Röstkrävande yrken kan behöva längre sjukskrivning.</p>\n<p>Hos patienter med samtidig annan luftvägs- eller lungsjukdom som exempelvis astma eller kol kan symtomen vid akut bronkit bli mer uttalade och funktionsnedsättningen bli mer långdragen. Bakteriell sekundärinfektion kan påverka allmäntillståndet.</p>\n<p>Överväg miljöfaktorer som orsak till återkommande eller ihållande besvär om fördjupad utredning har fallit ut negativt. Uppmärksamma malignitetsrisken framför allt hos rökare och uppmana till rökstopp.</p>\n',
              },
              {
                heading: 'SYMPTOM_PROGNOS_BEHANDLING',
                text:
                  '<p>Akut bronkit orsakas vanligen av luftvägsinflammation och epitelskada (skador på hud och slemhinnor i kroppen) efter vanlig virusförkylning. Akut bronkit kan ge hosta under flera månader och är ofta tecken på inflammation i bronkerna. Symtom är akut påkommande torr eller slemmig hosta. Tillståndet är vanligtvis kortvarigt och varar några dagar till några veckor. Ibland får patienten hosta under flera månader vilket är ett uttryck för en sekundärinfektion. Återkommande akuta bronkiter hos rökare bör medföra rökstopp. Bihåleinflammationer efter viroser kan ligga bakom återkommande akuta bronkiter. Långvarig bronkit kan bero på twar eller infektion med mykoplasma pneumoni.</p>\n<p>Utred långvariga besvär med lungröntgen och eventuell röntgen av bi-hålorna. Förtydliga anamnesen samt utför spirometri eller PEF-mätningar. Överväg specialistremiss för eventuell bronkoskopi.</p>\n',
              },
            ],
          },
          {
            name: 'AKTIVITETSBEGRANSNING',
            content: [
              {
                heading: 'AKTIVITETSBEGRANSNING',
                text:
                  'Vid Akut bronkit är förmågan till fysisk aktivitet nedsatt under en kortare tid. Det kan innebära svårigheter att gå och att röra sig omkring på olika sätt (exempelvis att krypa, klättra, springa eller hoppa). Tillståndet kan medföra svårigheter att genomföra daglig rutin och hushållsarbete.',
              },
            ],
          },
          {
            name: 'INFORMATIONOMREHABILITERING',
            content: [
              {
                heading: 'INFORMATIONOMREHABILITERING',
                text:
                  '<p>Fysisk aktivitet/information att ge till patienten?\nFysisk aktivitet i sig förvärrar inte sjukdomen. Lagom anpassad fysisk aktivitet bör rekommenderas.\n(tydligare rek)\nArbetsrelaterade åtgärder\nDet kan vara aktuellt med t.ex. ergonomiska förbättringsåtgärder, anpassade arbetsuppgifter eller omplacering. Diskutera åtgärder vid sjuskrivning mer än tre månader alt. vid fysiskt krävande arbete. Om det inte går att anpassa arbetsuppgifterna bör byte av arbete övervägas tidigt av patienten. Mycket tungt arbete bör undvikas.\nEtt lagom rörligt arbete med möjlighet att ofta ändra arbetsställning är idealt.\nSamverkan med andra\nFöretagshälsovården och/eller arbetsgivaren och Försäkringskassan bör kopplas in tidigt.</p>\n',
              },
            ],
          },
          {
            name: 'FUNKTIONSNEDSATTNING',
            content: [
              {
                heading: 'FUNKTIONSNEDSATTNING',
                text:
                  'Akut bronkit kan medföra feber, trötthet och nedsatt\nfysisk uthållighet.\nTillståndet påverkar\nandningsfunktionerna och patienten kan\nfå problem att andas och att hosta upp slem. Problemen\nmed andningen\nkan även medföra\npåverkan på hjärt-kärlfunktioner och patienten kan uppleva\nen känsla av tryck över bröstet, att\nhjärtat slår oregelbundet\neller känslan av\natt hålla på att kvävas.',
              },
            ],
          },
          {
            name: 'ARBETSFORMAGA',
            content: [
              {
                heading: 'BESLUTSUNDERLAG_TEXTUELLT',
                list: [
                  'Vid medelsvår akut bronkit rekommenderas ingen sjukskrivningstid.',
                  'Vid svår akut bronkit med kvarstående hosta rekommenderas sjukskrivning på heltid upp till 2 veckor.',
                  'Vid akut bronkit med samsjuklighet kroniskt obstruktiv lungsjukdom (KOL) eller astma kan det finnas behov av längre sjukskrivning.',
                  'Vid akut bronkit där arbetsbelastningen innefattar röstkrävande yrke rekommenderas sjukskrivning på heltid. Kan ge ett behov av längre sjukskrivning',
                ],
              },
            ],
          },
        ],
      })
      .status(200)
      .send()
  }
})

app.put('/api/anvandare/preferences', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send()
})

app.get('/config/links', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} GET /config/links'`)
  res
    .json({
      fmbSoc: {
        key: 'fmbSoc',
        url: 'https://roi.socialstyrelsen.se/fmb',
        text: 'Läs mer om FMB hos Socialstyrelsen',
        target: '_blank',
        tooltip: 'Öppnar Socialstyrelsens beslutstöd för angiven huvuddiagnos',
      },
      transportstyrelsen: {
        key: 'transportstyrelsen',
        url: 'https://www.transportstyrelsen.se',
        text: 'www.transportstyrelsen.se',
        target: '_blank',
      },
      ineraIntygsskola: {
        key: 'ineraIntygsskola',
        url: 'https://www.inera.se/intygsskolan/webcert',
        text: 'Hitta svar på dina frågor i Ineras intygsskola',
        target: '_blank',
      },
    })
    .status(200)
    .send()
})

app.post('/moduleapi/diagnos/kod/sok', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /moduleapi/diagnos/kod/sok`)
  res
    .json({
      resultat: 'OK',
      diagnoser: diagnoses.filter((d) => d.kod.includes(req.body.fragment)),
      moreResults: false,
    })
    .status(200)
    .send()
})

app.post('/moduleapi/diagnos/beskrivning/sok', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /moduleapi/diagnos/beskrivning/sok`)
  res
    .json({
      resultat: 'OK',
      diagnoser: diagnoses.filter((d) => d.beskrivning.toLowerCase().includes(req.body.fragment.toLowerCase())),
      moreResults: false,
    })
    .status(200)
    .send()
})

app.listen(9088, () => console.log('Server running'))

function createResponse(certificate: Certificate): Certificate {
  const certificateClone = _.cloneDeep(certificate)

  certificateClone.links = []

  console.log(loggedInUser)

  const userData: User | undefined = bootstrapUsers.find((user) => user.hsaId === loggedInUser!.hsaId)

  switch (certificateClone.metadata.status) {
    case CertificateStatus.UNSIGNED:
      certificateClone.links.push({
        type: ResourceLinkType.EDIT_CERTIFICATE,
        name: 'Ändra',
        description: 'Ändrar intygsutkastet',
        enabled: true,
      })
      certificateClone.links.push({
        type: ResourceLinkType.PRINT_CERTIFICATE,
        name: 'Skriv ut',
        description: 'Laddar ned intygsutkastet för utskrift.',
        enabled: true,
      })
      certificateClone.links.push({
        type: ResourceLinkType.REMOVE_CERTIFICATE,
        name: 'Radera',
        description: 'Raderar intygsutkastet.',
        enabled: true,
      })
      certificateClone.links.push({
        type: ResourceLinkType.FORWARD_CERTIFICATE,
        name: 'Vidarebefordra utkast',
        description: 'Skapar ett e-postmeddelande i din e-postklient med en direktlänk till utkastet.',
        enabled: true,
      })
      if (userData!.role === 'Läkare') {
        certificateClone.links.push({
          type: ResourceLinkType.SIGN_CERTIFICATE,
          name: 'Signera',
          description: 'Signerar intygsutkastet',
          enabled: true,
        })
      }
      if (certificate.metadata.type === 'lisjp') {
        certificateClone.links.push({
          type: ResourceLinkType.FMB,
          name: 'FMB',
          description: 'Läs FMB - ett stöd för ifyllnad och bedömning.',
          enabled: true,
        })
      }
      break
    case CertificateStatus.SIGNED:
      certificateClone.links.push({
        type: ResourceLinkType.CHOOSE_RECEIVERS,
        receivers: ['Försäkringskassan', 'Försäkringsbolaget'],
        name: 'Välj intygsmottagare',
        description: `Öppnar ett fönster där du kan välja vilka intygsmottagare intyget får skickas till.`,
        enabled: true,
      } as ResourceLinkChooseReceivers)
      certificateClone.links.push({
        type: ResourceLinkType.SEND_CERTIFICATE,
        name: 'Skicka',
        description: `Öppnar ett fönster där du kan välja att skicka intyget till Försäkringskassan`,
        modalBody:
          '<p>Om du går vidare kommer intyget skickas direkt till Försäkringskassans system vilket ska göras i samråd med patienten.</p>' +
          '<p>Upplys patienten om att även göra en ansökan om sjukpenning hos Försäkringskassan.</p>',
        receiver: 'Försäkringskassan',
        enabled: true,
      } as ResourceLinkSend)
      certificateClone.links.push({
        type: ResourceLinkType.PRINT_CERTIFICATE,
        name: 'Skriv ut',
        description: 'Laddar ned intyget för utskrift.',
        enabled: true,
      })
      if (userData!.role === 'Läkare') {
        certificateClone.links.push({
          type: ResourceLinkType.REVOKE_CERTIFICATE,
          name: 'Makulera',
          description: 'Makulerar intyget.',
          enabled: true,
        })
        certificateClone.links.push({
          type: ResourceLinkType.REPLACE_CERTIFICATE,
          name: 'Ersätt',
          description: 'Ersätter intyget',
          enabled: true,
        })
        if (certificate.metadata.type === 'lisjp') {
          certificateClone.links.push({
            type: ResourceLinkType.RENEW_CERTIFICATE,
            name: 'Förnya',
            description: 'Skapar en redigerbar kopia av intyget på den enheten du är inloggad på.',
            body:
              'Förnya intyg kan användas vid förlängning av en sjukskrivning. När ett intyg förnyas skapas ett nytt intygsutkast med viss information från det ursprungliga intyget.<br><br>' +
              'Uppgifterna i det nya intygsutkastet går att ändra innan det signeras.<br><br>' +
              'De uppgifter som inte kommer med till det nya utkastet är:<br><br>' +
              '<ul>' +
              '<li>Sjukskrivningsperiod och grad.</li>' +
              '<li>Valet om man vill ha kontakt med Försäkringskassan.</li>' +
              '<li>Referenser som intyget baseras på.</li>' +
              '</ul>' +
              '<br>Eventuell kompletteringsbegäran kommer att klarmarkeras.<br><br>' +
              'Det nya utkastet skapas på den enhet du är inloggad på.',
            enabled: true,
          })
        }
      }
      break
    case CertificateStatus.LOCKED:
      certificateClone.links.push({
        type: ResourceLinkType.PRINT_CERTIFICATE,
        name: 'Skriv ut',
        description: 'Laddar ned intygsutkastet för utskrift.',
        enabled: true,
      })
      certificateClone.links.push({
        type: ResourceLinkType.COPY_CERTIFICATE,
        name: 'Kopiera',
        description: 'Skapar en redigerbar kopia av utkastet på den enheten du är inloggad på.',
        enabled: true,
      })
      if (userData!.role === 'Läkare') {
        certificateClone.links.push({
          type: ResourceLinkType.REVOKE_CERTIFICATE,
          name: 'Makulera',
          description: 'Öppnar ett fönster där du kan välja att makulera det låsta utkastet.',
          enabled: true,
        })
      }
      break
    case CertificateStatus.REVOKED:
    case CertificateStatus.LOCKED_REVOKED:
    default:
  }

  return certificateClone
}

function isParentVisible(certificate: Certificate, id: string) {
  if (certificate.data[id].parent) {
    return certificate.data[certificate.data[id].parent].visible
  } else return true
}

function handleSmittbararpenning(certificateClone: Certificate) {
  const hasSmittbararpenning = certificateClone.data['27'].value as ValueBoolean
  for (const questionId in certificateClone.data) {
    if (
      certificateClone.data[questionId].validation &&
      certificateClone.data[questionId].validation.some((v) => v.type === CertificateDataValidationType.HIDE_VALIDATION)
    ) {
      certificateClone.data[questionId].visible = !hasSmittbararpenning.selected
      if (hasSmittbararpenning.selected) {
        switch (certificateClone.data[questionId].value?.type) {
          case CertificateDataValueType.BOOLEAN:
            ;(certificateClone.data[questionId].value as ValueBoolean).selected = null
            break
          case CertificateDataValueType.TEXT:
            ;(certificateClone.data[questionId].value as ValueText).text = ''
            break
          case CertificateDataValueType.CODE:
            ;(certificateClone.data[questionId].value as ValueCode).code = ''
            ;(certificateClone.data[questionId].value as ValueCode).id = ''
            break
          case CertificateDataValueType.CODE_LIST:
            ;(certificateClone.data[questionId].value as ValueCodeList).list = []
            break
        }
      }
    }
  }
}

function createCopy(sourceCertificate: Certificate, isRenewal: boolean): Certificate {
  const certificateClone = _.cloneDeep(sourceCertificate)
  certificateClone.metadata.id = uuidv4()
  certificateClone.metadata.status = CertificateStatus.UNSIGNED

  if (sourceCertificate.metadata.type === 'lisjp') {
    handleSmittbararpenning(certificateClone)
    if (isRenewal) {
      ;(certificateClone.data['1'].value as ValueDateList).list = []
      ;(certificateClone.data['1.1'].value as ValueText).text = ''
      ;(certificateClone.data['1.2'].value as ValueText).text = ''
      ;(certificateClone.data['26'].value as ValueBoolean).selected = null
      ;(certificateClone.data['26.2'].value as ValueBoolean).selected = null
      certificateClone.data['26.2'].visible = false
      ;(certificateClone.data['32'].value as ValueDateRangeList).list = []
      ;(certificateClone.data['32.1'].value as ValueText).text = ''
      ;(certificateClone.data['33'].value as ValueBoolean).selected = null
      ;(certificateClone.data['33.2'].value as ValueText).text = ''
    }

    const hasContactWithFK = certificateClone.data['26'].value as ValueBoolean
    certificateClone.data['26.2'].visible =
      hasContactWithFK.selected && isParentVisible(certificateClone, '26.2') ? hasContactWithFK.selected : false
    const hasAtgarder = certificateClone.data['40'].value as ValueCodeList
    certificateClone.data['44'].visible = hasAtgarder.list.length > 0 && isParentVisible(certificateClone, '44')
    certificateClone.data['32.1'].visible =
      (certificateClone.data['32'].value as ValueDateRangeList).list.some(
        (date) => (new Date().getTime() - new Date(date.from).getTime()) / (1000 * 60 * 60 * 24) < -7
      ) && isParentVisible(certificateClone, '32')
    certificateClone.data['33'].visible =
      !(certificateClone.data['32'].value as ValueDateRangeList).list.some((date) => date.id === 'HELT_NEDSATT') &&
      (certificateClone.data['32'].value as ValueDateRangeList).list.length > 0 &&
      !(certificateClone.data['27'].value as ValueBoolean).selected
    isParentVisible(certificateClone, '33')
    const hasBedomning = certificateClone.data['33'].value as ValueBoolean
    certificateClone.data['33.2'].visible = hasBedomning.selected === true && isParentVisible(certificateClone, '33.2')
    certificateClone.data['29'].visible =
      (certificateClone.data['28'].value as ValueCodeList).list.some((date) => date.id === 'NUVARANDE_ARBETE') &&
      isParentVisible(certificateClone, '29')
    certificateClone.data['1.2'].visible =
      (certificateClone.data['1'].value as ValueDateList).list.some((date) => date.id === 'annatGrundForMU') &&
      isParentVisible(certificateClone, '1.2')
    certificateClone.data['1.1'].visible =
      !(certificateClone.data['1'].value as ValueDateList).list.some((date) => date.id === 'undersokningAvPatienten') &&
      (certificateClone.data['1'].value as ValueDateList).list.length > 0 &&
      isParentVisible(certificateClone, '1.1')
  } else {
    const harFunktionsnedsattning = certificateClone.data['1.1'].value as ValueBoolean
    certificateClone.data['1.2'].visible = harFunktionsnedsattning.selected ? harFunktionsnedsattning.selected : false
    certificateClone.data['aktivitetsbegransning'].visible = harFunktionsnedsattning.selected ? harFunktionsnedsattning.selected : false
    certificateClone.data['2.1'].visible = harFunktionsnedsattning.selected ? harFunktionsnedsattning.selected : false
    const harAktivitetsbegransning = certificateClone.data['2.1'].value as ValueBoolean
    certificateClone.data['2.2'].visible = harAktivitetsbegransning.selected ? harAktivitetsbegransning.selected : false
    const harUtredningBehandling = certificateClone.data['3.1'].value as ValueBoolean
    certificateClone.data['3.2'].visible = harUtredningBehandling.selected ? harUtredningBehandling.selected : false
    const harArbetspaverkan = certificateClone.data['4.1'].value as ValueBoolean
    certificateClone.data['4.2'].visible = harArbetspaverkan.selected ? harArbetspaverkan.selected : false
  }

  for (const questionId in certificateClone.data) {
    certificateClone.data[questionId].readOnly = false
  }

  return certificateClone
}

function validate(certificate: Certificate): ValidationError[] {
  const validationError: ValidationError[] = []
  let category = ''
  for (const questionId in certificate.data) {
    const dataProp = certificate.data[questionId].config.propName
    const question = certificate.data[questionId]
    category = question.config.type === 'CATEGORY' ? questionId : category
    if (question.visible && !question.disabled && question.mandatory) {
      switch (question.value?.type) {
        case CertificateDataValueType.BOOLEAN:
          const booleanValue: ValueBoolean = question.value as ValueBoolean
          if (booleanValue.selected === undefined || booleanValue.selected === null) {
            validationError.push({
              id: questionId,
              category: getCategory(certificate, question.parent),
              field: dataProp as string,
              type: 'EMPTY',
              text: 'Välj ett alternativ.',
            })
          }
          break
        case CertificateDataValueType.TEXT:
          const textValue: ValueText = question.value as ValueText
          if (!textValue.text) {
            validationError.push({
              id: questionId,
              category: getCategory(certificate, question.parent),
              field: dataProp as string,
              type: 'EMPTY',
              text: 'Ange ett svar.',
            })
          }
          break
        case CertificateDataValueType.CODE:
          const codeValue = question.value as ValueCode
          if (codeValue.id === undefined || codeValue.id === null) {
            validationError.push({
              id: questionId,
              category: getCategory(certificate, question.parent),
              field: dataProp as string,
              type: 'EMPTY',
              text: 'Välj ett alternativ.',
            })
          }
          break
        case CertificateDataValueType.CODE_LIST:
          const codeListValue = question.value as ValueCode
          if ((codeListValue.list as ValueCode[]).length === 0) {
            validationError.push({
              id: questionId,
              category: getCategory(certificate, question.parent),
              field: dataProp as string,
              type: 'EMPTY',
              text: 'Välj minst ett alternativ.',
            })
          }
          break
        case CertificateDataValueType.DIAGNOSIS_LIST:
          const diagnosisListValue = question.value as ValueDiagnosisList
          if ((diagnosisListValue.list as ValueDiagnosis[]).length === 0) {
            validationError.push({
              id: questionId,
              category: getCategory(certificate, question.parent),
              field: dataProp as string,
              type: 'EMPTY',
              text: 'Välj minst en diagnos.',
            })
          }
          break
        case CertificateDataValueType.DATE_LIST:
          const dateListValue = question.value as ValueDateList
          if ((dateListValue.list as ValueDate[]).length === 0) {
            validationError.push({
              id: questionId,
              category: getCategory(certificate, question.parent),
              field: dataProp as string,
              type: 'EMPTY',
              text: 'Välj minst ett alternativ.',
            })
          }
          break
        default:
          break
      }
    }
  }
  return validationError
}

function getCategory(certificate: Certificate, parent: string): string {
  if (parent) {
    const newParent = certificate.data[parent].parent
    if (newParent) {
      return getCategory(certificate, newParent)
    }
  }
  return parent
}

// https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
