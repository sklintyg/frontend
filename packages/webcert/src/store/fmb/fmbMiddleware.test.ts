import MockAdapter from 'axios-mock-adapter'
import { Certificate, CertificateDataElement, CertificateDataValueType, ConfigTypes, ResourceLinkType } from '@frontend/common'
import { FMBDiagnoseRequest, getFMBDiagnosisCodeInfo, updateFMBDiagnosisCodeInfo, updateFMBPanelActive } from './fmbActions'
import axios from 'axios'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../reducers'
import apiMiddleware from '../api/apiMiddleware'
import { fmbMiddleware } from './fmbMiddleware'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'

// https://stackoverflow.com/questions/53009324/how-to-wait-for-request-to-be-finished-with-axios-mock-adapter-like-its-possibl
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('Test FMB middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(apiMiddleware, ...fmbMiddleware),
    })
  })

  describe('Handle GetFMBDiagnosisCodeInfo', () => {
    it('shall handle diagnose code that has FMB recommendation', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('A01', 0)
      const fmbDiagnosisResponse = getResponseWithFMB(fmbDiagnosisRequest.icd10Code)
      const expectedFMBDiagnosisInfo = getFMBDiagnosisCodeInfoResult(fmbDiagnosisRequest.icd10Code, fmbDiagnosisRequest.index)
      fakeAxios.onGet('/api/fmb/' + fmbDiagnosisRequest.icd10Code).reply(200, fmbDiagnosisResponse)

      testStore.dispatch(getFMBDiagnosisCodeInfo(fmbDiagnosisRequest))

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo[0]).toEqual(expectedFMBDiagnosisInfo)
    })

    it('shall handle diagnose code that has missing FMB recommendation', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('A01', 0)
      const fmbDiagnosisResponse = getResponseWithEmptyFMB()
      const expectedFMBDiagnosisInfo = getEmptyFMBDiagnosisCodeInfoResult(fmbDiagnosisRequest.icd10Code, fmbDiagnosisRequest.index)
      fakeAxios.onGet('/api/fmb/' + fmbDiagnosisRequest.icd10Code).reply(204, fmbDiagnosisResponse)

      testStore.dispatch(getFMBDiagnosisCodeInfo(fmbDiagnosisRequest))

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo[0]).toEqual(expectedFMBDiagnosisInfo)
    })
  })

  describe('Handle UpdateCertificateDataElement', () => {
    beforeEach(() => {
      testStore.dispatch(updateFMBPanelActive(true))
    })

    it('shall show FMB recommendations if data element includes one diagnoses', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('A01', 0)
      const fmbDiagnosisResponse = getResponseWithFMB(fmbDiagnosisRequest.icd10Code)
      const expectedFMBDiagnosisInfo = getFMBDiagnosisCodeInfoResult(fmbDiagnosisRequest.icd10Code, fmbDiagnosisRequest.index)
      fakeAxios.onGet('/api/fmb/' + fmbDiagnosisRequest.icd10Code).reply(200, fmbDiagnosisResponse)

      testStore.dispatch(updateCertificateDataElement(getDiagnosesElement([fmbDiagnosisRequest])))

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo[0]).toEqual(expectedFMBDiagnosisInfo)
    })

    it('shall not fetch FMB recommendations as it already have been fetched', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('A01', 0)
      const expectedFMBDiagnosisInfo = getFMBDiagnosisCodeInfoResult(fmbDiagnosisRequest.icd10Code, fmbDiagnosisRequest.index)
      testStore.dispatch(updateFMBDiagnosisCodeInfo(expectedFMBDiagnosisInfo))

      testStore.dispatch(updateCertificateDataElement(getDiagnosesElement([fmbDiagnosisRequest])))

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo[0]).toEqual(expectedFMBDiagnosisInfo)
      expect(fakeAxios.history.get.length).toBe(0)
    })

    it('shall fetch FMB for diagnosis one but not for diagnosis two as it already has been fetched', async () => {
      const fmbDiagnosisRequestOne = getFMBDiagnoseRequest('A01', 0)
      const fmbDiagnosisRequestTwo = getFMBDiagnoseRequest('B02', 1)
      const fmbDiagnosisResponse = getResponseWithFMB(fmbDiagnosisRequestOne.icd10Code)
      const expectedFMBDiagnosisInfoOne = getFMBDiagnosisCodeInfoResult(fmbDiagnosisRequestOne.icd10Code, fmbDiagnosisRequestOne.index)
      const expectedFMBDiagnosisInfoTwo = getFMBDiagnosisCodeInfoResult(fmbDiagnosisRequestTwo.icd10Code, fmbDiagnosisRequestTwo.index)
      testStore.dispatch(updateFMBDiagnosisCodeInfo(expectedFMBDiagnosisInfoTwo))
      fakeAxios.onGet('/api/fmb/' + fmbDiagnosisRequestOne.icd10Code).reply(200, fmbDiagnosisResponse)

      testStore.dispatch(updateCertificateDataElement(getDiagnosesElement([fmbDiagnosisRequestOne, fmbDiagnosisRequestTwo])))

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo[0]).toEqual(expectedFMBDiagnosisInfoOne)
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo[1]).toEqual(expectedFMBDiagnosisInfoTwo)
      expect(fakeAxios.history.get.length).toBe(1)
    })

    it('shall clear FMB for diagnosis one when it is removed from the CertificateDataElement', async () => {
      const fmbDiagnosisRequestOne = getFMBDiagnoseRequest('A01', 0)
      const fmbDiagnosisRequestTwo = getFMBDiagnoseRequest('B02', 1)
      const expectedFMBDiagnosisInfoOne = getFMBDiagnosisCodeInfoResult(fmbDiagnosisRequestOne.icd10Code, fmbDiagnosisRequestOne.index)
      const expectedFMBDiagnosisInfoTwo = getFMBDiagnosisCodeInfoResult(fmbDiagnosisRequestTwo.icd10Code, fmbDiagnosisRequestTwo.index)
      testStore.dispatch(updateFMBDiagnosisCodeInfo(expectedFMBDiagnosisInfoOne))
      testStore.dispatch(updateFMBDiagnosisCodeInfo(expectedFMBDiagnosisInfoTwo))

      testStore.dispatch(updateCertificateDataElement(getDiagnosesElement([fmbDiagnosisRequestTwo])))

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo).toHaveLength(1)
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo[0]).toEqual(expectedFMBDiagnosisInfoTwo)
      expect(fakeAxios.history.get.length).toBe(0)
    })

    it('shall not fetch FMB recommendations if FMB Panel is inactive', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('A01', 0)
      testStore.dispatch(updateFMBPanelActive(false))

      testStore.dispatch(updateCertificateDataElement(getDiagnosesElement([fmbDiagnosisRequest])))

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(0)
    })
  })

  describe('Handle UpdateCertificate', () => {
    it('shall not fetch FMB recommendations if resource link FMB is inactive', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('A01', 0)

      testStore.dispatch(updateCertificate(getCertificate([fmbDiagnosisRequest], false)))

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(0)
    })

    it('shall not fetch FMB recommendations if resource link FMB is missing', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('A01', 0)

      testStore.dispatch(updateCertificate(getCertificate([fmbDiagnosisRequest])))

      await flushPromises()
      expect(fakeAxios.history.get.length).toBe(0)
    })

    it('shall fetch FMB recommendations if resource link FMB is active', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('A01', 0)
      const fmbDiagnosisResponse = getResponseWithFMB(fmbDiagnosisRequest.icd10Code)
      const expectedFMBDiagnosisInfo = getFMBDiagnosisCodeInfoResult(fmbDiagnosisRequest.icd10Code, fmbDiagnosisRequest.index)
      fakeAxios.onGet('/api/fmb/' + fmbDiagnosisRequest.icd10Code).reply(200, fmbDiagnosisResponse)

      testStore.dispatch(updateCertificate(getCertificate([fmbDiagnosisRequest], true)))

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo[0]).toEqual(expectedFMBDiagnosisInfo)
    })
  })
})

