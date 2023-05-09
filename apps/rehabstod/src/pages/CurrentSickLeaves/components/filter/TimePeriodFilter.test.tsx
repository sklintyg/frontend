import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { SickLeaveLengthInterval } from '../../../../schemas/sickLeaveSchema'
import { TimePeriodMetric } from '../../../../schemas/timePeriodOptionSchema'
import { TimePeriodFilter } from './TimePeriodFilter'

const TITLE = 'title'
const DESCRIPTION = 'description'
const availableOptions = [
  { from: 1, to: 2, metric: TimePeriodMetric.DAYS, id: 0 },
  { from: 10, to: 20, metric: TimePeriodMetric.YEARS, id: 1 },
  { from: 5, to: null, metric: TimePeriodMetric.YEARS, id: 2 },
  { from: null, to: 10, metric: TimePeriodMetric.YEARS, id: 2 },
]
let onChange: (intervals: SickLeaveLengthInterval[]) => void

const renderComponent = (selectedOptions: SickLeaveLengthInterval[] = []) => {
  onChange = vi.fn()
  render(
    <TimePeriodFilter
      label={TITLE}
      description={DESCRIPTION}
      onChange={onChange}
      availableOptions={availableOptions}
      selectedOptions={selectedOptions}
    />
  )
}

describe('TimePeriodFilter', () => {
  it('should render without issues', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText(TITLE)).toBeInTheDocument()
  })

  it('should call on change if checking checkbox', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByLabelText('1-2 dagar'))
    expect(onChange).toHaveBeenCalledWith([{ from: 1, to: 2 }])
  })

  it('should call on change if unchecking checkbox', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByLabelText('1-2 dagar'))
    await userEvent.click(screen.getByLabelText('1-2 dagar'))
    expect(onChange).toHaveBeenLastCalledWith([])
  })

  it('should have selected options checked by default', async () => {
    renderComponent([{ from: 1, to: 2 }])
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked()
  })

  describe('open dropdown', () => {
    beforeEach(async () => {
      renderComponent()
      await userEvent.click(screen.getByRole('button'))
    })

    it('should show checkboxes', () => {
      expect(screen.getAllByRole('checkbox')).toHaveLength(4)
    })

    it('should show days option', () => {
      expect(screen.getByText('1-2 dagar')).toBeInTheDocument()
    })

    it('should show years option', () => {
      expect(screen.getByText('10-20 år')).toBeInTheDocument()
    })

    it('should show null to date option', async () => {
      expect(screen.getByText('Över 5 år')).toBeInTheDocument()
    })

    it('should show null from date option', async () => {
      expect(screen.getByText('Under 10 år')).toBeInTheDocument()
    })
  })

  describe('placeholder', () => {
    it('should have default placeholder if none is chosen', () => {
      renderComponent()
      expect(screen.getByLabelText(TITLE)).toHaveValue('Välj')
    })

    it('should have label if one option is chosen', async () => {
      renderComponent()
      await userEvent.click(screen.getByRole('button'))
      await userEvent.click(screen.getByLabelText('1-2 dagar'))
      await userEvent.click(screen.getByLabelText(TITLE))
      expect(screen.getByLabelText(TITLE)).toHaveValue('1-2 dagar')
    })

    it('should show label x chosen if more than one chosen option', async () => {
      renderComponent()
      await userEvent.click(screen.getByRole('button'))
      await userEvent.click(screen.getByLabelText('1-2 dagar'))
      await userEvent.click(screen.getByLabelText('10-20 år'))
      await userEvent.click(screen.getByLabelText(TITLE))
      expect(screen.getByLabelText(TITLE)).toHaveValue('2 valda')
    })
  })
})
