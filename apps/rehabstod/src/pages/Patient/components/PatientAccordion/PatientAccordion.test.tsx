import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PatientAccordion } from './PatientAccordion'

it('Should hide children when closed', () => {
  render(
    <PatientAccordion title="Title" open={false}>
      <p>Foo</p>
    </PatientAccordion>
  )
  expect(screen.queryByText('Foo')).not.toBeInTheDocument()
})

it('Should hide children when toggled', async () => {
  render(
    <PatientAccordion title="Title" open>
      <p>Foo</p>
    </PatientAccordion>
  )
  expect(screen.queryByText('Foo')).toBeInTheDocument()
  await userEvent.click(screen.getByText('Title'))
  expect(screen.queryByText('Foo')).not.toBeInTheDocument()
})
