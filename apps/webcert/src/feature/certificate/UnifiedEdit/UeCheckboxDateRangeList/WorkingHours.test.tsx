import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps, useState } from 'react'
import { WorkingHours } from './WorkingHours'

type WorkingHoursProps = Omit<ComponentProps<typeof WorkingHours>, 'onBaseWorkHours'>

function ComponentWrapper({ baseWorkHours: incomingWorkHours, ...props }: WorkingHoursProps) {
  const [baseWorkHours, setBaseWorkHours] = useState(incomingWorkHours)
  return <WorkingHours {...props} baseWorkHours={baseWorkHours} onBaseWorkHours={setBaseWorkHours} />
}

function renderComponent(props: WorkingHoursProps) {
  return render(<ComponentWrapper {...props} />)
}

it('Should not display any validation error', () => {
  renderComponent({ id: '1', parent: 'parent', disabled: false, baseWorkHours: '20' })
  expect(
    screen.queryByText('Ange ett giltigt antal arbetstimmar. Arbetstiden kan inte överstiga 168 timmar per vecka.')
  ).not.toBeInTheDocument()
})

it('Should display validation error when working hours are too high', () => {
  renderComponent({ id: '1', parent: 'parent', disabled: false, baseWorkHours: '169' })
  expect(screen.getByText('Ange ett giltigt antal arbetstimmar. Arbetstiden kan inte överstiga 168 timmar per vecka.')).toBeInTheDocument()
})

it('Should display validation error hours are increased above limit', async () => {
  renderComponent({ id: '1', parent: 'parent', disabled: false, baseWorkHours: '20' })
  await userEvent.type(screen.getByTestId('workingHours'), '169')
  expect(screen.getByText('Ange ett giltigt antal arbetstimmar. Arbetstiden kan inte överstiga 168 timmar per vecka.')).toBeInTheDocument()
})
