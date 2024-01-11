import { render, screen } from '@testing-library/react'
import { expect, it, describe } from 'vitest'
import { DisplayHTML } from './DisplayHTML'

describe('tables', () => {
  it('Should add class to tables', () => {
    render(<DisplayHTML html="<table></table>" />)
    expect(screen.getByRole('table')).toHaveClass('ids-table', { exact: true })
  })

  it('Should render mobile table', () => {
    render(
      <DisplayHTML
        html="`
          <table>
            <thead>
              <tr>
                <th>First cell</th>
                <th>Second cell</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>123</td>
                <td>Lorem ipsum</td>
              </tr>
              <tr>
                <td>456</td>
                <td>dolor sit amet</td>
              </tr>
            </tbody>
          </table>
        `"
      />
    )
    expect(screen.getAllByRole('table')[0]).toMatchSnapshot()
  })

  it('Should render mobile table with row headers', () => {
    render(
      <DisplayHTML
        html="`
          <table>
            <thead>
              <tr>
                <th></th>
                <th>First cell</th>
                <th>Second cell</th>
                <th>Third cell</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Row heading</th>
                <td>1</td>
                <td>2</td>
                <td>3</td>
              </tr>
            </tbody>
          </table>
        `"
      />
    )
    expect(screen.getAllByRole('table')[0]).toMatchSnapshot()
  })
})

describe('link', () => {
  it('Should render link as ids-link', () => {
    const { container } = render(<DisplayHTML html="<a href='http://some-place.com'>Some link</a>" />)
    expect(container).toMatchSnapshot()
  })

  it('Should render link with external icon when target is _blank', () => {
    const { container } = render(<DisplayHTML html="<a href='http://some-place.com' target='_blank'>Some link</a>" />)
    expect(container).toMatchSnapshot()
  })
})

describe('headings', () => {
  it.each(Array.from({ length: 6 }, (_, index) => index + 1))('Should render %s heading as expected', (level) => {
    const tag = `h${level}`
    render(<DisplayHTML html={`<${tag}>text</${tag}>`} />)
    expect(screen.getByRole('heading')).toHaveClass(`ids-heading-${level}`, { exact: true })
  })
})

describe('Table header', () => {
  it('Empty table header cell should be converted to td', () => {
    render(<DisplayHTML html="<table><thead><tr><th></th></tr></thead></table>" />)
    expect(screen.getByRole('cell')).toBeInTheDocument()
    expect(screen.queryByRole('columnheader')).not.toBeInTheDocument()
  })

  it('Populated table header cell should not be converted to td', () => {
    render(<DisplayHTML html="<table><thead><tr><th>Hello</th></tr></thead></table>" />)
    expect(screen.getByRole('columnheader')).toBeInTheDocument()
    expect(screen.queryByRole('cell')).not.toBeInTheDocument()
  })
})
