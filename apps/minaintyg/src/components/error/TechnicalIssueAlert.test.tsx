import { render, screen } from '@testing-library/react'
import { TechnicalIssueAlert } from './TechnicalIssueAlert'

const error = { ...new Error('Some error'), id: 'some-error-id' }

it('Should render error id', () => {
  render(
    <TechnicalIssueAlert error={error}>
      <p>Some error text</p>
    </TechnicalIssueAlert>
  )
  expect(screen.getByRole('alert')).toMatchInlineSnapshot(`
    <ids-alert
      role="alert"
    >
      <div
        class="flex flex-col gap-4"
      >
        <p>
          Some error text
        </p>
        <p>
          <strong>
            Fel-ID:
          </strong>
           
          some-error-id
        </p>
      </div>
    </ids-alert>
  `)
})
