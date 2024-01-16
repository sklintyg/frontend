import { EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {
  getCertificateWithDiagnosisElementWithCodeSystem,
  getCodeElement,
  getDiagnosisElementWithCodeSystem,
} from '../../components/icf/icfTestUtils'
import { flushPromises } from '../../utils/flushPromises'
import { apiMiddleware } from '../api/apiMiddleware'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'
import { configureApplicationStore } from '../configureApplicationStore'
import { IcfRequest, IcfResponse, getIcfCodes, updateIcfCodes } from './icfActions'
import { icfMiddleware } from './icfMiddleware'
import { IcfTitles, Certificate, CertificateStatus, IcfCode, Icd10Code } from '../../types'

const getCertificate = (icfTitles: IcfTitles): Certificate => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  metadata: { id: 'certificateId' },
  status: CertificateStatus.SIGNED,
  icfTitles,
})

const getIcfTitles = (): IcfTitles => ({
  disability: { unique: ['Test 2', 'Test 3'], common: ['Test 0', 'Test 1', 'Test 2', 'Test 3'] },
  activityLimitation: { unique: ['Test 0', 'Test 1'], common: ['Test 0', 'Test 1', 'Test 2', 'Test 3'] },
})

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
    it('shall update icf codes', () => {
      const expectedIcfTitles = getIcfTitles()
      const certificate = getCertificate(expectedIcfTitles)

      testStore.dispatch(updateCertificate(certificate))

      flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate.icfTitles).toEqual(expectedIcfTitles)
    })

    it('shall fetch icf codes when', () => {
      const expectedIcfTitles = getIcfTitles()
      const certificate = getCertificate(expectedIcfTitles)

      testStore.dispatch(updateCertificate(certificate))

      flushPromises()
      expect(testStore.getState().ui.uiCertificate.certificate.icfTitles).toEqual(expectedIcfTitles)
    })

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
