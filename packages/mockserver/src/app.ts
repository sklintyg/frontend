import express, { Application, Request, Response, NextFunction } from 'express'
import bootstrapCertificate from './bootstrap/bed26d3e-7112-4f08-98bf-01be40e26c80.json'
import { Certificate, CertificateBooleanValue, CertificateStatus, CertificateTextValue, ValidationError } from '@frontend/common'
import bodyParser from 'body-parser'
import _ from 'lodash'

const app: Application = express()

const repository = {
  [bootstrapCertificate.metadata.certificateId]: _.cloneDeep(bootstrapCertificate),
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
    const certificateClone = _.cloneDeep(bootstrapCertificate)
    certificateClone.metadata.certificateId = req.params.id
    repository[req.params.id] = certificateClone
    res.json(certificateClone)
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.delete('/api/certificate/:id/:version', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} DELETE /api/certificate/${req.params.id}/${req.params.version}`)
  if (repository[req.params.id]) {
    delete repository[req.params.id]
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
    res.json(repository[req.params.id].metadata.version)
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
    repository[req.params.id].metadata.certificateStatus = CertificateStatus.SIGNED

    for (const questionId in repository[req.params.id].data) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      // TODO: Fix the test data so the Certificate type can be used correctly.
      repository[req.params.id].data[questionId].readOnly = true
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      repository[req.params.id].data[questionId].visible = true
    }

    res.json(repository[req.params.id])
  } else {
    res.status(404).send(`Certificate with ${req.params.id} doesn't exist`)
  }
})

app.post('/api/certificate/:id/validate', (req: Request, res: Response, next: NextFunction) => {
  console.log(`###################################### ${new Date()} POST /api/certificate/${req.params.id}/validate`)
  const validationErrors = validate(req.body as Certificate)
  res.json(validationErrors)
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
