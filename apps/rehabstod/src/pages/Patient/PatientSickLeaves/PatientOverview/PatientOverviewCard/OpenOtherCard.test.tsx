import { fakerFromSchema } from '@frontend/fake'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { sjfMetaDataSchema } from '../../../../../schemas/patientSchema'
import { renderWithRouter } from '../../../../../utils/renderWithRouter'
import { OpenOtherCard } from './OpenOtherCard'

const sjfMetaData = fakerFromSchema(sjfMetaDataSchema)({
  kraverSamtycke: [
    {
      bidrarTillAktivtSjukfall: true,
      includedInSjukfall: true,
      itemName: 'Name 1',
      itemId: 'Id1',
      itemType: 'VARDGIVARE',
    },
    {
      bidrarTillAktivtSjukfall: true,
      includedInSjukfall: true,
      itemName: 'Name 2',
      itemId: 'Id2',
      itemType: 'VARDGIVARE',
    },
    {
      bidrarTillAktivtSjukfall: true,
      includedInSjukfall: false,
      itemName: 'Name 3',
      itemId: 'Id3',
      itemType: 'VARDGIVARE',
    },
  ],
})

it('should render without problems', () => {
  expect(() =>
    renderWithRouter(
      <OpenOtherCard sjfMetaData={{ ...sjfMetaData, samtyckeFinns: true }} giveConsent={vi.fn()} patientId="123" encryptedPatientId="456" />
    )
  ).not.toThrow()
})

it('Should render empty text when there are no items', () => {
  renderWithRouter(
    <OpenOtherCard
      sjfMetaData={fakerFromSchema(sjfMetaDataSchema)({
        kraverSamtycke: [],
      })}
      giveConsent={vi.fn()}
      patientId="123"
      encryptedPatientId="456"
    />
  )
  expect(screen.getByText('Det finns för tillfället ingen information i denna kategori att inhämta.')).toBeInTheDocument()
})

describe('hasConsent', () => {
  beforeEach(async () => {
    renderWithRouter(
      <OpenOtherCard sjfMetaData={{ ...sjfMetaData, samtyckeFinns: true }} giveConsent={vi.fn()} patientId="123" encryptedPatientId="456" />
    )
    await userEvent.click(screen.getByRole('button'))
  })

  it('should render list of items', () => {
    expect(screen.getByText(sjfMetaData.kraverSamtycke[0].itemName)).toBeInTheDocument()
    expect(screen.getByText(sjfMetaData.kraverSamtycke[1].itemName)).toBeInTheDocument()
    expect(screen.getByText(sjfMetaData.kraverSamtycke[2].itemName)).toBeInTheDocument()
  })

  it('should show button to get patient information for each item that does not have includedInSjukfall true', () => {
    expect(screen.getAllByText('Hämta')).toHaveLength(1)
  })

  it('should not render form', () => {
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })

  it('should not render buttons', () => {
    expect(screen.queryByText('Avbryt')).not.toBeInTheDocument()
    expect(screen.queryByText('Patienten ger samtycke')).not.toBeInTheDocument()
  })

  it('should not render information link', () => {
    expect(screen.queryByText('Om samtycke och sammanhållen vårddokumentation')).not.toBeInTheDocument()
  })
})

describe('hasNoConsent', () => {
  let onGiveConsent = vi.fn()
  beforeEach(async () => {
    onGiveConsent = vi.fn()
    renderWithRouter(
      <OpenOtherCard
        sjfMetaData={{ ...sjfMetaData, samtyckeFinns: false }}
        giveConsent={onGiveConsent}
        patientId="123"
        encryptedPatientId="456"
      />
    )
    await userEvent.click(screen.getByRole('button'))
  })

  it('should render list of items', async () => {
    expect(screen.getByText(sjfMetaData.kraverSamtycke[0].itemName, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(sjfMetaData.kraverSamtycke[1].itemName, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(sjfMetaData.kraverSamtycke[2].itemName, { exact: false })).toBeInTheDocument()
  })

  it('should render form', async () => {
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(2)
  })

  it('should have checkbox as unchecked as default', async () => {
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('should have radio button for only user checked as default', async () => {
    expect(screen.getByLabelText('Bara jag')).toBeChecked()
    expect(screen.getByLabelText('All behörig personal på vårdenheten')).not.toBeChecked()
  })

  it('should have default value 7 for number of days of consent', async () => {
    expect(screen.getByRole('spinbutton')).toHaveValue(7)
  })

  it('should render buttons', async () => {
    expect(screen.queryByText('Avbryt')).toBeInTheDocument()
    expect(screen.queryByText('Patienten ger samtycke')).toBeInTheDocument()
  })

  it('should render information link', async () => {
    expect(screen.getByText('Om samtycke och sammanhållen vårddokumentation')).toBeInTheDocument()
  })

  it('should render error if pressing button without checking checkbox', async () => {
    await userEvent.click(screen.getByText('Patienten ger samtycke'))
    expect(screen.getByText('Du behöver kryssa i rutan för att kunna fortsätta')).toBeInTheDocument()
  })

  it('should not call give consent if pressing button without checking checkbox', async () => {
    await userEvent.click(screen.getByText('Patienten ger samtycke'))
    expect(onGiveConsent).not.toHaveBeenCalled()
  })

  it('should call give consent if pressing button with checked checkbox', async () => {
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByText('Patienten ger samtycke'))
    expect(onGiveConsent).toHaveBeenCalledTimes(1)
  })
})
