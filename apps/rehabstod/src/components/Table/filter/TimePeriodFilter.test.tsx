import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { SickLeaveLengthInterval } from '../../../schemas/sickLeaveSchema'
import { TimePeriodMetric } from '../../../schemas/timePeriodOptionSchema'
import { TimePeriodFilter } from './TimePeriodFilter'

const TITLE = 'title'
const DESCRIPTION = 'description'
const availableOptions = [
  { from: 1, to: 2, metric: TimePeriodMetric.DAYS, id: 0 },
  { from: 10, to: 20, metric: TimePeriodMetric.YEARS, id: 1 },
  { from: 5, to: null, metric: TimePeriodMetric.YEARS, id: 2 },
  { from: null, to: 10, metric: TimePeriodMetric.YEARS, id: 3 },
  { from: 0, to: 10, metric: TimePeriodMetric.DAYS, id: 4 },
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
    expect(screen.getByLabelText(TITLE)).toBeInTheDocument()
  })

  it('should call on change if checking checkbox', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByLabelText('1-2 dagar'))
    expect(onChange).toHaveBeenCalledWith([{ from: 1, to: 2 }])
  })

  it('should call on change if unchecking checkbox', async () => {
    renderComponent([availableOptions[0]])
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByLabelText('1-2 dagar'))
    expect(onChange).toHaveBeenLastCalledWith([])
  })

  it('should have selected options checked by default', async () => {
    renderComponent([{ from: 1, to: 2 }])
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked()
  })

  describe('open dropdown', () => {
    it('should show checkboxes', async () => {
      renderComponent()
      await userEvent.click(screen.getByRole('button'))
      expect(screen.getAllByRole('checkbox')).toHaveLength(availableOptions.length)
    })

    it('should show days option', async () => {
      renderComponent()
      await userEvent.click(screen.getByRole('button'))
      expect(screen.getByText('1-2 dagar')).toBeInTheDocument()
    })

    it('should show years option', async () => {
      renderComponent()
      await userEvent.click(screen.getByRole('button'))
      expect(screen.getByText('10-20 år')).toBeInTheDocument()
    })

    it('should show null to date option', async () => {
      renderComponent()
      await userEvent.click(screen.getByRole('button'))
      expect(screen.getByText('Över 5 år')).toBeInTheDocument()
    })

    it('should show null from date option', async () => {
      renderComponent()
      await userEvent.click(screen.getByRole('button'))
      expect(screen.getByText('Under 10 år')).toBeInTheDocument()
    })
  })

  it('should have default placeholder if none is chosen', () => {
    renderComponent()
    expect(screen.getByLabelText(TITLE)).toHaveValue('Alla valda')
  })

  it('should not count 0 as null when deciding placeholder', async () => {
    renderComponent()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('0-10 dagar')).toBeInTheDocument()
  })
})
