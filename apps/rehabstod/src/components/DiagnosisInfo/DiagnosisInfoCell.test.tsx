import { fakerFromSchema } from '@frontend/fake'
import { fireEvent, render, screen } from '@testing-library/react'
import { ReactNode } from 'react'
import { diagnosisSchema } from '../../schemas/diagnosisSchema'
import { DiagnosisInfoCell } from './DiagnosisInfoCell'

function ComponentWrapper({ children }: { children: ReactNode }) {
  return (
    <table>
      <tbody>
        <tr>{children}</tr>
      </tbody>
    </table>
  )
}

it('should print unknown if diagnos is not set', () => {
  render(
    <ComponentWrapper>
      <DiagnosisInfoCell biDiagnoses={[]} />
    </ComponentWrapper>
  )
  expect(screen.getByText('Okänt')).toBeInTheDocument()
})

it('should display diagnosis tooltip', () => {
  render(
    <ComponentWrapper>
      <DiagnosisInfoCell diagnosis={fakerFromSchema(diagnosisSchema)({ kod: '1234', beskrivning: 'description' })} biDiagnoses={[]} />
    </ComponentWrapper>
  )
  fireEvent.mouseEnter(screen.getByRole('cell'))
  expect(screen.getByText('1234 - description')).toBeInTheDocument()
})

it('should display tooltip on missing diagnosis', async () => {
  render(
    <ComponentWrapper>
      <DiagnosisInfoCell biDiagnoses={[]} />
    </ComponentWrapper>
  )
  fireEvent.mouseEnter(screen.getByRole('cell'))
  expect(screen.getByText('Patienten har valt att inte förmedla diagnos')).toBeInTheDocument()
})
