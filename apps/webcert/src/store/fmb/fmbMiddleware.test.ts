import {
  Certificate,
  CertificateDataElement,
  CertificateDataValueType,
  CertificateMetadata,
  fakeCertificateConfig,
  fakeCertificateValue,
  fakeDiagnosesElement,
  fakeSickLeavePeriod,
  Patient,
  PersonId,
  ResourceLinkType,
  ValueDateRangeList,
  ValueDiagnosisList,
} from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { flushPromises } from '../../utils/flushPromises'
import { apiMiddleware } from '../api/apiMiddleware'
import { updateCertificate, updateCertificateDataElement } from '../certificate/certificateActions'
import { configureApplicationStore } from '../configureApplicationStore'
import {
  FMBDiagnoseRequest,
  getFMBDiagnosisCodeInfo,
  setDiagnosisListValue,
  setPatientId,
  setSickLeavePeriodValue,
  updateFMBDiagnosisCodeInfo,
  updateFMBPanelActive,
} from './fmbActions'
import { fmbMiddleware } from './fmbMiddleware'

const getFMBDiagnoseRequest = (code: string, index: number): FMBDiagnoseRequest => ({
  icd10Code: code,
  icd10Description: `Description for ${code}`,
  index,
})

const getResponseWithFMB = (code: string) => ({
  icd10Code: code,
  icd10Description: `Description for ${code}`,
  diagnosTitle: 'diagnosTitle',
  forms: [],
  referenceDescription: 'referenceDescription',
  referenceLink: 'referenceLink',
  relatedDiagnoses: 'relatedDiagnoses',
})

const getResponseWithEmptyFMB = () => ({})

const getFMBDiagnosisCodeInfoResult = (code: string, index: number) => ({
  icd10Code: code,
  originalIcd10Code: code,
  icd10Description: `Description for ${code}`,
  index,
  originalIcd10Description: `Description for ${code}`,
  diagnosTitle: 'diagnosTitle',
  forms: [],
  referenceDescription: 'referenceDescription',
  referenceLink: 'referenceLink',
  relatedDiagnoses: 'relatedDiagnoses',
})

const getFMBDiagnosisCodeInfoResultWithOtherCode = (code: string, index: number, originalCode: string) => ({
  icd10Code: code,
  originalIcd10Code: originalCode,
  icd10Description: `Description for ${code}`,
  originalIcd10Description: `Description for ${originalCode}`,
  diagnosTitle: 'diagnosTitle',
  forms: [],
  referenceDescription: 'referenceDescription',
  referenceLink: 'referenceLink',
  relatedDiagnoses: 'relatedDiagnoses',
  index,
})

const getEmptyFMBDiagnosisCodeInfoResult = (code: string, index: number) => ({
  index,
  originalIcd10Code: code,
  originalIcd10Description: `Description for ${code}`,
})