const getFMBDiagnoseRequest = (code: string, index: number): FMBDiagnoseRequest => {
  return { icd10Code: code, icd10Description: 'Description for ' + code, index: index }
}

const getResponseWithFMB = (code: string) => {
  return {
    icd10Code: code,
    icd10Description: 'Description for ' + code,
    diagnosTitle: 'diagnosTitle',
    forms: [],
    referenceDescription: 'referenceDescription',
    referenceLink: 'referenceLink',
    relatedDiagnoses: 'relatedDiagnoses',
  }
}

const getResponseWithEmptyFMB = () => {
  return {}
}

const getFMBDiagnosisCodeInfoResult = (code: string, index: number) => {
  return {
    icd10Code: code,
    icd10Description: 'Description for ' + code,
    diagnosTitle: 'diagnosTitle',
    forms: [],
    referenceDescription: 'referenceDescription',
    referenceLink: 'referenceLink',
    relatedDiagnoses: 'relatedDiagnoses',
    index: index,
  }
}

const getEmptyFMBDiagnosisCodeInfoResult = (code: string, index: number) => {
  return {
    icd10Code: code,
    icd10Description: 'Description for ' + code,
    index: index,
  }
}

export const getDiagnosesElement = (codes: FMBDiagnoseRequest[]): CertificateDataElement => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return {
    id: '6.1',
    parent: '6',
    index: 6,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: {
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
      type: ConfigTypes.UE_DIAGNOSES,
      id: 'funktionsnedsattning',
    },
    value: {
      type: CertificateDataValueType.DIAGNOSIS_LIST,
      list: codes.map((value, index) => ({
        id: String(index + 1),
        terminology: 'icd10',
        code: value.icd10Code,
        description: value.icd10Description,
      })),
    },
    validation: [],
    validationErrors: [],
  }
}

export const getCertificate = (codes: FMBDiagnoseRequest[], fmbActive?: boolean): Certificate => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return {
    links:
      fmbActive === undefined
        ? []
        : [
            {
              type: ResourceLinkType.FMB,
              enabled: fmbActive,
              name: 'FMB',
              description: 'FMB',
            },
          ],
    data: {
      '6.1': getDiagnosesElement(codes),
    },
  }
}
