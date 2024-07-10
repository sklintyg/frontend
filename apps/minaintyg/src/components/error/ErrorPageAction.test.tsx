import { render } from '@testing-library/react'
import { ErrorPageActionType } from '../../schema/error.schema'
import { withRouter } from '../../utils/withRouter'
import { ErrorPageAction } from './ErrorPageAction'

it.each(ErrorPageActionType.options)('Should render %s type action', (type) => {
  const { container } = render(withRouter(<ErrorPageAction type={type} />))
  expect(container).toMatchSnapshot()
})
