import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import { certificateListEventSchema } from '../../../../schema/certificateList.schema'
import { CertificateCardEvents } from './CertificateCardEvents'

function renderComponent() {
  const events = [
    fakerFromSchema(certificateListEventSchema, { seed: 1 })({ timestamp: '2023-09-06T11:00:00.000Z' }),
    fakerFromSchema(certificateListEventSchema, { seed: 2 })({ timestamp: '2023-09-05T11:00:00.000Z' }),
    fakerFromSchema(certificateListEventSchema, { seed: 3 })({ timestamp: '2023-09-04T11:00:00.000Z' }),
  ]
  return render(<CertificateCardEvents events={events} />)
}

it('Should render correctly', () => {
  const { baseElement } = renderComponent()
  expect(baseElement).toMatchSnapshot()
})

it('Should display number of shown events', () => {
  renderComponent()
  expect(screen.getAllByText('Senaste händelser (visar 3 av 3 händelser)')).toHaveLength(2)
})
