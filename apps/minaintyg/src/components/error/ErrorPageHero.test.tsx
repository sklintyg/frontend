import { render, screen } from '@testing-library/react'
import { ErrorType } from '../../schema/error.schema'
import { withRouter } from '../../utils/withRouter'
import { ErrorPageHero } from './ErrorPageHero'

it('Should render identifier', () => {
  render(withRouter(<ErrorPageHero id="037b5ea0-ca66-49dd-abfa-a498dc0b1027" />))
  expect(screen.getByText('Om problemet kvarstår, spara nedan id och kontakta')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'support' })).toBeInTheDocument()
  expect(screen.getByText('037b5ea0-ca66-49dd-abfa-a498dc0b1027')).toBeInTheDocument()
})

it.each(ErrorType.options)('Should render %s type error', (type) => {
  const { container } = render(withRouter(<ErrorPageHero type={type} />))
  expect(container).toMatchSnapshot()
})
