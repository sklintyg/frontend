import { faker } from '@faker-js/faker'
import { CertificateData, CertificateStatus, Patient, ResourceLink, Staff, Unit } from '@frontend/common'
import { Story } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import { updateCertificate } from '../../store/certificate/certificateActions'
import { getCertificate } from '../../store/certificate/certificateSelectors'
import store from '../../store/store'
import {
  fakeCategoryElement,
  fakeCertificateData,
  fakeCheckboxBooleanElement,
  fakeCheckboxMultipleCodeElement,
  fakeCheckboxMultipleDate,
  fakeDiagnosesElement,
  fakeICFDataElement,
  fakeRadioMultipleCodeElement,
} from '../../utils/fakeCertificateData'
import Certificate from './Certificate'

export default {
  title: 'Webcert/Certificate',
  component: Certificate,
}

faker.seed(10)

const fakeUnit = (): Unit => {
  return {
    unitId: faker.random.alpha(5),
    unitName: faker.lorem.words(),
    address: faker.address.streetAddress(),
    zipCode: faker.random.numeric(5),
    city: faker.address.city(),
    phoneNumber: faker.random.numeric(10),
    email: faker.internet.email(),
    isInactive: false,
  }
}

const fakePatient = (): Patient => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  return {
    personId: { type: faker.random.alpha(), id: faker.random.alpha() },
    previousPersonId: { type: faker.random.alpha(), id: faker.random.alpha() },
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    coordinationNumber: false,
    testIndicated: false,
    protectedPerson: false,
    deceased: false,
    differentNameFromEHR: false,
    personIdChanged: false,
    reserveId: false,
  }
}

const fakeStaff = (): Staff => {
  return {
    personId: faker.random.alpha(10),
    fullName: faker.name.fullName(),
    prescriptionCode: faker.random.alpha(),
  }
}

interface Props {
  data: CertificateData
  links: ResourceLink[]
}

const Template: Story<Props> = ({ data, links = [] }) => {
  store.dispatch(
    updateCertificate({
      metadata: {
        id: '1',
        description: faker.lorem.sentence(),
        type: faker.random.alpha(6),
        name: faker.lorem.words(),
        typeVersion: faker.random.numeric(),
        status: CertificateStatus.UNSIGNED,
        sent: false,
        created: faker.date.recent().toString(),
        testCertificate: true,
        forwarded: false,
        relations: {
          parent: null,
          children: [],
        },
        unit: fakeUnit(),
        careUnit: fakeUnit(),
        careProvider: fakeUnit(),
        patient: fakePatient(),
        issuedBy: fakeStaff(),
        version: faker.mersenne.rand(1, 10),
        latestMajorVersion: true,
        responsibleHospName: faker.random.alpha(6),
      },
      data: data,
      links: links,
    })
  )

  return <Provider store={store}>{getCertificate(store.getState()) && <Certificate />}</Provider>
}

export const Default = Template.bind({})
Default.args = {
  data: fakeCertificateData([
    fakeCategoryElement({ id: 'kategori 1' }, [fakeICFDataElement(), fakeCheckboxBooleanElement(), fakeRadioMultipleCodeElement()]),
    fakeCategoryElement({ id: 'kategori 2' }, [fakeCheckboxMultipleCodeElement(), fakeICFDataElement()]),
    fakeCategoryElement({ id: 'diagnoses' }, [fakeDiagnosesElement(), fakeCheckboxMultipleDate()]),
  ]),
}
