import type { EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {
  fakeCertificate,
  fakeCertificateConfig,
  fakeCertificateDataElement,
  fakeCertificateMetaData,
  fakeCertificateValue,
  fakeDiagnosesElement,
  fakePatient,
  fakeResourceLink,
} from '../../faker'
import type { CertificateDataElement, Icd10Code, IcfCode } from '../../types'
import { ResourceLinkType } from '../../types'
import { flushPromises } from '../../utils/flushPromises'
import { apiMiddleware } from '../api/apiMiddleware'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'
import { configureApplicationStore } from '../configureApplicationStore'
import type { IcfRequest, IcfResponse } from './icfActions'
import { getIcfCodes, updateIcfCodes } from './icfActions'
import { icfMiddleware } from './icfMiddleware'

const getDiagnosisElementWithCodeSystem = (codeSystem: string) =>
  fakeDiagnosesElement({
    id: '6.1',
    config: {
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
    },
    value: {
      list: [
        {
          code: 'code',
          terminology: codeSystem,
          id: '1',
        },
      ],
    },
  })['6.1']

const getCertificateWithDiagnosisElementWithCodeSystem = (codeSystem: string) =>
  fakeCertificate({
    links: [
      fakeResourceLink({
        type: ResourceLinkType.FMB,
        name: 'FMB',
        description: 'FMB',
      }),
    ],
    data: {
      '6.1': getDiagnosisElementWithCodeSystem(codeSystem),
    },
    metadata: fakeCertificateMetaData({
      patient: fakePatient({
        personId: {
          type: 'type',
          id: '1912121212',
        },
      }),
    }),
  })

const getCodeElement = (): CertificateDataElement =>
  fakeCertificateDataElement({
    id: '6.1',
    config: fakeCertificateConfig.diagnoses({
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
    }),
    value: fakeCertificateValue.code({
      code: 'code',
      id: 'id',
    }),
  })['6.1']

const getIcfData = (): IcfResponse => {
  const icfCodes: IcfCode[] = [
    {
      code: '1',
      description: 'description 0',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 0',
    },
    {
      code: '2',
      description: 'description 1',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 1',
    },
    {
      code: '3',
      description: 'description 2',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 2',
    },
  ]

  const ICD_CODE_1 = { code: 'A02', title: 'Andra salmonellainfektioner' }
  const ICD_CODE_2 = { code: 'U071', title: 'Covid-19, virus identifierat' }
  const icdCodes: Icd10Code[] = [ICD_CODE_1, ICD_CODE_2]

  return {
    activityLimitation: {
      commonCodes: { icfCodes, icd10Codes: icdCodes },
      uniqueCodes: [
        { icfCodes, icd10Codes: [ICD_CODE_1] },
        { icfCodes, icd10Codes: [ICD_CODE_2] },
      ],
    },
    disability: {
      commonCodes: { icfCodes, icd10Codes: icdCodes },
      uniqueCodes: [
        { icfCodes, icd10Codes: [ICD_CODE_1] },
        { icfCodes, icd10Codes: [ICD_CODE_2] },
      ],
    },
  }
}

describe('Test ICF middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([apiMiddleware, icfMiddleware])
  })

  describe('Handle getIcfCodes', () => {
    it('shall update ICF state', async () => {
      const request: IcfRequest = {
        icdCodes: ['A02', 'U071'],
      }
      const expectedIcfInfo = getIcfData()
      fakeAxios.onPost('/api/icf').reply(200, expectedIcfInfo)

      testStore.dispatch(getIcfCodes(request))

      await flushPromises()
      expect(testStore.getState().ui.uiIcf.disability).toEqual(expectedIcfInfo.disability)
      expect(testStore.getState().ui.uiIcf.activityLimitation).toEqual(expectedIcfInfo.activityLimitation)
    })
  })

  describe('Handle updateIcfCodes', () => {
    it('shall update ICF state', () => {
      const expectedIcfInfo = getIcfData()

      testStore.dispatch(updateIcfCodes(expectedIcfInfo))

      flushPromises()
      expect(testStore.getState().ui.uiIcf.disability).toEqual(expectedIcfInfo.disability)
      expect(testStore.getState().ui.uiIcf.activityLimitation).toEqual(expectedIcfInfo.activityLimitation)
    })
  })

  describe('Handle updateCertificate', () => {
    it('shall save icd 10 codes to state', () => {
      const certificate = getCertificateWithDiagnosisElementWithCodeSystem('ICD_10_SE')

      testStore.dispatch(updateCertificate(certificate))

      flushPromises()
      expect(testStore.getState().ui.uiIcf.originalIcd10Codes).toHaveLength(1)
    })

    it('shall not save codes that are not icd 10 to state', () => {
      const certificate = getCertificateWithDiagnosisElementWithCodeSystem('test')

      testStore.dispatch(updateCertificate(certificate))

      flushPromises()
      expect(testStore.getState().ui.uiIcf.originalIcd10Codes).toHaveLength(0)
    })
  })

  describe('HandleUpdateCertificateDataElement', () => {
    it('shall save icd 10 codes to state', () => {
      const element = getDiagnosisElementWithCodeSystem('ICD_10_SE')

      testStore.dispatch(updateCertificateDataElement(element))

      flushPromises()
      expect(testStore.getState().ui.uiIcf.originalIcd10Codes).toHaveLength(1)
    })

    it('shall not save codes that are not icd 10 to state', () => {
      const element = getDiagnosisElementWithCodeSystem('test')

      testStore.dispatch(updateCertificateDataElement(element))

      flushPromises()
      expect(testStore.getState().ui.uiIcf.originalIcd10Codes).toHaveLength(0)
    })

    it('shall keep saved icd codes if other data element is updated', () => {
      const diagnosisElement = getDiagnosisElementWithCodeSystem('ICD_10_SE')
      const otherElement = getCodeElement()
      testStore.dispatch(updateCertificateDataElement(diagnosisElement))
      testStore.dispatch(updateCertificateDataElement(otherElement))

      flushPromises()
      expect(testStore.getState().ui.uiIcf.originalIcd10Codes).toHaveLength(1)
    })
  })
})