const getDiagnosisElementWithCodeSystem = (codeSystem: string): CertificateDataElement =>
  fakeDiagnosesElement({
    id: '6.1',
    parent: '6',
    index: 6,
    visible: true,
    mandatory: false,
    readOnly: false,
    config: fakeCertificateConfig.diagnoses({
      text: 'Beskriv de funktionsnedsättningar som har observerats (undersökningsfynd). Ange, om möjligt, varaktighet.',
      description:
        'Ange de nedsättningar som har framkommit vid undersökning eller utredning.\n\nTill exempel:\nMedvetenhet, uppmärksamhet, orienteringsförmåga\nSocial interaktion, agitation\nKognitiva störningar som t ex minnessvårigheter\nStörningar på sinnesorganen som t ex syn- och hörselnedsättning, balansrubbningar\nSmärta i rörelseorganen\nRörelseinskränkning, rörelseomfång, smidighet\nUthållighet, koordination\n\nMed varaktighet menas permanent eller övergående. Ange i så fall tidsangivelse vid övergående.',
    }),
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

const getDiagnosesElement = (codes: FMBDiagnoseRequest[]): CertificateDataElement =>
  fakeDiagnosesElement({
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
    },
    value: {
      list: codes.map((value, index) => ({
        id: String(index + 1),
        terminology: 'icd10',
        code: value.icd10Code,
        description: value.icd10Description,
      })),
    },
  })['6.1']

const getDateRangeListValue = (): ValueDateRangeList => ({
  type: CertificateDataValueType.DATE_RANGE_LIST,
  list: [{ type: CertificateDataValueType.DATE_RANGE, to: '2022-01-01', from: '2021-01-01', id: 'HALFTEN' }],
})

const getDiagnosisListValue = (): ValueDiagnosisList => ({
  type: CertificateDataValueType.DIAGNOSIS_LIST,
  list: [{ type: CertificateDataValueType.DIAGNOSIS, code: 'F500', description: 'desc', id: '1', terminology: 'icd10' }],
})

const getDateRangeListElement = (): CertificateDataElement =>
  fakeSickLeavePeriod({
    id: '6.1',
    parent: '6',
    index: 6,
    visible: true,
    mandatory: false,
    readOnly: false,
    value: {
      list: [{ id: 'EN_FJARDEDEL', to: '2022-12-12', from: '2020-12-12' }],
    },
    validation: [],
    validationErrors: [],
  })['6.1']

const getCertificateWithDiagnosisElementWithCodeSystem = (codeSystem: string): Certificate => ({
  links: [
    {
      type: ResourceLinkType.FMB,
      enabled: true,
      name: 'FMB',
      description: 'FMB',
    },
  ],
  data: {
    '6.1': getDiagnosisElementWithCodeSystem(codeSystem),
  },
  metadata: {
    patient: {
      personId: {
        type: 'type',
        id: '1912121212',
      },
    } as Patient,
  } as CertificateMetadata,
})

const getCertificate = (codes: FMBDiagnoseRequest[], fmbActive?: boolean): Certificate => ({
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
  metadata: {
    patient: {
      personId: {
        type: 'type',
        id: '1912121212',
      },
    } as Patient,
  } as CertificateMetadata,
})

describe('Test FMB middleware', () => {
  let fakeAxios: MockAdapter
  let testStore: EnhancedStore

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios)
    testStore = configureApplicationStore([apiMiddleware, fmbMiddleware])
  })

  describe('Handle GetFMBDiagnosisCodeInfo', () => {
    it('shall handle diagnose code that has FMB recommendation', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('A01', 0)
      const fmbDiagnosisResponse = getResponseWithFMB(fmbDiagnosisRequest.icd10Code)
      const expectedFMBDiagnosisInfo = getFMBDiagnosisCodeInfoResult(fmbDiagnosisRequest.icd10Code, fmbDiagnosisRequest.index)
      fakeAxios.onGet(`/api/fmb/${fmbDiagnosisRequest.icd10Code}`).reply(200, fmbDiagnosisResponse)

      testStore.dispatch(getFMBDiagnosisCodeInfo(fmbDiagnosisRequest))

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo[0]).toEqual(expectedFMBDiagnosisInfo)
    })

    it('shall handle diagnose code that has missing FMB recommendation', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('A01', 0)
      const fmbDiagnosisResponse = getResponseWithEmptyFMB()
      const expectedFMBDiagnosisInfo = getEmptyFMBDiagnosisCodeInfoResult(fmbDiagnosisRequest.icd10Code, fmbDiagnosisRequest.index)
      fakeAxios.onGet(`/api/fmb/${fmbDiagnosisRequest.icd10Code}`).reply(204, fmbDiagnosisResponse)

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
      fakeAxios.onGet(`/api/fmb/${fmbDiagnosisRequest.icd10Code}`).reply(200, fmbDiagnosisResponse)

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
      fakeAxios.onGet(`/api/fmb/${fmbDiagnosisRequestOne.icd10Code}`).reply(200, fmbDiagnosisResponse)

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

    it('shall show sick leave period warning if updated element is diagnosis list', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('F500', 0)
      const response = { message: 'warning message' }
      fakeAxios.onPost('/api/fmb/validateSickLeavePeriod').reply(200, response)

      testStore.dispatch(setPatientId('191212121212'))
      testStore.dispatch(setSickLeavePeriodValue(getDateRangeListValue()))
      testStore.dispatch(updateCertificate(getCertificate([fmbDiagnosisRequest], true)))
      testStore.dispatch(updateCertificateDataElement(getDiagnosesElement([fmbDiagnosisRequest])))

      await flushPromises()

      expect(testStore.getState().ui.uiFMB.sickLeavePeriodWarning).toEqual(response.message)
    })

    it('shall not show sick leave period warning sick leave period is not valid', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('F500', 0)

      testStore.dispatch(setPatientId('191212121212'))
      testStore.dispatch(
        setSickLeavePeriodValue(
          fakeCertificateValue.dateRangeList({
            list: [
              {
                to: '2022-01-01',
                from: '2',
                id: 'HALFTEN',
              },
            ],
          })
        )
      )
      testStore.dispatch(updateCertificate(getCertificate([fmbDiagnosisRequest], true)))
      testStore.dispatch(updateCertificateDataElement(getDiagnosesElement([fmbDiagnosisRequest])))

      await flushPromises()

      expect(fakeAxios.history.post.length).toEqual(0)
    })

    it('shall only send valid sick leave periods in sick leave period warning request', async () => {
      const value = fakeCertificateValue.dateRangeList({
        list: [
          { to: '2022-01-01', from: '2', id: 'HALFTEN' },
          { to: '2022-01-01', from: '2020-01-01', id: 'HELT_NEDSATT' },
        ],
      })
      const expectedValue = { ...value }
      expectedValue.list = value.list.slice().filter((item) => item.id === 'HELT_NEDSATT')

      const fmbDiagnosisRequest = getFMBDiagnoseRequest('F500', 0)
      fakeAxios.onPost('/api/fmb/validateSickLeavePeriod').reply(200, { message: 'warning message' })

      testStore.dispatch(setPatientId('191212121212'))
      testStore.dispatch(setSickLeavePeriodValue(value))
      testStore.dispatch(updateCertificate(getCertificate([fmbDiagnosisRequest], true)))
      testStore.dispatch(updateCertificateDataElement(getDiagnosesElement([fmbDiagnosisRequest])))

      await flushPromises()
      expect(JSON.parse(fakeAxios.history.post[0].data).dateRangeList).toEqual(expectedValue)
    })

    it('shall show sick leave period warning if updated element is date range list', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('F500', 0)
      const response = { message: 'warning message' }
      fakeAxios.onPost('/api/fmb/validateSickLeavePeriod').reply(200, response)

      testStore.dispatch(setPatientId('191212121212'))
      testStore.dispatch(setDiagnosisListValue(getDiagnosisListValue()))
      testStore.dispatch(updateCertificate(getCertificate([fmbDiagnosisRequest], true)))
      testStore.dispatch(updateCertificateDataElement(getDateRangeListElement()))

      await flushPromises()

      expect(testStore.getState().ui.uiFMB.sickLeavePeriodWarning).toEqual(response.message)
    })

    it('shall not fetch sick leave period warning if updated element is incomplete date range list', async () => {
      const response = { message: 'warning message' }
      fakeAxios.onPost('/api/fmb/validateSickLeavePeriod').reply(200, response)

      testStore.dispatch(setDiagnosisListValue(getDiagnosisListValue()))
      testStore.dispatch(
        updateCertificateDataElement(
          fakeSickLeavePeriod({ id: 'id', value: { list: [{ id: 'EN_FJARDEDEL', to: '2022-12-12', from: '' }] } }).id
        )
      )

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo.length).toEqual(0)
      expect(fakeAxios.history.get.length).toBe(0)
    })

    it('shall not fetch FMB recommendations if code system is different than icd10', async () => {
      testStore.dispatch(updateCertificateDataElement(getDiagnosisElementWithCodeSystem('unknown')))

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo.length).toEqual(0)
      expect(fakeAxios.history.get.length).toBe(0)
    })
    it('should use previousPersonId if reserveId is true and previousPersonId exists', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('F500', 0)
      const expectedPersonId = '201212121212'
      const patientId = {
        type: 'patientId',
        id: expectedPersonId,
      } as PersonId
      const certificate = getCertificate([fmbDiagnosisRequest], true)
      certificate.metadata.patient.reserveId = true
      certificate.metadata.patient.previousPersonId = patientId

      testStore.dispatch(updateCertificate(certificate))

      expect(testStore.getState().ui.uiFMB.patientId).toEqual(expectedPersonId)
    })
    it('should use personId if reserveId is true and previousPersonId is missing', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('F500', 0)
      const expectedPersonId = '1912121212'
      const certificate = getCertificate([fmbDiagnosisRequest], true)
      certificate.metadata.patient.reserveId = true

      testStore.dispatch(updateCertificate(certificate))

      expect(testStore.getState().ui.uiFMB.patientId).toEqual(expectedPersonId)
    })
    it('should use personId if reserveId is false', async () => {
      const fmbDiagnosisRequest = getFMBDiagnoseRequest('F500', 0)
      const expectedPersonId = '1912121212'
      const certificate = getCertificate([fmbDiagnosisRequest], true)
      certificate.metadata.patient.reserveId = false

      testStore.dispatch(updateCertificate(certificate))

      expect(testStore.getState().ui.uiFMB.patientId).toEqual(expectedPersonId)
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
      fakeAxios.onGet(`/api/fmb/${fmbDiagnosisRequest.icd10Code}`).reply(200, fmbDiagnosisResponse)

      testStore.dispatch(updateCertificate(getCertificate([fmbDiagnosisRequest], true)))

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo[0]).toEqual(expectedFMBDiagnosisInfo)
    })

    it('shall set original icd10 values', async () => {
      const originalCode = 'F312'
      const actualCode = 'F31'
      const fmbDiagnosisRequest = getFMBDiagnoseRequest(originalCode, 0)
      const fmbDiagnosisResponse = getResponseWithFMB(actualCode)
      const expectedFMBDiagnosisInfo = getFMBDiagnosisCodeInfoResultWithOtherCode(actualCode, fmbDiagnosisRequest.index, originalCode)
      fakeAxios.onGet(`/api/fmb/${fmbDiagnosisRequest.icd10Code}`).reply(200, fmbDiagnosisResponse)

      testStore.dispatch(updateCertificate(getCertificate([fmbDiagnosisRequest], true)))

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo[0]).toEqual(expectedFMBDiagnosisInfo)
    })

    it('shall not fetch FMB recommendations if code system is different than icd10', async () => {
      testStore.dispatch(updateCertificate(getCertificateWithDiagnosisElementWithCodeSystem('unknown')))

      await flushPromises()
      expect(testStore.getState().ui.uiFMB.fmbDiagnosisCodeInfo.length).toEqual(0)
      expect(fakeAxios.history.get.length).toBe(0)
    })
  })
})
