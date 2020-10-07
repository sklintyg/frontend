import express, { Application, NextFunction, Request, Response } from 'express'
import bootstrapCertificate from './bootstrap/bed26d3e-7112-4f08-98bf-01be40e26c80.json'
import { Certificate, CertificateBooleanValue, CertificateStatus, CertificateTextValue, ValidationError } from '@frontend/common'
import bodyParser from 'body-parser'
import * as fs from 'fs'
import _ from 'lodash'
import { CertificateRelation, CertificateRelationType } from '@frontend/common/src'

const app: Application = express()

const repository = {
  [bootstrapCertificate.metadata.certificateId]: (_.cloneDeep(bootstrapCertificate) as unknown) as Certificate,
}

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(bodyParser.json())

app.get('/api/certificate/:id', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} GET /api/certificate/${req.params.id}`)
  if (repository[req.params.id]) {
    res.json(repository[req.params.id])
  } else if (req.params.id) {
    const certificateClone = (_.cloneDeep(bootstrapCertificate) as unknown) as Certificate
    certificateClone.metadata.certificateId = req.params.id
    repository[req.params.id] = certificateClone
    res.json(certificateClone)
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.get('/moduleapi/intyg/:type/:id/pdf', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} GET /moduleapi/intyg/${req.params.type}/${req.params.id}/pdf`)
  if (repository[req.params.id]) {
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
  if (repository[req.params.id]) {
    const certificate = repository[req.params.id]
    delete repository[req.params.id]

    if (certificate.metadata.relations.parent) {
      const parentCertificate = repository[certificate.metadata.relations.parent.certificateId]
      parentCertificate.metadata.relations.children = []
    }

    res.status(200).send()
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.put('/api/certificate/:id', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} PUT /api/certificate/${req.params.id}`)
  if (repository[req.params.id]) {
    repository[req.params.id] = req.body
    repository[req.params.id].metadata.version += 1
    res.json({ version: repository[req.params.id].metadata.version })
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/fake', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /fake`)
  res.status(200).send()
})

app.post('/api/certificate/:id/sign', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/sign`)
  if (repository[req.params.id]) {
    const certificate = repository[req.params.id]
    certificate.metadata.certificateStatus = CertificateStatus.SIGNED

    for (const questionId in certificate.data) {
      certificate.data[questionId].readOnly = true
      certificate.data[questionId].visible = true
    }

    if (certificate.metadata.relations.parent) {
      const parentCertificate = repository[certificate.metadata.relations.parent.certificateId]
      parentCertificate.metadata.relations.children[0].status = certificate.metadata.certificateStatus
    }

    res.json(certificate)
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/api/certificate/:id/revoke', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/revoke`)
  if (repository[req.params.id]) {
    const certificate = repository[req.params.id]
    certificate.metadata.certificateStatus = CertificateStatus.INVALIDATED

    if (certificate.metadata.relations.parent) {
      const parentCertificate = repository[certificate.metadata.relations.parent.certificateId]
      parentCertificate.metadata.relations.children[0].status = certificate.metadata.certificateStatus
    }

    if (certificate.metadata.relations.children && certificate.metadata.relations.children.length > 0) {
      const childCertificate = repository[certificate.metadata.relations.children[0].certificateId]
      if (childCertificate.metadata.relations.parent) {
        childCertificate.metadata.relations.parent.status = certificate.metadata.certificateStatus
      }
    }

    res.status(200).send()
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/api/certificate/:id/replace', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/replace`)
  if (repository[req.params.id]) {
    const originalCertificate = repository[req.params.id]

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

    repository[certificateClone.metadata.certificateId] = certificateClone
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

app.listen(9088, () => console.log('Server running'))

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
