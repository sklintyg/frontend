import express, { Application, NextFunction, Request, Response } from 'express'
import bootstrapCertificate from './bootstrap/bed26d3e-7112-4f08-98bf-01be40e26c80.json'
import bootstrapUsers from './bootstrap/users.json'
import {
  Certificate,
  CertificateBooleanValue,
  CertificateStatus,
  CertificateTextValue,
  ValidationError,
  CertificateEventType,
  CertificateRelation,
  CertificateRelationType,
  FakeLogin,
  User,
} from '@frontend/common'
import bodyParser from 'body-parser'
import * as fs from 'fs'
import _ from 'lodash'
import { createEvent } from './util'
import { ResourceLinkType } from '@frontend/common/src/types/resourceLink'

const app: Application = express()

const certificateRepository = {
  [bootstrapCertificate.metadata.certificateId]: (_.cloneDeep(bootstrapCertificate) as unknown) as Certificate,
}

const certificateEventRepository = {
  [bootstrapCertificate.metadata.certificateId]: Array.of(
    createEvent(bootstrapCertificate.metadata.certificateId, CertificateEventType.CREATED, null, null)
  ),
}

let loggedInUser: FakeLogin | null = null

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
    res.json(createResponse(certificateRepository[req.params.id]))
  } else if (req.params.id) {
    const certificateClone = (_.cloneDeep(bootstrapCertificate) as unknown) as Certificate
    certificateClone.metadata.certificateId = req.params.id
    certificateRepository[req.params.id] = certificateClone

    const certificateEvent = createEvent(certificateClone.metadata.certificateId, CertificateEventType.CREATED, null, null)

    certificateEventRepository[req.params.id] = Array.of(certificateEvent)

    res.json(createResponse(certificateClone))
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

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

    certificateEventRepository[certificate.metadata.certificateId].push(
      createEvent(certificate.metadata.certificateId, CertificateEventType.DELETED, null, null)
    )

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
    certificate.metadata.certificateStatus = CertificateStatus.SIGNED

    for (const questionId in certificate.data) {
      certificate.data[questionId].readOnly = true
      certificate.data[questionId].visible = true
    }

    if (certificate.metadata.relations.parent) {
      const parentCertificateId = certificate.metadata.relations.parent.certificateId

      const parentCertificate = certificateRepository[parentCertificateId]
      parentCertificate.metadata.relations.children[0].status = certificate.metadata.certificateStatus

      const parentCertificateEvents = certificateEventRepository[parentCertificateId]
      parentCertificateEvents.forEach((event) => {
        if (event.type === CertificateEventType.REPLACED) {
          event.relatedCertificateStatus = certificate.metadata.certificateStatus
        }
      })
    }

    certificateEventRepository[certificate.metadata.certificateId].push(
      createEvent(certificate.metadata.certificateId, CertificateEventType.SIGNED, null, null),
      createEvent(certificate.metadata.certificateId, CertificateEventType.AVAILABLE_FOR_PATIENT, null, null),
      createEvent(certificate.metadata.certificateId, CertificateEventType.SENT, null, null)
    )

    res.json(createResponse(certificate))
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/api/certificate/:id/revoke', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/revoke`)
  if (certificateRepository[req.params.id]) {
    const certificate = certificateRepository[req.params.id]
    certificate.metadata.certificateStatus = CertificateStatus.INVALIDATED

    if (certificate.metadata.relations.parent) {
      const parentCertificateId = certificate.metadata.relations.parent.certificateId

      const parentCertificate = certificateRepository[parentCertificateId]
      parentCertificate.metadata.relations.children[0].status = certificate.metadata.certificateStatus

      const parentCertificateEvents = certificateEventRepository[parentCertificateId]
      parentCertificateEvents.forEach((event) => {
        if (event.type === CertificateEventType.REPLACED) {
          event.relatedCertificateStatus = certificate.metadata.certificateStatus
        }
      })
    }

    if (certificate.metadata.relations.children && certificate.metadata.relations.children.length > 0) {
      const childCertificateId = certificate.metadata.relations.children[0].certificateId

      const childCertificate = certificateRepository[childCertificateId]
      if (childCertificate.metadata.relations.parent) {
        childCertificate.metadata.relations.parent.status = certificate.metadata.certificateStatus
      }

      const childCertificateEvents = certificateEventRepository[childCertificateId]
      childCertificateEvents.forEach((event) => {
        if (event.type === CertificateEventType.REPLACES) {
          event.relatedCertificateStatus = certificate.metadata.certificateStatus
        }
      })
    }

    certificateEventRepository[certificate.metadata.certificateId].push(
      createEvent(certificate.metadata.certificateId, CertificateEventType.REVOKED, null, null)
    )

    res.json(createResponse(certificate)).send()
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/api/certificate/:id/replace', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/replace`)
  if (certificateRepository[req.params.id]) {
    const originalCertificate = certificateRepository[req.params.id]

    const certificateClone = _.cloneDeep(originalCertificate)
    certificateClone.metadata.certificateId = uuidv4()
    certificateClone.metadata.certificateStatus = CertificateStatus.UNSIGNED

    const harFunktionsnedsattning = certificateClone.data['1.1'].value as CertificateBooleanValue
    certificateClone.data['1.2'].visible = harFunktionsnedsattning.selected ? harFunktionsnedsattning.selected : false
    certificateClone.data['aktivitetsbegransning'].visible = harFunktionsnedsattning.selected ? harFunktionsnedsattning.selected : false
    certificateClone.data['2.1'].visible = harFunktionsnedsattning.selected ? harFunktionsnedsattning.selected : false
    const harAktivitetsbegransning = certificateClone.data['2.1'].value as CertificateBooleanValue
    certificateClone.data['2.2'].visible = harAktivitetsbegransning.selected ? harAktivitetsbegransning.selected : false
    const harUtredningBehandling = certificateClone.data['3.1'].value as CertificateBooleanValue
    certificateClone.data['3.2'].visible = harUtredningBehandling.selected ? harUtredningBehandling.selected : false
    const harArbetspaverkan = certificateClone.data['4.1'].value as CertificateBooleanValue
    certificateClone.data['4.2'].visible = harArbetspaverkan.selected ? harArbetspaverkan.selected : false

    for (const questionId in certificateClone.data) {
      certificateClone.data[questionId].readOnly = false
    }

    const childRelation: CertificateRelation = {
      certificateId: certificateClone.metadata.certificateId,
      type: CertificateRelationType.REPLACE,
      status: certificateClone.metadata.certificateStatus,
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
      certificateId: originalCertificate.metadata.certificateId,
      type: CertificateRelationType.REPLACE,
      status: originalCertificate.metadata.certificateStatus,
      created: new Date().toLocaleString(),
    }

    certificateClone.metadata.relations = {
      parent: parentRelation,
      children: [],
    }

    const certificateEvent = createEvent(
      certificateClone.metadata.certificateId,
      CertificateEventType.REPLACES,
      originalCertificate.metadata.certificateId,
      originalCertificate.metadata.certificateStatus
    )

    certificateEventRepository[certificateClone.metadata.certificateId] = Array.of(certificateEvent)

    certificateEventRepository[originalCertificate.metadata.certificateId].push(
      createEvent(
        originalCertificate.metadata.certificateId,
        CertificateEventType.REPLACED,
        certificateClone.metadata.certificateId,
        certificateClone.metadata.certificateStatus
      )
    )

    certificateRepository[certificateClone.metadata.certificateId] = certificateClone
    res.json({ certificateId: certificateClone.metadata.certificateId }).send()
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/api/certificate/:id/validate', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/validate`)
  const validationErrors = validate(req.body as Certificate)
  res.json({ validationErrors }).send()
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

app.listen(9088, () => console.log('Server running'))

function createResponse(certificate: Certificate): Certificate {
  const certificateClone = _.cloneDeep(certificate)

  certificateClone.links = []

  console.log(loggedInUser)

  const userData: User | undefined = bootstrapUsers.find((user) => user.hsaId === loggedInUser!.hsaId)

  switch (certificateClone.metadata.certificateStatus) {
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
        name: 'Vidarebefodra utkast',
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
      certificateClone.links.push({
        type: ResourceLinkType.SEND_CERTIFICATE,
        name: 'Skicka',
        description: 'Skickar intyget',
        enabled: true,
      })
      break
    case CertificateStatus.SIGNED:
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
      }
      break
    case CertificateStatus.INVALIDATED:
    default:
  }

  return certificateClone
}

function validate(certificate: Certificate): ValidationError[] {
  const validationError: ValidationError[] = []
  let category = ''
  for (const questionId in certificate.data) {
    const dataProp = certificate.data[questionId].config.prop
    const question = certificate.data[questionId]

    category = question.config.component === 'category' ? questionId : category

    if (question.visible && question.validation && question.validation.required) {
      switch (question.value.type) {
        case 'BOOLEAN':
          const booleanValue: CertificateBooleanValue = question.value as CertificateBooleanValue
          if (booleanValue.selected === undefined || booleanValue.selected === null) {
            validationError.push({
              id: questionId,
              category: getCategory(certificate, question.parent),
              field: dataProp,
              type: 'EMPTY',
              text: 'Välj ett alternativ.',
            })
          }
          break
        case 'TEXT':
          const textValue: CertificateTextValue = question.value as CertificateTextValue
          if (!textValue.text) {
            validationError.push({
              id: questionId,
              category: getCategory(certificate, question.parent),
              field: dataProp,
              type: 'EMPTY',
              text: 'Ange ett svar.',
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
