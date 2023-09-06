import { render } from '@testing-library/react'
import { CertificateStatus } from '../../../../schema/certificateList.schema'
import { CertificateCardHeading } from './CertificateCardHeading'

it('Should render correctly', () => {
  const { baseElement } = render(<CertificateCardHeading title="Foo" id="123" status={CertificateStatus.NEW} />)
  expect(baseElement).toMatchSnapshot()
})
