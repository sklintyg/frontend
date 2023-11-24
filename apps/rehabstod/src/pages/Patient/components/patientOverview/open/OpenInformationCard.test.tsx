import { fakerFromSchema } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { StickyContainerProvider } from '../../../../../components/StickyContainer/StickyContainerProvider'
import { sjfItemSchema } from '../../../../../schemas/patientSchema'
import { OpenInformationCard } from './OpenInformationCard'

const TITLE = 'Title'
const SUB_TITLE = 'Sub title'
const DESCRIPTION = 'Description'

const ITEM_1 = {
  bidrarTillAktivtSjukfall: true,
  includedInSjukfall: true,
  itemName: 'Name 1',
  itemId: 'Id1',
  itemType: 'VARDGIVARE',
}

const ITEM_2 = {
  bidrarTillAktivtSjukfall: true,
  includedInSjukfall: true,
  itemName: 'Name 2',
  itemId: 'Id2',
  itemType: 'VARDGIVARE',
}

const ITEM_3 = {
  bidrarTillAktivtSjukfall: true,
  includedInSjukfall: false,
  itemName: 'Name 3',
  itemId: 'Id3',
  itemType: 'VARDGIVARE',
}

const ITEM_4 = {
  bidrarTillAktivtSjukfall: false,
  includedInSjukfall: false,
  itemName: 'Name 4',
  itemId: 'Id4',
  itemType: 'VARDGIVARE',
}

const ITEMS = [ITEM_1, ITEM_2, ITEM_3, ITEM_4]

let onGetInformation: (id: string) => void

const renderComponent = (items = ITEMS) => {
  onGetInformation = vi.fn()
  render(
    <StickyContainerProvider>
      <OpenInformationCard title={TITLE} subTitle={SUB_TITLE} description={DESCRIPTION} items={items} onGetInformation={onGetInformation} />
    </StickyContainerProvider>
  )
}

it('should render component without errors', () => {
  expect(() => renderComponent()).not.toThrow()
})

it('should show title', () => {
  renderComponent()
  expect(screen.getByText(TITLE)).toBeInTheDocument()
})

it('should show regular description', () => {
  renderComponent()
  expect(screen.getByText(DESCRIPTION)).toBeInTheDocument()
})

it('should show expand button', () => {
  renderComponent()
  expect(screen.getByText('Visa')).toBeInTheDocument()
})

describe('has information', () => {
  it('should not show sub title', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Visa'))
    expect(screen.getByText(SUB_TITLE)).toBeInTheDocument()
  })

  it('should not show no information description', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Visa'))
    expect(screen.queryByText('Det finns för tillfället ingen information i denna kategori att inhämta.')).not.toBeInTheDocument()
  })

  it('should show list of items', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Visa'))
    expect(screen.getByText(ITEMS[0].itemName)).toBeInTheDocument()
    expect(screen.getByText(ITEMS[1].itemName)).toBeInTheDocument()
  })

  it('should show button to get patient information for each item that does not have includedInSjukfall true', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Visa'))
    expect(screen.getAllByText('Hämta')).toHaveLength(2)
  })

  it('should not call get information if clicking on item with bidrarTillAktivtSjukfall false', async () => {
    renderComponent([fakerFromSchema(sjfItemSchema)({ bidrarTillAktivtSjukfall: false, includedInSjukfall: false })])
    await userEvent.click(screen.getByText('Visa'))
    await userEvent.click(screen.getByRole('button', { name: 'Hämta' }))
    expect(onGetInformation).toHaveBeenCalledTimes(0)
  })

  it('should open modal if clicking on item with bidrarTillAktivtSjukfall false', async () => {
    renderComponent([fakerFromSchema(sjfItemSchema)({ bidrarTillAktivtSjukfall: false, includedInSjukfall: false })])
    await userEvent.click(screen.getByText('Visa'))
    await userEvent.click(screen.getByRole('button', { name: 'Hämta' }))
    expect(screen.getByText('Vårdenhetens intyg tillhör inte pågående sjukfall och inhämtas därför inte.')).toBeInTheDocument()
  })

  it('should call on get information when clicking get button', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Visa'))
    await userEvent.click(screen.getAllByText('Hämta')[0])
    expect(onGetInformation).toHaveBeenCalledTimes(1)
    expect(onGetInformation).toHaveBeenCalledWith(ITEMS[2].itemId)
  })

  it('should show that information has been collected', async () => {
    renderComponent()
    await userEvent.click(screen.getByText('Visa'))
    expect(screen.getAllByText('Hämtat')).toHaveLength(2)
  })
})

describe('has no information', () => {
  it('should show title', () => {
    renderComponent([])
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  it('should not show sub title', () => {
    renderComponent([])
    expect(screen.queryByText(SUB_TITLE)).not.toBeInTheDocument()
  })

  it('should show no information description', () => {
    renderComponent([])
    expect(screen.getByText('Det finns för tillfället ingen information i denna kategori att inhämta.')).toBeInTheDocument()
  })

  it('should not show regular description', () => {
    renderComponent([])
    expect(screen.queryByText(DESCRIPTION)).not.toBeInTheDocument()
  })

  it('should not show expand button', () => {
    renderComponent([])
    expect(screen.queryByText('Visa')).not.toBeInTheDocument()
  })
})
